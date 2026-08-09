/**
 * Theme Builder — the ornament vocabulary (myne#394).
 *
 * The colour manifest's sibling. Where `GROUPS` turns token names into
 * human-worded colour controls, this turns the ornament vocabulary into
 * dropdowns — and it follows the same rule: never show a raw `--token`.
 *
 * Mirrors `theme-validator/src/ornament.rs` (which decides what a theme may
 * legally say) and `@myne/ornaments`'s `ORNAMENT_PRIMITIVES` (which decides
 * what the app draws). Three lists, kept in step by review; a value here that
 * the validator rejects would be a control that produces an invalid theme, and
 * one the stylesheet does not draw would be a control that does nothing.
 *
 * NOT CI-GATED. `scripts/check-ornament-vocabulary.mjs` cross-checks this file
 * against the validator and is meant to be run by hand (and before touching the
 * vocabulary) — this repo's only CI step is a docker build with no node in it,
 * so wiring the guard there would have been a step that never ran, which is
 * worse than one that is honestly manual.
 *
 * PRESETS are a builder convenience ONLY. They expand to ordinary generic
 * settings, so no name here ever enters Myne's code or its product vocabulary
 * — "polaroid" is a starting point in this UI, not a thing the app knows about
 * (`decisions.md` 2026-08-06).
 *
 * @typedef {{ id: string, label: string, hint: string, values: {value: string, label: string}[] }} Primitive
 */

const v = (value, label) => ({ value, label });

/** @type {Primitive[]} */
export const PRIMITIVES = [
  {
    id: "frame",
    label: "Frame",
    hint: "An outline drawn just inside the edge.",
    values: [v("none", "None"), v("hairline", "Hairline"), v("thick", "Thick"), v("double", "Double"), v("inset", "Recessed")],
  },
  {
    id: "shadow",
    label: "Shadow",
    hint: "How the surface sits above the page.",
    values: [v("none", "None"), v("soft", "Soft"), v("hard", "Hard"), v("offset", "Offset")],
  },
  {
    id: "texture",
    label: "Texture",
    hint: "A pattern behind the content. Its strength is capped so text stays readable.",
    values: [v("none", "None"), v("paper", "Paper"), v("grain", "Grain"), v("scanline", "Scanline"), v("grid", "Grid")],
  },
  {
    id: "ruled",
    label: "Ruled ground",
    hint: "Notebook-style lines behind the content.",
    values: [v("none", "None"), v("lines", "Lines"), v("grid", "Squares"), v("dotted", "Dots")],
  },
  {
    id: "edge",
    label: "Edge",
    hint: "How the top and bottom edges are finished.",
    values: [v("plain", "Plain"), v("torn", "Torn"), v("serrated", "Serrated"), v("cut", "Cut corners")],
  },
  {
    id: "fold",
    label: "Corner fold",
    hint: "A turned corner, the way a page is marked.",
    values: [v("none", "None"), v("folded", "Folded"), v("dogear", "Dog-ear")],
  },
  {
    id: "ribbon",
    label: "Ribbon",
    hint: "A band or label laid over the surface.",
    values: [v("none", "None"), v("corner", "Corner tape"), v("band", "Top band"), v("label", "Label")],
  },
  {
    id: "perforation",
    label: "Perforation",
    hint: "A row of punched holes.",
    values: [v("none", "None"), v("left", "Left"), v("top", "Top"), v("both", "Both")],
  },
];

/** The three scopes ornament is chosen at. */
export const ROLES = [
  { id: "surface", label: "Panels", hint: "Page and panel backgrounds." },
  { id: "box", label: "Boxes", hint: "Callouts, code blocks, quotes and cards." },
  { id: "chrome", label: "Controls", hint: "Tabs, buttons and bars." },
];

/**
 * Which primitives each role accepts — the matrix is SPARSE.
 *
 * Mirrors `theme-validator/src/ornament.rs`'s `ROLE_PRIMITIVES` and
 * `@myne/ornaments`'s. Offering every role × every primitive put controls in
 * this builder that describe nothing: a button with a dog-eared corner, a tab
 * with a punched margin, a toolbar with notebook rules. The app now classifies
 * those keys as unknown, so a control for one would author a setting the app
 * stores and ignores — the exact "validates, then does nothing" shape the
 * vocabulary exists to prevent.
 */
export const ROLE_PRIMITIVES = {
  surface: ["frame", "shadow", "texture", "ruled", "edge", "fold", "perforation"],
  box: ["frame", "shadow", "texture", "ruled", "edge", "fold", "ribbon", "perforation"],
  chrome: ["frame", "shadow", "texture"],
};

/** `true` when `role` accepts `primitive` (see {@link ROLE_PRIMITIVES}). */
export function roleAccepts(role, primitive) {
  return (ROLE_PRIMITIVES[role] ?? []).includes(primitive);
}

/** The primitives to render controls for, in {@link PRIMITIVES} order. */
export function primitivesForRole(role) {
  return PRIMITIVES.filter((p) => roleAccepts(role, p.id));
}

/**
 * Starting points. Each expands to plain settings the user can then change —
 * they are not a second vocabulary, and nothing records that a theme "is" one.
 */
export const PRESETS = [
  { id: "polaroid", label: "Polaroid", role: "box", set: { frame: "thick", shadow: "hard", texture: "paper" } },
  { id: "notebook", label: "Notebook", role: "surface", set: { ruled: "lines", perforation: "left" } },
  { id: "cassette", label: "Cassette", role: "box", set: { ribbon: "band", texture: "grain", frame: "hairline" } },
  { id: "index-card", label: "Index card", role: "box", set: { ruled: "lines", frame: "hairline", edge: "plain" } },
  { id: "brutalist", label: "Brutalist", role: "box", set: { frame: "thick", shadow: "offset", texture: "grain" } },
  { id: "terminal", label: "Terminal", role: "surface", set: { texture: "scanline", frame: "hairline", shadow: "none" } },
  { id: "plain", label: "Plain", role: "box", set: { frame: "none", shadow: "none", texture: "none", ruled: "none", fold: "none", ribbon: "none", perforation: "none", edge: "plain" } },
];

/**
 * The tint wash — one colour and one strength, NOT role-scoped.
 *
 * Mirrors `theme-validator/src/ornament.rs`'s `TINT_KEYS`, and it is separate
 * from {@link PRIMITIVES} for the reason that module states: the wash is
 * composed on the shared ornament layer, so `--surface-tint` and `--chrome-tint`
 * would validate, store, sync — and never be drawn by anything.
 */
export const TINT_TOKENS = Object.freeze(["--tint", "--tint-strength"]);

/**
 * The ceiling the app clamps a wash's strength to (`ornaments.css`'s
 * `--_o-ceiling`).
 *
 * The builder's slider must stop here. Past it the preview and the app diverge:
 * the wash is composed through `min(var(--tint-strength), var(--_o-ceiling))`,
 * so a user dragging to 0.5 would see 0.14 and be told 0.5 — a control that
 * lies about its own effect.
 */
export const TINT_CEILING = 0.14;

/** `--box-frame` for ("box", "frame"). One definition of the naming scheme. */
export function ornamentToken(role, primitive) {
  return `--${role}-${primitive}`;
}

/** Every ornament token a theme may carry, in a stable order. */
export function allOrnamentTokens() {
  return ROLES.flatMap((r) => primitivesForRole(r.id).map((p) => ornamentToken(r.id, p.id)));
}
