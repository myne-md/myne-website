#!/usr/bin/env node
// Build gate for src/data/releases.json — the download page's only source of truth.
//
// ── What it prevents ────────────────────────────────────────────────────────
//
// This site is the SECOND WITNESS for release integrity. The artefacts are
// served from downloads.myne.md (status box, operations, hand-driven rsync); the
// hashes are published here (myne.md, this repo, its own Woodpecker chain).
// With every myne-md repository private there is no public git record to anchor
// a release hash, so this page is the anchor. A page that ships a placeholder
// key, a truncated hash or a dead link is not a weaker witness — it is a
// confident-looking one that verifies nothing.
//
// ── What it deliberately does NOT do ───────────────────────────────────────
//
// It does not fetch anything from downloads.myne.md. Checking these values
// against the origin they exist to check would be circular: a compromised
// origin would supply both halves and they would agree. The snapshot is written
// by scripts/sync-releases.mjs, which verifies the origin's SIGNED index before
// writing (so the origin cannot forge it without the offline key), and this
// script is the offline half: it proves the committed file is well-formed and
// self-consistent, and it runs in `pnpm build` on every push.
//
// The thing neither half can prove is that the published bytes were built from
// the published source. That is A9's residual and it is stated on the page.
//
// Run: node scripts/validate-release.mjs  (wired into `pnpm build`)

import { readFileSync } from "node:fs";

const SRC = "src/data/releases.json";
const fail = [];

const HEX64 = /^[0-9a-f]{64}$/;
const TAG = /^v\d+\.\d+\.\d+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const PUBKEY = /^RW[A-Za-z0-9+/]{40,}={0,2}$/;

let data;
try {
  data = JSON.parse(readFileSync(SRC, "utf8"));
} catch (err) {
  console.error(`validate-release: cannot read ${SRC}: ${err.message}`);
  process.exit(1);
}

const assetTotal = (data.releases ?? []).reduce(
  (n, r) => n + (r.assets?.length ?? 0),
  0,
);

// The placeholder that shipped before the key was minted. A page telling people
// to run `minisign -P RWQ__PENDING_KEY_MINT__` is worse than one that omits
// verification, because it reads as a verification step.
const keys = [data.pubkey, ...(data.pubkeys ?? [])].filter(Boolean);
if (keys.length === 0) fail.push("no signing key in the snapshot");
for (const key of keys) {
  if (/PENDING|TODO|XXX/i.test(String(key))) {
    fail.push(`signing key is still a placeholder: ${key}`);
  } else if (!PUBKEY.test(String(key))) {
    fail.push(`not a minisign public key: ${key}`);
  }
}

if (data.origin !== "https://downloads.myne.md") {
  fail.push(`origin is not the downloads origin: ${data.origin}`);
}

const releases = Array.isArray(data.releases) ? data.releases : [];
if (releases.length === 0) fail.push("the roster is empty");

const tags = new Set();
for (const r of releases) {
  const where = r.tag ?? "(no tag)";
  if (!TAG.test(String(r.tag))) fail.push(`${where}: tag is not vX.Y.Z`);
  if (tags.has(r.tag)) fail.push(`${where}: duplicate tag`);
  tags.add(r.tag);
  if (!DATE.test(String(r.date))) fail.push(`${where}: date is not YYYY-MM-DD`);
  if (r.tag !== `v${r.version}`) {
    fail.push(`${where}: tag and version disagree (${r.tag} vs ${r.version})`);
  }
  // The channel is a LABEL the archive renders, so an out-of-range value is not
  // a security problem — it is a row that claims a kind of build it was not.
  // `null` is honest (the sync could not reach GitHub); anything else must be
  // one of the two.
  if (![null, undefined, "stable", "beta"].includes(r.channel)) {
    fail.push(`${where}: channel is ${JSON.stringify(r.channel)}, not stable/beta/null`);
  }
  if (!Array.isArray(r.assets) || r.assets.length === 0) {
    fail.push(`${where}: no assets`);
    continue;
  }
  const names = new Set();
  for (const a of r.assets) {
    if (!a.name) fail.push(`${where}: asset with no name`);
    if (names.has(a.name)) fail.push(`${where}: duplicate asset ${a.name}`);
    names.add(a.name);
    if (!HEX64.test(String(a.sha256))) {
      fail.push(`${where}/${a.name}: sha256 is not 64 lowercase hex`);
    }
    if (!Number.isInteger(a.bytes) || a.bytes <= 0) {
      fail.push(`${where}/${a.name}: size is not a positive integer`);
    }
  }
}

// Newest first, because the page renders the list in order and a roster that
// sorts by accident is a roster whose next edit lands the new release at the
// bottom. Dates are the sort key, not tags: v0.10.0 sorts before v0.9.0 as a
// string.
const dates = releases.map((r) => String(r.date));
const sorted = [...dates].sort((a, b) => b.localeCompare(a));
if (dates.join() !== sorted.join()) fail.push("releases are not newest-first by date");

// Both channels must name a release in the roster, or the page throws at build
// time with a message a reader of the output cannot act on.
for (const channel of ["stable", "beta"]) {
  const tag = data.channels?.[channel];
  if (!tag) fail.push(`no ${channel} channel`);
  else if (!releases.some((r) => r.tag === tag)) {
    fail.push(`${channel} channel points at ${tag}, which is not in the roster`);
  }
}

// A floor on the roster. Every check above is a loop, and a loop over an empty
// set passes: this is what stops a bad merge that empties the file from
// reporting green.
if (assetTotal < 1) fail.push("the roster carries no assets at all");

if (fail.length) {
  console.error("validate-release: FAILED");
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `validate-release: ok — ${releases.length} releases ` +
    `(${releases.filter((r) => r.channel === "beta").length} beta), ${assetTotal} assets, ` +
    `stable ${data.channels.stable}, beta ${data.channels.beta}`,
);
