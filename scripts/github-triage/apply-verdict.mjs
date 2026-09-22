#!/usr/bin/env node
// apply-verdict — deterministic port of the n8n "Parse verdict & route" node and
// every side-effect HTTP node it routes to (WF3).
//
// Reads the classifier's verdict and applies it to GitHub via the myne-bot token:
// label PATCH, comment, duplicate close, GraphQL transferIssue, sub-issue links.
// The LLM never sees this code and never touches GitHub — this script owns every
// write, exactly as n8n did. The verdict is model output (free text in several
// fields), so every value is validated against what the packet offered before it
// becomes an API call.
//
// Env:
//   TRIAGE_PACKET     the packet+meta JSON written by build-packet.mjs
//   TRIAGE_VERDICT    the verdict JSON written by classify.mjs
//   MYNE_BOT_PAT      the token for every GitHub write (org-wide myne-bot)

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const __dirname = dirname(new URL(import.meta.url).pathname);
const PACKET = process.env.TRIAGE_PACKET || join(__dirname, '..', '.triage', 'packet.json');
const VERDICT = process.env.TRIAGE_VERDICT || join(__dirname, '..', '.triage', 'verdict.json');

const DRY_RUN = process.env.TRIAGE_DRY_RUN === '1' || process.env.TRIAGE_DRY_RUN === 'true';

const token = process.env.MYNE_BOT_PAT || '';
if (!token && !DRY_RUN) {
  console.error('FATAL: set MYNE_BOT_PAT');
  process.exit(1);
}

const { packet, meta } = JSON.parse(readFileSync(PACKET, 'utf8'));
let verdict;
try {
  verdict = JSON.parse(readFileSync(VERDICT, 'utf8'));
} catch (e) {
  // The classifier failed to produce a readable verdict. Apply the same
  // DESTROY-NOTHING fallback the n8n node used: keep whatever the issue already
  // carries, add status: triage, and stay loud by exiting non-zero.
  console.error(`FATAL: no readable verdict at ${VERDICT}: ${e.message}`);
  const t = meta;
  const keep = Array.isArray(t.existingLabels) ? t.existingLabels : [];
  const fallbackLabels = keep.indexOf('status: triage') === -1 ? keep.concat(['status: triage']) : keep.slice();
  await patchIssue({ labels: fallbackLabels });
  console.error('applied status: triage fallback; failing loudly for a human to see');
  process.exit(1);
}

const HEADERS = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'myne-bot',
  'X-GitHub-Api-Version': '2022-11-28',
  Authorization: `Bearer ${token}`,
};

async function gh(path, opts = {}) {
  if (DRY_RUN) {
    console.log(`DRY_RUN ${opts.method || 'GET'} ${path} ${opts.body ? JSON.stringify(opts.body) : ''}`);
    return {};
  }
  const url = path.startsWith('http') ? path : `https://api.github.com${path}`;
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers: HEADERS,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text().catch(() => '');
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} ${opts.method || 'GET'} ${url}: ${text.slice(0, 300)}`);
  }
  return json;
}

const patchIssue = (body) => gh(`/repos/${meta.owner}/${meta.repo}/issues/${meta.issueNumber}`, { method: 'PATCH', body });
const commentIssue = (body) => gh(`/repos/${meta.owner}/${meta.repo}/issues/${meta.issueNumber}/comments`, { method: 'POST', body: { body } });

// --- parse the verdict, replicating n8n's Parse verdict & route --------------
const v = verdict;
const cls = v.classification || {};
const dup = v.duplicate || {};
const cross = v.cross_repo || {};
const threshold = packet.config?.duplicate_autoclose_threshold ?? 0.85;

// A transfer may only target a repo the packet actually offered. The verdict is
// model output, so target_repo is free text and can name an archived/deleted repo.
const LIVE = (packet.sibling_repos || []).map((s) => s && s.name).filter(Boolean);
const targetOffered = !!v.target_repo && LIVE.indexOf(v.target_repo) !== -1;

let action;
if (cross.should_move && v.target_repo && v.target_repo !== meta.repo && targetOffered) action = 'transfer';
else if (dup.is_duplicate && (dup.confidence || 0) >= threshold && dup.of_issue) action = 'dup_close';
else if (dup.is_duplicate && (dup.confidence || 0) >= 0.5 && dup.of_issue) action = 'dup_flag';
else action = 'triage';

// Milestone string → number: only emit a milestone the packet actually carries.
const ms = (packet.repo_context?.milestones || []).find((m) => m && m.title === cls.milestone);
const milestoneNumber = ms ? ms.number : null;

const labels = [];
if (cls.type_label) labels.push(cls.type_label);
for (const a of (cls.area_labels || [])) labels.push(a);
const statuses = (cls.status_labels && cls.status_labels.length) ? cls.status_labels : ['status: triage'];
for (const s of statuses) labels.push(s);
if (cls.roadmap_label) labels.push(cls.roadmap_label);
const dupLabels = ['meta: duplicate'];

const comment = v.comment_en || '';

async function addSubIssues() {
  const rels = (v.relationships || []).filter((r) => r && r.type === 'sub_issue_of' && r.issue && meta.issueId);
  for (const r of rels) {
    const repo = r.repo || meta.repo;
    try {
      await gh(`/repos/${meta.owner}/${repo}/issues/${r.issue}/sub_issues`, {
        method: 'POST', body: { sub_issue_id: meta.issueId },
      });
      console.log(`sub-issue: linked under ${repo}#${r.issue}`);
    } catch (e) {
      console.error(`sub-issue: failed for ${repo}#${r.issue}: ${e.message}`);
    }
  }
}

async function transferIssue(targetRepo) {
  // Pre-labels on the SOURCE issue before the transfer (GitHub transfer preserves
  // them, but only labels the target already has survive — so send the shared type
  // label and status: triage, nothing repo-specific).
  const pre = { labels: [cls.type_label, 'status: triage'].filter(Boolean) };
  await patchIssue(pre);

  // The transfer itself is a GraphQL mutation, as in n8n's Move: transfer issue.
  const target = await gh(`/repos/${meta.owner}/${targetRepo}`);
  const query = `mutation { transferIssue(input:{issueId:"${meta.issueNodeId}", repositoryId:"${target.node_id}", createLabelsIfMissing:true}) { issue { number url } } }`;
  await gh('https://api.github.com/graphql', { method: 'POST', body: { query } });
  console.log(`transfer: ${meta.repo}#${meta.issueNumber} → ${targetRepo}`);
}

// --- apply ------------------------------------------------------------------
console.log(`apply-verdict: action=${action} target=${v.target_repo || meta.repo} dup=${dup.of_issue || '-'}`);

try {
  if (action === 'transfer') {
    if (comment) await commentIssue(comment);
    await transferIssue(v.target_repo);
  } else if (action === 'dup_close') {
    await patchIssue({ labels: [...labels, ...dupLabels], state: 'closed', state_reason: 'not_planned' });
    if (comment) await commentIssue(comment);
  } else if (action === 'dup_flag') {
    await patchIssue({ labels: [...labels, ...dupLabels] });
    if (comment) await commentIssue(comment);
  } else {
    await patchIssue({ labels, milestone: milestoneNumber, type: cls.issue_type || null });
    if (comment) await commentIssue(comment);
  }

  await addSubIssues();
} catch (e) {
  console.error(`apply-verdict: ${e.message}`);
  process.exit(1);
}

// A triage that produced no comment is a failure worth surfacing, exactly as the
// n8n "Alert: no comment produced" node did.
if (!comment) {
  console.error(`apply-verdict: verdict produced no comment for ${meta.repo}#${meta.issueNumber}`);
  process.exit(1);
}

console.log(`apply-verdict: done for ${meta.repo}#${meta.issueNumber}`);
