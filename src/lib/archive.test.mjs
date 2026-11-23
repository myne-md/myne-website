// node --test src/lib/archive.test.mjs
//
// Two things this holds that a browser test would not: the arithmetic at the
// boundaries (a roster shorter than one page, exactly one page, one row past
// it) and the promise that the reveal never shrinks. The DOM half is exercised
// by the page itself; this is the decision.
import { test } from "node:test";
import assert from "node:assert/strict";

import { FIRST_PAGE, archiveProgress, visibleCount } from "./archive.mjs";

test("the first page is the seven the owner asked for", () => {
  assert.equal(FIRST_PAGE, 7);
});

test("a roster shorter than one page is shown whole", () => {
  assert.equal(visibleCount(3, 0), 3);
  assert.equal(visibleCount(3, 4), 3);
  assert.equal(archiveProgress({ total: 3, presses: 0, label: "releases" }).hasMore, false);
});

test("exactly one page has nothing left to load", () => {
  assert.equal(visibleCount(7, 0), 7);
  assert.equal(archiveProgress({ total: 7, presses: 0, label: "releases" }).hasMore, false);
});

test("one row past the page is the case the button exists for", () => {
  const first = archiveProgress({ total: 8, presses: 0, label: "releases" });
  assert.equal(first.shown, 7);
  assert.equal(first.hidden, 1);
  assert.equal(first.hasMore, true);
  assert.equal(first.text, "7 of 8 releases");

  const after = archiveProgress({ total: 8, presses: 1, label: "releases" });
  assert.equal(after.shown, 8);
  assert.equal(after.hasMore, false);
});

test("each press reveals a page and the count never goes backwards", () => {
  const total = 18;
  let seen = 0;
  for (let presses = 0; presses < 6; presses++) {
    const now = visibleCount(total, presses);
    assert.ok(now >= seen, `press ${presses} shrank the list: ${seen} -> ${now}`);
    assert.ok(now - seen <= FIRST_PAGE || presses === 0, "a press revealed more than a page");
    seen = now;
  }
  assert.equal(seen, total);
});

test("asking for more rows than exist is clamped rather than wrapped", () => {
  assert.equal(visibleCount(18, 99), 18);
  assert.equal(visibleCount(0, 0), 0);
});
