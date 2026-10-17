#!/usr/bin/env node
// The website's NOTICE makes three claims, and two of them are about the tree
// rather than about the notice. Both kinds rot the same way: a font is added and
// nobody adds a row, or a component asks for `client:` and the sentence "no
// framework runtime ships" quietly becomes false while the file keeps reading
// as a complete notice.
//
// This is the website's own `node --test` convention rather than a script in the
// application repo, because every fact here is a fact about this repository.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const NOTICE = readFileSync("NOTICE", "utf8");

test("the notice names both bundled fonts and points at their licence", () => {
  for (const font of ["Inter", "JetBrains Mono"]) {
    assert.ok(NOTICE.includes(font), `NOTICE does not name the bundled font ${font}`);
  }
  assert.ok(NOTICE.includes("public/fonts/OFL.txt"), "NOTICE does not point at the OFL text");
});

test("the OFL text it points at exists and carries both copyright lines", () => {
  const path = "public/fonts/OFL.txt";
  assert.ok(existsSync(path), `${path} is missing, so the notice points at nothing`);
  const ofl = readFileSync(path, "utf8");
  assert.ok(ofl.includes("The Inter Project Authors"), "no Inter copyright line in the OFL text");
  assert.ok(
    ofl.includes("The JetBrains Mono Project Authors"),
    "no JetBrains Mono copyright line in the OFL text",
  );
  assert.ok(ofl.includes("SIL OPEN FONT LICENSE Version 1.1"), "not an OFL-1.1 text");
});

test("no Astro island ships a hydration runtime, which is what the notice claims", () => {
  // `client:*` is the whole of the claim: Astro emits its client runtime only for
  // a component that asks for it. A directive appearing here is the moment the
  // "no framework runtime" paragraph stops being true.
  const files = readdirSync("src", { recursive: true, encoding: "utf8" }).filter((f) =>
    /\.(astro|ts|tsx|js|mjs)$/.test(f),
  );
  assert.ok(files.length > 50, `the src scan read ${files.length} file(s); expected the whole tree`);
  const offenders = files.filter((f) => readFileSync(`src/${f}`, "utf8").includes("client:"));
  assert.deepEqual(offenders, [], "an island now hydrates; NOTICE owes its runtime's licence");
});

test("the build actually ships the notice into the artefact", () => {
  const build = readFileSync("package.json", "utf8");
  assert.ok(
    build.includes("scripts/ship-notice.mjs"),
    "the build script no longer copies NOTICE into dist/, so the deployed site carries none",
  );
});
