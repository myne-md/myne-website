/**
 * The reveal decision, and the contract that keeps it honest.
 *
 * Two jobs. The first is ordinary: a box far below the fold is not due, a box
 * that has crossed the line is, and a box the reader has already scrolled past
 * is due anyway, because a one-shot reveal that never fires leaves a hole.
 *
 * The second is the one that matters after this change. The reason the
 * comparison table was invisible is that a reveal variant hid its own element
 * with a zero-area clip, which made the observer that would have revealed it
 * measure zero. The fix routes such variants around the observer, and this test
 * is what stops a third variant from being added to the stylesheet without being
 * routed. It reads the stylesheet and the driver as text, which is unusual on
 * purpose: the defect is a disagreement between two files, and neither file's
 * own tests can see the other.
 *
 * Verified by injection: add `clip-path: inset(0 0 100% 0)` under a new
 * `[data-motion="wipe"]` in the stylesheet without listing `wipe` in the driver
 * and this file fails naming `wipe`.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GEOMETRY_COLLAPSING, REVEAL_FRACTION, revealDue } from "./reveal.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, "..", "..");

test("a target below the line is not due", () => {
  assert.equal(revealDue({ top: 900, height: 200 }, 800), false);
});

test("a target whose top edge crosses the line is due", () => {
  const line = 800 * REVEAL_FRACTION;
  assert.equal(revealDue({ top: line + 1, height: 100 }, 800), false);
  assert.equal(revealDue({ top: line - 1, height: 100 }, 800), true);
});

test("a target taller than the viewport is due once its top is above the line", () => {
  assert.equal(revealDue({ top: 100, height: 5000 }, 800), true);
});

test("a target whose top edge is above the viewport is still due while any of it shows", () => {
  assert.equal(revealDue({ top: -200, height: 600 }, 800), true);
});

test("a target entirely above the viewport is not due", () => {
  assert.equal(revealDue({ top: -900, height: 600 }, 800), false);
});

test("an unmeasurable target is not due, and does not throw", () => {
  assert.equal(revealDue({ top: 10, height: 0 }, 800), false);
  assert.equal(revealDue({ top: 10, height: 100 }, 0), false);
  assert.equal(revealDue({ top: 10, height: 100 }, Number.NaN), false);
});

test("the stylesheet's collapsing variants are exactly the ones the driver routes", () => {
  const css = readFileSync(join(site, "src/styles/motion.css"), "utf8");
  const driver = readFileSync(join(site, "src/scripts/motion.ts"), "utf8");

  // Every hidden state that removes the element's own area: a zero-area clip,
  // or a scale on either axis.
  const declared = new Set();
  const block = /:not\(\.is-in\)\[data-motion="([a-z]+)"\][^{]*\{([^}]*)\}/g;
  for (const [, variant, body] of css.matchAll(block)) {
    const collapses =
      /clip-path:\s*inset\(\s*0(?:px)?\s+0(?:px)?\s+100%/.test(body) ||
      /transform:\s*scale[XY]\(\s*0\s*\)/.test(body);
    if (collapses) declared.add(variant);
  }

  const routedInCss = new Set(GEOMETRY_COLLAPSING);
  assert.deepEqual(
    [...declared].sort(),
    [...routedInCss].sort(),
    "a motion variant that collapses its own geometry must be listed in GEOMETRY_COLLAPSING, " +
      "because the observer cannot see a zero-area target and the element would stay hidden",
  );

  // And the driver must actually use the list rather than merely export it.
  assert.match(driver, /GEOMETRY_COLLAPSING/, "motion.ts does not route the collapsing variants");
});

test("the fraction matches the observer's own rootMargin", () => {
  const driver = readFileSync(join(site, "src/scripts/motion.ts"), "utf8");
  const margin = /rootMargin:\s*"0px 0px -(\d+)% 0px"/.exec(driver);
  assert.ok(margin, "motion.ts no longer carries a bottom rootMargin; see reveal.mjs");
  assert.equal(REVEAL_FRACTION, 1 - Number(margin[1]) / 100);
});
