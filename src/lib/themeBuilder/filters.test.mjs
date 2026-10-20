import { test } from "node:test";
import assert from "node:assert/strict";

import { computeVisibility, normaliseQuery } from "./filters.mjs";

const ROWS = [
  { token: "--paper", hay: "page background --paper" },
  { token: "--paper-2", hay: "panels & cards --paper-2" },
  { token: "--ink-1", hay: "body text --ink-1" },
];

const base = { "--paper": "#fbfbfa", "--paper-2": "#f4f4f2", "--ink-1": "#1a1a17" };

test("normaliseQuery folds case and trims", () => {
  assert.equal(normaliseQuery("  Accent  "), "accent");
  assert.equal(normaliseQuery(undefined), "");
});

test("an empty query shows every row and never hides the group", () => {
  const r = computeVisibility({ filterKind: "rows", label: "surfaces", rows: ROWS, palette: base, basePalette: base });
  assert.equal(r.hidden, false);
  assert.deepEqual(r.rows.map((x) => x.show), [true, true, true]);
});

test("a row matches on its own words, and non-matching rows hide", () => {
  const r = computeVisibility({ filterKind: "rows", label: "surfaces", rows: ROWS, query: "cards" });
  assert.deepEqual(r.rows.map((x) => x.show), [false, true, false]);
  assert.equal(r.hidden, false);
});

test("a group whose LABEL matches shows all of its rows", () => {
  // Typing the family's name has to reach the whole family, not the rows whose
  // own label happens to repeat it.
  const r = computeVisibility({ filterKind: "rows", label: "borders", rows: ROWS, query: "borders" });
  assert.deepEqual(r.rows.map((x) => x.show), [true, true, true]);
});

test("a group with no surviving row is hidden", () => {
  const r = computeVisibility({ filterKind: "rows", label: "surfaces", rows: ROWS, query: "zzz" });
  assert.equal(r.hidden, true);
  assert.deepEqual(r.rows.map((x) => x.show), [false, false, false]);
});

test("Modified narrows to the tokens that differ from the starting palette", () => {
  const palette = { ...base, "--ink-1": "#000000" };
  const r = computeVisibility({
    filterKind: "rows",
    label: "text",
    rows: ROWS,
    modifiedOnly: true,
    palette,
    basePalette: base,
  });
  assert.deepEqual(r.rows.map((x) => x.show), [false, false, true]);
});

test("Modified with nothing changed hides the whole group", () => {
  const r = computeVisibility({
    filterKind: "rows",
    label: "surfaces",
    rows: ROWS,
    modifiedOnly: true,
    palette: base,
    basePalette: base,
  });
  assert.equal(r.hidden, true);
});

test("a group-kind panel matches as a whole and Modified never hides it", () => {
  const label = "ornament decoration frames shadows textures folds tint wash";
  const rows = [{ token: "--tint", hay: "tint colour --tint" }];
  assert.equal(computeVisibility({ filterKind: "group", label, rows, query: "frames" }).hidden, false);
  assert.equal(computeVisibility({ filterKind: "group", label, rows, query: "zzz" }).hidden, true);
  // Modified compares colour values, and these panels have none to compare.
  assert.equal(
    computeVisibility({ filterKind: "group", label, rows, query: "", modifiedOnly: true }).hidden,
    false,
  );
});
