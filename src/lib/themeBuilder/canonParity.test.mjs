/**
 * Theme Builder — the vendored canon against the sheet it describes (myne#900).
 *
 * The builder seeds a preview with `{ ...canon, ...palette }`, so every token a
 * theme omits shows the built-in value for the appearance the theme declares,
 * exactly as the app does. That makes `tokens.mjs` the builder's copy of the
 * canon, and a copy drifts: `DARK_DEFAULTS["--highlight"]` sat at `#4a3f1e`
 * (vendored when the builder landed) while the sheet had moved to `#4f4422`, and
 * nothing compared them. The same table also carried 44 of the sheet's 65
 * appearance-varying tokens, so the merge would have corrected three families and
 * silently left the graph group colours, eight highlight washes, the selection
 * wash, `--danger-solid` and the three shadows on their light values.
 *
 * So this test parses the CAPTURED sheet the preview actually renders
 * (`src/data/preview/preview.css`, synced from the app by `sync-preview.mjs`) and
 * compares both ways: a token the sheet re-points per appearance must be in the
 * table with the sheet's own value, and a table entry the sheet does not vary is
 * reported as stale. Names AND values, so neither half can rot alone.
 *
 * `--info` is the one documented exclusion: its dark declaration is
 * `var(--accent)`, an alias, and the builder's value gate accepts concrete values
 * only, so seeding it would freeze whatever accent was resolved at read time.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { DARK_DEFAULTS, LIGHT_DEFAULTS } from "./tokens.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SHEET = join(HERE, "..", "..", "data", "preview", "preview.css");

/** The declared `--token: value` pairs of one block, located by its selector. */
function blockDecls(css, selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `no ${selector} block in the captured sheet`);
  const end = css.indexOf("}", start);
  const out = new Map();
  for (const [, key, value] of css.slice(start, end).matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+)/g)) {
    out.set(key, value.trim());
  }
  assert.notEqual(out.size, 0, `${selector} parsed as empty`);
  return out;
}

/** Every declared pair in the file, so a private `--_*-dark` ramp can be resolved. */
function allDecls(css) {
  const out = new Map();
  for (const [, key, value] of css.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+)/g)) {
    if (!out.has(key)) out.set(key, value.trim());
  }
  return out;
}

/** Resolve `var(--x)` chains the way the browser would, to a concrete value. */
function resolve(value, everything, depth = 0) {
  if (depth > 6) return value;
  const m = /^var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]*))?\)$/.exec(String(value).trim());
  if (m === null) return value;
  const next = everything.get(m[1]) ?? m[2];
  return next === undefined ? value : resolve(next, everything, depth + 1);
}

/** The sheet's appearance-varying tokens, resolved, per appearance. */
function sheetCanon() {
  const css = readFileSync(SHEET, "utf8");
  const everything = allDecls(css);
  const light = blockDecls(css, ":root");
  const dark = blockDecls(css, ':root[data-theme="dark"]');
  const varying = [...dark.keys()].filter(
    (key) => light.has(key) && !key.startsWith("--_") && light.get(key) !== dark.get(key) && key !== "--info",
  );
  assert.ok(varying.length >= 60, `expected the sheet to vary many tokens, saw ${varying.length}`);
  return {
    light: Object.fromEntries(varying.map((key) => [key, resolve(light.get(key), everything)])),
    dark: Object.fromEntries(varying.map((key) => [key, resolve(dark.get(key), everything)])),
  };
}

test("the vendored canon is exactly the sheet's appearance-varying set", () => {
  const sheet = sheetCanon();
  // The FULL key set, not an intersection: filtering to the keys the sheet knows
  // would let the table grow an entry nothing varies, which is the stale-entry
  // half of the same drift.
  assert.deepEqual(
    Object.keys(LIGHT_DEFAULTS).sort(),
    Object.keys(sheet.light).sort(),
    "LIGHT_DEFAULTS and the sheet disagree on which tokens vary",
  );
});

/**
 * Compare VALUES, not spellings. The captured sheet is minified (`#fff`,
 * `rgba(44,74,122,0.22)` shortened to 8-digit hex), while the table is written in
 * the source notation, so a literal string compare would report a drift for every
 * colour whose spelling differs and never for a colour that actually moved. Both
 * sides are reduced to 8-digit lowercase hex, and anything that is not a colour
 * (the shadow lists) compares literally.
 */
function normalize(value) {
  const text = String(value).trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,8})$/.exec(text);
  if (hex !== null) {
    const h = hex[1];
    const full =
      h.length === 3 ? [...h].map((c) => c + c).join("") + "ff"
      : h.length === 4 ? [...h].map((c) => c + c).join("")
      : h.length === 6 ? h + "ff"
      : h;
    return `#${full}`;
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(text);
  if (rgb !== null) {
    const alpha = Math.round(Number(rgb[4] ?? 1) * 255);
    return `#${[rgb[1], rgb[2], rgb[3], alpha]
      .map((n) => Number(n).toString(16).padStart(2, "0"))
      .join("")}`;
  }
  return text;
}

test("every vendored value matches the sheet, in both appearances", () => {
  const sheet = sheetCanon();
  const wrongLight = Object.entries(sheet.light).filter(([key, v]) => normalize(LIGHT_DEFAULTS[key]) !== normalize(v));
  const wrongDark = Object.entries(sheet.dark).filter(([key, v]) => normalize(DARK_DEFAULTS[key]) !== normalize(v));
  assert.deepEqual(wrongLight, [], "light values drifted from the sheet");
  assert.deepEqual(wrongDark, [], "dark values drifted from the sheet");
});
