#!/usr/bin/env node
// classify — run the issue-triage skill headless via `opencode run`, parse the verdict.
//
// This is the LLM step, the one piece of the triage pipeline that is not
// deterministic. It reads the packet built by build-packet.mjs, prepends the
// skill body (the classifier's operating procedure), runs `opencode run
// --format json`, and extracts the single JSON verdict from the NDJSON event
// stream. It writes the verdict next to the packet for apply-verdict.mjs.
//
// Why opencode and not `claude -p`: the triage pipeline moved from n8n's Claude
// Code shim to a GitHub Action, and opencode's headless `run` is the CLI the
// action uses. The skill body is identical — it is still a pure function that
// returns JSON and touches no network or tool.
//
// Env:
//   TRIAGE_PACKET     path to the packet JSON written by build-packet.mjs
//                     (default: scripts/github-triage/../.triage/packet.json)
//   TRIAGE_SKILL      path to the issue-triage SKILL.md (default: the agent-tooling clone)
//   TRIAGE_MODEL      provider/model (default: opencode-go/deepseek-v4-flash)
//   TRIAGE_OUT        where the verdict is written (default: same dir, verdict.json)
//   OPENCODE_API_KEY  the opencode-go provider key (opencode reads this itself)

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const __dirname = dirname(new URL(import.meta.url).pathname);

const PACKET = process.env.TRIAGE_PACKET || join(__dirname, '..', '.triage', 'packet.json');
const SKILL = process.env.TRIAGE_SKILL || join(__dirname, '..', '..', '..', 'agent-tooling', 'skills', 'issue-triage', 'SKILL.md');
const MODEL = process.env.TRIAGE_MODEL || 'opencode-go/deepseek-v4-flash';
const OUT = process.env.TRIAGE_OUT || join(dirname(PACKET), 'verdict.json');
const TIMEOUT_MS = Number(process.env.TRIAGE_TIMEOUT_MS || 300000);

const packetRaw = readFileSync(PACKET, 'utf8');
let packet;
try { packet = JSON.parse(packetRaw); } catch (e) {
  console.error(`FATAL: packet at ${PACKET} is not valid JSON: ${e.message}`);
  process.exit(1);
}

let skillBody;
try {
  skillBody = readFileSync(SKILL, 'utf8');
} catch (e) {
  console.error(`FATAL: cannot read skill at ${SKILL}: ${e.message}`);
  process.exit(1);
}
// Strip the YAML frontmatter — the model only needs the operating procedure.
skillBody = skillBody.replace(/^---[\s\S]*?---\s*/, '');

// The classifier sees only the packet, not the node ids / existing labels that
// apply-verdict carries out of band. `meta` is deliberately dropped here.
const prompt =
  skillBody +
  '\n\n# Context packet — reason over this JSON\n\n```json\n' +
  JSON.stringify(packet.packet) +
  '\n```\n\nNow output ONLY the verdict JSON object described above. No prose, no fences, nothing after the closing brace.';

function runOpencode() {
  return new Promise((resolve, reject) => {
    // --print-logs pushes opencode's own diagnostics to stderr, which is how a
    // cold-start stall (model fetch, provider auth) becomes visible in CI instead
    // of reading as a silent timeout.
    const child = spawn('opencode', ['run', '--print-logs', '--log-level', 'DEBUG', '--format', 'json', '--model', MODEL, prompt], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });

    let stdout = '', stderr = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error(`opencode timeout after ${TIMEOUT_MS} ms; stderr tail: ${stderr.slice(-1200)}`)); }, TIMEOUT_MS);

    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', (e) => { clearTimeout(timer); reject(e); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(`opencode exit ${code}: ${stderr.slice(0, 500)}`));
      resolve(stdout);
    });
  });
}

// Extract the model's text from the NDJSON event stream. `opencode run --format
// json` emits one JSON object per line; the assistant's answer is the `text` of
// each `type:"text"` part, in order. Only the concatenation of those is the
// verdict. (Verified against opencode 1.18.x: step_start / text / step_finish.)
function textOf(ndjson) {
  const parts = [];
  for (const line of ndjson.split('\n')) {
    if (!line.trim()) continue;
    let ev;
    try { ev = JSON.parse(line); } catch { continue; }
    if (ev.type === 'text' && ev.part && typeof ev.part.text === 'string') parts.push(ev.part.text);
  }
  return parts.join('');
}

// The model is told to emit one JSON object and nothing else, but stray prose or
// a trailing newline must not cost a re-run. Tolerate by slicing first `{` to
// last `}`, the same shape the n8n shim used.
function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) throw new Error('no JSON object found in model output');
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch (err) {
    const m = /position (\d+)/.exec(err.message);
    const at = m ? Number(m[1]) : -1;
    const ctx = at >= 0 ? slice.slice(Math.max(0, at - 90), at + 90) : slice.slice(0, 180);
    throw new Error(`the verdict is not valid JSON: ${err.message}\n  around offset ${at}: ...${ctx}...`);
  }
}

async function main() {
  console.log(`classify: model=${MODEL} skill=${SKILL} packet=${PACKET}`);
  const raw = await runOpencode();
  const text = textOf(raw);
  const verdict = extractJson(text);
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(verdict));
  console.log(`classify: verdict written to ${OUT}`);
}

main().catch((e) => {
  console.error(`classify: ${e.message}`);
  process.exit(1);
});
