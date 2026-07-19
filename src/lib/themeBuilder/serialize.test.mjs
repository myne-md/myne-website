import { test } from "node:test";
import assert from "node:assert/strict";

import { buildThemeJson, buildMetaJson, canExport } from "./serialize.mjs";
import { isAllowedValue, missingRequired } from "./validator.mjs";
import { LIGHT_DEFAULTS, REQUIRED_TOKENS, ALL_TOKENS } from "./tokens.mjs";

test("buildThemeJson emits canonical tokens only, key-sorted, all allowlist-valid", () => {
  const dirty = { ...LIGHT_DEFAULTS, "--not-a-token": "#000000", "--blank": "" };
  const theme = buildThemeJson(dirty);
  const keys = Object.keys(theme);
  // no stray/blank keys
  assert.ok(!keys.includes("--not-a-token"));
  assert.ok(!keys.includes("--blank"));
  keys.forEach((k) => assert.ok(ALL_TOKENS.includes(k), `${k} not canonical`));
  // deterministic order
  assert.deepEqual(keys, [...keys].sort());
  // the result passes the vendored validator (stand-in for the Rust validate binary)
  assert.deepEqual(missingRequired(theme), []);
  Object.values(theme).forEach((v) => assert.ok(isAllowedValue(v)));
});

test("buildMetaJson fixes CC-BY-4.0, trims, and takes appearance from the preview", () => {
  const meta = buildMetaJson({ name: "  Nord Dusk ", author: "Ada ", description: " Calm blues " }, "dark");
  assert.deepEqual(meta, {
    name: "Nord Dusk",
    author: "Ada",
    description: "Calm blues",
    license: "CC-BY-4.0",
    appearance: "dark",
  });
  // appearance omitted when not light|dark
  assert.equal("appearance" in buildMetaJson({ name: "x", author: "y", description: "z" }, undefined), false);
});

test("canExport blocks until all 21 required tokens are present", () => {
  assert.deepEqual(canExport(LIGHT_DEFAULTS), { ok: true, missing: [] });
  const { ["--accent"]: _drop, ...missingAccent } = LIGHT_DEFAULTS;
  const res = canExport(missingAccent);
  assert.equal(res.ok, false);
  assert.deepEqual(res.missing, ["--accent"]);
  // sanity: the gate is over exactly the 21 required
  assert.equal(canExport({}).missing.length, REQUIRED_TOKENS.length);
});
