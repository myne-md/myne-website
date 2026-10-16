import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  MAPPINGS,
  guardedFiles,
  parseDarkPalette,
  resolveValue,
  stripComments,
  checkValuePreservation,
  checkNoStrayLiterals,
  checkHeadScript,
  analyse,
} from "./check-theme-tokens.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const tokensCss = readFileSync(ROOT + "src/styles/tokens.css", "utf8");

function realInputs() {
  const files = {};
  for (const f of guardedFiles(ROOT)) files[f] = readFileSync(ROOT + f, "utf8");
  return { tokensCss, files, landingLayout: files["src/layouts/LandingLayout.astro"] };
}

test("the real tree passes every check", () => {
  const { ok, findings } = analyse(realInputs());
  assert.deepEqual(findings, []);
  assert.ok(ok);
});

test("the guard is not vacuous: it scans a real denominator", () => {
  const guarded = guardedFiles(ROOT);
  assert.ok(guarded.length > 20, `expected >20 guarded files, got ${guarded.length}`);
  assert.ok(guarded.includes("src/pages/index.astro"));
  assert.ok(guarded.includes("src/components/GlassNav.astro"));
  assert.ok(guarded.includes("src/styles/userguide.css"));
  assert.ok(MAPPINGS.length > 20);
});

test("the dark palette resolves through var() chains", () => {
  const palette = parseDarkPalette(tokensCss);
  assert.equal(resolveValue("var(--paper-2)", palette), "#101010");
  assert.equal(resolveValue("var(--accent)", palette), "#8aa4d0");
  assert.equal(resolveValue("var(--warning)", palette), "rgb(194 163 94)");
  assert.equal(
    resolveValue("rgb(var(--line-rgb) / 0.18)", palette),
    "rgb(255 255 255 / 0.18)",
  );
});

test("stripComments drops mentions but keeps code", () => {
  const src = `a /* #ffffff */ b // #000000\nc "<!-- #123456 -->" d`;
  const out = stripComments(src);
  assert.ok(out.includes("a "));
  assert.ok(out.includes("b "));
  assert.ok(out.includes("c "));
  assert.ok(!out.includes("#ffffff"));
  assert.ok(!out.includes("#000000"));
  assert.ok(!out.includes("#123456"));
});

test("a shifted dark token is caught by value preservation", () => {
  const broken = tokensCss.replace("--ink-1:    #e6e6e4;", "--ink-1:    #d0d0d0;");
  assert.notEqual(broken, tokensCss, "fixture did not actually shift the palette");
  const findings = checkValuePreservation(broken);
  assert.ok(findings.length > 0);
  assert.ok(findings.some((f) => f.includes("--ink-1")));
});

test("a stray literal in the chrome is caught by the ratchet", () => {
  const { files } = realInputs();
  files["src/pages/404.astro"] += `\n<div style="color:#ff00ff"></div>`;
  const findings = checkNoStrayLiterals(files);
  assert.ok(findings.some((f) => f.includes("#ff00ff")));
});

test("a numeric rgb literal is caught in BOTH spellings", () => {
  const { files } = realInputs();
  const comma = {
    ...files,
    "src/pages/404.astro": files["src/pages/404.astro"] + `\n<div style="color:rgba(255,255,255,0.5)"></div>`,
  };
  assert.ok(checkNoStrayLiterals(comma).some((f) => f.includes("rgba(255,255,255,0.5)")));
  const space = {
    ...files,
    "src/pages/404.astro": files["src/pages/404.astro"] + `\n<div style="color:rgb(255 255 255 / 0.5)"></div>`,
  };
  assert.ok(checkNoStrayLiterals(space).some((f) => f.includes("rgb(255 255 255 / 0.5)")));
});

test("an allowlisted literal is capped at its recorded occurrence count", () => {
  const { files } = realInputs();
  const extra = {
    ...files,
    "src/layouts/LandingLayout.astro":
      files["src/layouts/LandingLayout.astro"] + `\n<div style="background:#0a0a0a"></div>`,
  };
  assert.ok(
    checkNoStrayLiterals(extra).some((f) => f.includes("#0a0a0a") && f.includes("times")),
  );
});

test("the allowed literals are not flagged, and only those", () => {
  const { files } = realInputs();
  // The real tree's allowlisted literals (#000 mask, print #999) pass...
  assert.deepEqual(checkNoStrayLiterals(files), []);
  // ...but an unlisted colour in the same file is still caught.
  const polluted = { ...files };
  polluted["src/pages/index.astro"] = files["src/pages/index.astro"] + "\n<!-- -->\n<b style=\"background:#abcdef\">";
  assert.ok(checkNoStrayLiterals(polluted).some((f) => f.includes("#abcdef")));
});

test("a drifted pre-paint key is caught", () => {
  const { landingLayout } = realInputs();
  const broken = landingLayout.replace('localStorage.getItem("myne-theme")', 'localStorage.getItem("theme")');
  assert.notEqual(broken, landingLayout, "fixture did not actually drift the key");
  assert.ok(checkHeadScript(broken).some((f) => f.includes("THEME_KEY")));
});

test("a missing theme-lock short-circuit is caught", () => {
  const { landingLayout } = realInputs();
  const broken = landingLayout.replace(/root\.dataset\.themeLock === "dark"/, 'false');
  assert.notEqual(broken, landingLayout, "fixture did not actually remove the lock");
  assert.ok(checkHeadScript(broken).some((f) => f.includes("data-theme-lock")));
});
