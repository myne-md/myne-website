/**
 * Theme Builder: friendly-word → token manifest (SYNC-3).
 *
 * The single dictionary that turns developer token names into human-worded
 * controls (req #1: never show `--accent-secondary`, show "Accent color").
 * Labels come from docs/design/colors_and_type.css comments + the
 * custom-theme-reference "Role" column. Imported by controls (labels), preview
 * (region labels), lightbox help text and export. No group or token label ever
 * contains a raw `--token` name; the derived semantic aliases (bg / fg / info)
 * are never included.
 *
 * ── ONE GROUP IS ONE TONE FAMILY ────────────────────────────────────────────
 * Groups used to be organised by widget purpose ("Background", "Error colors",
 * …), which made the panel read as a flat list of unrelated sliders and hid the
 * fact that most of these values are DERIVED: pick an accent and its hover,
 * pressed, soft and on-text shades are arithmetic. A tone family says the same
 * thing the way a designer would: one anchor color, and the shades that follow
 * from it: so the panel can show the relationship instead of describing it in
 * prose.
 *
 * `anchor: true` marks the token a family is driven by. Every other token in
 * the group carries `derivesFrom` and is re-derived from its anchor whenever the
 * anchor changes, UNLESS the author has pinned it (the link control on the row,
 * see `state.mjs`'s `pinned` set): then it is a deliberate override and stays
 * put. A theme stores raw values either way, so derivation is builder-side
 * sugar that is materialised into the palette; nothing about it is exported.
 *
 * @typedef {{ token: string, label: string, anchor?: boolean, helper?: boolean,
 *   derivesFrom?: string }} TokenEntry
 * @typedef {{ id: string, label: string, disclosure: boolean, hint?: string,
 *   tokens: TokenEntry[] }} Group
 */

/** @type {Group[]} */
export const GROUPS = [
  {
    id: "surface",
    label: "Surfaces",
    disclosure: false,
    hint: "The page and the panels that sit on it. Panels are mixed down from the page color, so they move together.",
    tokens: [
      { token: "--paper", label: "Page background", anchor: true },
      { token: "--paper-2", label: "Panels & cards", helper: true, derivesFrom: "--paper" },
      { token: "--paper-3", label: "Hover surfaces", helper: true, derivesFrom: "--paper" },
    ],
  },
  {
    id: "ink",
    label: "Text",
    disclosure: false,
    hint: "Headings and body text read against the page. Secondary and muted text are the body color mixed toward the page.",
    tokens: [
      { token: "--ink-1", label: "Body text", anchor: true },
      { token: "--ink-0", label: "Headings", helper: true, derivesFrom: "--ink-1" },
      { token: "--ink-2", label: "Secondary text", helper: true, derivesFrom: "--ink-1" },
      { token: "--ink-3", label: "Muted text", helper: true, derivesFrom: "--ink-1" },
    ],
  },
  {
    id: "line",
    label: "Borders",
    disclosure: false,
    hint: "Hairlines, dividers and the outline of a disabled control. Both shades are the hairline mixed toward the muted text color.",
    tokens: [
      { token: "--line-1", label: "Hairlines", anchor: true },
      { token: "--line-2", label: "Dividers", helper: true, derivesFrom: "--line-1" },
      { token: "--line-3", label: "Disabled controls", helper: true, derivesFrom: "--line-1" },
    ],
  },
  {
    id: "accent",
    label: "Accent",
    disclosure: false,
    hint: "Every link, selected state and primary button in the interface. Its hover, pressed, soft and on-text shades are computed so the set stays legible.",
    tokens: [
      { token: "--accent", label: "Accent color", anchor: true },
      { token: "--accent-hover", label: "Hover", helper: true, derivesFrom: "--accent" },
      { token: "--accent-press", label: "Pressed", helper: true, derivesFrom: "--accent" },
      { token: "--accent-soft", label: "Soft background", helper: true, derivesFrom: "--accent" },
      { token: "--accent-on", label: "Text on accent", helper: true, derivesFrom: "--accent" },
    ],
  },
  {
    id: "status",
    label: "Status",
    disclosure: false,
    hint: "Errors, warnings and confirmations. Each background is its own color mixed into the page, so the three read as one family.",
    tokens: [
      { token: "--danger", label: "Error", anchor: true },
      { token: "--danger-soft", label: "Error background", helper: true, derivesFrom: "--danger" },
      { token: "--warning", label: "Warning", anchor: true },
      { token: "--warning-soft", label: "Warning background", helper: true, derivesFrom: "--warning" },
      { token: "--success", label: "Success", anchor: true },
      { token: "--success-soft", label: "Success background", helper: true, derivesFrom: "--success" },
    ],
  },
  {
    id: "syntax",
    label: "Code highlighting",
    disclosure: true,
    hint: "The colors of fenced code blocks. Each one names what it paints.",
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
    hint: "The six label colors a note can be tagged with. Myne picks the label's text color for you.",
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
    hint: "The washes behind highlighted text, as drawn by the highlighter in the editor bar.",
    tokens: [
      { token: "--highlight", label: "Highlight" },
      { token: "--highlight-green", label: "Green" },
      { token: "--highlight-blue", label: "Blue" },
      { token: "--highlight-pink", label: "Pink" },
      { token: "--highlight-purple", label: "Purple" },
      { token: "--highlight-orange", label: "Orange" },
      { token: "--highlight-red", label: "Red" },
      { token: "--highlight-teal", label: "Teal" },
      { token: "--highlight-cyan", label: "Cyan" },
      { token: "--highlight-lime", label: "Lime" },
      { token: "--highlight-brown", label: "Brown" },
      { token: "--highlight-grey", label: "Grey" },
      { token: "--highlight-indigo", label: "Indigo" },
    ],
  },
];

/** Flat list of every token the manifest exposes (all 52, in display order). */
export const MANIFEST_TOKENS = GROUPS.flatMap((g) => g.tokens.map((t) => t.token));

const ALL_ENTRIES = GROUPS.flatMap((g) => g.tokens);

/** The anchor tokens: the handles a tone family is driven from. */
export const ANCHOR_TOKENS = ALL_ENTRIES.filter((t) => t.anchor).map((t) => t.token);

/** Tokens that are auto-derived from an anchor color (shown with a link control). */
export const HELPER_TOKENS = ALL_ENTRIES.filter((t) => t.helper).map((t) => t.token);

/** The token a helper follows, or `undefined` for an anchor / standalone token. */
export function anchorFor(token) {
  return ALL_ENTRIES.find((t) => t.token === token)?.derivesFrom;
}

/** The helpers a given anchor drives, in display order. */
export const DERIVATIONS = ALL_ENTRIES.filter((t) => t.helper && t.derivesFrom).reduce(
  (acc, t) => {
    (acc[t.derivesFrom] ??= []).push(t.token);
    return acc;
  },
  /** @type {Record<string, string[]>} */ ({}),
);

const LABELS = Object.fromEntries(ALL_ENTRIES.map((t) => [t.token, t.label]));

/** The human label for a token, or undefined if the token isn't authorable. */
export function labelFor(token) {
  return LABELS[token];
}
