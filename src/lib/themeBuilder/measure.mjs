/**
 * Theme Builder — the measure vocabulary (myne#394).
 *
 * The third manifest, alongside `manifest.mjs` (colour) and `ornament.mjs`
 * (ornament), and it follows the same rule they do: never show a raw `--token`,
 * show what the thing IS.
 *
 * Mirrors `theme-validator/src/ornament.rs`'s `MEASURE_KEYS` (which decides what
 * a theme may legally say) and `src/lib/themeMeasure.ts`'s `MEASURE_KEYS` (which
 * decides what the app will paint). Three lists, kept in step by review — the
 * same arrangement the ornament vocabulary already lives under.
 *
 * ── THE BAND ────────────────────────────────────────────────────────────────
 * Every measure value the app paints is clamped to 0.5×–2× of that token's
 * BUILT-IN default (`decisions.md` 2026-08-06 clause (d)): a theme may make the
 * app denser or airier, it cannot make it unusable. A builder whose slider ran
 * past that band would be a builder that lies — the user would drag to 4×, the
 * preview would show 4× only if the preview also skipped the clamp, and the app
 * would then paint 2×. So the slider IS the band.
 *
 * The defaults are not written here. They are read at runtime off the preview's
 * own token sheet — the real `tokens.css`, captured with the snapshot — because
 * a hardcoded table in this repo would drift from the app's the first time a
 * default changed, and nothing would say so.
 *
 * ── WHAT IS DELIBERATELY ABSENT ─────────────────────────────────────────────
 * `--space-0` and `--tracking-normal` are recognized by the validator and are
 * NOT offered here. Both default to `0`, and 0.5×–2× of zero is zero: the app
 * clamps whatever the theme asks for straight back to `0`, silently. Offering a
 * control that cannot move its value is worse than offering nothing — and it is
 * not hypothetical, the bundled Field Notes theme ships `--tracking-normal:
 * 0.01em` today and it has never had any effect.
 *
 * @typedef {{ token: string, label: string }} MeasureEntry
 * @typedef {{ id: string, label: string, hint: string, unit: string, step: number, tokens: MeasureEntry[] }} MeasureGroup
 */

/**
 * The zero-default tokens, stated once so the reason travels with the list.
 * A token here is validated by the app and unmovable by anyone.
 */
export const UNMOVABLE = Object.freeze(["--space-0", "--tracking-normal"]);

/** @type {MeasureGroup[]} */
export const MEASURE_GROUPS = [
  {
    id: "spacing",
    label: "Spacing",
    hint: "How much room sits between things. Lower is denser.",
    unit: "px",
    step: 0.5,
    tokens: [
      { token: "--space-1", label: "Hairline gaps" },
      { token: "--space-2", label: "Tight gaps" },
      { token: "--space-3", label: "Standard gaps" },
      { token: "--space-4", label: "Comfortable gaps" },
      { token: "--space-5", label: "Section spacing" },
      { token: "--space-6", label: "Large spacing" },
      { token: "--space-7", label: "Extra-large spacing" },
      { token: "--space-8", label: "Page margins" },
      { token: "--space-9", label: "Widest spacing" },
    ],
  },
  {
    id: "corners",
    label: "Corners",
    hint: "How rounded things are. Lower reads sharper and more technical.",
    unit: "px",
    step: 0.5,
    tokens: [
      { token: "--radius-1", label: "Small corners" },
      { token: "--radius-2", label: "Standard corners" },
      { token: "--radius-3", label: "Large corners" },
      { token: "--radius-pill", label: "Pill shapes" },
    ],
  },
  {
    id: "type",
    label: "Text size",
    hint: "The type scale. Every size moves independently, so you can widen or flatten the range.",
    unit: "px",
    step: 0.5,
    tokens: [
      { token: "--text-xs", label: "Smallest labels" },
      { token: "--text-sm", label: "Small text" },
      { token: "--text-base", label: "Body text" },
      { token: "--text-md", label: "Large body" },
      { token: "--text-lg", label: "Small headings" },
      { token: "--text-xl", label: "Headings" },
      { token: "--text-2xl", label: "Large headings" },
      { token: "--text-3xl", label: "Display" },
      { token: "--text-4xl", label: "Largest display" },
    ],
  },
  {
    id: "weight",
    label: "Text weight",
    hint: "How heavy each weight step is.",
    unit: "",
    step: 25,
    tokens: [
      { token: "--weight-regular", label: "Regular" },
      { token: "--weight-medium", label: "Medium" },
      { token: "--weight-semibold", label: "Semibold" },
      { token: "--weight-bold", label: "Bold" },
    ],
  },
  {
    id: "tracking",
    label: "Letter spacing",
    hint: "How tightly letters sit together.",
    unit: "em",
    step: 0.002,
    tokens: [
      { token: "--tracking-tight", label: "Tight (headings)" },
      { token: "--tracking-wide", label: "Wide" },
      { token: "--tracking-caps", label: "Small caps" },
    ],
  },
];

/** Every measure token the builder offers, in a stable order. */
export function allMeasureTokens() {
  return MEASURE_GROUPS.flatMap((g) => g.tokens.map((t) => t.token));
}

/** Lower bound of the clamp band, as a multiple of the built-in default. */
export const CLAMP_MIN_RATIO = 0.5;
/** Upper bound of the clamp band, as a multiple of the built-in default. */
export const CLAMP_MAX_RATIO = 2;

/**
 * `"12px"` → `{ n: 12, unit: "px" }`; `"400"` → `{ n: 400, unit: "" }`; else null.
 *
 * The faithful port of `src/lib/themeMeasure.ts`'s `parseScalar`, and it must
 * stay faithful: a value this parses and the app's does not (or vice versa)
 * produces a slider whose value the app then refuses to paint.
 */
export function parseScalar(raw) {
  const m = /^([+-]?(?:\d+\.?\d*|\.\d+))([a-z%]*)$/i.exec(String(raw).trim());
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? { n, unit: m[2].toLowerCase() } : null;
}

/**
 * The band a token's slider may travel, given its built-in default.
 *
 * Returns `null` when no band can be established — an unreadable default, or one
 * whose band is a single point (a zero default). The caller must then NOT render
 * a control: a slider that cannot move is a promise the app will not keep.
 */
export function bandFor(defaultValue) {
  const d = parseScalar(defaultValue);
  if (!d) return null;
  const min = d.n * CLAMP_MIN_RATIO;
  const max = d.n * CLAMP_MAX_RATIO;
  if (min === max) return null; // zero default — clamps to itself, always
  return { min: Math.min(min, max), max: Math.max(min, max), unit: d.unit, base: d.n };
}
