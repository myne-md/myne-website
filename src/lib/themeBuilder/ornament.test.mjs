// The ornament vocabulary + its effect on the exported theme (myne#394).

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PRIMITIVES,
  PRESETS,
  ROLES,
  allOrnamentTokens,
  ornamentToken,
  primitivesForRole,
  roleAccepts,
} from "./ornament.mjs";
import { buildThemeJson } from "./serialize.mjs";

test("token naming matches the shape the app parses", () => {
  assert.equal(ornamentToken("box", "frame"), "--box-frame");
  // The matrix is SPARSE — a role takes the primitives that mean something for
  // what it is, so this is the sum of the table's rows rather than a product.
  // Offering the full grid meant controls for a dog-eared button and a
  // perforated tab, which the app now classifies as unknown keys.
  const expected = ROLES.reduce((n, r) => n + primitivesForRole(r.id).length, 0);
  assert.equal(allOrnamentTokens().length, expected);
  assert.ok(expected < ROLES.length * PRIMITIVES.length, "the matrix should be sparse");
});

test("each role offers only the primitives it accepts", () => {
  assert.deepEqual(primitivesForRole("chrome").map((p) => p.id), ["frame", "shadow", "texture"]);
  assert.equal(primitivesForRole("box").length, PRIMITIVES.length, "box takes the full set");
  assert.equal(roleAccepts("surface", "ribbon"), false, "a page does not wear a label");
  assert.equal(roleAccepts("chrome", "fold"), false, "a button has no dog-ear");
});

test("every preset only sets primitives its own role accepts", () => {
  // A preset writing a key the role does not take would author a setting the
  // app stores and ignores — with a friendly button on it.
  for (const preset of PRESETS) {
    for (const primitive of Object.keys(preset.set)) {
      assert.ok(
        roleAccepts(preset.role, primitive),
        `preset ${preset.id} sets ${primitive} on ${preset.role}, which does not accept it`,
      );
    }
  }
});

test("every control offers a way to draw nothing", () => {
  // A theme must always be able to say "no ornament here", or a user who picks
  // a preset can never fully undo it.
  for (const p of PRIMITIVES) {
    const offs = p.values.filter((v) => v.value === "none" || v.value === "plain");
    assert.equal(offs.length, 1, `${p.id} has no off value`);
  }
});

test("no value carries a hyphen — the app's allowlist cannot express one", () => {
  for (const p of PRIMITIVES) {
    for (const v of p.values) assert.match(v.value, /^[a-z]+$/, `${p.id}=${v.value}`);
  }
});

test("every preset names a real role and only real primitives/values", () => {
  for (const preset of PRESETS) {
    assert.ok(ROLES.some((r) => r.id === preset.role), `${preset.id}: unknown role`);
    for (const [primitive, value] of Object.entries(preset.set)) {
      const p = PRIMITIVES.find((x) => x.id === primitive);
      assert.ok(p, `${preset.id}: unknown primitive ${primitive}`);
      assert.ok(p.values.some((v) => v.value === value), `${preset.id}: ${primitive}=${value}`);
    }
  }
});

test("a preset can be fully undone by the plain preset", () => {
  const plain = PRESETS.find((p) => p.id === "plain");
  assert.ok(plain);
  for (const p of PRIMITIVES) {
    assert.ok(p.id in plain.set, `plain preset does not reset ${p.id}`);
  }
});

test("export carries ornament and omits the no-op values that are truly no-ops", () => {
  const out = buildThemeJson({
    "--paper": "#ffffff",
    "--box-frame": "thick",
    // A pseudo-element primitive: nothing inherits, so `none` really is what an
    // absent key already means and writing it is noise.
    "--box-texture": "none",
    // …but `shadow` writes an INHERITING slot, so its `none` is an instruction
    // ("no shadow on the boxes inside this framed surface") that an absent key
    // cannot carry. This test used to assert it was dropped, which deleted the
    // escape hatch `ornaments.css` grew per-role reset rules for.
    "--box-shadow": "none",
    "--surface-texture": "scanline",
  });
  assert.equal(out["--box-frame"], "thick");
  assert.equal(out["--surface-texture"], "scanline");
  assert.ok(!("--box-texture" in out), "a pseudo-element `none` should be omitted");
  assert.equal(out["--box-shadow"], "none", "an inheriting `none` must survive export");
  assert.equal(out["--paper"], "#ffffff");
});

test("a colour-only theme is unchanged by the vocabulary existing", () => {
  // The compatibility promise: themes authored before ornament existed must
  // serialize byte-identically.
  const before = { "--paper": "#ffffff", "--ink-1": "#111111" };
  assert.deepEqual(buildThemeJson(before), before);
});
