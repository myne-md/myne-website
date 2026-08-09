// The measure vocabulary + the band its sliders are bound to (myne#394).

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MEASURE_GROUPS,
  UNMOVABLE,
  allMeasureTokens,
  bandFor,
  parseScalar,
  CLAMP_MIN_RATIO,
  CLAMP_MAX_RATIO,
} from "./measure.mjs";

test("no control shows a raw token name", () => {
  // The builder's oldest rule (SYNC-3): show what the thing IS, never
  // `--space-4`.
  for (const g of MEASURE_GROUPS) {
    assert.doesNotMatch(g.label, /--/, `group ${g.id}`);
    assert.doesNotMatch(g.hint, /--/, `group ${g.id} hint`);
    for (const t of g.tokens) assert.doesNotMatch(t.label, /--/, t.token);
  }
});

test("every offered token is a `--` custom property, listed once", () => {
  const all = allMeasureTokens();
  for (const t of all) assert.match(t, /^--[a-z0-9-]+$/, t);
  assert.equal(new Set(all).size, all.length, "a token is offered twice");
});

test("the zero-default tokens are NOT offered", () => {
  // `--space-0` and `--tracking-normal` default to 0, and 0.5×–2× of zero is
  // zero — the app clamps any value straight back, silently. A control for them
  // would be a control that cannot move. (Field Notes ships
  // `--tracking-normal: 0.01em` today and it has never done anything.)
  const offered = new Set(allMeasureTokens());
  for (const t of UNMOVABLE) assert.equal(offered.has(t), false, `${t} must not be offered`);
});

test("the band matches the app's clamp exactly", () => {
  // These ratios are `src/lib/themeMeasure.ts`'s. A slider wider than the app's
  // clamp is a builder that lies: the user drags past the band, and the app
  // paints the bound instead.
  assert.equal(CLAMP_MIN_RATIO, 0.5);
  assert.equal(CLAMP_MAX_RATIO, 2);
  assert.deepEqual(bandFor("12px"), { min: 6, max: 24, unit: "px", base: 12 });
  assert.deepEqual(bandFor("400"), { min: 200, max: 800, unit: "", base: 400 });
  assert.deepEqual(bandFor("0.02em"), { min: 0.01, max: 0.04, unit: "em", base: 0.02 });
});

test("a band that cannot move is refused rather than rendered flat", () => {
  assert.equal(bandFor("0"), null);
  assert.equal(bandFor("0em"), null);
  assert.equal(bandFor("auto"), null);
  assert.equal(bandFor(""), null);
  assert.equal(bandFor(undefined), null);
});

test("the scalar parser agrees with the app's", () => {
  // Faithful port of `themeMeasure.ts`'s `parseScalar`. A value one side parses
  // and the other does not produces a slider whose output the app refuses.
  assert.deepEqual(parseScalar("12px"), { n: 12, unit: "px" });
  assert.deepEqual(parseScalar("  0.5rem "), { n: 0.5, unit: "rem" });
  assert.deepEqual(parseScalar("400"), { n: 400, unit: "" });
  assert.deepEqual(parseScalar("-0.015em"), { n: -0.015, unit: "em" });
  assert.equal(parseScalar("12 px"), null);
  assert.equal(parseScalar("calc(1px + 1px)"), null);
  assert.equal(parseScalar("thick"), null);
});
