/**
 * When a reveal target has come far enough into the viewport to be shown.
 *
 * ── Why this is not the IntersectionObserver's answer ──────────────────────
 *
 * A reveal variant may hide its own element by collapsing it: a `clip-path`
 * that clips it to zero area, or a `scaleX(0)` wipe. `IntersectionObserver`
 * measures the VISIBLE area of its target, so an element hidden that way
 * reports a zero-area intersection and its callback never fires. The variant
 * therefore starves the trigger that exists to undo it, and the element stays
 * hidden forever. That is not a hypothetical: it is why the comparison table on
 * the home page never appeared.
 *
 * So the decision is taken from a box the hidden state cannot corrupt. The
 * caller passes the element's layout height (`offsetHeight`, which ignores the
 * element's own transform) and its untransformed top edge, and this function
 * answers from numbers alone. Being pure is the second half of the fix: a
 * browser is not needed to prove the answer, so the test that holds this can
 * run in `pnpm test` rather than in a lane nobody has.
 *
 * The fraction matches the observer's own `rootMargin: "0px 0px -12% 0px"`, so
 * the two paths reveal at the same point on the page.
 */

/** The share of the viewport a target's top edge must cross. */
export const REVEAL_FRACTION = 0.88;

/**
 * @param {{ top: number, height: number }} box layout height and the top edge
 *   of the element, in viewport coordinates
 * @param {number} viewportHeight
 * @returns {boolean}
 */
export function revealDue(box, viewportHeight) {
  if (!(box.height > 0)) return false;
  if (!(viewportHeight > 0)) return false;
  const line = viewportHeight * REVEAL_FRACTION;
  // Below the line: not yet. Entirely above the viewport: the reader scrolled
  // past it, and a one-shot reveal must still show it rather than leave a hole.
  return box.top < line && box.top + box.height > 0;
}

/**
 * The reveal variants whose hidden state changes the element's own box, and
 * which therefore must NOT be driven by the observer.
 *
 * This list is asserted against `styles/motion.css` by `reveal.test.mjs`: a
 * variant added to the stylesheet that collapses geometry without being listed
 * here fails the test, because the failure mode is silent and the next person
 * to add a wipe will not have read this file.
 */
export const GEOMETRY_COLLAPSING = ["clip", "line"];
