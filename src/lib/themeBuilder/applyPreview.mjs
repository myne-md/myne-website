/**
 * Theme Builder — live preview apply engine (SYNC-4, hard rule).
 *
 * The site has NO CSP, so the value allowlist is the ONLY injection gate in the
 * browser. Every value is checked with `isAllowedValue` (the faithful `value.rs`
 * port) BEFORE it reaches the DOM, and applied strictly via per-property CSSOM
 * `setProperty` — which cannot inject a second declaration. NEVER string-
 * concatenate values into an inline `<style>` block or `style` attribute (that's
 * what the headless gallery renderer does, safe only because it runs over
 * already-validated committed themes).
 *
 * `target` is a CSSStyleDeclaration (`element.style`) in the browser, or any
 * `{ setProperty(name, value) }` stub in tests.
 *
 * @typedef {import("./tokens.mjs").Palette} Palette
 * @typedef {{ setProperty: (name: string, value: string) => void }} CssTarget
 */
import { isAllowedValue } from "./validator.mjs";
import { deriveSyntaxTokensForTheme } from "./syntaxTheme.mjs";

/**
 * Apply a palette to a scoped CSS target, gating each value through the
 * allowlist. Values that fail are skipped (never applied).
 * @param {CssTarget | null | undefined} target
 * @param {Palette | null | undefined} palette
 */
export function applyPalette(target, palette) {
  if (!target || !palette) return;
  for (const [token, value] of Object.entries(palette)) {
    if (typeof value === "string" && isAllowedValue(value)) {
      target.setProperty(token, value);
    }
  }
}

/**
 * Apply a full theme authentically: the raw palette, then the dark-syntax
 * derivation the desktop app applies (`deriveSyntaxTokensForTheme`) — so the
 * preview's code sample matches what the app renders. Both passes are gated.
 * @param {CssTarget | null | undefined} target
 * @param {Palette | null | undefined} palette
 */
export function applyTheme(target, palette) {
  applyPalette(target, palette);
  if (palette) applyPalette(target, deriveSyntaxTokensForTheme(palette));
}
