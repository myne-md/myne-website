import { test } from "node:test";
import assert from "node:assert/strict";

import { createThemeState } from "./state.mjs";

test("pin/unpin track an override without touching the palette", () => {
  const s = createThemeState({ palette: { "--paper": "#fff", "--paper-2": "#f4f4f2" } });
  assert.equal(s.isPinned("--paper-2"), false);
  s.pin("--paper-2");
  assert.equal(s.isPinned("--paper-2"), true);
  assert.equal(s.get("--paper-2"), "#f4f4f2", "pinning does not change the value");

  s.unpin("--paper-2");
  assert.equal(s.isPinned("--paper-2"), false);
});

test("pinning notifies subscribers, and pinning twice does not", () => {
  const s = createThemeState({ palette: {} });
  let calls = 0;
  s.subscribe(() => {
    calls += 1;
  });
  s.pin("--ink-2");
  assert.equal(calls, 1, "the UI redraws the link control on the first pin");
  s.pin("--ink-2");
  assert.equal(calls, 1, "and a second pin of the same token is one state change");
  s.unpin("--ink-2");
  assert.equal(calls, 2);
  s.unpin("--ink-2");
  assert.equal(calls, 2, "unpinning an unpinned token is not a change either");
});

test("loading a preset clears the pinned set", () => {
  const s = createThemeState({ palette: { "--paper": "#fff" } });
  s.pin("--paper-2");
  s.pin("--accent-hover");
  // A preset defines its own anchors; carrying "unlinked" markers across a load
  // would refuse to re-derive against the new base, which is the opposite of
  // what the marker means.
  s.replace({ "--paper": "#101010", "--paper-2": "#0c0c0c" }, true);
  assert.equal(s.isPinned("--paper-2"), false);
  assert.equal(s.isPinned("--accent-hover"), false);
  assert.equal(s.isDark(), true);
});
