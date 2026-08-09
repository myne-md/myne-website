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

test("the export carries measure and tint tokens, and omits the unset ones", () => {
  // All three optional families (ornament, tint, measure) travel in the same
  // flat map the app already reads. A theme that sets none of them must be
  // byte-identical to one authored before the vocabulary existed — which is what
  // lets an older client open a newer theme and simply ignore what it does not
  // know (`decisions.md` 2026-08-06).
  const theme = buildThemeJson({
    ...LIGHT_DEFAULTS,
    "--radius-2": "12px",
    "--text-base": "18px",
    "--tint": "#7a4a1f",
    "--tint-strength": "0.14",
    "--box-frame": "thick",
    // The builder writes "" for a control sitting at its default — an absent key
    // and a key holding the built-in value mean the same thing to the app.
    "--space-4": "",
    // `shadow` writes an INHERITING slot, so its `none` is an instruction the
    // absence of a key cannot carry — see the dedicated test below.
    "--box-shadow": "none",
    // …whereas a pseudo-element primitive's `none` is genuinely what absent
    // already means.
    "--box-texture": "none",
  });
  assert.equal(theme["--radius-2"], "12px");
  assert.equal(theme["--text-base"], "18px");
  assert.equal(theme["--tint"], "#7a4a1f");
  assert.equal(theme["--tint-strength"], "0.14");
  assert.equal(theme["--box-frame"], "thick");
  assert.equal("--space-4" in theme, false, "a default-valued control writes nothing");
  assert.equal(theme["--box-shadow"], "none", "an inheriting `none` is an instruction");
  assert.equal("--box-texture" in theme, false, "a pseudo-element `none` means absent");

  // A colour-only theme stays exactly what it was.
  assert.deepEqual(buildThemeJson(LIGHT_DEFAULTS), buildThemeJson({ ...LIGHT_DEFAULTS }));
});

test("keeps `none` for the two primitives that INHERIT, drops it for the rest", () => {
  // `frame` and `shadow` write inheriting slots, so `--box-frame: none` is the
  // documented escape hatch for "a frame on panels but not on the rows inside
  // them". Dropping it here deleted that instruction on the way out: the author
  // saw it work in the preview and shipped a file that could not express it.
  const out = buildThemeJson({
    "--box-frame": "none",
    "--chrome-shadow": "none",
    // These paint on a pseudo-element — nothing inherits, so absent and `none`
    // really are the same and the key is noise.
    "--box-texture": "none",
    "--surface-edge": "plain",
    "--surface-ruled": "none",
  });
  assert.equal(out["--box-frame"], "none");
  assert.equal(out["--chrome-shadow"], "none");
  assert.equal(out["--box-texture"], undefined);
  assert.equal(out["--surface-edge"], undefined);
  assert.equal(out["--surface-ruled"], undefined);
});

test("keeps an explicit zero tint strength, because absent means 8% and not off", () => {
  // The stylesheet composes `min(var(--tint-strength, 0.08), var(--_o-ceiling))`.
  const out = buildThemeJson({ "--tint": "#ff0000", "--tint-strength": "0" });
  assert.equal(out["--tint-strength"], "0");
});
