// The captured-interface frame: readiness, and reflecting a palette onto it.
//
// The readiness half exists because of a bug that cost an afternoon and produced
// no error: a freshly-created iframe holds an `about:blank` document whose
// `readyState` is ALREADY "complete". The builder measured that empty document
// for every token's built-in default, found nothing, decided no band could be
// established, and removed all 29 measure controls — silently. It was a race, so
// it worked most of the time, which is the worst frequency a bug can have. A
// race is also what a browser check reproduces least reliably, which is why the
// predicate is a pure function with a test rather than a condition inline.

import { test } from "node:test";
import assert from "node:assert/strict";
import { ON_ATTR, isFrameLoaded, ornamentAttr, reflectOrnament } from "./previewFrame.mjs";

const frame = (readyState, sheets) => ({
  contentDocument: { readyState, styleSheets: { length: sheets } },
});

test("a blank document is not loaded, however complete it claims to be", () => {
  // THE REGRESSION. `about:blank` reports "complete" the moment the element
  // exists; without the sheet count the builder acted on an empty document.
  assert.equal(isFrameLoaded(frame("complete", 0)), false);
});

test("the snapshot is loaded once its stylesheet is live", () => {
  assert.equal(isFrameLoaded(frame("complete", 1)), true);
});

test("a document still parsing is not loaded", () => {
  assert.equal(isFrameLoaded(frame("loading", 0)), false);
  assert.equal(isFrameLoaded(frame("interactive", 1)), false);
});

test("a missing or unreachable frame is not loaded, and does not throw", () => {
  assert.equal(isFrameLoaded(null), false);
  assert.equal(isFrameLoaded(undefined), false);
  assert.equal(isFrameLoaded({}), false);
  assert.equal(isFrameLoaded({ contentDocument: null }), false);
  // Cross-origin access throws on property read rather than returning null.
  assert.equal(
    isFrameLoaded({
      get contentDocument() {
        throw new DOMException("blocked");
      },
    }),
    false,
  );
});

// ── the reflect half ────────────────────────────────────────────────────────

const root = () => {
  const attrs = new Map();
  return {
    attrs,
    // `reflectOrnament` clears the previous selection before writing the new
    // one, so the stub has to expose the attribute list a real element would.
    get attributes() {
      return [...attrs.keys()].map((name) => ({ name }));
    },
    setAttribute: (k, v) => attrs.set(k, v),
    removeAttribute: (k) => attrs.delete(k),
  };
};

// What the captured stylesheet can draw. The shared helper takes this rather
// than guessing: a selection the CSS has no rule for must never reach the DOM.
const DRAWABLE = new Map([
  ["data-o-box-frame", new Set(["thick", "hairline", "none"])],
  ["data-o-box-shadow", new Set(["soft", "none"])],
]);

test("token to attribute", () => {
  assert.equal(ornamentAttr("--box-frame"), "data-o-box-frame");
});

test("reflects a selection the stylesheet can draw, and flags the layer on", () => {
  const el = root();
  const drawable = new Map([["data-o-box-frame", new Set(["thick"])]]);
  assert.equal(reflectOrnament(el, { "--box-frame": "thick" }, drawable), true);
  assert.equal(el.attrs.get("data-o-box-frame"), "thick");
  assert.equal(el.attrs.has(ON_ATTR), true);
});

test("drops a selection no rule matches", () => {
  // An attribute nothing selects on is the failure this builder shipped with:
  // the selection reflected, and the page drew nothing.
  const el = root();
  const drawable = new Map([["data-o-box-frame", new Set(["thick"])]]);
  assert.equal(reflectOrnament(el, { "--box-frame": "quilted" }, drawable), false);
  assert.equal(el.attrs.has("data-o-box-frame"), false);
  assert.equal(el.attrs.has(ON_ATTR), false);
});

test("`none` is WRITTEN, not removed — absence would leave the inherited frame", () => {
  // This test asserted the opposite until a review found the bug. `frame` and
  // `shadow` write their slots on the host element and custom properties
  // inherit, so a box nested in a framed surface inherits that frame; only an
  // explicit `[data-o-box-frame="none"]` rule puts the slot back to neutral.
  // Removing the attribute leaves the inherited value in place — the opposite of
  // what the user asked for.
  const el = root();
  reflectOrnament(el, { "--box-frame": "thick" }, DRAWABLE);
  reflectOrnament(el, { "--box-frame": "none" }, DRAWABLE);
  assert.equal(el.attrs.get("data-o-box-frame"), "none");
  // …but `none` is not a SELECTION, so it must not turn the layer on: a theme
  // whose every ornament key is `none` should cost an unornamented session
  // nothing.
  assert.equal(el.attrs.has(ON_ATTR), false);
});

test("an empty value clears the control", () => {
  const el = root();
  reflectOrnament(el, { "--box-frame": "thick" }, DRAWABLE);
  reflectOrnament(el, { "--box-frame": "" }, DRAWABLE);
  assert.equal(el.attrs.has("data-o-box-frame"), false);
});

test("a tint-only palette turns the layer on, reflecting no attribute", () => {
  // `--tint` needs no attribute (the stylesheet reads it through `var()`) but
  // every rule that draws it is scoped under the flag.
  const el = root();
  assert.equal(reflectOrnament(el, { "--tint": "#ff5cae" }, DRAWABLE), true);
  assert.equal(el.attrs.has(ON_ATTR), true);
});

test("a colour-only palette leaves the layer off", () => {
  const el = root();
  assert.equal(reflectOrnament(el, { "--accent": "#ff5cae" }, DRAWABLE), false);
  assert.equal(el.attrs.has(ON_ATTR), false);
});
