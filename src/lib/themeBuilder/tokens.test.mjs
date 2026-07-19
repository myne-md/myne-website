import { test } from "node:test";
import assert from "node:assert/strict";

import {
  REQUIRED_TOKENS,
  OPTIONAL_TOKENS,
  ALL_TOKENS,
  LIGHT_DEFAULTS,
  DARK_DEFAULTS,
} from "./tokens.mjs";
import { createThemeState } from "./state.mjs";

// The 21 required raw-ramp tokens, transcribed verbatim from the single source
// of truth: theme-validator/src/schema.rs:38-65 (REQUIRED_KEYS). If the Rust
// list ever changes, this test is the tripwire.
const EXPECTED_REQUIRED = [
  "--paper", "--paper-2", "--paper-3",
  "--ink-0", "--ink-1", "--ink-2", "--ink-3",
  "--line-1", "--line-2", "--line-3",
  "--accent", "--accent-hover", "--accent-press", "--accent-soft", "--accent-on",
  "--danger", "--danger-soft", "--warning", "--warning-soft", "--success", "--success-soft",
];

// The 23 optional tokens, transcribed from docs/design/colors_and_type.css
// (:141-152 syntax, :129-134 labels, :116-120 highlights).
const EXPECTED_OPTIONAL = [
  "--syntax-keyword", "--syntax-string", "--syntax-comment", "--syntax-number",
  "--syntax-variable", "--syntax-property", "--syntax-function", "--syntax-type",
  "--syntax-operator", "--syntax-tag", "--syntax-meta", "--syntax-invalid",
  "--label-clay", "--label-ochre", "--label-moss", "--label-slate", "--label-plum", "--label-stone",
  "--highlight", "--highlight-green", "--highlight-blue", "--highlight-pink", "--highlight-purple",
];

// The 9 derived semantic aliases that MUST NOT appear in either list — they
// re-resolve off the raw tokens (colors_and_type.css:92-98,114-115) and are not
// authorable.
const ALIAS_TOKENS = [
  "--bg-1", "--bg-2", "--bg-3",
  "--fg-1", "--fg-2", "--fg-3", "--fg-display",
  "--info", "--info-soft",
];

const HEX6 = /^#[0-9a-f]{6}$/i;
const asSet = (a) => new Set(a);
const setEqual = (a, b) =>
  a.size === b.size && [...a].every((x) => b.has(x));

test("REQUIRED_TOKENS is exactly schema.rs REQUIRED_KEYS (21, set-equal)", () => {
  assert.equal(REQUIRED_TOKENS.length, 21);
  assert.ok(
    setEqual(asSet(REQUIRED_TOKENS), asSet(EXPECTED_REQUIRED)),
    "REQUIRED_TOKENS drifted from schema.rs REQUIRED_KEYS",
  );
});

test("OPTIONAL_TOKENS is exactly the 23 canonical optional tokens (set-equal)", () => {
  assert.equal(OPTIONAL_TOKENS.length, 23);
  assert.ok(setEqual(asSet(OPTIONAL_TOKENS), asSet(EXPECTED_OPTIONAL)));
});

test("no derived alias leaks into the authorable token lists", () => {
  for (const alias of ALIAS_TOKENS) {
    assert.ok(!REQUIRED_TOKENS.includes(alias), `${alias} must not be required`);
    assert.ok(!OPTIONAL_TOKENS.includes(alias), `${alias} must not be optional`);
    assert.ok(!ALL_TOKENS.includes(alias), `${alias} must not be authorable`);
  }
});

test("ALL_TOKENS is required + optional, no duplicates", () => {
  assert.equal(ALL_TOKENS.length, 44);
  assert.equal(new Set(ALL_TOKENS).size, 44);
});

test("LIGHT_DEFAULTS covers every required token with a 6-digit hex", () => {
  for (const t of REQUIRED_TOKENS) {
    assert.ok(t in LIGHT_DEFAULTS, `LIGHT_DEFAULTS missing ${t}`);
    assert.match(LIGHT_DEFAULTS[t], HEX6, `${t} light value not #rrggbb`);
  }
});

test("DARK_DEFAULTS covers every required AND optional token with a 6-digit hex", () => {
  for (const t of ALL_TOKENS) {
    assert.ok(t in DARK_DEFAULTS, `DARK_DEFAULTS missing ${t}`);
    assert.match(DARK_DEFAULTS[t], HEX6, `${t} dark value not #rrggbb`);
  }
});

test("state store: get/set a single token", () => {
  const s = createThemeState({ palette: { "--accent": "#111111" } });
  assert.equal(s.get("--accent"), "#111111");
  s.set("--accent", "#222222");
  assert.equal(s.get("--accent"), "#222222");
});

test("state store: replace wholesale + isDark", () => {
  const s = createThemeState();
  assert.equal(s.isDark(), false);
  s.replace({ "--paper": "#000000" }, true);
  assert.equal(s.getPalette()["--paper"], "#000000");
  assert.equal(s.isDark(), true);
});

test("state store: subscribe fires on change and unsubscribes", () => {
  const s = createThemeState();
  let calls = 0;
  const off = s.subscribe(() => { calls += 1; });
  s.set("--accent", "#333333");
  assert.equal(calls, 1);
  off();
  s.set("--accent", "#444444");
  assert.equal(calls, 1);
});
