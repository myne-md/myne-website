import { test } from "node:test";
import assert from "node:assert/strict";

import {
  clearHighlight,
  elementsForToken,
  highlightToken,
  selectorsForToken,
  HIGHLIGHT_CLASS,
} from "./highlight.mjs";

const styleRule = (selectorText, decls) => ({
  selectorText,
  cssText: `${selectorText} { ${decls} }`,
});

/** A minimal fake CSSOM rule list, including one grouping rule. */
const RULES = [
  styleRule(":root", "--bg-1: #fff; --fg-1: var(--ink-1);"),
  styleRule(".cm-content", "color: var(--ink-1); font-size: 15px;"),
  styleRule(".cm-gutters", "color: var(--ink-3); border-right: 1px solid var(--line-1);"),
  {
    cssRules: [styleRule(".tb-x", "background: var(--accent);")],
  },
  styleRule(".accent-hover", "background: var(--accent-hover);"),
  styleRule("::-webkit-scrollbar-thumb", "background: var(--accent);"),
];

test("selectorsForToken finds the rules that read the token", () => {
  assert.deepEqual(selectorsForToken(RULES, "--ink-1"), [":root", ".cm-content"]);
  assert.deepEqual(selectorsForToken(RULES, "--line-1"), [".cm-gutters"]);
});

test("selectorsForToken does not match a longer token name", () => {
  // `var(--accent-hover)` must not be reported as a use of `--accent`, or one
  // click would outline the wrong regions (and the count would be wrong).
  assert.deepEqual(selectorsForToken(RULES, "--accent"), [".tb-x", "::-webkit-scrollbar-thumb"]);
});

test("selectorsForToken recurses into grouping rules", () => {
  const nested = [{ cssRules: [{ cssRules: [styleRule(".deep", "color: var(--ink-2);")] }] }];
  assert.deepEqual(selectorsForToken(nested, "--ink-2"), [".deep"]);
});

test("selectorsForToken copes with an empty or missing rule list", () => {
  assert.deepEqual(selectorsForToken([], "--ink-1"), []);
  assert.deepEqual(selectorsForToken(undefined, "--ink-1"), []);
});

/** A fake document whose querySelectorAll answers from a selector → elements map. */
function fakeDoc(mapFor) {
  const root = { name: "root", classList: { add() {}, remove() {} } };
  const body = { name: "body", classList: { add() {}, remove() {} } };
  const map = mapFor({ root, body }) ?? {};
  return {
    documentElement: root,
    body,
    styleSheets: [{ cssRules: RULES }],
    querySelectorAll: (sel) => map[sel] ?? [],
  };
}

test("elementsForToken unions, dedupes, and never marks the document root or body", () => {
  const a = { name: "a" };
  const b = { name: "b" };
  const doc = fakeDoc(({ root, body }) => ({
    // `:root` reads the token (through the alias), `.cm-content` reads it
    // directly, and `--accent` is read by two rules.
    ":root": [root, body],
    ".cm-content": [a],
    ".tb-x": [a, b],
    "::-webkit-scrollbar-thumb": [],
  }));
  const out = elementsForToken(doc, "--accent");
  assert.deepEqual(out.map((el) => el.name).sort(), ["a", "b"]);
});

test("elementsForToken caps how much one click can paint", () => {
  const many = Array.from({ length: 50 }, (_, i) => ({ name: `el${i}` }));
  const doc = fakeDoc(() => ({ ".tb-x": many, "::-webkit-scrollbar-thumb": [] }));
  assert.equal(elementsForToken(doc, "--accent", { limit: 10 }).length, 10);
});

test("elementsForToken skips a selector the engine refuses", () => {
  const doc = fakeDoc(() => ({}));
  doc.querySelectorAll = (sel) => {
    if (sel === ".cm-content") throw new Error("unsupported selector");
    return sel === ".tb-x" ? [{ name: "ok" }] : [];
  };
  assert.deepEqual(elementsForToken(doc, "--accent").map((e) => e.name), ["ok"]);
});

test("clearHighlight removes the marker class and leaves the stylesheet", () => {
  const seen = [];
  const el = { classList: { remove: (c) => seen.push(c) } };
  const doc = { querySelectorAll: (sel) => (sel === `.${HIGHLIGHT_CLASS}` ? [el] : []) };
  clearHighlight(doc);
  assert.deepEqual(seen, [HIGHLIGHT_CLASS]);
});

/**
 * A fake document that carries the injected marker stylesheet, which is what
 * `highlightToken` needs and the pure helpers above do not.
 */
function fakeStyledDoc(selectorMap) {
  const marked = [];
  const makeEl = (name) => ({
    name,
    classList: {
      add: (c) => marked.push(`${name}:${c}`),
      remove: (c) => marked.push(`-${name}:${c}`),
    },
  });
  const target = makeEl("target");
  const style = { id: "", textContent: "" };
  let styleEl = null;
  return {
    marked,
    documentElement: makeEl("root"),
    body: makeEl("body"),
    styleSheets: [{ cssRules: RULES }],
    querySelectorAll: (sel) =>
      sel === `.${HIGHLIGHT_CLASS}` ? [] : (selectorMap[sel] ?? []).map(() => target),
    getElementById: () => styleEl,
    createElement: () => style,
    head: {
      appendChild: () => {
        styleEl = style;
      },
    },
  };
}

test("highlightToken injects the marker sheet and marks what the token drives", () => {
  const doc = fakeStyledDoc({ ".tb-x": [1], "::-webkit-scrollbar-thumb": [] });
  assert.equal(highlightToken(doc, "--accent"), 1);
  assert.ok(doc.getElementById(), "the marker stylesheet was injected");
  assert.deepEqual(doc.marked, [`target:${HIGHLIGHT_CLASS}`]);
});

test("highlightToken injects the sheet ONCE across calls", () => {
  const doc = fakeStyledDoc({ ".tb-x": [1], "::-webkit-scrollbar-thumb": [] });
  highlightToken(doc, "--accent");
  const first = doc.getElementById();
  highlightToken(doc, "--accent");
  assert.equal(doc.getElementById(), first, "the second call reuses the existing sheet");
});

test("highlightToken with no token clears, and creates no sheet", () => {
  const doc = fakeStyledDoc({ ".tb-x": [1] });
  assert.equal(highlightToken(doc, null), 0);
  assert.equal(doc.getElementById(), null);
});
