import { test } from "node:test";
import assert from "node:assert/strict";

import { slugify, slugCollides, isShareableSlug } from "./slug.mjs";

test("slugify: lowercase, hyphenated, ascii-folded, trimmed", () => {
  assert.equal(slugify("Nord Dusk"), "nord-dusk");
  assert.equal(slugify("  Café Noir!! "), "cafe-noir");
  assert.equal(slugify("dracula"), "dracula");
  assert.equal(slugify("Tokyo   Night 2"), "tokyo-night-2");
  assert.equal(slugify("--weird--"), "weird");
  assert.equal(slugify(""), "");
  assert.equal(slugify(undefined), "");
});

test("slugify: non-Latin / emoji names fold to an empty (non-shareable) slug", () => {
  for (const name of ["日本語", "Привет", "こんにちは", "🎨🎨"]) {
    assert.equal(slugify(name), "", `${name} should fold to ""`);
    assert.equal(isShareableSlug(slugify(name)), false, `${name} should not be shareable`);
  }
});

test("isShareableSlug: true only for a non-empty ascii slug", () => {
  assert.equal(isShareableSlug("nord-dusk"), true);
  assert.equal(isShareableSlug(slugify("Café Noir")), true);
  assert.equal(isShareableSlug(""), false);
  assert.equal(isShareableSlug(slugify("日本語")), false);
});

test("slugCollides: matches an already-published slug (offline)", () => {
  const existing = ["dracula", "nord", "gruvbox-dark"];
  assert.equal(slugCollides("dracula", existing), true);
  assert.equal(slugCollides("nord-dusk", existing), false);
});
