/**
 * Apply a theme to the captured interface — the ONE implementation (myne#394).
 *
 * Two consumers paint a palette onto the snapshot beside this file: the website's
 * theme builder (live, in an iframe) and the `myne-themes` gallery renderer
 * (headless, to a PNG). They had written this three times between them, and the
 * copies had already diverged in ways that mattered: one reflected ornament
 * selections onto a page with no rules to draw them, and both treated `none` as
 * "remove the attribute" — which is the opposite of what `none` means for the two
 * primitives that inherit.
 *
 * ── WHY PLAIN ESM AND NOT TYPESCRIPT ────────────────────────────────────────
 * The gallery renderer is a Node CLI. It cannot import a `.ts` module, and it
 * cannot import `@myne/ornaments` (also TypeScript) either. A build step for one
 * shared helper would be a build step nobody runs before a hand-invoked render.
 * So this is `.mjs` with JSDoc types, and it takes its vocabulary from the
 * STYLESHEET rather than from the TS constant — see {@link drawableOrnaments}.
 *
 * ── WHY THE VOCABULARY COMES FROM THE STYLESHEET ────────────────────────────
 * A fourth copy of the role × primitive × value table is a fourth thing to
 * drift. "What the stylesheet actually draws" is the only answer that cannot be
 * wrong, and it is what these two consumers need: they render the captured CSS,
 * so a selection that CSS has no rule for would put an attribute in the DOM that
 * matches nothing. The app does NOT work this way and must not — it knows its
 * vocabulary at compile time and has no business parsing CSS at runtime.
 *
 * @typedef {Map<string, Set<string>>} Drawable
 */

/** The attribute every ornament rule is scoped under. */
export const ON_ATTR = "data-o-on";

/**
 * The attribute that opens the layer for the TINT WASH.
 *
 * The `::before` layer is `display: none` until a rule selects it, and CSS
 * cannot branch on whether a custom property is set — so the wash, whose only
 * input is the `--tint` VALUE, needs a state to select on. Without it a
 * tint-only theme painted its colour onto a layer that was never displayed.
 */
export const TINT_ATTR = "data-o-tint";

/** `--box-frame` → `data-o-box-frame`. */
export function ornamentAttr(token) {
  return `data-o-${String(token).replace(/^--/, "")}`;
}

/**
 * The ornament attributes a stylesheet can actually draw, read off its own
 * selectors (`:root[data-o-box-frame="thick"]`).
 *
 * @param {string} css
 * @returns {Drawable}
 */
export function drawableOrnaments(css) {
  const text = String(css);
  // The roles the stylesheet itself declares — still derived, not a fourth copy
  // of the table. Needed because `data-o-*` is not exclusively the theme's
  // channel: the multi-line-box mechanism uses `data-o-seg="start|mid|end"`,
  // which is Myne's own internal marker. A shape-blind scrape pulled it into the
  // vocabulary, so a palette key `--seg` — which passes every theme-validator
  // gate, `is_known` included — reflected onto the preview root and raised the
  // on-flag, turning the whole layer on for a theme that selected no ornament.
  // The app does neither, so it was a live divergence between the two
  // implementations this module exists to unify.
  const roles = new Set(
    [...text.matchAll(/\[data-ornament="([a-z]+)"\]/g)].map(([, role]) => role),
  );
  const out = new Map();
  for (const m of text.matchAll(/\[data-o-([a-z]+)-([a-z-]+)="([a-z]+)"\]/g)) {
    if (!roles.has(m[1])) continue; // not a role → not the theme's to select
    const attr = `data-o-${m[1]}-${m[2]}`;
    if (!out.has(attr)) out.set(attr, new Set());
    out.get(attr).add(m[3]);
  }
  return out;
}

/**
 * The `<html>` attributes a palette reflects to.
 *
 * **`none` and `plain` are WRITTEN, not skipped, and that is the subtle half.**
 * `frame` and `shadow` write their slots on the host element and custom
 * properties inherit, so a box nested inside a framed surface inherits that
 * frame; only an explicit `[data-o-box-frame="none"]` rule puts the slot back to
 * neutral. Removing the attribute leaves the inherited value in place — the
 * opposite of the theme's instruction. They are still not a SELECTION, so they
 * do not raise the on-flag: a theme whose every ornament key is `none` must cost
 * an unornamented session nothing.
 *
 * @param {Record<string, string>} palette
 * @param {Drawable} drawable
 * @returns {Record<string, string>}
 */
export function ornamentAttributes(palette, drawable) {
  const attrs = {};
  let selected = false;
  for (const [key, raw] of Object.entries(palette ?? {})) {
    if (!key.startsWith("--") || key.startsWith("--_")) continue;
    const attr = ornamentAttr(key);
    const value = String(raw ?? "").trim();
    if (value === "") continue;
    const off = value === "none" || value === "plain";
    // A primitive this stylesheet has no rules for at all is not part of its
    // vocabulary; neither its values nor its `none` belong in the DOM.
    if (!drawable.has(attr)) continue;
    // **Membership is checked for `none`/`plain` too**, and it used to be
    // short-circuited by `off`. That wrote any value literally spelled `none` or
    // `plain` whether or not the stylesheet had a rule for it — so
    // `--surface-edge: none` (edge's no-op is `plain`) and `--box-frame: plain`
    // (frame's is `none`) both landed in the DOM matching nothing. The
    // stylesheet carries an explicit `="none"` reset exactly for the two
    // inheriting primitives and deliberately not for the rest, which is the
    // distinction this check exists to respect rather than to bypass.
    if (!drawable.get(attr).has(value)) continue;
    attrs[attr] = value;
    if (!off) selected = true;
  }
  // The wash needs TWO things: its own attribute, because the `::before` layer
  // is `display: none` until a rule selects it and CSS cannot branch on whether
  // `--tint` is set; and the on-flag, because every ornament rule is scoped
  // under it. It used to get only the second, so a tint-only theme painted its
  // colour onto a layer that was never displayed.
  const tinted = String(palette?.["--tint"] ?? "").trim().length > 0;
  if (tinted) attrs[TINT_ATTR] = "";
  if (selected || tinted) attrs[ON_ATTR] = "";
  return attrs;
}

/** The custom properties a palette may paint: `--*`, never `--_*`. */
export function paintableEntries(palette) {
  return Object.entries(palette ?? {}).filter(
    ([k, v]) => k.startsWith("--") && !k.startsWith("--_") && typeof v === "string",
  );
}

/**
 * Paint `palette` onto a live document (the builder's iframe).
 *
 * Returns whether any ornament was selected — worth surfacing so a caller can
 * tell "no ornament chosen" apart from "ornament chosen and nothing drew it".
 *
 * **The caller owns value validation.** A host facing unvalidated input (a live
 * form) must gate each value through its own allowlist port before calling this;
 * this module assumes the palette it is handed is already admissible, exactly as
 * the app's own apply path does.
 *
 * @param {Document} doc
 * @param {Record<string, string>} palette
 * @param {Drawable} drawable
 */
export function applyPalette(doc, palette, drawable) {
  const root = doc.documentElement;
  clearPalette(doc);
  // A custom palette replaces the built-in wholesale rather than layering over
  // it, exactly as the app does — otherwise the captured `data-theme` keeps
  // supplying values the theme meant to override.
  root.removeAttribute("data-theme");
  const attrs = ornamentAttributes(palette, drawable);
  for (const [attr, value] of Object.entries(attrs)) root.setAttribute(attr, value);
  const keys = [];
  for (const [key, value] of paintableEntries(palette)) {
    root.style.setProperty(key, value);
    keys.push(key);
  }
  written.set(doc, keys);
  return Object.keys(attrs).length > 0;
}

/** The keys the last {@link applyPalette} wrote, per document. */
const written = new WeakMap();

/** Remove everything {@link applyPalette} wrote, leaving the built-in look. */
export function clearPalette(doc) {
  const root = doc.documentElement;
  for (const key of written.get(doc) ?? []) root.style.removeProperty(key);
  written.set(doc, []);
  for (const attr of [...root.attributes].map((a) => a.name)) {
    if (attr === ON_ATTR || attr.startsWith("data-o-")) root.removeAttribute(attr);
  }
}
