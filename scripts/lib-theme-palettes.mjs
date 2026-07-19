// Collect full theme palettes from a sibling `myne-themes` checkout.
//
// The gallery index (index.json) only carries 5 swatches + metadata per theme.
// The Theme Builder's "start from a gallery theme" preset needs the FULL palette,
// so this reads each themes/<slug>/theme.json directly (independent of the
// generated index) into a { slug: palette } map. Vendored at build time into
// src/data/themes-full.json — NO runtime fetch (SYNC-5, no-phone-home).

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Read every `themes/<slug>/theme.json` under a myne-themes root into a flat
 * `{ slug: palette }` map. Returns `{}` if the root (or its `themes/` dir) is
 * absent, and skips a malformed `theme.json` — so a missing/partial sibling
 * degrades gracefully and never fails the site build.
 * @param {string} themesRoot  path to a myne-themes checkout
 * @returns {Record<string, Record<string, string>>}
 */
export function collectFullPalettes(themesRoot) {
  const themesDir = join(themesRoot, "themes");
  if (!existsSync(themesDir)) return {};
  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  for (const slug of readdirSync(themesDir).sort()) {
    const themeJson = join(themesDir, slug, "theme.json");
    if (!existsSync(themeJson)) continue;
    try {
      out[slug] = JSON.parse(readFileSync(themeJson, "utf8"));
    } catch {
      // skip a malformed theme.json rather than break the whole build
    }
  }
  return out;
}
