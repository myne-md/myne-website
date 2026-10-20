/**
 * Theme Builder — canonical token model (single source of truth).
 *
 * A Myne custom theme is a *single flat palette* (grill 2026-06-16, SYNC-1):
 * overriding the raw ramp is sufficient because the semantic aliases
 * (`--bg-1: var(--paper)`, …) re-resolve automatically off the raw tokens, so
 * they are NOT authorable and never appear here.
 *
 * Sources of truth (do NOT read token names from shipped theme files — some
 * ship non-canonical names the app silently ignores, e.g. `--label-red`):
 *   - REQUIRED_TOKENS  ← theme-validator/src/schema.rs:38-65 (REQUIRED_KEYS)
 *   - OPTIONAL_TOKENS  ← docs/design/colors_and_type.css (syntax/label/highlight)
 *   - LIGHT_DEFAULTS   ← colors_and_type.css `:root` values
 *   - DARK_DEFAULTS    ← colors_and_type.css `--_*-dark` source values
 *
 * @typedef {string} Token   A canonical CSS custom-property name, e.g. "--accent".
 * @typedef {Record<Token, string>} Palette  Flat map token → "#rrggbb".
 */

/** The 21 required raw-ramp tokens (schema.rs REQUIRED_KEYS). Missing any → reject. */
export const REQUIRED_TOKENS = [
  // Neutral paper ramp (page / recessed / hover surfaces)
  "--paper", "--paper-2", "--paper-3",
  // Ink ramp (display / primary / secondary / tertiary text)
  "--ink-0", "--ink-1", "--ink-2", "--ink-3",
  // Hairline / border / disabled lines
  "--line-1", "--line-2", "--line-3",
  // Accent family
  "--accent", "--accent-hover", "--accent-press", "--accent-soft", "--accent-on",
  // State colors
  "--danger", "--danger-soft", "--warning", "--warning-soft", "--success", "--success-soft",
];

/** The 12 optional syntax-highlighting tokens. */
export const SYNTAX_TOKENS = [
  "--syntax-keyword", "--syntax-string", "--syntax-comment", "--syntax-number",
  "--syntax-variable", "--syntax-property", "--syntax-function", "--syntax-type",
  "--syntax-operator", "--syntax-tag", "--syntax-meta", "--syntax-invalid",
];

/** The 6 optional color-label tokens (canonical hue names). */
export const LABEL_TOKENS = [
  "--label-clay", "--label-ochre", "--label-moss", "--label-slate", "--label-plum", "--label-stone",
];

/** The 5 optional highlight-wash tokens. */
export const HIGHLIGHT_TOKENS = [
  "--highlight", "--highlight-green", "--highlight-blue", "--highlight-pink", "--highlight-purple",
  "--highlight-orange", "--highlight-red", "--highlight-teal", "--highlight-cyan",
  "--highlight-lime", "--highlight-brown", "--highlight-grey", "--highlight-indigo",
];

/** All 31 optional tokens (author may omit; a dark theme should set them, SYNC-6). */
export const OPTIONAL_TOKENS = [...SYNTAX_TOKENS, ...LABEL_TOKENS, ...HIGHLIGHT_TOKENS];

/** All 52 authorable tokens (required + optional). Never includes derived aliases. */
export const ALL_TOKENS = [...REQUIRED_TOKENS, ...OPTIONAL_TOKENS];

/**
 * Canonical LIGHT palette — the `:root` defaults from colors_and_type.css.
 * Covers the 21 required tokens; optionals fall back to these built-in light
 * values when omitted, which is correct for a light theme.
 * @type {Record<string, string>}
 */
export const LIGHT_DEFAULTS = {
  "--paper": "#fbfbfa", "--paper-2": "#f4f4f2", "--paper-3": "#ecebe7",
  "--ink-0": "#0b0b09", "--ink-1": "#1a1a17", "--ink-2": "#3a3934", "--ink-3": "#6b6a64",
  "--line-1": "#e3e2dd", "--line-2": "#c8c7c1", "--line-3": "#a3a29c",
  "--accent": "#2c4a7a", "--accent-hover": "#233b62", "--accent-press": "#1b2e4d",
  "--accent-soft": "#e8edf5", "--accent-on": "#ffffff",
  "--danger": "#8a2a23", "--danger-soft": "#f5e7e5",
  "--warning": "#8a6a1f", "--warning-soft": "#f5efde",
  "--success": "#2f6048", "--success-soft": "#e3eee8",
  // Optional light values (used as the light-base seed).
  "--syntax-keyword": "#7a3b8c", "--syntax-string": "#3f6a4a", "--syntax-comment": "#706f66",
  "--syntax-number": "#9a5d2a", "--syntax-variable": "#1a1a17", "--syntax-property": "#2c4a7a",
  "--syntax-function": "#1f5c6e", "--syntax-type": "#8a5a1f", "--syntax-operator": "#5c5b54",
  "--syntax-tag": "#8a2a23", "--syntax-meta": "#5a5478", "--syntax-invalid": "#992018",
  "--label-clay": "#b0543f", "--label-ochre": "#94701c", "--label-moss": "#4d7a55",
  "--label-slate": "#46688a", "--label-plum": "#7e4d76", "--label-stone": "#6f6d64",
  "--highlight": "#f3e7c4", "--highlight-green": "#d8e9cf", "--highlight-blue": "#d3e2ee",
  "--highlight-pink": "#efd8e2", "--highlight-purple": "#e2d8ee",
  // Appearance-varying families the preview must seed too (myne#900). The
  // parity test holds this block, names and values, against the captured sheet.
  // `--info` is deliberately absent: its dark declaration is an alias of `--accent`,
  // and the value gate takes concrete values only.
  "--danger-solid": "#a8322a", "--group-olive": "#5d7b32", "--group-fern": "#549f41",
  "--group-teal": "#32647b", "--group-denim": "#415c9f", "--group-indigo": "#3b327b",
  "--group-violet": "#72419f", "--group-orchid": "#75327b", "--group-rose": "#9f4182",
  "--highlight-orange": "#f2ddc6", "--highlight-red": "#efd3d3", "--highlight-teal": "#cfe6e2",
  "--highlight-cyan": "#cfe4ea", "--highlight-lime": "#e0ecc4", "--highlight-brown": "#e3d9cd",
  "--highlight-grey": "#dedcd8", "--highlight-indigo": "#d6d8ee",
  "--selection-bg": "#2c4a7a38",
  "--shadow-1": "0 1px 0 #0b0b090a, 0 1px 2px #0b0b090f",
  "--shadow-2": "0 2px 4px #0b0b090f, 0 4px 12px #0b0b0914",
  "--shadow-3": "0 8px 16px #0b0b0914, 0 16px 40px #0b0b091f",
  "--scrim": "#0b0b0966",
};

/**
 * Canonical DARK palette — the `--_*-dark` source values from
 * colors_and_type.css. Covers all 44 tokens: a dark base MUST set the optionals
 * (they otherwise fall back to LIGHT), so this is the dark-seed source (SYNC-6).
 * @type {Record<string, string>}
 */
export const DARK_DEFAULTS = {
  "--paper": "#121210", "--paper-2": "#1a1a17", "--paper-3": "#232220",
  "--ink-0": "#f7f6ee", "--ink-1": "#e8e7df", "--ink-2": "#c2c1b9", "--ink-3": "#8d8c85",
  "--line-1": "#2c2b28", "--line-2": "#3a3935", "--line-3": "#5a5852",
  "--accent": "#8aa4d0", "--accent-hover": "#a3b8de", "--accent-press": "#6e8dc0",
  "--accent-soft": "#1f2735", "--accent-on": "#0b0b09",
  "--danger": "#d99086", "--danger-soft": "#2e1f1d",
  "--warning": "#d8b76a", "--warning-soft": "#2c2618",
  "--success": "#8cc1a4", "--success-soft": "#1a2620",
  "--syntax-keyword": "#c79ad4", "--syntax-string": "#8cc1a4", "--syntax-comment": "#8e8d85",
  "--syntax-number": "#d8b76a", "--syntax-variable": "#e8e7df", "--syntax-property": "#8aa4d0",
  "--syntax-function": "#7fbfcf", "--syntax-type": "#d4a96a", "--syntax-operator": "#a8a79f",
  "--syntax-tag": "#d99086", "--syntax-meta": "#a59fc4", "--syntax-invalid": "#e88b80",
  "--label-clay": "#d99683", "--label-ochre": "#d4b46a", "--label-moss": "#8cc1a4",
  "--label-slate": "#93b4d6", "--label-plum": "#c79cc0", "--label-stone": "#a8a69d",
  "--highlight": "#4f4422", "--highlight-green": "#2c3d28", "--highlight-blue": "#24384a",
  "--highlight-pink": "#46283a", "--highlight-purple": "#392a4c",
  // Appearance-varying families the preview must seed too (myne#900). The
  // parity test holds this block, names and values, against the captured sheet.
  // `--info` is deliberately absent: its dark declaration is an alias of `--accent`,
  // and the value gate takes concrete values only.
  "--danger-solid": "#c0392b", "--group-olive": "#cce3ab", "--group-fern": "#9cd98c",
  "--group-teal": "#abd1e3", "--group-denim": "#8ca2d9", "--group-indigo": "#b1abe3",
  "--group-violet": "#b48cd9", "--group-orchid": "#deabe3", "--group-rose": "#d98cc1",
  "--highlight-orange": "#4a3722", "--highlight-red": "#4a2a2a", "--highlight-teal": "#23403c",
  "--highlight-cyan": "#223a42", "--highlight-lime": "#37411f", "--highlight-brown": "#3d352b",
  "--highlight-grey": "#37363a", "--highlight-indigo": "#2b2e4d",
  "--selection-bg": "#8aa4d04d",
  "--shadow-1": "0 1px 0 #0006, 0 1px 2px #00000080",
  "--shadow-2": "0 2px 4px #0006, 0 4px 12px #00000080",
  "--shadow-3": "0 8px 16px #00000080, 0 16px 40px #0009",
  "--scrim": "#0009",
};
