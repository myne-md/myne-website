import { test } from "node:test";
import assert from "node:assert/strict";

import { isAllowedValue, missingRequired, invalidValues, contrastReport } from "./validator.mjs";
import { contrastRatio } from "./contrast.mjs";
import { LIGHT_DEFAULTS } from "./tokens.mjs";

// Accept/reject vectors transcribed verbatim from theme-validator/src/value.rs
// tests (accepts_every_valid_value_shape + rejects_every_injection_class). This
// is the drift tripwire: the JS port must return the SAME verdict as the Rust.
const ACCEPT = [
  "#fff", "#ffff", "#a1b2c3", "#a1b2c3d4",
  "rgb(12, 34, 56)", "rgba(0,0,0,0.5)", "hsl(210, 50%, 40%)", "hsla(210 50% 40% / 0.5)",
  "red", "transparent", "currentColor",
  "0", "12px", "0.5rem", "100%", "-2em",
];
const REJECT = [
  "url(evil.png)", "url('x')", "expression(alert(1))", 'red; @import "x"',
  "javascript:alert(1)", "@import url(x)", "#fff;}", "rgb(0,0,0);x", "rgb(0,0,0",
  "rgb(0,0,url(x))", "\\75rl(x)", "/* */red", "red/**/", "calc(1px + 2px)",
  "var(--x)", "#ffggff", "#12345", "", "  ",
];

test("isAllowedValue accepts every valid value shape (matches value.rs)", () => {
  for (const v of ACCEPT) assert.equal(isAllowedValue(v), true, `should accept ${JSON.stringify(v)}`);
});

test("isAllowedValue rejects every injection class (matches value.rs)", () => {
  for (const v of REJECT) assert.equal(isAllowedValue(v), false, `should reject ${JSON.stringify(v)}`);
});

test("missingRequired: [] for a complete palette, exact missing key otherwise", () => {
  assert.deepEqual(missingRequired(LIGHT_DEFAULTS), []);
  const { ["--accent"]: _drop, ...withoutAccent } = LIGHT_DEFAULTS;
  assert.deepEqual(missingRequired(withoutAccent), ["--accent"]);
  // present-but-empty counts as missing (the builder gate must not pass a blank).
  assert.deepEqual(missingRequired({ ...LIGHT_DEFAULTS, "--paper": "" }), ["--paper"]);
});

test("invalidValues flags a poisoned value by token, none for a clean palette", () => {
  assert.deepEqual(invalidValues(LIGHT_DEFAULTS), []);
  const poisoned = { ...LIGHT_DEFAULTS, "--accent": "url(evil.png)" };
  assert.deepEqual(invalidValues(poisoned), [{ token: "--accent", value: "url(evil.png)" }]);
});

test("contrastReport: canonical light palette passes all 5 rules; ink≈paper fails", () => {
  const good = contrastReport(LIGHT_DEFAULTS);
  assert.equal(good.ok, true, `canon light should pass: ${good.errors.join("; ")}`);

  // Unreadable: primary/secondary/display ink set near paper.
  const bad = contrastReport({
    ...LIGHT_DEFAULTS,
    "--ink-0": "#f8f8f7", "--ink-1": "#f7f7f6", "--ink-2": "#f6f6f5", "--accent": "#f5f5f4",
  });
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.length >= 4, "each low-contrast pair should report");
});

test("vendored contrast.mjs matches WCAG anchors", () => {
  assert.ok(Math.abs(contrastRatio("#000000", "#ffffff") - 21) < 0.1);
  assert.ok(Math.abs(contrastRatio("#123456", "#123456") - 1) < 0.001);
  assert.equal(contrastRatio("not-hex", "#fff"), null);
});
