/**
 * Theme Builder: derivation of a tone family's shades from its anchor (SYNC-6).
 *
 * Builder-side sugar so a non-technical user picks one color per family and the
 * shades that follow from it are filled in for them, each one overridable (the
 * link control on the row is what "overridable" means in the UI). The app stores
 * raw values, so every derivation is MATERIALISED into state, never left
 * implicit: a theme is always a flat palette.
 *
 * ── THE RULES ARE DECLARATIVE, AND THAT IS THE POINT ────────────────────────
 * `DERIVATION_RULES` is keyed by anchor token and names a `kind` per shade
 * rather than hard-coding a formula per token name. The kinds are the five
 * relationships a palette actually has:
 *
 *   shade      darker than the anchor (hover, pressed, panel surfaces)
 *   wash       the anchor mixed into the page colour (soft backgrounds)
 *   on         whichever of near-black / white reads better on the anchor
 *   contrast   mixed toward the appearance's extreme, for a stronger text tone
 *   blend-to   mixed toward ANOTHER palette token (secondary text toward the
 *              page, divider lines toward the muted text colour)
 *
 * `blend-to` is why `helpersForBase` accepts the palette: a divider is
 * meaningless without knowing what the muted text colour is. When that token is
 * absent the rule degrades to the anchor unchanged rather than inventing a
 * value, so a partial palette can never produce a color the author did not ask
 * for.
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

/** The near-black / near-white pair a palette mixes toward. */
const DARK_TEXT = "#0b0b09";
const LIGHT_TEXT = "#ffffff";

/** @typedef {{ token: string, kind: "shade"|"wash"|"on"|"contrast"|"blend-to", amount?: number, target?: string }} Rule */

/**
 * The derivation table: anchor token → the shades it drives.
 * @type {Record<string, Rule[]>}
 */
export const DERIVATION_RULES = {
  // Panels and hover surfaces are derived a little BELOW the page.
  //
  // That is a builder DEFAULT, not a law of the gallery: measured over
  // `src/data/themes-full.json`, five of the twelve shipped themes put their
  // panels LIGHTER than the page (arcade-crt, gruvbox-dark, nocturne, nord,
  // solarized-dark) and four put hover surfaces lighter than panels. So an author
  // who starts from one of those and then nudges the page colour gets panels
  // derived downward, which is not the direction their base theme uses. It is
  // one click to unlink a shade that reads wrong, and the alternative (reading
  // the base theme's own direction) would need the builder to know which theme
  // the palette came from, which it deliberately does not.
  "--paper": [
    { token: "--paper-2", kind: "shade", amount: 0.045 },
    { token: "--paper-3", kind: "shade", amount: 0.09 },
  ],
  // Headings push past the body colour; secondary and muted text fall back
  // toward the page they are read on.
  "--ink-1": [
    { token: "--ink-0", kind: "contrast", amount: 0.45 },
    { token: "--ink-2", kind: "blend-to", target: "--paper", amount: 0.35 },
    { token: "--ink-3", kind: "blend-to", target: "--paper", amount: 0.6 },
  ],
  // A divider is a hairline that has moved toward the muted text colour.
  "--line-1": [
    { token: "--line-2", kind: "blend-to", target: "--ink-3", amount: 0.5 },
    { token: "--line-3", kind: "blend-to", target: "--ink-3", amount: 0.8 },
  ],
  "--accent": [
    { token: "--accent-hover", kind: "shade", amount: 0.14 },
    { token: "--accent-press", kind: "shade", amount: 0.26 },
    { token: "--accent-soft", kind: "wash", amount: 0.86 },
    // On-accent text is picked by measured contrast, not by a luminance
    // threshold: the crossover sits near 0.18, so a fixed 0.4 chose white for
    // mid-tone accents where black has strictly more contrast, dropping the
    // button label below AA. See `deriveHelpers`.
    { token: "--accent-on", kind: "on" },
  ],
  "--danger": [{ token: "--danger-soft", kind: "wash", amount: 0.86 }],
  "--warning": [{ token: "--warning-soft", kind: "wash", amount: 0.86 }],
  "--success": [{ token: "--success-soft", kind: "wash", amount: 0.86 }],
};

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
    // strictly more contrast: sometimes dropping the button label below AA.
    on:
      (contrastRatio(base, "#ffffff") ?? 0) >= (contrastRatio(base, DARK_TEXT) ?? 0)
        ? "#ffffff"
        : DARK_TEXT,
  };
}

/**
 * Evaluate ONE rule against an anchor value.
 * @param {Rule} rule @param {string} base @param {boolean} isDark
 * @param {Palette} [palette]
 * @returns {string} `#rrggbb`
 */
export function applyRule(rule, base, isDark, palette = {}) {
  const surface = isDark ? "#141412" : "#ffffff";
  switch (rule.kind) {
    case "shade":
      return mix(base, "#000000", rule.amount ?? 0.1);
    case "wash":
      return mix(base, surface, rule.amount ?? 0.86);
    case "contrast":
      return mix(base, isDark ? LIGHT_TEXT : DARK_TEXT, rule.amount ?? 0.45);
    case "blend-to": {
      const target = rule.target ? palette[rule.target] : undefined;
      // No such token in this palette: leave the anchor alone rather than
      // inventing a neighbour the author never set.
      if (typeof target !== "string" || target.trim() === "") return base;
      return mix(base, target, rule.amount ?? 0.5);
    }
    case "on":
      return (contrastRatio(base, "#ffffff") ?? 0) >= (contrastRatio(base, DARK_TEXT) ?? 0)
        ? "#ffffff"
        : DARK_TEXT;
    default:
      return base;
  }
}

/**
 * Map a base token + value to its derived token→value pairs, per
 * `DERIVATION_RULES`. Returns `{}` for a token that drives nothing (a
 * standalone token such as a syntax colour).
 *
 * @param {string} baseToken @param {string} baseValue @param {boolean} isDark
 * @param {Palette} [palette] the rest of the palette, for `blend-to` rules
 * @returns {Palette}
 */
export function helpersForBase(baseToken, baseValue, isDark, palette = {}) {
  const rules = DERIVATION_RULES[baseToken];
  if (!rules) return {};
  /** @type {Palette} */
  const out = {};
  for (const rule of rules) out[rule.token] = applyRule(rule, baseValue, isDark, palette);
  return out;
}

/**
 * Re-derive every helper token in `palette` from its anchor, honouring the
 * pinned set: a pinned token is an author's deliberate override and is left
 * exactly as it is.
 *
 * @param {Palette} palette @param {boolean} isDark
 * @param {Iterable<string>} [pinned]
 * @returns {Palette} only the derived changes
 */
export function deriveAll(palette, isDark, pinned = []) {
  const pinnedSet = new Set(pinned);
  /** @type {Palette} */
  const out = {};
  for (const [anchor, helpers] of Object.entries(DERIVATIONS)) {
    const base = palette[anchor];
    if (typeof base !== "string" || base.trim() === "") continue;
    const derived = helpersForBase(anchor, base, isDark, palette);
    for (const token of helpers) {
      if (pinnedSet.has(token)) continue;
      if (derived[token]) out[token] = derived[token];
    }
  }
  return out;
}
