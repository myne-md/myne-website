#!/usr/bin/env node
// Build gate for src/data/release.ts — the download page's only source of truth.
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
// origin would supply both halves and they would agree. The values are copied
// by hand from the verified staging tree (runbooks/downloads-origin.md §4b),
// and this script only proves they are well-formed and self-consistent.
//
// Run: node scripts/validate-release.mjs  (wired into `pnpm build`)

import { readFileSync } from "node:fs";

const SRC = "src/data/release.ts";
const src = readFileSync(SRC, "utf8");
const fail = [];

const str = (name) => {
  const m = src.match(new RegExp(`export const ${name} = "([^"]*)"`));
  if (!m) fail.push(`${name}: not found in ${SRC}`);
  return m?.[1];
};

const tag = str("RELEASE_TAG");
const version = str("RELEASE_VERSION");
const date = str("RELEASE_DATE");
const pubkey = str("MINISIGN_PUBKEY");
const origin = str("DOWNLOADS_ORIGIN");

if (tag && !/^v\d+\.\d+\.\d+$/.test(tag)) fail.push(`RELEASE_TAG is not vX.Y.Z: ${tag}`);
if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) fail.push(`RELEASE_DATE is not YYYY-MM-DD: ${date}`);
if (tag && version && tag !== `v${version}`) {
  fail.push(`RELEASE_TAG (${tag}) and RELEASE_VERSION (${version}) disagree`);
}
if (origin && !origin.startsWith("https://")) fail.push(`DOWNLOADS_ORIGIN is not https: ${origin}`);

// The placeholder that shipped in this file before the key was minted. A page
// telling people to run `minisign -P RWQ__PENDING_KEY_MINT__` is worse than one
// that omits verification, because it reads as a verification step.
if (pubkey === "RWQ__PENDING_KEY_MINT__" || /PENDING|TODO|XXX/i.test(pubkey ?? "")) {
  fail.push("MINISIGN_PUBKEY is still a placeholder");
} else if (pubkey && !/^RW[A-Za-z0-9+/]{40,}={0,2}$/.test(pubkey)) {
  fail.push(`MINISIGN_PUBKEY is not a minisign public key: ${pubkey}`);
}

// Assets: every filename must carry the version it claims to be, or the page
// links a real file from a DIFFERENT release with this release's hash beside
// it — which fails verification at the user's machine and looks like tampering.
const assets = [...src.matchAll(
  /name:\s*"([^"]+)",\s*bytes:\s*(\d+),\s*sha256:\s*"([^"]*)"/g,
)].map(([, name, bytes, sha256]) => ({ name, bytes: Number(bytes), sha256 }));

if (assets.length === 0) fail.push("ASSETS is empty");
const seen = new Set();
for (const a of assets) {
  if (seen.has(a.name)) fail.push(`duplicate asset: ${a.name}`);
  seen.add(a.name);
  if (!/^[0-9a-f]{64}$/.test(a.sha256)) fail.push(`${a.name}: sha256 is not 64 lowercase hex`);
  if (!(a.bytes > 0)) fail.push(`${a.name}: bytes must be positive`);
  if (version && !a.name.includes(version)) {
    fail.push(`${a.name}: filename does not contain ${version}`);
  }
}
const hashes = new Set(assets.map((a) => a.sha256));
if (hashes.size !== assets.length) fail.push("two assets share a sha256 — copy/paste error");

if (fail.length) {
  console.error(`validate-release: FAIL (${fail.length})`);
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `validate-release: OK — ${tag}, ${assets.length} assets, key ${pubkey.slice(0, 8)}…`,
);
