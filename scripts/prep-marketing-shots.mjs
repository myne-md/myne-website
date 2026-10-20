#!/usr/bin/env node
//
// Marketing shots: the publish half of the capture pipeline for the landing
// page hero and the /features panel deck.
//
//   node scripts/prep-marketing-shots.mjs <artifacts-dir> [--theme dark|light]
//
// ── Why this file exists ────────────────────────────────────────────────────
//
// The WebP files under `public/app/` came from two capture runs of the main
// repo's e2e harness (`e2e/capture/userguide.capture.ts`), and until this script
// landed nothing in either repository could produce them: the harness writes
// PNGs named after guide articles to `e2e/artifacts/userguide/`, the marketing
// names (`p-<section>.webp`, `desktop.webp`, `phone.webp`) appear nowhere in it,
// and a later re-shoot had nothing to run. This is that run's other half.
//
// ── Both halves of the pipeline, in order ───────────────────────────────────
//
// 1. DESKTOP FRAMES. From the main `myne` repo, on Linux (tauri-driver has no
//    macOS support), with three deliberate edits to a THROWAWAY COPY of
//    `e2e/capture/userguide.capture.ts` so the main checkout is never touched:
//
//      a. a theme step after unlock (Settings → Appearance → Dark, or → Light),
//         run once per theme, because the capture's own header fixes it to the
//         app's light default;
//      b. the split-view frame deleted outright, so every frame it captured
//         after it is a single-tab window rather than a cramped two-pane one;
//      c. an `ai-chat` frame that seeds a conversation through the app's own
//         `plugin:chats|chats_create` IPC from the page seat and then opens the
//         panel on the note it is anchored to (the harness cannot run a model,
//         so there is no other way to photograph the assistant), plus a
//         `vault-locked` frame last of all, and the `restore-backup` frame
//         dropped so the lock can be the final shot.
//
//    Run it with `scripts/capture-userguide.sh --retina --skip-build
//    --userguide-only` in the copy, once per theme, and copy each
//    `e2e/artifacts/userguide/` aside before the next run overwrites it.
//
// 2. THE PHONE FRAME. From this repo's sibling, the mobile client's flow-logic
//    lane (a real React tree in Chromium at the pinned 390x844 viewport with
//    mock IPC). A temporary spec seeds a note set and screenshots it at
//    deviceScaleFactor 2, once per `colorScheme`.
//
// 3. THIS SCRIPT. Copies and re-encodes the two runs into `public/app/`.
//
// ── The mapping, which is the part a re-shoot needs ─────────────────────────
//
// Run it once per theme, pointing at that theme's artifacts directory; the
// `-light` files are written only by the light run, and the dark ones only by
// the dark run, so a re-shoot of one theme leaves the other alone.
//
//   section id      guide frame            where it shows
//   collaboration   comments               /features 01 + hero slide
//   agents          ai-chat (the override) /features 02 + hero slide
//   markdown        markdown-flowchart     /features 03 + hero slide
//   encryption      vault-locked (override, palette-independent: one file)
//   graph           graph-all              /features 05 + hero slide
//   search          find-and-replace       /features 06 + hero slide
//   portable        export-notes           /features 07 + hero slide
//   (hero)          interface-tour         the landing hero window
//
import { createRequire } from "node:module";
import { mkdirSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "app");

const artifacts = process.argv[2];
const themeArg = process.argv.indexOf("--theme");
const theme = themeArg === -1 ? "dark" : (process.argv[themeArg + 1] ?? "dark");
if (!artifacts || !["dark", "light"].includes(theme)) {
  console.error(
    "usage: node scripts/prep-marketing-shots.mjs <artifacts-dir> --theme dark|light",
  );
  console.error("  <artifacts-dir> is a copy of the main repo's e2e/artifacts/userguide/");
  process.exit(2);
}
if (!existsSync(join(artifacts, "interface-tour.png"))) {
  console.error(`prep-marketing-shots: no interface-tour.png in ${artifacts}`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

/* section id -> guide frame. `panel: false` marks a frame that is not a
   per-section slide (the hero is its own window, and the phone comes from the
   mobile lane rather than from here). */
const FRAMES = [
  ["collaboration", "comments"],
  ["agents", "ai-chat"],
  ["markdown", "markdown-flowchart"],
  ["encryption", "vault-locked"],
  ["graph", "graph-all"],
  ["search", "find-and-replace"],
  ["portable", "export-notes"],
];

const suffix = theme === "light" ? "-light" : "";
const jobs = FRAMES
  /* The unlock screen is drawn in the app's default palette in both themes,
     because the theme is a vault preference and a locked vault has none. One
     file, written by the dark run. */
  .filter(([id]) => !(id === "encryption" && theme === "light"))
  .map(([id, frame]) => [
    join(artifacts, `${frame}.png`),
    join(OUT, id === "encryption" ? "p-encryption.webp" : `p-${id}${suffix}.webp`),
    // Panels render at ~600 CSS px, so 1400 is twice that.
    1400,
    80,
  ]);
jobs.push([join(artifacts, "interface-tour.png"), join(OUT, `desktop${suffix}.webp`), 2200, 82]);

// The phone pair is produced by the mobile lane, not by the desktop harness;
// pass it in beside the artifacts directory when there is one to refresh.
for (const [name, file] of [
  ["phone", "phone"],
  ["phone-light", "phone-light"],
]) {
  const src = join(artifacts, `${file}.png`);
  if (existsSync(src)) jobs.push([src, join(OUT, `${name}.webp`), 780, 82]);
}

let total = 0;
for (const [src, out, width, quality] of jobs) {
  if (!existsSync(src)) {
    console.error(`  missing frame: ${src}`);
    continue;
  }
  const info = await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(out);
  total += info.size;
  console.log(
    out.split("/").pop().padEnd(28),
    `${info.width}x${info.height}`.padEnd(12),
    `${(info.size / 1024).toFixed(0)}KB`,
  );
}

/* A panel whose section no longer exists is dead weight in a served bundle, and
   deleting it here is what stops `public/app/` drifting away from the page. The
   scope is the CURRENT theme only: a dark run may delete a `p-*.webp` that
   nothing maps to any more, and must never delete a `-light` one, which is the
   other run's output. */
// The phone pair is not a `job` on a run that has no phone artifacts, and the
// cleanup below deletes anything not in `expected`. Without the two names here a
// desktop-only re-shoot deletes `phone.webp` and the landing hero loses its
// frame, which is the same shape as the missing light pair this change fixes.
const PHONE_OUT = ["phone.webp", "phone-light.webp"];
const expected = new Set([
  ...jobs.map(([, out]) => out.split("/").pop()),
  ...PHONE_OUT,
]);
for (const f of readdirSync(OUT)) {
  if (expected.has(f)) continue;
  if (f.includes("-light") !== suffix.startsWith("-light")) continue;
  unlinkSync(join(OUT, f));
  console.log("  removed stale:", f);
}
console.log(`prep-marketing-shots: ${jobs.length} files, ${(total / 1024).toFixed(0)}KB (${theme})`);
