/**
 * `myne://theme/install` link builder (MYND-568).
 *
 * The contract under test is a CROSS-REPO one: the app's parser
 * (`src/lib/themeDeepLink.ts` in `myne`) pins the version token, the unpadded
 * base64url encoding, and the verbatim-payload rule. A change here that these
 * tests still pass but that parser rejects would break every published link, so
 * the assertions deliberately decode the URL the way the app does rather than
 * just checking that a string was produced.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { UNMOVABLE } from "./themeBuilder/measure.mjs";
import {
  MAX_AUTHOR_LEN,
  MAX_SOURCE_LEN,
  MAX_NAME_LEN,
  MAX_INSTALL_URL_LEN,
  THEME_LINK_VERSION,
  base64UrlEncode,
  buildThemeInstallUrl,
} from "./themeInstallLink.mjs";

/** A complete palette — the gate below requires all 21 required-core tokens. */
const PALETTE = Object.fromEntries(
  [
    "--paper", "--paper-2", "--paper-3", "--ink-0", "--ink-1", "--ink-2", "--ink-3",
    "--line-1", "--line-2", "--line-3", "--accent", "--accent-hover", "--accent-press",
    "--accent-soft", "--accent-on", "--danger", "--danger-soft", "--warning",
    "--warning-soft", "--success", "--success-soft",
  ].map((t) => [t, "#faf6ee"]),
);

/** Decode a link the way the desktop parser does. */
function decodeLink(url) {
  const u = new URL(url);
  const encoded = u.searchParams.get("payload");
  assert.match(encoded, /^[A-Za-z0-9_-]*$/, "payload must be base64url");
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const json = Buffer.from(
    padded + "=".repeat((4 - (padded.length % 4)) % 4),
    "base64",
  ).toString("utf8");
  return { url: u, json, palette: JSON.parse(json) };
}

describe("buildThemeInstallUrl", () => {
  it("emits the action, version and payload the app parser expects", () => {
    const url = buildThemeInstallUrl({ name: "Warm Paper", palette: PALETTE });
    const { url: u, palette } = decodeLink(url);

    assert.equal(u.protocol, "myne:");
    assert.equal(u.host, "theme");
    assert.equal(u.pathname, "/install");
    assert.equal(u.searchParams.get("v"), THEME_LINK_VERSION);
    assert.equal(u.searchParams.get("name"), "Warm Paper");
    assert.deepEqual(palette, PALETTE);
  });

  it("carries optional provenance when given, and omits it when not", () => {
    const withMeta = new URL(
      buildThemeInstallUrl({
        name: "Warm Paper",
        palette: PALETTE,
        author: "Myne",
        source: "https://github.com/myne-md/myne-themes/tree/develop/themes/warm-paper",
      }),
    );
    assert.equal(withMeta.searchParams.get("author"), "Myne");
    assert.match(withMeta.searchParams.get("src"), /^https:\/\/github\.com\//);

    const bare = new URL(buildThemeInstallUrl({ name: "Warm Paper", palette: PALETTE }));
    assert.equal(bare.searchParams.get("author"), null);
    assert.equal(bare.searchParams.get("src"), null);
  });

  it("emits MINIFIED, key-sorted json — the bytes the host validator will see", () => {
    const { json, palette } = decodeLink(buildThemeInstallUrl({ name: "T", palette: PALETTE }));
    assert.ok(!json.includes("\n"), "payload must not carry pretty-print newlines");
    assert.ok(!json.includes(": "), "payload must not carry pretty-print spacing");
    // Key order is normalized (see the determinism test below), so compare the
    // decoded content, and the exact bytes against the same normalization.
    assert.deepEqual(palette, PALETTE);
    const sorted = Object.fromEntries(Object.entries(PALETTE).sort(([a], [b]) => (a < b ? -1 : 1)));
    assert.equal(json, JSON.stringify(sorted));
  });

  it("ships only canonical tokens — stray keys and non-canonical names are dropped", () => {
    // Real gallery themes carry keys the app does not read (nocturne ships
    // `--label-red`, which is not one of the app's `--label-clay`/… tokens).
    // Those are inert, so they must not spend URL budget.
    const { palette } = decodeLink(
      buildThemeInstallUrl({
        name: "T",
        palette: { ...PALETTE, name: "not a token", "--label-red": "#ff0000", "--bad": 42 },
      }),
    );
    assert.deepEqual(palette, PALETTE);
  });

  it("emits a key-sorted payload, so the link is deterministic", () => {
    const shuffled = Object.fromEntries(Object.entries(PALETTE).reverse());
    assert.equal(
      buildThemeInstallUrl({ name: "T", palette: shuffled }),
      buildThemeInstallUrl({ name: "T", palette: PALETTE }),
    );
  });

  it("returns null for an incomplete palette instead of a link the app rejects", () => {
    const { "--accent": _dropped, ...missingRequired } = PALETTE;
    assert.equal(buildThemeInstallUrl({ name: "T", palette: missingRequired }), null);
  });

  it("mirrors the app's sanitise-THEN-slice on the name", () => {
    // Order matters: slicing first would let stripped characters eat the budget.
    const u = new URL(
      buildThemeInstallUrl({ name: "  Warm\u202e  Paper  ", palette: PALETTE }),
    );
    assert.equal(u.searchParams.get("name"), "Warm Paper");
  });

  it("returns null for a name the app would reject, so the caller falls back", () => {
    // The app answers a nameless link with an error dialog; a working download
    // is the better outcome, so the link is simply not emitted.
    for (const name of ["", "   ", "\u0000\u202e\u2066"]) {
      assert.equal(buildThemeInstallUrl({ name, palette: PALETTE }), null);
    }
  });

  it("caps author and drops a src the app would refuse", () => {
    const u = new URL(
      buildThemeInstallUrl({
        name: "T",
        palette: PALETTE,
        author: "A".repeat(300),
        source: "javascript:alert(1)",
      }),
    );
    assert.equal(u.searchParams.get("author").length, MAX_AUTHOR_LEN);
    assert.equal(u.searchParams.get("src"), null, "non-web src must not be emitted");

    const long = "https://example.com/" + "p".repeat(400);
    const capped = new URL(
      buildThemeInstallUrl({ name: "T", palette: PALETTE, source: long }),
    );
    assert.equal(capped.searchParams.get("src").length, MAX_SOURCE_LEN);
  });

  it("caps the name at the app's display ceiling", () => {
    const u = new URL(
      buildThemeInstallUrl({ name: "A".repeat(200), palette: PALETTE }),
    );
    assert.equal(u.searchParams.get("name").length, MAX_NAME_LEN);
  });

  it("returns null when there is nothing to hand off", () => {
    assert.equal(buildThemeInstallUrl({ name: "T", palette: null }), null);
    assert.equal(buildThemeInstallUrl({ name: "T", palette: undefined }), null);
    assert.equal(buildThemeInstallUrl({ name: "T", palette: {} }), null);
    // Only non-token keys → nothing installable.
    assert.equal(buildThemeInstallUrl({ name: "T", palette: { name: "x" } }), null);
  });

  it("drops only keys the app does not read (the lossy-projection guard)", () => {
    // The payload keeps just the 44 canonical tokens. That is safe only while
    // every key it drops is one the app ignores — pin it against real data so a
    // future token family added app-side without updating tokens.mjs shows up.
    const full = JSON.parse(
      readFileSync(new URL("../data/themes-full.json", import.meta.url), "utf8"),
    );
    // Per-theme, not per-gallery: `.some()` excused a dropped key if ANY theme
    // set it to `none`, so the excuse widened every time a theme was added.
    const noopIn = (palette, k) => palette[k] === "none" || palette[k] === "plain";
    const dropped = new Set();
    for (const [, palette] of Object.entries(full)) {
      const kept = new Set(Object.keys(decodeLink(
        buildThemeInstallUrl({ name: "T", palette }),
      ).palette));
      for (const k of Object.keys(palette)) {
        if (kept.has(k)) continue;
        // Judge the excuse against THIS theme's own value.
        if (noopIn(palette, k)) continue;
        dropped.add(k);
      }
    }
    // Two reasons a key may legitimately be dropped, and the test states both
    // rather than pinning a list — a list turns every new ornament key into a
    // failure that says nothing about whether the projection is still lossless.
    //
    //   1. the app does not read it (`--label-*`), or
    //   2. its value is `none` / `plain`, which means "draw nothing" — exactly
    //      what an ABSENT key already means, so carrying it would only spend URL
    //      budget. (Field Notes ships four of these.)
    //   3. it is a measure token whose built-in default is `0`, so the app's
    //      0.5x-2x clamp folds any value straight back to the default. The app
    //      reads it and it changes nothing — Field Notes ships
    //      `--tracking-normal: 0.01em` and it has never had an effect.
    const unread = (k) => k.startsWith("--label-");
    const unmovable = (k) => UNMOVABLE.includes(k);
    const unexplained = [...dropped].filter((k) => !unread(k) && !unmovable(k)).sort();
    assert.deepEqual(
      unexplained,
      [],
      "a key was dropped that the app DOES read and that is not a no-op — the projection is lossy",
    );
    // And the ornament keys that carry a real selection must survive, or the
    // hand-off installs a theme stripped of everything but its colours.
    // Built here rather than found in the gallery: `if (found)` meant the
    // assertion silently stopped running the day no shipped theme happened to
    // set this key.
    const anyTheme = Object.values(full)[0];
    const ornamented = { ...anyTheme, "--box-frame": "thick" };
    const keptOrnament = new Set(
      Object.keys(decodeLink(buildThemeInstallUrl({ name: "T", palette: ornamented })).palette),
    );
    assert.ok(
      keptOrnament.has("--box-frame"),
      "a real ornament selection must survive the hand-off",
    );
  });

  it("keeps every real gallery theme installable (the data this ships against)", () => {
    // Guards the gate against being stricter than the themes actually shipped:
    // a tightening that silently delisted the gallery would otherwise pass.
    const full = JSON.parse(
      readFileSync(new URL("../data/themes-full.json", import.meta.url), "utf8"),
    );
    for (const [slug, palette] of Object.entries(full)) {
      const url = buildThemeInstallUrl({ name: slug, palette });
      assert.ok(url !== null, `${slug} lost its install link`);
      assert.ok(url.length < MAX_INSTALL_URL_LEN, `${slug} link too long: ${url.length}`);
    }
  });

  it("returns null instead of emitting a link the OS would truncate", () => {
    const huge = {};
    for (let i = 0; i < 400; i += 1) huge[`--token-${i}`] = "#123456";
    const url = buildThemeInstallUrl({ name: "Huge", palette: huge });
    assert.equal(url, null, "over-budget links fall back to the plain download");
  });

  it("leaves budget headroom on a full 26-token theme", () => {
    const real = { ...PALETTE };
    for (const key of [
      "--syntax-keyword", "--syntax-string", "--syntax-comment",
      "--syntax-number", "--syntax-function",
    ]) {
      real[key] = "#1e1e2e";
    }
    const url = buildThemeInstallUrl({
      name: "Catppuccin Mocha",
      palette: real,
      author: "Catppuccin",
      source: "https://github.com/myne-md/myne-themes/tree/develop/themes/catppuccin-mocha",
    });
    assert.ok(url !== null);
    assert.ok(
      url.length < MAX_INSTALL_URL_LEN * 0.75,
      `a real theme should leave headroom; got ${url.length} of ${MAX_INSTALL_URL_LEN}`,
    );
  });
});

describe("base64UrlEncode", () => {
  it("uses the url-safe alphabet and drops padding", () => {
    const encoded = base64UrlEncode('{"--a":"???"}');
    assert.match(encoded, /^[A-Za-z0-9_-]+$/);
    assert.ok(!encoded.includes("="));
  });

  it("round-trips non-ASCII (theme names and values are not ASCII-only)", () => {
    const text = '{"--paper":"#fff","--note":"Şafak — ünlü"}';
    const encoded = base64UrlEncode(text);
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(
      padded + "=".repeat((4 - (padded.length % 4)) % 4),
      "base64",
    ).toString("utf8");
    assert.equal(decoded, text);
  });
});

it("runs without Buffer, over a payload long enough to chunk", () => {
  const saved = globalThis.Buffer;
  // The browser branch is the one the builder actually uses (the toolbar's
  // "Open in Myne"), and under `node --test` the Buffer branch always wins, so
  // deleting the global is the only way to execute it here.
  delete globalThis.Buffer;
  try {
    // > 32 KiB so the chunking loop runs: `String.fromCharCode(...bytes)` throws
    // on an array this long, which is why the loop exists.
    const text = "ünïcödé ✓ ".repeat(4000);
    assert.ok(text.length > 32 * 1024, "the fixture has to be big enough to chunk");
    const encoded = base64UrlEncode(text);
    assert.match(encoded, /^[A-Za-z0-9_-]+$/, "url-safe alphabet, no padding");
    assert.equal(saved.from(encoded, "base64url").toString("utf8"), text, "round-trips");
  } finally {
    globalThis.Buffer = saved;
  }
});
