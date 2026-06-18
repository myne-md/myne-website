#!/usr/bin/env node
// wire-screenshots — embed captured user-guide screenshots into their articles.
//
// The capture harness (main repo: e2e/capture/userguide.capture.ts, run via
// scripts/capture-userguide.sh on a Linux box — see docs/dev/userguide-screenshots.md)
// writes one PNG per frame plus a manifest.json to e2e/artifacts/userguide/.
// This script is the publish half of that pipeline: for every frame the
// manifest marks ok, it copies the PNG next to its article and inserts a
// Markdown image (with the frame's alt text) right after the article's opening
// paragraph. Idempotent — re-running refreshes the PNGs and never double-inserts.
//
//   node scripts/wire-screenshots.mjs <artifacts-dir>
//
// <artifacts-dir> is the directory holding manifest.json + the *.png files
// (e.g. a copy of the main repo's e2e/artifacts/userguide/ pulled off the
// capture box). The PNG is named after the article it illustrates, co-located
// with the article and referenced as ./<slug>.png (same convention as the
// hand-drawn getting-started/welcome-vault.svg).

import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const UG = fileURLToPath(new URL("../src/content/user-guide/", import.meta.url));

const artifactsDir = process.argv[2];
if (!artifactsDir) {
  console.error("usage: node scripts/wire-screenshots.mjs <artifacts-dir>");
  console.error("  <artifacts-dir> holds manifest.json + the captured *.png files");
  process.exit(2);
}

const manifestPath = join(artifactsDir, "manifest.json");
if (!existsSync(manifestPath)) {
  console.error(`wire-screenshots: no manifest.json in ${artifactsDir}`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

/** Insert `imgLine` as its own block right after the article's opening
 *  (summary-mirror) paragraph: skip the frontmatter, skip leading blank lines,
 *  consume the first paragraph, then drop the image after the blank line. */
function insertAfterOpening(content, imgLine) {
  const lines = content.split("\n");
  const dashes = [];
  for (let i = 0; i < lines.length; i++) if (lines[i].trim() === "---") dashes.push(i);
  if (dashes.length < 2) return null; // no frontmatter — refuse rather than guess
  let i = dashes[1] + 1;
  while (i < lines.length && lines[i].trim() === "") i++; // leading blanks
  while (i < lines.length && lines[i].trim() !== "") i++; // opening paragraph
  lines.splice(i + 1, 0, imgLine, "");
  return lines.join("\n");
}

let wired = 0;
let refreshed = 0;
let skipped = 0;
const problems = [];

for (const frame of manifest.frames ?? []) {
  if (!frame.ok) continue;
  const { name, slug, alt } = frame;
  const slash = slug.indexOf("/");
  if (slash === -1) {
    problems.push(`${name}: malformed slug "${slug}"`);
    continue;
  }
  const base = slug.slice(slash + 1);
  const articlePath = join(UG, `${slug}.md`);
  const pngSrc = join(artifactsDir, `${name}.png`);
  const pngDst = join(dirname(articlePath), `${base}.png`);
  const ref = `./${base}.png`;

  if (!existsSync(articlePath)) {
    problems.push(`${name}: no article at ${slug}.md`);
    continue;
  }
  if (!existsSync(pngSrc)) {
    problems.push(`${name}: no PNG at ${name}.png`);
    continue;
  }

  copyFileSync(pngSrc, pngDst); // always refresh the image
  const content = readFileSync(articlePath, "utf8");
  if (content.includes(ref)) {
    refreshed++;
    continue; // already embedded — PNG refreshed, leave the Markdown as-is
  }
  const next = insertAfterOpening(content, `![${alt}](${ref})`);
  if (next === null) {
    problems.push(`${name}: ${slug}.md has no frontmatter; PNG copied but not embedded`);
    continue;
  }
  writeFileSync(articlePath, next);
  wired++;
}

console.log(
  `wire-screenshots: ${wired} embedded, ${refreshed} refreshed (already embedded), ${skipped} skipped`,
);
const failed = (manifest.frames ?? []).filter((f) => !f.ok).map((f) => f.name);
if (failed.length) console.log(`  frames not ok in manifest (no screenshot): ${failed.join(", ")}`);
if (problems.length) {
  for (const p of problems) console.warn(`  problem: ${p}`);
  process.exit(1);
}
