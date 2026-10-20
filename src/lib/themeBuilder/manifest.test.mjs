import { test } from "node:test";
import assert from "node:assert/strict";

import { GROUPS, MANIFEST_TOKENS, HELPER_TOKENS, DERIVATIONS, anchorFor, labelFor } from "./manifest.mjs";
import { ALL_TOKENS } from "./tokens.mjs";

const ALIAS_TOKENS = [
  "--bg-1", "--bg-2", "--bg-3", "--fg-1", "--fg-2", "--fg-3", "--fg-display", "--info", "--info-soft",
];

test("manifest covers all 52 canonical tokens, each exactly once", () => {
  assert.equal(MANIFEST_TOKENS.length, 52);
  assert.equal(new Set(MANIFEST_TOKENS).size, 52);
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

test("progressive-disclosure flags: syntax/labels/highlights collapse, the tone families don't", () => {
  const byId = Object.fromEntries(GROUPS.map((g) => [g.id, g.disclosure]));
  assert.equal(byId.syntax, true);
  assert.equal(byId.labels, true);
  assert.equal(byId.highlights, true);
  // The tone families are the panel's spine: always open.
  for (const id of ["surface", "ink", "line", "accent", "status"]) {
    assert.equal(byId[id], false, `${id} should be always-visible`);
  }
});

test("helper-shade flags cover the ramps and the accent/status families", () => {
  const expected = [
    // neutral ramps
    "--paper-2", "--paper-3", "--ink-0", "--ink-2", "--ink-3", "--line-2", "--line-3",
    // accent + status
    "--accent-hover", "--accent-press", "--accent-soft", "--accent-on",
    "--danger-soft", "--warning-soft", "--success-soft",
  ];
  assert.deepEqual(new Set(HELPER_TOKENS), new Set(expected));
  // every helper names an anchor it derives from, that anchor is a real token,
  // is inside the SAME group, and is not itself a helper
  for (const g of GROUPS) {
    for (const t of g.tokens) {
      if (!t.helper) continue;
      assert.ok(t.derivesFrom && ALL_TOKENS.includes(t.derivesFrom), `${t.token} bad derivesFrom`);
      assert.ok(!HELPER_TOKENS.includes(t.derivesFrom), `${t.token} derives from another helper`);
      assert.ok(
        g.tokens.some((s) => s.token === t.derivesFrom),
        `${t.token} derives from ${t.derivesFrom}, which lives in another group`,
      );
    }
  }
});

test("every group that has helpers names the anchor it is driven from", () => {
  for (const g of GROUPS) {
    const helpers = g.tokens.filter((t) => t.helper);
    const anchors = g.tokens.filter((t) => t.anchor);
    if (helpers.length) {
      assert.ok(anchors.length > 0, `${g.id} has helpers and no anchor`);
    }
    // An anchor is never also a helper, and every group's tokens are unique.
    assert.equal(new Set(g.tokens.map((t) => t.token)).size, g.tokens.length, `${g.id} repeats a token`);
    for (const a of anchors) assert.ok(!a.helper, `${a.token} is both anchor and helper`);
  }
  assert.deepEqual(new Set(DERIVATIONS["--accent"]), new Set(["--accent-hover", "--accent-press", "--accent-soft", "--accent-on"]));
  assert.equal(anchorFor("--paper-2"), "--paper");
  assert.equal(anchorFor("--paper"), undefined);
});

test("labelFor returns the human label for a token", () => {
  assert.equal(labelFor("--accent"), "Accent color");
  assert.equal(labelFor("--paper"), "Page background");
  assert.equal(labelFor("--nope"), undefined);
});
