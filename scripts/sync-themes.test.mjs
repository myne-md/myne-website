import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { collectFullPalettes } from "./lib-theme-palettes.mjs";

test("collectFullPalettes reads each theme.json into { slug: palette }", () => {
  const root = mkdtempSync(join(tmpdir(), "mt-"));
  try {
    mkdirSync(join(root, "themes", "foo"), { recursive: true });
    writeFileSync(
      join(root, "themes", "foo", "theme.json"),
      JSON.stringify({ "--paper": "#111111", "--accent": "#8aa4d0" }),
    );
    mkdirSync(join(root, "themes", "bar"), { recursive: true }); // no theme.json → skipped
    const got = collectFullPalettes(root);
    assert.deepEqual(got, { foo: { "--paper": "#111111", "--accent": "#8aa4d0" } });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("collectFullPalettes skips a malformed theme.json rather than throw", () => {
  const root = mkdtempSync(join(tmpdir(), "mt-"));
  try {
    mkdirSync(join(root, "themes", "good"), { recursive: true });
    writeFileSync(join(root, "themes", "good", "theme.json"), JSON.stringify({ "--paper": "#000000" }));
    mkdirSync(join(root, "themes", "broken"), { recursive: true });
    writeFileSync(join(root, "themes", "broken", "theme.json"), "{ not json");
    const got = collectFullPalettes(root);
    assert.deepEqual(Object.keys(got), ["good"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("collectFullPalettes returns {} when the source is absent (graceful build)", () => {
  assert.deepEqual(collectFullPalettes(join(tmpdir(), "definitely-not-here-xyz-123")), {});
});
