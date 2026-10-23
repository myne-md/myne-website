#!/usr/bin/env node
//
// Every image the built site asks for under `/app/` exists on disk.
//
// ── Why this file exists ────────────────────────────────────────────────────
//
// The marketing captures under `public/app/` are committed binaries produced by
// `scripts/prep-marketing-shots.mjs`, and nothing in this repository compared
// what the pages ASK FOR with what the directory HOLDS. The gap shipped: the
// `/features` deck renders a light/dark pair per section, one section (the
// encryption slide) has no light half by design, and the showcase block below it
// built the `-light` path unconditionally. `astro build` was green because a
// missing `img src` is not a build error, and the reader in the light theme got
// alt text where the screenshot should have been, plus a 404 in the origin log.
//
// A present file with the wrong name is the same class of failure as a missing
// one, so the check is one-directional and post-build: read every `dist/**/*.html`
// for `/app/...` references and fail on any that does not resolve.
//
//   node scripts/validate-app-shots.mjs
//
// Runs inside `pnpm build` after `astro build`, in the post-build slot, because
// it reads the built HTML rather than the source: a component that composes a
// path is only visible once it has rendered.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");

if (!existsSync(DIST)) {
  console.error("validate-app-shots: no dist/, run `astro build` first");
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const pages = walk(DIST);
const missing = new Map();
let checked = 0;

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  // `src`, `srcset` and CSS `url(...)` all reach for the same directory. The
  // query/hash suffix is stripped because `?v=2` is still the same file.
  const refs = [
    ...html.matchAll(/(?:src|srcset)="(\/app\/[^"\s]+)/g),
    ...html.matchAll(/url\((&#34;|"|')?(\/app\/[^"')]+)/g),
  ];
  for (const match of refs) {
    const raw = match[1].startsWith("/app/") ? match[1] : match[2];
    if (raw === undefined) continue;
    const rel = raw.split(/[?#]/)[0];
    checked += 1;
    if (existsSync(join(PUBLIC, rel.slice(1)))) continue;
    if (!missing.has(rel)) missing.set(rel, new Set());
    missing.get(rel).add(page.slice(DIST.length + 1));
  }
}

if (checked === 0) {
  // A scan that found no `/app/` reference is not a pass: it means the matcher
  // stopped matching, and every rule below it then checks nothing.
  console.error("validate-app-shots: the build references no /app/ image, so nothing was checked");
  process.exit(1);
}

if (missing.size > 0) {
  console.error("validate-app-shots: the build asks for images that do not exist\n");
  for (const [ref, pages] of [...missing].sort()) {
    console.error(`  ${ref}`);
    for (const page of [...pages].sort()) console.error(`    <- ${page}`);
  }
  console.error(
    "\nEvery one is a reader seeing alt text instead of a screenshot. Add the file under public/app/, or compose the reference only where the file exists.",
  );
  process.exit(1);
}

const committed = statSync(PUBLIC).isDirectory()
  ? readdirSync(join(PUBLIC, "app")).filter((f) => f.endsWith(".webp")).length
  : 0;
console.log(`validate-app-shots: OK — ${checked} reference(s) across ${pages.length} page(s), ${committed} committed capture(s)`);
