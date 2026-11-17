// The release archive's load-more behaviour, as a function rather than as a
// script tag (myne-md/myne-website#132).
//
// ── Why this is a module and not twelve lines inline ──────────────────────
//
// The page ships the WHOLE archive in its HTML and hides the older rows on
// load. That is deliberate: a reader without JavaScript sees every release,
// which is the version of this page that cannot break, and the archive is the
// one surface here whose job is being complete. The consequence is that the
// hiding is a progressive enhancement, so it has to behave when it runs twice,
// when it runs on a list shorter than one page, and when it runs after the
// reader has already opened a row.
//
// ── What the numbers mean ─────────────────────────────────────────────────
//
// `FIRST_PAGE` is what the owner asked for by name ("son 7 tanesi normal
// gözükebilir"). Every press after that reveals `FIRST_PAGE` more, so the
// archive grows in the same rhythm it starts in and a reader who wants v0.6.0
// presses three times rather than reading a wall.

/** Rows visible before the first press, and rows added by each press. */
export const FIRST_PAGE = 7;

/**
 * How many rows are visible after `presses` presses.
 *
 * Never less than the first page and never more than `total`, so a short roster
 * renders whole and a long one cannot be asked for more rows than exist.
 */
export function visibleCount(total, presses) {
  const asked = FIRST_PAGE + Math.max(0, presses) * FIRST_PAGE;
  return Math.min(Math.max(0, total), asked);
}

/**
 * What the counter under the list says, and whether the button still has work.
 *
 * The counter exists because "Load more" alone does not say how much more there
 * is; a reader deciding whether to press is deciding whether the older releases
 * are worth it, and the total is the fact that answers that.
 */
export function archiveProgress({ total, presses, label }) {
  const shown = visibleCount(total, presses);
  return {
    shown,
    hidden: total - shown,
    /** "7 of 18 releases" — no pluralisation branch, the numbers carry it. */
    text: `${shown} of ${total} ${label}`,
    hasMore: shown < total,
  };
}
