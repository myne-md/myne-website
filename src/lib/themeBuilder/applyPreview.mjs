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
import { isAllowedKey, isAllowedValue, isReservedKey } from "./validator.mjs";
import { deriveSyntaxTokensForTheme } from "./syntaxTheme.mjs";

/**
 * Apply a palette to a scoped CSS target, gating each value through the
 * allowlist. Values that fail are skipped (never applied).
 * @param {CssTarget | null | undefined} target
 * @param {Palette | null | undefined} palette
 */
/**
 * The keys the last {@link applyPalette} wrote, per target.
 *
 * Without this the preview only ever ADDS. Switching from a preset that sets
 * `--space-3`, `--text-base`, `--tint` and `--tint-strength` to "Blank — light"
 * left all four painted, because the blank defaults have zero overlap with the
 * measure, tint and ornament sets — so the preview showed a palette that was no
 * longer selected. The shared `preview/src/apply.mjs` solves this exact problem
 * with the same WeakMap; this hot path bypassed it, which is the one thing
 * extracting that module was supposed to prevent.
 */
const written = new WeakMap();

export function applyPalette(target, palette) {
  if (!target || !palette) return;
  // Everything the previous palette wrote and this one does not is removed
  // first. `removeProperty` on an absent property is a no-op, so this is exactly
  // as correct as tracking removals and cannot drift out of step with the apply.
  const previous = written.get(target) ?? [];
  const incoming = new Set(Object.keys(palette));
  for (const key of previous) {
    if (!incoming.has(key)) target.removeProperty?.(key);
  }
  const applied = [];
  for (const [token, value] of Object.entries(palette)) {
    // The KEY is gated too, and it was not: this module's own docstring says it
    // faces unvalidated live-form input, and it checked only the value. A key in
    // the reserved `--_` namespace would have let a palette rewrite
    // `--_o-ceiling`, the bound the tint wash is clamped by, so the preview
    // would have shown a wash the app clamps back down — the builder lying about
    // its own limit. No path reached it today; the next one added would have.
    if (!isAllowedKey(token) || isReservedKey(token)) continue;
    if (typeof value === "string" && isAllowedValue(value)) {
      target.setProperty(token, value);
      applied.push(token);
    }
  }
  written.set(target, applied);
}

/**
 * Apply a full theme authentically: the raw palette, then the dark-syntax
 * derivation the desktop app applies (`deriveSyntaxTokensForTheme`) — so the
 * preview's code sample matches what the app renders. Both passes are gated.
 * @param {CssTarget | null | undefined} target
 * @param {Palette | null | undefined} palette
 */
export function applyTheme(target, palette) {
  // ONE call, not two. `applyPalette` now removes what the previous palette
  // wrote and this one does not — so a second call would take the first call's
  // tokens straight back out again. Merging with the derived tokens last keeps
  // the precedence the two-call version had (derived wins) while leaving the
  // removal set correct.
  if (!palette) {
    applyPalette(target, palette);
    return;
  }
  applyPalette(target, { ...palette, ...deriveSyntaxTokensForTheme(palette) });
}
