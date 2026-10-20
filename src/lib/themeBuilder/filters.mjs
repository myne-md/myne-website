/**
 * Theme Builder: which controls a query shows.
 *
 * The search box and the "Modified" toggle are the only part of the panel with
 * real branching: a group can match by LABEL (the ornament and shape panels have
 * no colour rows), a row can match by its own words, "Modified" compares every
 * token against the palette the session started from, and a group whose rows all
 * fall out is hidden rather than left as an empty heading. That decision lived in
 * the page's inline `<script>`, where this repository's runner cannot reach it
 * (`package.json`'s test script is `node --test` over `src/lib` and `scripts`;
 * there is no DOM lane), so it is a pure function here with its own spec and the
 * page keeps only the DOM writes.
 *
 * Two shapes, because there are two kinds of panel:
 *
 *   - `filterKind: "rows"`  a tone family: every token is a row, and the group is
 *                           hidden when no row survives.
 *   - `filterKind: "group"` the ornament and measure panels: they have no colour
 *                           rows, so they match as a whole, and "Modified"
 *                           (which compares colour values) never hides them.
 *
 * @typedef {{ token: string, hay: string }} Row
 * @typedef {{ query?: string, modifiedOnly?: boolean, filterKind: "rows" | "group",
 *   label?: string, rows: Row[], palette?: Record<string, string>,
 *   basePalette?: Record<string, string> }} VisibilityInput
 * @typedef {{ hidden: boolean, rows: { token: string, show: boolean }[] }} Visibility
 */

/** The normalised query: trimmed and lowercased, so callers do not each decide. */
export function normaliseQuery(query) {
  return String(query ?? "").trim().toLowerCase();
}

/**
 * Which rows of one group survive the current query and the Modified toggle,
 * and whether the group itself should be hidden.
 *
 * @param {VisibilityInput} input
 * @returns {Visibility}
 */
export function computeVisibility(input) {
  const {
    filterKind,
    label = "",
    rows = [],
    modifiedOnly = false,
    palette = {},
    basePalette = {},
  } = input;
  const q = normaliseQuery(input.query);

  if (filterKind === "group") {
    const matches = q === "" || label.includes(q);
    return { hidden: !matches, rows: rows.map((r) => ({ token: r.token, show: matches })) };
  }

  // A group whose own label matches shows all of its rows: typing "borders"
  // should reach every hairlines row, not only the ones whose label says so.
  const groupMatches = q !== "" && label.includes(q);
  let visible = 0;
  const out = rows.map((row) => {
    const matches = groupMatches || q === "" || row.hay.includes(q);
    const changed = modifiedOnly
      ? (palette[row.token] ?? "") !== (basePalette[row.token] ?? "")
      : true;
    const show = matches && changed;
    if (show) visible += 1;
    return { token: row.token, show };
  });
  return { hidden: visible === 0, rows: out };
}
