// Sync the theme-preview snapshot from the main `myne` repo into this site.
//
// The sibling of `sync-themes.mjs`, and the same build-time coupling (myne#394):
// `preview/src/preview.{html,css}` are captured FROM the running desktop app by
// `e2e/capture/theme-preview.capture.ts`, and this pulls them in so the theme
// builder and the gallery can render the REAL interface with no cross-repo fetch
// at request time.
//
// Why a copy rather than an import: this site is a separate repo with its own
// build, and nothing here can resolve a pnpm workspace member of the app's tree.
// The copy is a derived artefact — `src/data/preview/` is regenerated, never
// hand-edited — and `preview.meta.json` records which commit it came from, so a
// stale one is answerable rather than mysterious.
//
// Sources, in order: MYNE_DIR env → ../ (this site lives inside the main repo).
// If the snapshot is not found, writes nothing and leaves any previous copy in
// place, so the site still builds — an absent snapshot degrades the builder's
// preview, it does not break the deploy.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const OUT_DIR = join(SITE, "src", "data", "preview");
// The captured CSS carries the app's own `@font-face` rules verbatim, and they
// point at absolute `/fonts/*.woff2` paths. This site self-hosts a DIFFERENT
// build of the same families (@fontsource, latin subset, bundled), so those
// paths resolve to nothing here — copying the app's font files to the same path
// is what makes the preview render in the app's actual typefaces instead of
// silently falling back. Rewriting the URLs instead would mean re-doing the
// rewrite every time the capture changes.
const OUT_FONTS = join(SITE, "public", "fonts");

const src = process.env.MYNE_DIR || join(SITE, "..");
const previewDir = join(src, "preview", "src");

const HTML = join(previewDir, "preview.html");
const CSS = join(previewDir, "preview.css");
const META = join(previewDir, "meta.json");
const APPLY = join(previewDir, "apply.mjs");

if (!existsSync(HTML) || !existsSync(CSS)) {
  console.warn(
    `[sync-preview] no snapshot at ${previewDir} — leaving any previous copy in place.\n` +
      "               Capture one from the main repo:\n" +
      "                 ./scripts/capture-theme-preview.sh && cp e2e/artifacts/theme-preview/* preview/src/",
  );
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(OUT_FONTS, { recursive: true });

copyFileSync(HTML, join(OUT_DIR, "preview.html"));
copyFileSync(CSS, join(OUT_DIR, "preview.css"));
// The shared apply helper travels with the artefact it applies to. Without it
// this site would keep its own copy of "paint a palette onto the snapshot" —
// which is how the copies diverged over `none` in the first place.
if (existsSync(APPLY)) copyFileSync(APPLY, join(OUT_DIR, "apply.mjs"));

let commit = "unknown";
if (existsSync(META)) {
  copyFileSync(META, join(OUT_DIR, "meta.json"));
  try {
    commit = JSON.parse(readFileSync(META, "utf8")).commit ?? "unknown";
  } catch {
    /* a meta this site cannot read is not worth failing a build over */
  }
} else {
  writeFileSync(join(OUT_DIR, "meta.json"), `${JSON.stringify({ commit: "unknown" }, null, 2)}\n`);
}

let fonts = 0;
const fontsDir = join(src, "public", "fonts");
if (existsSync(fontsDir)) {
  for (const f of ["InterVariable.woff2", "JetBrainsMono.woff2"]) {
    const from = join(fontsDir, f);
    if (!existsSync(from)) continue;
    copyFileSync(from, join(OUT_FONTS, f));
    fonts++;
  }
}

const bytes = readFileSync(join(OUT_DIR, "preview.css")).length;
console.log(
  `[sync-preview] wrote ${OUT_DIR} (${Math.round(bytes / 1024)} KiB css) from ${String(commit).slice(0, 8)}, ${fonts} font file(s) → public/fonts/`,
);
