import { test } from "node:test";
import assert from "node:assert/strict";

import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb, hexToHsv, hsvToHex, normalizeHex } from "./colorPicker.mjs";

test("hexToRgb parses 3- and 6-digit; rejects junk", () => {
  assert.deepEqual(hexToRgb("#ff0000"), [255, 0, 0]);
  assert.deepEqual(hexToRgb("#f00"), [255, 0, 0]);
  assert.deepEqual(hexToRgb("8aa4d0"), [138, 164, 208]);
  assert.equal(hexToRgb("nope"), null);
  assert.equal(hexToRgb("#12"), null);
});

test("rgbToHex clamps + zero-pads", () => {
  assert.equal(rgbToHex(255, 0, 0), "#ff0000");
  assert.equal(rgbToHex(300, -5, 16), "#ff0010");
});

test("rgbToHsv known anchors", () => {
  assert.deepEqual(rgbToHsv(255, 0, 0), { h: 0, s: 1, v: 1 });
  assert.deepEqual(rgbToHsv(0, 0, 0), { h: 0, s: 0, v: 0 });
  assert.deepEqual(rgbToHsv(255, 255, 255), { h: 0, s: 0, v: 1 });
  const green = rgbToHsv(0, 128, 0);
  assert.ok(Math.abs(green.h - 120) < 0.5);
});

test("hsvToRgb known anchors", () => {
  assert.deepEqual(hsvToRgb(0, 1, 1).map(Math.round), [255, 0, 0]);
  assert.deepEqual(hsvToRgb(240, 1, 1).map(Math.round), [0, 0, 255]);
  assert.deepEqual(hsvToRgb(0, 0, 1).map(Math.round), [255, 255, 255]);
});

test("hex → hsv → hex round-trips for real theme colors", () => {
  for (const c of ["#8aa4d0", "#2c4a7a", "#282a36", "#d65d0e", "#fbfbfa", "#0b0b09"]) {
    const { h, s, v } = hexToHsv(c);
    assert.equal(hsvToHex(h, s, v), c, `round-trip failed for ${c}`);
  }
});

test("normalizeHex expands + lowercases, rejects invalid", () => {
  assert.equal(normalizeHex("#FFF"), "#ffffff");
  assert.equal(normalizeHex("8AA4D0"), "#8aa4d0");
  assert.equal(normalizeHex("#8aa4d0"), "#8aa4d0");
  assert.equal(normalizeHex("xyz"), null);
  assert.equal(normalizeHex("#12g"), null);
});
