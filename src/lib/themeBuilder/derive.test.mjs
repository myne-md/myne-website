import { test } from "node:test";
import assert from "node:assert/strict";

import { deriveAll, deriveHelpers, helpersForBase } from "./derive.mjs";
import { LIGHT_DEFAULTS } from "./tokens.mjs";
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

test("helpersForBase covers the neutral ramps, not just the accent family", () => {
  // Surfaces: panels and hover surfaces sit below the page colour.
  const paper = helpersForBase("--paper", "#fbfbfa", false);
  assert.deepEqual(Object.keys(paper), ["--paper-2", "--paper-3"]);
  for (const v of Object.values(paper)) assert.match(v, HEX6);
  assert.notEqual(paper["--paper-2"], "#fbfbfa");

  // Ink: headings push past the body colour: measured as more contrast against
  // the page, in BOTH appearances.
  const ink0 = helpersForBase("--ink-1", "#1a1a17", false, { "--paper": "#fbfbfa" })["--ink-0"];
  assert.ok(
    (contrastRatio(ink0, "#fbfbfa") ?? 0) > (contrastRatio("#1a1a17", "#fbfbfa") ?? 0),
    `headings should out-contrast body text, got ${ink0}`,
  );
  const darkInk = helpersForBase("--ink-1", "#e2daf8", true, { "--paper": "#282a36" })["--ink-0"];
  assert.ok(
    (contrastRatio(darkInk, "#282a36") ?? 0) > (contrastRatio("#e2daf8", "#282a36") ?? 0),
    `headings should out-contrast body text on a dark theme, got ${darkInk}`,
  );

  // Lines are `blend-to` rules, so they need the palette they blend toward.
  const withPalette = helpersForBase("--line-1", "#e3e2dd", false, { "--ink-3": "#6b6a64" });
  assert.match(withPalette["--line-2"], HEX6);
  assert.notEqual(withPalette["--line-2"], withPalette["--line-3"]);
  // Without the target token the rule degrades to the anchor rather than
  // inventing a neighbour.
  assert.equal(helpersForBase("--line-1", "#e3e2dd", false, {})["--line-2"], "#e3e2dd");
});

test("helpersForBase returns {} for a standalone token", () => {
  assert.deepEqual(helpersForBase("--syntax-keyword", "#7a3b8c", false), {});
  assert.deepEqual(helpersForBase("--paper" === "" ? "" : "--label-plum", "#7e4d76", false), {});
});

test("deriveAll honours the pinned set: a pinned shade stops following its anchor", () => {
  const palette = { "--paper": "#fbfbfa", "--ink-1": "#1a1a17", "--line-1": "#e3e2dd", "--ink-3": "#6b6a64" };
  const all = deriveAll(palette, false);
  assert.ok("--paper-2" in all && "--ink-0" in all && "--line-3" in all);

  const pinned = deriveAll(palette, false, ["--paper-2"]);
  assert.ok(!("--paper-2" in pinned));
  assert.ok("--paper-3" in pinned);
});


/** Rough luminance, enough to state a direction. */
const luma = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
};

test("the panel ramp derives BELOW the page, which is a builder default and not a law of the gallery", () => {
  // The light canon.
  const light = helpersForBase("--paper", LIGHT_DEFAULTS["--paper"], false);
  assert.ok(luma(light["--paper-2"]) < luma(LIGHT_DEFAULTS["--paper"]));
  assert.ok(luma(light["--paper-3"]) < luma(light["--paper-2"]));
  // A shipped dark theme whose panels are also darker than its page (Dracula).
  // Five of the twelve gallery themes go the other way, which is why the rule's
  // header says "default" rather than "every theme": this test pins the
  // direction the rule promises on the cases it claims, not a universal.
  const dracula = helpersForBase("--paper", "#282a36", true);
  assert.ok(luma(dracula["--paper-2"]) < luma("#282a36"));
  assert.ok(luma(dracula["--paper-3"]) < luma(dracula["--paper-2"]));
});
