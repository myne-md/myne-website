/**
 * Theme Builder — helper-shade derivation + dark optional seeding (SYNC-6).
 *
 * Builder-side sugar so a non-technical user picks one base color and the
 * hover / pressed / soft / on-text shades (and status softs) are filled in for
 * them (grill builder-controls Q3), each overridable. The app stores raw values,
 * so derivations are MATERIALIZED into state, not left implicit.
 *
 * @typedef {import("./tokens.mjs").Palette} Palette
 */
import { hexToRgb, contrastRatio } from "./contrast.mjs";
import { DERIVATIONS } from "./manifest.mjs";

const clamp = (n) => Math.max(0, Math.min(255, n));
const toHex = (rgb) => "#" + rgb.map((c) => clamp(Math.round(c)).toString(16).padStart(2, "0")).join("");

/** Linear blend of two hex colors; `t` is the weight toward `b`. Falls back to `a` if either isn't hex. */
function mix(a, b, t) {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return a;
  return toHex(ra.map((c, i) => c + (rb[i] - c) * t));
}

/**
 * Derive the four helper shades for a base color. `isDark` tints the soft shade
 * toward the dark surface instead of white.
 * @param {string} base @param {boolean} isDark
 * @returns {{ hover: string, press: string, soft: string, on: string }}
 */
export function deriveHelpers(base, isDark) {
  const surface = isDark ? "#141412" : "#ffffff";
  return {
    hover: mix(base, "#000000", 0.14),
    press: mix(base, "#000000", 0.26),
    soft: mix(base, surface, 0.86),
    // On-accent text: pick whichever of light/dark actually reads better against
    // the base by WCAG contrast. A fixed luminance threshold (the crossover is
    // ~0.18, not a tidy 0.4) chose white for mid-tone accents where black has
    // strictly more contrast — sometimes dropping the button label below AA.
    on:
      (contrastRatio(base, "#ffffff") ?? 0) >= (contrastRatio(base, "#0b0b09") ?? 0)
        ? "#ffffff"
        : "#0b0b09",
  };
}

/**
 * Map a base token + value to its helper token→value pairs, per the manifest
 * DERIVATIONS. Returns `{}` for a token that has no helpers (a non-base token).
 * @param {string} baseToken @param {string} baseValue @param {boolean} isDark
 * @returns {Palette}
 */
export function helpersForBase(baseToken, baseValue, isDark) {
  const helpers = DERIVATIONS[baseToken] || [];
  const d = deriveHelpers(baseValue, isDark);
  /** @type {Palette} */
  const out = {};
  for (const h of helpers) {
    if (h.endsWith("-hover")) out[h] = d.hover;
    else if (h.endsWith("-press")) out[h] = d.press;
    else if (h.endsWith("-soft")) out[h] = d.soft;
    else if (h.endsWith("-on")) out[h] = d.on;
  }
  return out;
}

// Note: dark-theme optional completion (SYNC-6) is handled directly by the
// preset base-merge in builder.astro (`{ ...DARK_DEFAULTS, ...palette }`), which
// already sets all 52 tokens — no separate seeding helper is needed.
