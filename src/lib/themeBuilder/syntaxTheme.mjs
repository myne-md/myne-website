/**
 * Theme Builder — authentic dark-syntax derivation.
 *
 * A faithful port of the desktop `src/lib/syntaxTheme.ts`
 * (`deriveSyntaxTokensForTheme`), so the preview's code sample renders EXACTLY
 * what the app renders: on a dark background, each of the 12 syntax roles the
 * theme does NOT define itself is filled from the built-in dark syntax ramp
 * (per-role, MYND-527), leaving roles the theme defines untouched.
 *
 * One deliberate adaptation: the desktop aliases each omitted role to
 * `var(--_syntax-<role>-dark)` (a source var defined in the app's `:root`). The
 * preview wrapper has no such source vars, so we resolve to the CONCRETE dark
 * canon hex (the same value those vars hold) — which also passes the value gate
 * (a `var(...)` would be rejected by the allowlist).
 *
 * @typedef {import("./tokens.mjs").Palette} Palette
 */
import { relativeLuminance } from "./contrast.mjs";
import { SYNTAX_TOKENS, DARK_DEFAULTS } from "./tokens.mjs";

/**
 * True when `background` is dark — WCAG relative luminance below 0.5. Unparseable
 * (non-hex) → false (keep the light default; the safe no-change fallback).
 * @param {string} background
 */
export function isDarkBackground(background) {
  const lum = relativeLuminance(background);
  return lum !== null && lum < 0.5;
}

/**
 * The `--syntax-*` overrides to apply for a `palette`, or `{}` for none. On a
 * dark `--paper`, fills each of the 12 syntax roles the theme omits with the
 * concrete dark canon hex; light theme / no `--paper` / fully-defined → `{}`.
 * @param {Palette} palette @returns {Palette}
 */
export function deriveSyntaxTokensForTheme(palette) {
  const background = palette?.["--paper"];
  if (background === undefined || !isDarkBackground(background)) return {};
  /** @type {Palette} */
  const out = {};
  for (const token of SYNTAX_TOKENS) {
    if (palette[token] === undefined) out[token] = DARK_DEFAULTS[token];
  }
  return out;
}
