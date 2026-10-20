/**
 * Theme Builder: the dice.
 *
 * Two shapes, one module: re-roll a SINGLE token, or compose a whole palette
 * from one random hue. Both are suggestions, not generators of truth: the
 * result lands in state exactly like a hand-picked color, so the author can
 * carry on from it, and `randomizePalette` materialises the same derivations a
 * preset load does rather than leaving a family half-filled.
 *
 * Coherence is the reason a whole-theme roll picks ONE hue first and every
 * colour is placed relative to it: rolling 44 independent hex values produces
 * noise, which is what makes randomizers useless. Within that hue, each family
 * keeps the envelope a palette actually uses (surfaces near the page's
 * lightness, text at the contrast extreme, washes low-saturation) so the result
 * is a theme someone might ship rather than a test pattern.
 *
 * `rand` is injectable so the tests can pin a sequence; nothing here calls
 * `Math.random` directly.
 *
 * @typedef {import("./tokens.mjs").Palette} Palette
 */
import { hsvToHex } from "./colorPicker.mjs";
import { contrastRatio } from "./contrast.mjs";
import {
  DARK_DEFAULTS,
  LIGHT_DEFAULTS,
  SYNTAX_TOKENS,
  LABEL_TOKENS,
  HIGHLIGHT_TOKENS,
} from "./tokens.mjs";
import { deriveAll } from "./derive.mjs";

/** Random in `[min, max)`. */
const between = (rand, min, max) => min + rand() * (max - min);

/** The token's tone family, which decides the envelope its random value uses. */
export function familyOf(token) {
  if (/^--paper/.test(token)) return "surface";
  if (/^--ink/.test(token)) return "text";
  if (/^--line/.test(token)) return "line";
  if (/^--accent/.test(token)) return "accent";
  if (/^--danger/.test(token)) return "danger";
  if (/^--warning/.test(token)) return "warning";
  if (/^--success/.test(token)) return "success";
  if (/^--syntax/.test(token)) return "syntax";
  if (/^--label/.test(token)) return "label";
  if (/^--highlight/.test(token)) return "highlight";
  return "other";
}

/** The hue each status family sits near, so "error" still reads as red. */
const STATUS_HUE = { danger: 8, warning: 42, success: 145 };
/** The six label hues, in the order the manifest lists them. */
const LABEL_HUE = [18, 40, 105, 212, 300, 30];

/**
 * A random value for ONE token, inside its family's envelope.
 *
 * `hue` places the value in the rolled palette's colour scheme; `rand` supplies
 * the jitter. An `on` token (text drawn on top of another colour) is not rolled
 * at all: it is picked by measured contrast against `--accent`, because a
 * random one is a coin flip on whether the button label is readable.
 *
 * @param {string} token
 * @param {{ isDark?: boolean, hue?: number, rand?: () => number, palette?: Palette }} [opts]
 * @returns {string} `#rrggbb`
 */
export function randomValueFor(token, opts = {}) {
  const { isDark = false, rand = Math.random, palette = {} } = opts;
  const hue = opts.hue ?? rand() * 360;
  const rot = (deg) => (hue + deg + 720) % 360;
  const fam = familyOf(token);

  if (token === "--accent-on") {
    const accent = palette["--accent"] ?? "#2c4a7a";
    return (contrastRatio(accent, "#ffffff") ?? 0) >= (contrastRatio(accent, "#0b0b09") ?? 0)
      ? "#ffffff"
      : "#0b0b09";
  }

  switch (fam) {
    case "surface":
      // The page colour: a near-white with a trace of the hue in light mode, a
      // near-black in dark. Panels are derived from it, so only the page's own
      // lightness is rolled here.
      return isDark
        ? hsvToHex(rot(between(rand, -12, 12)), between(rand, 0.02, 0.08), between(rand, 0.06, 0.13))
        : hsvToHex(rot(between(rand, -12, 12)), between(rand, 0.0, 0.05), between(rand, 0.95, 0.99));
    case "text":
      return isDark
        ? hsvToHex(rot(between(rand, -12, 12)), between(rand, 0.0, 0.08), between(rand, 0.82, 0.97))
        : hsvToHex(rot(between(rand, -12, 12)), between(rand, 0.0, 0.08), between(rand, 0.04, 0.16));
    case "line":
      return isDark
        ? hsvToHex(rot(between(rand, -12, 12)), between(rand, 0.02, 0.08), between(rand, 0.16, 0.34))
        : hsvToHex(rot(between(rand, -12, 12)), between(rand, 0.02, 0.08), between(rand, 0.6, 0.8));
    case "accent":
      return hsvToHex(rot(between(rand, 120, 300)), between(rand, 0.35, 0.75), isDark ? between(rand, 0.6, 0.85) : between(rand, 0.32, 0.55));
    case "danger":
    case "warning":
    case "success": {
      const h = STATUS_HUE[fam] + between(rand, -8, 8);
      return hsvToHex(h, between(rand, 0.5, 0.85), isDark ? between(rand, 0.6, 0.82) : between(rand, 0.34, 0.5));
    }
    case "syntax":
      return hsvToHex(rot(between(rand, 0, 360)), between(rand, 0.25, 0.65), isDark ? between(rand, 0.62, 0.86) : between(rand, 0.32, 0.5));
    case "label": {
      const idx = LABEL_TOKENS.indexOf(token);
      const h = (LABEL_HUE[idx] ?? 0) + between(rand, -10, 10);
      return hsvToHex(h, between(rand, 0.3, 0.55), isDark ? between(rand, 0.6, 0.78) : between(rand, 0.36, 0.5));
    }
    case "highlight":
      // A wash is read THROUGH by dark text, so it stays light and unsaturated
      // in both appearances rather than following the surface colour.
      return hsvToHex(rot(between(rand, 0, 360)), between(rand, 0.1, 0.3), between(rand, 0.87, 0.94));
    default:
      return hsvToHex(rot(0), 0.1, isDark ? 0.7 : 0.3);
  }
}

/**
 * A whole palette from one random hue.
 *
 * Every anchor gets a value, the families with no derivation rule (syntax,
 * labels, highlights) get their own, and `deriveAll` then fills in the shades
 * that follow: so the result is complete in the same sense a preset is.
 *
 * @param {{ isDark?: boolean, rand?: () => number }} [opts]
 * @returns {Palette}
 */
export function randomizePalette(opts = {}) {
  const { isDark = false, rand = Math.random } = opts;
  const hue = rand() * 360;
  const base = isDark ? DARK_DEFAULTS : LIGHT_DEFAULTS;
  /** @type {Palette} */
  const palette = { ...base };

  const anchors = [
    "--paper",
    "--ink-1",
    "--line-1",
    "--accent",
    "--danger",
    "--warning",
    "--success",
  ];
  for (const token of anchors) {
    palette[token] = randomValueFor(token, { isDark, hue, rand, palette });
  }
  for (const token of [...SYNTAX_TOKENS, ...LABEL_TOKENS, ...HIGHLIGHT_TOKENS]) {
    palette[token] = randomValueFor(token, { isDark, hue, rand, palette });
  }
  // `--accent-on` is contrast-picked, so it has to be rolled AFTER the accent.
  palette["--accent-on"] = randomValueFor("--accent-on", { isDark, hue, rand, palette });

  return { ...palette, ...deriveAll(palette, isDark) };
}
