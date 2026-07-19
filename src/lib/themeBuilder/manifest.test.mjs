import { test } from "node:test";
import assert from "node:assert/strict";

import { GROUPS, MANIFEST_TOKENS, HELPER_TOKENS, labelFor } from "./manifest.mjs";
import { ALL_TOKENS } from "./tokens.mjs";

const ALIAS_TOKENS = [
  "--bg-1", "--bg-2", "--bg-3", "--fg-1", "--fg-2", "--fg-3", "--fg-display", "--info", "--info-soft",
];

test("manifest covers all 44 canonical tokens, each exactly once", () => {
  assert.equal(MANIFEST_TOKENS.length, 44);
  assert.equal(new Set(MANIFEST_TOKENS).size, 44);
  assert.deepEqual(new Set(MANIFEST_TOKENS), new Set(ALL_TOKENS));
});

test("no derived alias appears in the manifest", () => {
  for (const alias of ALIAS_TOKENS) {
    assert.ok(!MANIFEST_TOKENS.includes(alias), `${alias} must not be in the manifest`);
  }
});

test("every token carries a human label with no raw token name", () => {
  for (const g of GROUPS) {
    assert.ok(g.label && !g.label.includes("--"), `group ${g.id} label leaks a token`);
    for (const t of g.tokens) {
      assert.ok(t.label && !t.label.includes("--"), `${t.token} label leaks a token name`);
    }
  }
});

test("progressive-disclosure flags: syntax/labels/highlights collapse, others don't", () => {
  const byId = Object.fromEntries(GROUPS.map((g) => [g.id, g.disclosure]));
  assert.equal(byId.syntax, true);
  assert.equal(byId.labels, true);
  assert.equal(byId.highlights, true);
  for (const id of ["background", "text", "borders", "accent", "status"]) {
    assert.equal(byId[id], false, `${id} should be always-visible`);
  }
});

test("helper-shade flags cover accent hover/press/soft/on + the three status softs", () => {
  const expected = [
    "--accent-hover", "--accent-press", "--accent-soft", "--accent-on",
    "--danger-soft", "--warning-soft", "--success-soft",
  ];
  assert.deepEqual(new Set(HELPER_TOKENS), new Set(expected));
  // every helper names a base it derives from, and that base is a real token
  for (const g of GROUPS) {
    for (const t of g.tokens) {
      if (t.helper) {
        assert.ok(t.derivesFrom && ALL_TOKENS.includes(t.derivesFrom), `${t.token} bad derivesFrom`);
        assert.ok(!HELPER_TOKENS.includes(t.derivesFrom), `${t.token} derives from another helper`);
      }
    }
  }
});

test("labelFor returns the human label for a token", () => {
  assert.equal(labelFor("--accent"), "Accent color");
  assert.equal(labelFor("--paper"), "Page background");
  assert.equal(labelFor("--nope"), undefined);
});
