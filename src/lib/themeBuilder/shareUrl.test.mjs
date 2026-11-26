import { test } from "node:test";
import assert from "node:assert/strict";

import { buildShareUrl, buildSubmission, MAX_URL_LEN } from "./shareUrl.mjs";

const base = {
  slug: "nord-dusk",
  name: "Nord Dusk",
  author: "Ada",
  description: "Calm blues",
  appearance: "dark",
  themeJson: JSON.stringify({ "--paper": "#282a36", "--accent": "#8aa4d0" }, null, 2),
  metaJson: JSON.stringify({ name: "Nord Dusk", license: "CC-BY-4.0" }, null, 2),
};

test("buildShareUrl targets a prefilled myne-themes issue with both files", () => {
  const url = buildShareUrl(base);
  assert.ok(url.startsWith("https://github.com/myne-md/myne-themes/issues/new?"));
  const u = new URL(url);
  assert.equal(u.searchParams.get("labels"), "theme-submission");
  assert.equal(u.searchParams.get("title"), "[theme] Nord Dusk");
  const body = u.searchParams.get("body");
  assert.ok(body.includes("themes/nord-dusk/"), "names the target folder");
  assert.ok(body.includes(base.themeJson), "carries theme.json verbatim");
  assert.ok(body.includes(base.metaJson), "carries meta.json verbatim");
  assert.ok(body.includes("**Appearance:** dark"));
});

test("buildShareUrl stays within GitHub's prefill budget for a normal theme", () => {
  assert.ok(buildShareUrl(base).length <= MAX_URL_LEN);
});

test("buildShareUrl falls back (drops JSON blocks) when the body is too large", () => {
  const huge = { ...base, themeJson: "#".repeat(20000) };
  const url = buildShareUrl(huge);
  assert.ok(url.length <= MAX_URL_LEN, "fallback URL respects the budget");
  const body = new URL(url).searchParams.get("body");
  assert.ok(!body.includes("#".repeat(20000)), "the oversized JSON is dropped");
  assert.ok(/download/i.test(body), "instructs the user to attach the downloaded files");
});

test("buildSubmission opens GitHub's new-file page with the palette prefilled", () => {
  const out = buildSubmission(base);
  assert.equal(out.kind, "pr");
  const u = new URL(out.url);
  assert.equal(u.origin + u.pathname, "https://github.com/myne-md/myne-themes/new/develop");
  assert.equal(u.searchParams.get("filename"), "themes/nord-dusk/theme.json");
  assert.equal(u.searchParams.get("value"), base.themeJson, "theme.json rides as the file body");
  assert.ok(u.searchParams.get("message").includes("nord-dusk"));
  const body = u.searchParams.get("description");
  assert.ok(body.includes("**Theme:** Nord Dusk"));
  assert.ok(body.includes(base.metaJson), "meta.json rides in the PR description");
  assert.ok(body.includes("**Appearance:** dark"));
});

test("buildSubmission falls back to the issue form when the URL would be truncated", () => {
  const huge = { ...base, themeJson: "#".repeat(20000) };
  const out = buildSubmission(huge);
  assert.equal(out.kind, "issue");
  assert.ok(out.url.startsWith("https://github.com/myne-md/myne-themes/issues/new?"));
  assert.ok(out.url.length <= MAX_URL_LEN);
});
