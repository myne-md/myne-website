import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_THEME,
  THEME_COLOR,
  THEME_KEY,
  applyTheme,
  nextTheme,
  normalizeTheme,
  readTheme,
  themeColorFor,
  themeOf,
  writeTheme,
} from "./theme.mjs";

function fakeStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    _map: map,
  };
}

function fakeRoot() {
  return { dataset: {} };
}

test("default theme is dark and anything unknown normalises to it", () => {
  assert.equal(DEFAULT_THEME, "dark");
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme("dark"), "dark");
  for (const bad of [undefined, null, "", "Light", "system", "auto", 0, {}])
    assert.equal(normalizeTheme(bad), "dark", `normalizeTheme(${String(bad)})`);
});

test("readTheme defaults to dark with no store or no value", () => {
  assert.equal(readTheme(fakeStorage()), "dark");
  assert.equal(readTheme(fakeStorage({ [THEME_KEY]: "light" })), "light");
  assert.equal(readTheme(fakeStorage({ [THEME_KEY]: "nonsense" })), "dark");
});

test("readTheme survives a store that throws", () => {
  const throwing = {
    getItem() {
      throw new Error("private mode");
    },
  };
  assert.equal(readTheme(throwing), "dark");
});

test("writeTheme persists the normalised value, best-effort", () => {
  const store = fakeStorage();
  writeTheme("light", store);
  assert.equal(store._map.get(THEME_KEY), "light");
  writeTheme("nonsense", store);
  assert.equal(store._map.get(THEME_KEY), "dark");
  const throwing = {
    setItem() {
      throw new Error("quota");
    },
  };
  assert.doesNotThrow(() => writeTheme("light", throwing));
});

test("applyTheme writes data-theme and themeOf reads it back", () => {
  const root = fakeRoot();
  assert.equal(applyTheme(root, "light"), "light");
  assert.equal(themeOf(root), "light");
  assert.equal(applyTheme(root, "dark"), "dark");
  assert.equal(themeOf(root), "dark");
  // A root with no attribute at all reads as dark.
  assert.equal(themeOf(fakeRoot()), "dark");
});

test("nextTheme flips and is stable at the poles", () => {
  assert.equal(nextTheme("dark"), "light");
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme("nonsense"), "light");
});

test("theme-color follows the theme", () => {
  assert.equal(themeColorFor("dark"), THEME_COLOR.dark);
  assert.equal(themeColorFor("light"), THEME_COLOR.light);
  assert.equal(themeColorFor("nonsense"), THEME_COLOR.dark);
});
