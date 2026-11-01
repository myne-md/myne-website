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
 * Parse a CSS color to 0-255 RGB, or `null` when the form is not one this
 * module understands. Covers what the theme value allowlist admits: 3/4/6/8
 * digit hex, `rgb()`/`rgba()` with commas or spaces, and `hsl()`/`hsla()`.
 *
 * @param {string} value
 * @returns {[number, number, number] | null}
 */
export function parseColorToRgb(value) {
  const v = String(value ?? "").trim().toLowerCase();
  const hex = v.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (h.length === 6 || h.length === 8) {
      const n = Number.parseInt(h.slice(0, 6), 16);
      return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
    }
    return null;
  }
  const fn = v.match(/^(rgba?|hsla?)\(([^)]*)\)$/);
  if (!fn) return null;
  const parts = (fn[2].match(/[-+]?[\d.]+%?/g) ?? []).slice(0, 3);
  if (parts.length < 3) return null;
  const nums = parts.map((t) => Number.parseFloat(t));
  if (!nums.every((n) => Number.isFinite(n))) return null;
  if (fn[1].startsWith("rgb")) {
    const channels = nums.map((n, i) => (parts[i].endsWith("%") ? (n * 255) / 100 : n));
    return channels.map((x) => Math.max(0, Math.min(255, x)));
  }
  const hue = ((nums[0] % 360) + 360) % 360;
  const sat = Math.max(0, Math.min(100, nums[1])) / 100;
  const light = Math.max(0, Math.min(100, nums[2])) / 100;
  const a = sat * Math.min(light, 1 - light);
  const k = (n) => (n + hue / 30) % 12;
  const f = (n) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((x) => Math.round(x * 255));
}

/** True when `background` is dark (WCAG luminance below 0.5). */
export function isDarkBackground(background) {
  const rgb = parseColorToRgb(background);
  if (rgb === null) return false;
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = rgb;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) < 0.5;
}

/**
 * The custom properties the captured sheet declares on `:root` AND again under
 * a `[data-theme]` block: exactly the tokens whose built-in value depends on
 * the appearance. Derived from the sheet so there is no fourth copy of the
 * list, and read from the same document the palette is about to be painted on.
 *
 * @param {Document} doc
 * @returns {string[]}
 */
export function appearanceVaryingTokens(doc) {
  const base = new Set();
  const themed = new Set();
  const walk = (rules) => {
    for (const rule of rules ?? []) {
      if (rule.cssRules) {
        walk(rule.cssRules);
        continue;
      }
      const sel = rule.selectorText ?? "";
      if (!rule.style) continue;
      const names = [];
      for (let i = 0; i < rule.style.length; i += 1) {
        const prop = rule.style.item(i);
        if (prop.startsWith("--") && !prop.startsWith("--_")) names.push(prop);
      }
      if (/\[data-theme/.test(sel)) names.forEach((p) => themed.add(p));
      else if (/^:root\b/.test(sel)) names.forEach((p) => base.add(p));
    }
  };
  for (const sheet of Array.from(doc.styleSheets ?? [])) {
    try {
      walk(sheet.cssRules);
    } catch {
      // A cross-origin sheet cannot be inspected; the captured one is inline.
    }
  }
  return [...base].filter((p) => themed.has(p));
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
  // A theme is a PARTIAL palette, and the built-in sheet states the omitted
  // tokens per appearance. Seed them for the appearance the theme declares, or
  // a dark theme renders the light label/highlight/graph families and the light
  // code colours (the divergence myne-md/myne#900 fixed in the app). Read before
  // dropping the attribute: the seed comes FROM the sheet.
  const dark = isDarkBackground(palette["--paper"] ?? "");
  const previous = root.getAttribute("data-theme");
  root.setAttribute("data-theme", dark ? "dark" : "light");
  const computed = doc.defaultView.getComputedStyle(root);
  /** @type {Record<string, string>} */
  const canon = {};
  for (const key of appearanceVaryingTokens(doc)) {
    const value = computed.getPropertyValue(key).trim();
    if (value !== "") canon[key] = value;
  }
  // `--info`'s dark declaration aliases `--accent`, which a computed read
  // resolves to the BUILT-IN accent; on a custom theme the alias means the
  // theme's own.
  if (dark) {
    const accent = palette["--accent"] ?? canon["--accent"];
    if (typeof accent === "string" && accent.trim() !== "") canon["--info"] = accent;
  }
  if (previous === null) root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", previous);
  const attrs = ornamentAttributes(palette, drawable);
  for (const [attr, value] of Object.entries(attrs)) root.setAttribute(attr, value);
  const keys = [];
  for (const [key, value] of paintableEntries({ ...canon, ...palette })) {
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
