// Static site smoke checks that need no browser and no new dependency.
//
// Run after `astro build` (the CI `web` job does). It answers two questions
// about the artefact rather than about the source:
//   1. every internal href resolves to a file the build actually emitted;
//   2. every page carries the basic accessibility landmarks a reader needs:
//      a language, a title, one h1, a main landmark, and alt text on images.
//
// It deliberately does not attempt axe/WCAG coverage. The high-value browser
// checks (focus order, contrast in computed styles) need a real layout engine
// and are a separate, later investment; this guard catches the cheap failures
// that otherwise ship silently on a static site.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = resolve("dist");
const failures = [];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

function targetExists(path) {
  const clean = path.split("?")[0].split("#")[0];
  const candidates = [];
  if (clean.endsWith("/")) candidates.push(join(ROOT, clean, "index.html"));
  else candidates.push(join(ROOT, clean), join(ROOT, `${clean}.html`), join(ROOT, clean, "index.html"));
  return candidates.some((candidate) => existsSync(candidate));
}

function textOf(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

if (!existsSync(ROOT)) {
  console.error("site-smoke: dist/ is missing; run `pnpm build` first");
  process.exit(1);
}

const pages = walk(ROOT).filter((path) => path.endsWith(".html"));

for (const page of pages) {
  const rel = relative(ROOT, page).split("\\").join("/");
  const html = readFileSync(page, "utf8");
  const redirect = /http-equiv=["']refresh["']/i.test(html);
  const appShell = rel === "themes/builder/index.html" || rel === "themes/preview-frame.html";

  if (redirect) continue;

  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) {
    failures.push(`${rel}: <html> has no lang attribute`);
  }
  if (!/<title>\s*\S[\s\S]*?<\/title>/i.test(html)) {
    failures.push(`${rel}: missing or empty <title>`);
  }

  const h1s = html.match(/<h1\b/gi) ?? [];
  if (!appShell && h1s.length !== 1) failures.push(`${rel}: expected one <h1>, found ${h1s.length}`);

  if (!appShell) {
    for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
      if (!/\balt\s*=/i.test(match[0])) failures.push(`${rel}: <img> without alt text`);
    }
  }

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const [, href, inner] = match;
    const label = textOf(inner);
    if (!label && !/aria-label\s*=/i.test(match[0]) && !/title\s*=/i.test(match[0])) {
      failures.push(`${rel}: anchor has no accessible name (${href})`);
    }

    if (
      href === "" ||
      href.startsWith("#") ||
      href.startsWith("//") ||
      /^[a-z][a-z0-9+.-]*:/i.test(href)
    ) {
      continue;
    }

    const path = href.split("?")[0].split("#")[0];
    if (!path) continue;
    const resolved = path.startsWith("/") ? path.slice(1) : join(dirname(rel), path);
    if (!targetExists(resolved)) failures.push(`${rel}: broken internal link ${href}`);
  }
}

if (failures.length > 0) {
  console.error(`site-smoke: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`site-smoke: ${pages.length} page(s), internal links resolve, a11y basics present`);
