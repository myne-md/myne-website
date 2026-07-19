// Sync the theme gallery data from the sibling `myne-themes` repo into this site.
//
// This is the build-time coupling (MYND-508): myne-themes CI generates
// `index.json` + `previews/*.png` (the `gallery` artifact); this script pulls
// them in so `/themes` can render statically with no cross-repo fetch at request
// time. Run it before `pnpm build` (or wire it into the deploy that has the
// gallery artifact / a pinned myne-themes checkout).
//
// Sources, in order: THEMES_DIR env → ../myne-themes (sibling checkout).
// If neither is found, writes an empty index so the site still builds.

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  readdirSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collectFullPalettes } from "./lib-theme-palettes.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const OUT_DATA = join(SITE, "src", "data", "themes-index.json");
const OUT_FULL = join(SITE, "src", "data", "themes-full.json");
const OUT_PREVIEWS = join(SITE, "public", "themes", "previews");

const src = process.env.THEMES_DIR || join(SITE, "..", "myne-themes");
const indexPath = join(src, "index.json");

mkdirSync(dirname(OUT_DATA), { recursive: true });
mkdirSync(OUT_PREVIEWS, { recursive: true });

// Full palettes for the Theme Builder "start from a gallery theme" preset —
// vendored client-side, independent of the generated index (SYNC-5).
const fullPalettes = collectFullPalettes(src);
writeFileSync(OUT_FULL, JSON.stringify(fullPalettes, null, 2) + "\n");

if (!existsSync(indexPath)) {
  console.warn(
    `[sync-themes] no index.json at ${indexPath} — writing an empty gallery.\n` +
      `  Generate it first: (cd ${src} && node tools/build-index.mjs index.json && ` +
      `for d in themes/*/; do node tools/render-preview.mjs "$d" "previews/$(basename $d).png"; done)`,
  );
  writeFileSync(OUT_DATA, JSON.stringify({ themes: [] }, null, 2) + "\n");
  console.log(
    `[sync-themes] wrote ${OUT_FULL} (${Object.keys(fullPalettes).length} full palettes).`,
  );
  process.exit(0);
}

const index = JSON.parse(readFileSync(indexPath, "utf8"));
const previewsDir = join(src, "previews");

// Rewrite preview paths to the site-served location and copy the PNGs in.
for (const row of index.themes) {
  const png = `${row.slug}.png`;
  const from = join(previewsDir, png);
  if (existsSync(from)) {
    copyFileSync(from, join(OUT_PREVIEWS, png));
    row.preview = `/themes/previews/${png}`;
  } else {
    // No preview rendered — fall back to the swatch chiplet in the page.
    row.preview = null;
  }
}

writeFileSync(OUT_DATA, JSON.stringify(index, null, 2) + "\n");
const copied = readdirSync(OUT_PREVIEWS).filter((f) => f.endsWith(".png")).length;
console.log(
  `[sync-themes] wrote ${OUT_DATA} (${index.themes.length} themes), ${copied} previews → public/themes/previews/`,
);
console.log(
  `[sync-themes] wrote ${OUT_FULL} (${Object.keys(fullPalettes).length} full palettes → builder presets).`,
);
