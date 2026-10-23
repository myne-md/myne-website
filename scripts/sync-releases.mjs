#!/usr/bin/env node
//
// Regenerate src/data/releases.json from the release origin (myne-md/myne-website).
//
//   node scripts/sync-releases.mjs [--check]
//
// ── Why this exists ─────────────────────────────────────────────────────────
//
// /download used to carry a hand-maintained copy of ONE release, and it drifted:
// the origin served v0.10.0 while the page still pinned v0.9.0, so the site's
// "current release" was a version nobody should download any more and the page
// that exists to be the second witness was witnessing the wrong artefact. Hand
// copying also cannot express what the origin already publishes: an ARCHIVE of
// releases plus two channels (`latest.json` for stable, `latest-beta.json` for
// beta).
//
// ── Why this does not weaken the second-witness rule ────────────────────────
//
// The rule (src/data/release.ts) is that hashes must not be read off the origin
// at RUNTIME, because a compromised origin would then supply the binary and the
// hash a reader checks it against. That still holds: this script is a BUILD-TIME
// step whose output is committed, and the page serves the committed values.
//
// It also does not read the origin on trust. `releases/index.json` is signed
// (`index.json.minisig`) by the same offline key that signs every release's
// SHA256SUMS, and this script refuses to write anything unless `minisign` says
// the signature is good against the PINNED_PUBKEY below. That is a stronger
// check than the hand-copy it replaces, which trusted whoever ran it.
//
// What it still cannot prove, and does not claim: that the published bytes were
// built from the published source. `stage-release.sh` verifies artefacts against
// the GitHub release; this script only proves the hash LIST is ours.
//
// Run it, read the diff, commit. `--check` exits non-zero when the committed
// snapshot no longer matches the origin, which is what a release pass should
// notice.
//
// ── Updating ───────────────────────────────────────────────────────────────
//
// After `operations/runbooks/downloads-origin.md` has published a release:
//   node scripts/sync-releases.mjs && node scripts/validate-release.mjs

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src", "data", "releases.json");
const ORIGIN = "https://downloads.myne.md";

/** Must match MINISIGN_PUBKEY in src/data/release.ts. Duplicated on purpose:
 *  the script that reads the origin cannot import the file it writes. */
const PINNED_PUBKEY = "RWRk3+M9oGvHo33oHg5kOL7a5DbNj8sR2KPLg0gwHMujnHOpQI+kX+nm";

const check = process.argv.includes("--check");
const versionless = [];
const fail = (msg) => {
  console.error(`sync-releases: ${msg}`);
  process.exit(1);
};

async function get(path) {
  const res = await fetch(`${ORIGIN}${path}`, { redirect: "follow" });
  if (!res.ok) fail(`${path} answered ${res.status}`);
  return res.text();
}

/* 1. The roster, plus its signature. Nothing below runs on an unverified index:
      an attacker who can rewrite index.json can rewrite every hash in it, and
      the only thing that separates that from the real file is this signature. */
const [indexRaw, sigRaw] = await Promise.all([
  get("/releases/index.json"),
  get("/releases/index.json.minisig"),
]);

const dir = mkdtempSync(join(tmpdir(), "myne-releases-"));
const indexPath = join(dir, "index.json");
const sigPath = join(dir, "index.json.minisig");
try {
  writeFileSync(indexPath, indexRaw);
  writeFileSync(sigPath, sigRaw);
  let verified = "";
  try {
    verified = execFileSync(
      "minisign",
      ["-Vm", indexPath, "-P", PINNED_PUBKEY],
      { encoding: "utf8" },
    );
  } catch (err) {
    fail(
      "the origin's index.json does not verify against the pinned key, so none " +
        "of its hashes can be trusted. Refusing to write.\n" +
        (err.stderr || err.message),
    );
  }
  if (!/verified/i.test(verified)) fail(`minisign did not confirm: ${verified}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}

/* 2. Shape. A malformed roster is a bug in the origin, not something to render. */
const index = JSON.parse(indexRaw);
const HEX64 = /^[0-9a-f]{64}$/;
const TAG = /^v\d+\.\d+\.\d+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

if (!Array.isArray(index.releases) || index.releases.length === 0) {
  fail("index.json carries no releases");
}

const releases = index.releases.map((r) => {
  if (!TAG.test(r.tag ?? "")) fail(`bad tag: ${JSON.stringify(r.tag)}`);
  if (!DATE.test(r.date ?? "")) fail(`${r.tag}: bad date ${JSON.stringify(r.date)}`);
  const version = r.tag.slice(1);
  if (!Array.isArray(r.assets) || r.assets.length === 0) {
    fail(`${r.tag}: no assets`);
  }
  const assets = r.assets.map((a) => {
    if (typeof a.name !== "string" || !a.name) fail(`${r.tag}: asset with no name`);
    /* A name that does not carry its own version is NOT a failure, because the
       page builds every link from that asset's own release entry (`/releases/
       <tag>/<name>`), which makes a cross-release link structurally impossible.
       It is worth a warning all the same: the hand-maintained page this
       replaced could pair one release's file with another's hash, and a name
       with no version cannot be checked by eye. Known versionless families are
       the Tauri updater payload (`Myne.app.tar.gz`) and the `myne-decrypt-*`
       CLI builds, which encode a target triple instead of a version. */
    if (!a.name.includes(version)) versionless.push(`${r.tag}/${a.name}`);
    if (!HEX64.test(a.sha256 ?? "")) fail(`${r.tag}/${a.name}: bad sha256`);
    if (!Number.isInteger(a.bytes) || a.bytes <= 0) {
      fail(`${r.tag}/${a.name}: bad size ${JSON.stringify(a.bytes)}`);
    }
    return { name: a.name, bytes: a.bytes, sha256: a.sha256 };
  });
  return { tag: r.tag, version, date: r.date, assets };
});

/* 3. Channels. The updater manifests are the only place the stable/beta split
      exists, so they are the source for it rather than a hand-kept pair. */
const channelOf = async (file) => {
  const raw = await get(`/releases/${file}`);
  const manifest = JSON.parse(raw);
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? "")) {
    fail(`${file}: bad version ${JSON.stringify(manifest.version)}`);
  }
  return `v${manifest.version}`;
};

const [stable, beta] = await Promise.all([
  channelOf("latest.json"),
  channelOf("latest-beta.json"),
]);

for (const [name, tag] of [
  ["latest.json", stable],
  ["latest-beta.json", beta],
]) {
  if (!releases.some((r) => r.tag === tag)) {
    fail(`${name} points at ${tag}, which is not in the roster`);
  }
}

releases.sort((a, b) => b.date.localeCompare(a.date));

const snapshot = {
  note:
    "Generated by scripts/sync-releases.mjs from downloads.myne.md. The roster " +
    "is signed (index.json.minisig) and verified before this file is written. " +
    "Do not hand-edit: run the script, read the diff, commit.",
  origin: ORIGIN,
  pubkey: index.pubkey ?? PINNED_PUBKEY,
  pubkeys: index.pubkeys ?? [PINNED_PUBKEY],
  channels: { stable, beta },
  releases,
};

const next = `${JSON.stringify(snapshot, null, 2)}\n`;

if (check) {
  let current = "";
  try {
    current = readFileSync(OUT, "utf8");
  } catch {
    fail("no committed snapshot; run without --check");
  }
  if (current !== next) {
    fail(
      "the committed snapshot no longer matches the origin. Run\n" +
        "  node scripts/sync-releases.mjs\n" +
        "and commit the diff.",
    );
  }
  console.log(
    `sync-releases: up to date (${releases.length} releases, stable ${stable}, beta ${beta})`,
  );
  process.exit(0);
}

writeFileSync(OUT, next);
console.log(
  `sync-releases: ${releases.length} releases, ${releases.reduce(
    (n, r) => n + r.assets.length,
    0,
  )} assets. stable ${stable}, beta ${beta}.`,
);
if (versionless.length) {
  console.warn(
    `sync-releases: ${versionless.length} asset name(s) carry no version. ` +
      "Links are built from each asset's own release directory, so this is " +
      "informational, but check any NEW family below by eye:\n  " +
      versionless.join("\n  "),
  );
}
