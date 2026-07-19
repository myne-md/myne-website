import { test } from "node:test";
import assert from "node:assert/strict";

import { isDarkBackground, deriveSyntaxTokensForTheme } from "./syntaxTheme.mjs";
import { SYNTAX_TOKENS, DARK_DEFAULTS } from "./tokens.mjs";

test("isDarkBackground matches WCAG-luminance<0.5 (dark) vs light vs non-hex", () => {
  assert.equal(isDarkBackground("#121210"), true);
  assert.equal(isDarkBackground("#282a36"), true); // dracula paper
  assert.equal(isDarkBackground("#fbfbfa"), false);
  assert.equal(isDarkBackground("not-a-color"), false); // unparseable → keep light default
});

test("dark theme with no syntax → all 12 roles resolve to the dark canon hex", () => {
  const out = deriveSyntaxTokensForTheme({ "--paper": "#121210" });
  assert.deepEqual(new Set(Object.keys(out)), new Set(SYNTAX_TOKENS));
  for (const t of SYNTAX_TOKENS) {
    // the builder resolves the desktop's var(--_syntax-*-dark) to the concrete
    // canon hex (same value; the preview has no --_*-dark source vars)
    assert.equal(out[t], DARK_DEFAULTS[t]);
  }
});

test("light theme → no derivation", () => {
  assert.deepEqual(deriveSyntaxTokensForTheme({ "--paper": "#fbfbfa" }), {});
});

test("dark theme that already defines every syntax role → no derivation", () => {
  const palette = { "--paper": "#121210" };
  for (const t of SYNTAX_TOKENS) palette[t] = "#abcdef";
  assert.deepEqual(deriveSyntaxTokensForTheme(palette), {});
});

test("per-role fill: only the omitted roles are filled", () => {
  const palette = { "--paper": "#121210", "--syntax-keyword": "#ff0000" };
  const out = deriveSyntaxTokensForTheme(palette);
  assert.ok(!("--syntax-keyword" in out), "a defined role is left alone");
  assert.equal(Object.keys(out).length, SYNTAX_TOKENS.length - 1);
});

test("no --paper → no derivation", () => {
  assert.deepEqual(deriveSyntaxTokensForTheme({}), {});
});
