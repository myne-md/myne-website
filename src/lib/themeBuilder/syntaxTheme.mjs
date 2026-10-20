/**
 * Theme Builder — the appearance predicate.
 *
 * True when a palette's own background is dark. `applyPreview.mjs` uses it to pick
 * which built-in canon to seed the tokens a theme omits, exactly as the app does
 * (`src/lib/themeCanon.ts`), so a dark theme applied while the light preset was
 * selected still gets the dark canon.
 *
 * This module used to also carry `deriveSyntaxTokensForTheme`, the builder's port
 * of the desktop one-family fill. myne#900 retired both: the canon seed covers
 * every appearance-varying family, so the syntax-only patch had nothing left to do.
 */
import { relativeLuminance } from "./contrast.mjs";

/**
 * True when `background` is dark — WCAG relative luminance below 0.5. Unparseable
 * (non-hex) → false (keep the light default; the safe no-change fallback).
 * @param {string} background
 */
export function isDarkBackground(background) {
  const lum = relativeLuminance(background);
  return lum !== null && lum < 0.5;
}
