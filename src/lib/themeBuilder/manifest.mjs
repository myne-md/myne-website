/**
 * Theme Builder — friendly-word → token manifest (SYNC-3).
 *
 * The single dictionary that turns developer token names into human-worded
 * controls (req #1: never show `--accent-secondary`, show "Accent color").
 * Labels are sourced from docs/design/colors_and_type.css comments + the
 * custom-theme-reference "Role" column. Imported by controls (labels), preview
 * (region labels), and export. No group or token label ever contains a raw
 * `--token` name; the derived semantic aliases (bg / fg / info) are never included.
 *
 * Helper shades (`helper:true`) are auto-derived from a base color (`derivesFrom`)
 * and shown under a "fine-tune" disclosure (grill builder-controls Q3).
 *
 * @typedef {{ token: string, label: string, helper?: boolean, derivesFrom?: string }} TokenEntry
 * @typedef {{ id: string, label: string, disclosure: boolean, hint?: string, tokens: TokenEntry[] }} Group
 */

/** @type {Group[]} */
export const GROUPS = [
  {
    id: "background",
    label: "Background",
    disclosure: false,
    tokens: [
      { token: "--paper", label: "Page background" },
      { token: "--paper-2", label: "Panels & cards" },
      { token: "--paper-3", label: "Hover surfaces" },
    ],
  },
  {
    id: "text",
    label: "Text",
    disclosure: false,
    tokens: [
      { token: "--ink-1", label: "Body text" },
      { token: "--ink-2", label: "Secondary text" },
      { token: "--ink-3", label: "Muted text" },
      { token: "--ink-0", label: "Headings" },
    ],
  },
  {
    id: "borders",
    label: "Borders",
    disclosure: false,
    tokens: [
      { token: "--line-1", label: "Hairlines" },
      { token: "--line-2", label: "Dividers" },
      { token: "--line-3", label: "Disabled controls" },
    ],
  },
  {
    id: "accent",
    label: "Accent color",
    disclosure: false,
    hint: "The hover, pressed, soft and text shades are filled in for you — fine-tune if you like.",
    tokens: [
      { token: "--accent", label: "Accent color" },
      { token: "--accent-hover", label: "Hover", helper: true, derivesFrom: "--accent" },
      { token: "--accent-press", label: "Pressed", helper: true, derivesFrom: "--accent" },
      { token: "--accent-soft", label: "Soft background", helper: true, derivesFrom: "--accent" },
      { token: "--accent-on", label: "Text on accent", helper: true, derivesFrom: "--accent" },
    ],
  },
  {
    id: "status",
    label: "Status colors",
    disclosure: false,
    tokens: [
      { token: "--danger", label: "Error" },
      { token: "--danger-soft", label: "Error background", helper: true, derivesFrom: "--danger" },
      { token: "--warning", label: "Warning" },
      { token: "--warning-soft", label: "Warning background", helper: true, derivesFrom: "--warning" },
      { token: "--success", label: "Success" },
      { token: "--success-soft", label: "Success background", helper: true, derivesFrom: "--success" },
    ],
  },
  {
    id: "syntax",
    label: "Code highlighting",
    disclosure: true,
    tokens: [
      { token: "--syntax-keyword", label: "Keywords" },
      { token: "--syntax-string", label: "Strings" },
      { token: "--syntax-comment", label: "Comments" },
      { token: "--syntax-number", label: "Numbers" },
      { token: "--syntax-variable", label: "Variables" },
      { token: "--syntax-property", label: "Properties" },
      { token: "--syntax-function", label: "Functions" },
      { token: "--syntax-type", label: "Types" },
      { token: "--syntax-operator", label: "Operators" },
      { token: "--syntax-tag", label: "Tags" },
      { token: "--syntax-meta", label: "Meta" },
      { token: "--syntax-invalid", label: "Errors" },
    ],
  },
  {
    id: "labels",
    label: "Color labels",
    disclosure: true,
    tokens: [
      { token: "--label-clay", label: "Brick" },
      { token: "--label-ochre", label: "Amber" },
      { token: "--label-moss", label: "Forest" },
      { token: "--label-slate", label: "Slate blue" },
      { token: "--label-plum", label: "Plum" },
      { token: "--label-stone", label: "Stone" },
    ],
  },
  {
    id: "highlights",
    label: "Text highlights",
    disclosure: true,
    tokens: [
      { token: "--highlight", label: "Highlight" },
      { token: "--highlight-green", label: "Green" },
      { token: "--highlight-blue", label: "Blue" },
      { token: "--highlight-pink", label: "Pink" },
      { token: "--highlight-purple", label: "Purple" },
    ],
  },
];

/** Flat list of every token the manifest exposes (all 44, in display order). */
export const MANIFEST_TOKENS = GROUPS.flatMap((g) => g.tokens.map((t) => t.token));

/** Tokens that are auto-derived from a base color (shown under "fine-tune"). */
export const HELPER_TOKENS = GROUPS.flatMap((g) => g.tokens)
  .filter((t) => t.helper)
  .map((t) => t.token);

/** token → { helper token list } grouping, keyed by the base each helper derives from. */
export const DERIVATIONS = GROUPS.flatMap((g) => g.tokens)
  .filter((t) => t.helper && t.derivesFrom)
  .reduce((acc, t) => {
    (acc[t.derivesFrom] ??= []).push(t.token);
    return acc;
  }, /** @type {Record<string, string[]>} */ ({}));

const LABELS = Object.fromEntries(
  GROUPS.flatMap((g) => g.tokens).map((t) => [t.token, t.label]),
);

/** The human label for a token, or undefined if the token isn't authorable. */
export function labelFor(token) {
  return LABELS[token];
}
