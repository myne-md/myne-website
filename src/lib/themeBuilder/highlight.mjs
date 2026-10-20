/**
 * Theme Builder: "which parts of the interface does this colour drive?"
 *
 * Clicking a swatch in the panel answers a question the panel cannot answer in
 * words: what does changing this actually move? The answer is already written
 * down: the captured stylesheet says which selectors read `var(--token)`: so
 * this module reads it out of the live CSSOM instead of keeping a second,
 * hand-maintained map of token → regions that would drift from the sheet the
 * moment anyone touched a rule.
 *
 * Two deliberate limits, stated rather than discovered:
 *
 *  - **One level of indirection.** A rule that reads `var(--bg-1)` is not found
 *    when you ask about `--paper`, even though `--bg-1: var(--paper)`. Following
 *    aliases means walking the sheet's own custom-property graph; the panel
 *    reports what NAMES a token, and the count it shows is that count.
 *  - **Elements, not pixels.** A matched element is outlined. A token read by a
 *    rule whose selector matches 200 elements (say, `*`) is capped, so one click
 *    cannot paint the whole document.
 */

/** Escape a token for use inside a RegExp. */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The selectors in a CSSOM rule list (recursing into grouping rules) whose
 * declarations read `var(--token)`. Matches `var(--token)` and
 * `var(--token, fallback)`, never `var(--token-elsewhere)`.
 *
 * @param {Iterable<object>} ruleList @param {string} token
 * @returns {string[]}
 */
export function selectorsForToken(ruleList, token) {
  const needle = new RegExp(`var\\(\\s*${escapeRe(token)}\\s*[,)]`);
  /** @type {string[]} */
  const out = [];
  const walk = (rules) => {
    for (const rule of rules ?? []) {
      // Grouping rules (@media, @supports, …) carry their own rule list.
      if (rule?.cssRules?.length) {
        walk(rule.cssRules);
        continue;
      }
      if (typeof rule?.selectorText !== "string") continue;
      if (typeof rule?.cssText === "string" && needle.test(rule.cssText)) {
        out.push(rule.selectorText);
      }
    }
  };
  walk(ruleList);
  return out;
}

/**
 * The elements in `doc` that a token drives, deduplicated and capped.
 *
 * A selector the engine refuses (`::-webkit-scrollbar`, a `:has()` form it does
 * not know) is skipped rather than thrown: a highlight that is one region short
 * is useful, a highlight that throws is not.
 *
 * @param {Document} doc @param {string} token @param {{ limit?: number }} [opts]
 * @returns {HTMLElement[]}
 */
export function elementsForToken(doc, token, opts = {}) {
  const limit = opts.limit ?? 80;
  /** @type {Set<Element>} */
  const found = new Set();
  for (const sheet of Array.from(doc.styleSheets ?? [])) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // a cross-origin sheet: not ours to read
    }
    for (const selector of selectorsForToken(rules, token)) {
      if (found.size >= limit) break;
      let els;
      try {
        els = doc.querySelectorAll(selector);
      } catch {
        continue;
      }
      for (const el of Array.from(els)) {
        if (found.size >= limit) break;
        // Never mark the document root or <body>: outlining them says nothing
        // and paints a border around the whole preview.
        if (el === doc.documentElement || el === doc.body) continue;
        found.add(el);
      }
    }
  }
  return /** @type {HTMLElement[]} */ (Array.from(found));
}

/** The class the preview frame's own stylesheet uses to draw the marker. */
export const HIGHLIGHT_CLASS = "tb-token-hl";

/** The marker's stylesheet, injected into the frame once. */
export const HIGHLIGHT_CSS = `
  .${HIGHLIGHT_CLASS} {
    outline: 2px solid #ff3d8b !important;
    outline-offset: 1px;
    background-color: rgba(255, 61, 139, 0.08) !important;
  }
`;

/**
 * Outline every element in `doc` that reads `var(--token)`, and return how many
 * there were. A previous highlight is cleared first, so this is idempotent.
 *
 * @param {Document} doc @param {string | null} token @param {{ limit?: number }} [opts]
 * @returns {number}
 */
export function highlightToken(doc, token, opts = {}) {
  clearHighlight(doc);
  if (!token) return 0;

  let style = doc.getElementById("tb-token-hl-style");
  if (!style) {
    style = doc.createElement("style");
    style.id = "tb-token-hl-style";
    style.textContent = HIGHLIGHT_CSS;
    (doc.head ?? doc.documentElement)?.appendChild(style);
  }

  const els = elementsForToken(doc, token, opts);
  for (const el of els) el.classList.add(HIGHLIGHT_CLASS);
  return els.length;
}

/** Remove every marker (and leave the stylesheet in place for the next click). */
export function clearHighlight(doc) {
  for (const el of Array.from(doc.querySelectorAll(`.${HIGHLIGHT_CLASS}`))) {
    el.classList.remove(HIGHLIGHT_CLASS);
  }
}
