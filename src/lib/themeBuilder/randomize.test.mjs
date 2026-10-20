import { test } from "node:test";
import assert from "node:assert/strict";

import { familyOf, randomValueFor, randomizePalette } from "./randomize.mjs";
import {
  ALL_TOKENS,
  DARK_DEFAULTS,
  LIGHT_DEFAULTS,
  SYNTAX_TOKENS,
  LABEL_TOKENS,
  HIGHLIGHT_TOKENS,
} from "./tokens.mjs";

const HEX6 = /^#[0-9a-f]{6}$/i;

/** A tiny LCG so a test can pin the sequence a roll walks. */
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Rough relative luminance, enough for the envelope assertions below. */
const luma = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
};

test("familyOf maps every canonical token to a known family", () => {
  assert.equal(familyOf("--paper-2"), "surface");
  assert.equal(familyOf("--ink-3"), "text");
  assert.equal(familyOf("--line-2"), "line");
  assert.equal(familyOf("--accent-soft"), "accent");
  assert.equal(familyOf("--danger-soft"), "danger");
  assert.equal(familyOf("--syntax-keyword"), "syntax");
  assert.equal(familyOf("--label-plum"), "label");
  assert.equal(familyOf("--highlight-blue"), "highlight");
  for (const token of ALL_TOKENS) {
    assert.notEqual(familyOf(token), "other", `${token} has no family`);
  }
});

test("randomValueFor yields a valid #rrggbb for every canonical token", () => {
  for (const token of ALL_TOKENS) {
    const v = randomValueFor(token, { rand: seeded(7), hue: 210 });
    assert.match(v, HEX6, `${token} → ${v}`);
  }
});

test("randomValueFor keeps each family inside its envelope", () => {
  // A highlight is read THROUGH by dark text, so it stays light even for a dark
  // theme; a surface in light mode is near-white and in dark mode near-black.
  assert.ok(luma(randomValueFor("--highlight", { rand: seeded(3), hue: 300 })) > 180);
  assert.ok(luma(randomValueFor("--paper", { rand: seeded(3), isDark: true, hue: 300 })) < 80);
  assert.ok(luma(randomValueFor("--paper", { rand: seeded(3), hue: 300 })) > 200);
});

test("randomValueFor picks on-text by contrast, never at random", () => {
  const white = randomValueFor("--accent-on", { palette: { "--accent": "#101010" }, rand: seeded(1) });
  const black = randomValueFor("--accent-on", { palette: { "--accent": "#fbfbfa" }, rand: seeded(1) });
  assert.equal(white, "#ffffff");
  assert.equal(black, "#0b0b09");
});

test("randomizePalette fills every canonical token with a valid hex", () => {
  const palette = randomizePalette({ rand: seeded(11) });
  for (const token of ALL_TOKENS) {
    assert.match(palette[token] ?? "", HEX6, `${token} missing from the roll`);
  }
  // The optional families are rolled too, not left at the light defaults.
  for (const token of [...SYNTAX_TOKENS, ...LABEL_TOKENS, ...HIGHLIGHT_TOKENS]) {
    assert.match(palette[token], HEX6);
  }
});

test("randomizePalette materialises the derivations instead of leaving a family half-filled", () => {
  const palette = randomizePalette({ rand: seeded(23) });
  // Asserted against the BASE the roll started from, not against a neighbouring
  // rolled token. The previous version compared rolled values to each other,
  // which passed with `deriveAll` deleted from the return: an underived
  // `--paper-2` falls back to the base palette's own panel colour, and that is
  // simply a different string from the freshly rolled page colour. A test that
  // passes with the defect injected is not coverage.
  assert.notEqual(palette["--paper-2"], LIGHT_DEFAULTS["--paper-2"]);
  assert.notEqual(palette["--paper-3"], LIGHT_DEFAULTS["--paper-3"]);
  assert.notEqual(palette["--accent-soft"], LIGHT_DEFAULTS["--accent-soft"]);
  assert.notEqual(palette["--ink-2"], LIGHT_DEFAULTS["--ink-2"]);

  // The dark roll derives against the dark base, which is the other half of the
  // same claim.
  const dark = randomizePalette({ isDark: true, rand: seeded(23) });
  assert.notEqual(dark["--paper-2"], DARK_DEFAULTS["--paper-2"]);
  assert.notEqual(dark["--ink-2"], DARK_DEFAULTS["--ink-2"]);
});

test("randomizePalette is deterministic for a given sequence", () => {
  const a = randomizePalette({ rand: seeded(99) });
  const b = randomizePalette({ rand: seeded(99) });
  assert.deepEqual(a, b);
  const c = randomizePalette({ rand: seeded(100) });
  assert.notDeepEqual(a, c);
});
