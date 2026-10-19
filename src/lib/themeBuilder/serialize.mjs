/**
 * Theme Builder — export serialization + the completeness gate (SYNC-2).
 *
 * Two files: `theme.json` (palette only — import-ready in the desktop app) and
 * `meta.json` (name/author/description/license[+appearance] — gallery/share only,
 * never consumed by import). `license` is fixed `CC-BY-4.0` (a no-code user
 * authors an original theme). Values are already hex (native pickers), but
 * theme.json is restricted to the 52 canonical tokens + key-sorted for a
 * deterministic, diff-friendly artefact.
 *
 * @typedef {import("./tokens.mjs").Palette} Palette
 */
import { ALL_TOKENS } from "./tokens.mjs";
import { allOrnamentTokens, TINT_TOKENS } from "./ornament.mjs";
import { allMeasureTokens } from "./measure.mjs";
import { missingRequired } from "./validator.mjs";

// Canonical tokens, key-sorted once — a deterministic, diff-friendly theme.json.
// Ornament, tint and measure tokens (myne#394) join the same set: all three are
// optional, so a theme that sets none of them is byte-identical to one authored
// before the vocabulary existed, and the app ignores any it does not recognize.
const SORTED_TOKENS = [
  ...ALL_TOKENS,
  ...allOrnamentTokens(),
  ...TINT_TOKENS,
  ...allMeasureTokens(),
].sort();

/**
 * The primitives whose slots the host element writes, and which therefore
 * INHERIT into nested roles. Mirrors the `INHERITS` set in the main repo's
 * `scripts/check-ornament-vocabulary.mjs`, which requires `ornaments.css` to
 * carry a per-role `="none"` reset rule for exactly these two.
 */
const INHERITING_ORNAMENTS = new Set(["frame", "shadow"]);

/** `--box-frame` → `frame`; a non-ornament token → `""`. */
function ornamentPrimitiveOf(token) {
  const m = /^--(?:surface|box|chrome)-([a-z]+)$/.exec(token);
  return m ? m[1] : "";
}

/**
 * The import-ready `theme.json`: the palette restricted to canonical tokens,
 * dropping blanks/stray keys, key-sorted.
 * @param {Palette} palette @returns {Palette}
 */
export function buildThemeJson(palette) {
  /** @type {Palette} */
  const out = {};
  for (const token of SORTED_TOKENS) {
    const v = palette?.[token];
    if (typeof v !== "string" || v.trim() === "") continue;
    // `none` / `plain` mean "draw nothing", which is also what an ABSENT key
    // means — so writing them would only make the file longer and noisier.
    //
    // **Except for the two primitives that INHERIT**, where the two are not the
    // same thing at all. `frame` and `shadow` write their slots on the host
    // element and custom properties inherit, so a box nested inside a framed
    // surface wears that frame until an explicit `--box-frame: none` resets it.
    // That escape hatch is the whole reason `ornaments.css` carries per-role
    // `="none"` rules — and dropping the key here deleted it on the way out, so
    // a theme author could select "no frame on rows inside panels", see it work
    // in the preview, and ship a file that could not express it.
    if ((v === "none" || v === "plain") && !INHERITING_ORNAMENTS.has(ornamentPrimitiveOf(token))) {
      continue;
    }
    out[token] = v;
  }
  return out;
}

/**
 * The gallery `meta.json`. License is fixed `CC-BY-4.0`; `appearance` comes from
 * the preview's effective mode (SYNC-8) and is omitted if not light|dark.
 * @param {{ name?: string, author?: string, description?: string }} fields
 * @param {"light" | "dark" | undefined} appearance
 */
export function buildMetaJson(fields, appearance) {
  /** @type {Record<string, string>} */
  const meta = {
    name: (fields.name ?? "").trim(),
    author: (fields.author ?? "").trim(),
    description: (fields.description ?? "").trim(),
    license: "CC-BY-4.0",
  };
  if (appearance === "light" || appearance === "dark") meta.appearance = appearance;
  return meta;
}

/**
 * Completeness gate: `theme.json` is rejected by the app/CI if any of the 21
 * required tokens is missing, so Submit/Download is blocked until all are set.
 * @param {Palette} palette @returns {{ ok: boolean, missing: string[] }}
 */
export function canExport(palette) {
  const missing = missingRequired(palette);
  return { ok: missing.length === 0, missing };
}
