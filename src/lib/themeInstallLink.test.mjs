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
import {
  MAX_NAME_LEN,
  MAX_URL_LEN,
  THEME_LINK_VERSION,
  base64UrlEncode,
  buildThemeInstallUrl,
} from "./themeInstallLink.mjs";

const PALETTE = {
  "--paper": "#faf6ee",
  "--ink-1": "#2b2720",
  "--accent": "#b3603c",
};

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
        source: "https://github.com/myne-md/myne-themes/tree/main/themes/warm-paper",
      }),
    );
    assert.equal(withMeta.searchParams.get("author"), "Myne");
    assert.match(withMeta.searchParams.get("src"), /^https:\/\/github\.com\//);

    const bare = new URL(buildThemeInstallUrl({ name: "Warm Paper", palette: PALETTE }));
    assert.equal(bare.searchParams.get("author"), null);
    assert.equal(bare.searchParams.get("src"), null);
  });

  it("emits MINIFIED json — the bytes the host validator will see", () => {
    const { json } = decodeLink(buildThemeInstallUrl({ name: "T", palette: PALETTE }));
    assert.ok(!json.includes("\n"), "payload must not carry pretty-print newlines");
    assert.equal(json, JSON.stringify(PALETTE));
  });

  it("drops non-token keys and non-string values rather than shipping them", () => {
    const { palette } = decodeLink(
      buildThemeInstallUrl({
        name: "T",
        palette: { ...PALETTE, name: "not a token", "--bad": 42 },
      }),
    );
    assert.deepEqual(palette, PALETTE);
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

  it("returns null instead of emitting a link the OS would truncate", () => {
    const huge = {};
    for (let i = 0; i < 400; i += 1) huge[`--token-${i}`] = "#123456";
    const url = buildThemeInstallUrl({ name: "Huge", palette: huge });
    assert.equal(url, null, "over-budget links fall back to the plain download");
  });

  it("keeps a realistic 26-token gallery theme comfortably inside the budget", () => {
    // Catppuccin Mocha's real shape: 21 required-core tokens + 5 syntax roles.
    const real = {};
    for (const key of [
      "--paper", "--paper-2", "--paper-3", "--ink-0", "--ink-1", "--ink-2", "--ink-3",
      "--line-1", "--line-2", "--line-3", "--accent", "--accent-hover", "--accent-press",
      "--accent-soft", "--accent-on", "--danger", "--danger-soft", "--warning",
      "--warning-soft", "--success", "--success-soft", "--syntax-keyword",
      "--syntax-string", "--syntax-comment", "--syntax-number", "--syntax-function",
    ]) {
      real[key] = "#1e1e2e";
    }
    const url = buildThemeInstallUrl({
      name: "Catppuccin Mocha",
      palette: real,
      author: "Catppuccin",
      source: "https://github.com/myne-md/myne-themes/tree/main/themes/catppuccin-mocha",
    });
    assert.ok(url !== null);
    assert.ok(
      url.length < MAX_URL_LEN * 0.75,
      `a real theme should leave headroom; got ${url.length} of ${MAX_URL_LEN}`,
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
