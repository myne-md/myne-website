/**
 * Theme Builder — export serialization + the completeness gate (SYNC-2).
 *
 * Two files: `theme.json` (palette only — import-ready in the desktop app) and
 * `meta.json` (name/author/description/license[+appearance] — gallery/share only,
 * never consumed by import). `license` is fixed `CC-BY-4.0` (a no-code user
 * authors an original theme). Values are already hex (native pickers), but
 * theme.json is restricted to the 44 canonical tokens + key-sorted for a
 * deterministic, diff-friendly artefact.
 *
 * @typedef {import("./tokens.mjs").Palette} Palette
 */
import { ALL_TOKENS } from "./tokens.mjs";
import { missingRequired } from "./validator.mjs";

// Canonical tokens, key-sorted once — a deterministic, diff-friendly theme.json.
const SORTED_TOKENS = [...ALL_TOKENS].sort();

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
    if (typeof v === "string" && v.trim() !== "") out[token] = v;
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
