import { test } from "node:test";
import assert from "node:assert/strict";

import { applyPalette, applyTheme } from "./applyPreview.mjs";
import { DARK_DEFAULTS, LIGHT_DEFAULTS } from "./tokens.mjs";

/** A CSSStyleDeclaration-shaped stub that records setProperty calls. */
function stubTarget() {
  const calls = [];
  return { calls, setProperty: (k, v) => calls.push([k, v]) };
}

test("applyPalette applies allowlist-passing values", () => {
  const t = stubTarget();
  applyPalette(t, { "--accent": "#123456", "--paper": "#ffffff" });
  assert.deepEqual(t.calls, [["--accent", "#123456"], ["--paper", "#ffffff"]]);
});

test("applyPalette NEVER applies a value that fails the allowlist", () => {
  const t = stubTarget();
  applyPalette(t, {
    "--accent": "url(https://evil.example/x.png)",
    "--paper": "expression(alert(1))",
    "--ink-1": "#101010", // the only valid one
    "--line-1": "var(--x)",
  });
  assert.deepEqual(t.calls, [["--ink-1", "#101010"]]);
});

test("applyPalette tolerates a null/empty target or palette", () => {
  assert.doesNotThrow(() => applyPalette(null, { "--accent": "#111111" }));
  assert.doesNotThrow(() => applyPalette(stubTarget(), null));
});

test("gates the KEY as well as the value", () => {
  // This module faces unvalidated live-form input (its own docstring says so)
  // and checked only the value. A reserved `--_o-ceiling` would have let a
  // palette rewrite the bound its own tint wash is clamped by — the builder
  // showing a wash the app clamps back down.
  const written = {};
  const target = { setProperty: (k, v) => (written[k] = v) };
  applyPalette(target, {
    "--accent": "#ff5cae",
    "--_o-ceiling": "1",
    "--not a key": "#000000",
    ["--x".padEnd(200, "y")]: "#000000",
  });
  assert.deepEqual(Object.keys(written), ["--accent"]);
});

/** The same stub, plus removal recording — the half that had no coverage. */
function stubTargetWithRemoval() {
  const props = {};
  const removed = [];
  return {
    props,
    removed,
    setProperty: (k, v) => {
      props[k] = v;
    },
    removeProperty: (k) => {
      delete props[k];
      removed.push(k);
    },
  };
}

test("applyPalette REMOVES a token the new palette no longer sets", () => {
  // The preview only ever added. Switching from a preset that sets `--space-3`,
  // `--text-base`, `--tint` and `--tint-strength` to "Blank — light" left all
  // four painted, because the blank defaults have zero overlap with the measure,
  // tint and ornament sets — so the preview showed a palette nobody had chosen.
  const t = stubTargetWithRemoval();
  applyPalette(t, { "--accent": "#123456", "--tint": "#ff0000", "--space-3": "10px" });
  applyPalette(t, { "--accent": "#654321" });
  assert.deepEqual(t.removed.sort(), ["--space-3", "--tint"]);
  assert.equal(t.props["--accent"], "#654321");
  assert.equal(t.props["--tint"], undefined);
});

test("applyTheme keeps the tokens it applied, despite the two-pass derivation", () => {
  // `applyTheme` used to call `applyPalette` twice — raw palette, then the
  // derived syntax tokens. With removal wired in, the second call would take the
  // first call's tokens straight back out, so it is one merged call now.
  const t = stubTargetWithRemoval();
  applyTheme(t, { "--accent": "#123456", "--paper": "#ffffff", "--ink-1": "#000000" });
  assert.equal(t.props["--accent"], "#123456");
  assert.equal(t.props["--paper"], "#ffffff");
  assert.deepEqual(t.removed, []);
});

// ── The canon seed (myne#900) ────────────────────────────────────────────────
//
// A theme is a partial palette and `applyPalette` drops `data-theme`, so the
// omitted families used to resolve to the built-in LIGHT values: a dark theme
// previewed with light label chips, light highlight washes and light graph group
// colours. The preview now merges the canon for the appearance the palette
// declares, which is what the app does.

test("applyTheme seeds a DARK palette's omitted families from the dark canon", () => {
  const t = stubTargetWithRemoval();
  applyTheme(t, { "--paper": "#1e1e2e", "--accent": "#7aa2f7" });
  assert.equal(t.props["--accent"], "#7aa2f7", "the palette's own value is kept");
  assert.equal(t.props["--label-clay"], DARK_DEFAULTS["--label-clay"]);
  assert.equal(t.props["--highlight-teal"], DARK_DEFAULTS["--highlight-teal"]);
  assert.equal(t.props["--group-teal"], DARK_DEFAULTS["--group-teal"]);
  assert.notEqual(DARK_DEFAULTS["--label-clay"], LIGHT_DEFAULTS["--label-clay"]);
});

test("applyTheme seeds a LIGHT palette from the light canon", () => {
  const t = stubTargetWithRemoval();
  applyTheme(t, { "--paper": "#fdfcf9" });
  assert.equal(t.props["--label-clay"], LIGHT_DEFAULTS["--label-clay"]);
  assert.equal(t.props["--highlight-teal"], LIGHT_DEFAULTS["--highlight-teal"]);
});

test("applyTheme never overrides a family the palette sets itself", () => {
  const t = stubTargetWithRemoval();
  applyTheme(t, { "--paper": "#1e1e2e", "--label-clay": "#123456", "--highlight-teal": "#654321" });
  assert.equal(t.props["--label-clay"], "#123456");
  assert.equal(t.props["--highlight-teal"], "#654321");
});

test("the value gate skips the shadow family, and that is the whole gap", () => {
  // Pinned rather than assumed: a shadow is a multi-part value the allowlist has
  // no grammar for, so the canon's three `--shadow-*` entries do not land. Every
  // other canon token must, or the preview is half-painted again.
  const t = stubTargetWithRemoval();
  applyTheme(t, { "--paper": "#1e1e2e" });
  const skipped = Object.keys(DARK_DEFAULTS).filter((key) => t.props[key] === undefined);
  assert.deepEqual(skipped.sort(), ["--shadow-1", "--shadow-2", "--shadow-3"]);
});
