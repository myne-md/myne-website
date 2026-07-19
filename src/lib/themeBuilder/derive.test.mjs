import { test } from "node:test";
import assert from "node:assert/strict";

import { deriveHelpers, helpersForBase } from "./derive.mjs";
import { contrastRatio } from "./contrast.mjs";

const HEX6 = /^#[0-9a-f]{6}$/i;

test("deriveHelpers yields valid #rrggbb for hover/press/soft/on", () => {
  const d = deriveHelpers("#2c4a7a", false);
  for (const k of ["hover", "press", "soft", "on"]) {
    assert.match(d[k], HEX6, `${k} not hex`);
  }
  // a dark base gets light on-text
  assert.equal(d.on, "#ffffff");
  // a light base gets dark on-text
  assert.equal(deriveHelpers("#f2f2f0", false).on, "#0b0b09");
});

test("deriveHelpers on-text picks the higher-contrast of light/dark (mid-tone accents)", () => {
  // Mid-tone accents where a fixed luminance threshold mis-picked white even
  // though black has strictly more WCAG contrast (some below AA 4.5).
  for (const base of ["#268bd2", "#6f8f2a", "#3a8f6a", "#0f8f8f", "#2f8f6f"]) {
    const { on } = deriveHelpers(base, false);
    const other = on === "#ffffff" ? "#0b0b09" : "#ffffff";
    assert.ok(
      contrastRatio(base, on) >= contrastRatio(base, other),
      `${base}: chose ${on} (${contrastRatio(base, on).toFixed(2)}) over ${other} (${contrastRatio(base, other).toFixed(2)})`,
    );
  }
  // Solarized's own accent: black wins (white 3.68 fails AA, black 5.35).
  assert.equal(deriveHelpers("#268bd2", false).on, "#0b0b09");
});

test("helpersForBase maps accent → its 4 helpers, danger → its soft", () => {
  const a = helpersForBase("--accent", "#2c4a7a", false);
  assert.deepEqual(new Set(Object.keys(a)), new Set(["--accent-hover", "--accent-press", "--accent-soft", "--accent-on"]));
  for (const v of Object.values(a)) assert.match(v, HEX6);

  const d = helpersForBase("--danger", "#8a2a23", false);
  assert.deepEqual(Object.keys(d), ["--danger-soft"]);
  assert.match(d["--danger-soft"], HEX6);
});

test("helpersForBase returns {} for a non-base token", () => {
  assert.deepEqual(helpersForBase("--paper", "#ffffff", false), {});
  assert.deepEqual(helpersForBase("--syntax-keyword", "#7a3b8c", false), {});
});

