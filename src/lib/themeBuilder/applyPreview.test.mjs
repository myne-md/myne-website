import { test } from "node:test";
import assert from "node:assert/strict";

import { applyPalette } from "./applyPreview.mjs";

/** A CSSStyleDeclaration-shaped stub that records setProperty calls. */
function stubTarget() {
  const calls = [];
  return { calls, setProperty: (k, v) => calls.push([k, v]) };
}

test("applyPalette applies allowlist-passing values", () => {
  const t = stubTarget();
  applyPalette(t, { "--accent": "#123456", "--paper": "#ffffff" });
  assert.deepEqual(t.calls, [["--accent", "#123456"], ["--paper", "#ffffff"]]);
});

test("applyPalette NEVER applies a value that fails the allowlist", () => {
  const t = stubTarget();
  applyPalette(t, {
    "--accent": "url(https://evil.example/x.png)",
    "--paper": "expression(alert(1))",
    "--ink-1": "#101010", // the only valid one
    "--line-1": "var(--x)",
  });
  assert.deepEqual(t.calls, [["--ink-1", "#101010"]]);
});

test("applyPalette tolerates a null/empty target or palette", () => {
  assert.doesNotThrow(() => applyPalette(null, { "--accent": "#111111" }));
  assert.doesNotThrow(() => applyPalette(stubTarget(), null));
});
