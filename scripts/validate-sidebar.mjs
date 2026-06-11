#!/usr/bin/env node
// validate-sidebar — manifest <-> filesystem integrity gate for the user guide.
//
// Zero dependencies (no tsx, no yaml lib). Runs before `astro build` (see the
// `build` script in package.json) so manifest drift fails the lefthook
// pre-push gate and the Woodpecker docker build alike — drift can never again
// be silent (it was, because getStaticPaths intersects manifest∩disk without
// error). Reintroduces the prototype's skipped Task 13 (decisions.md, MYND-244).
//
// Errors (exit 1):
//   - manifest schema violation
//   - a manifest article slug with no .md file on disk
//   - an on-disk non-underscore .md not listed in the manifest (orphan)
//   - a file whose frontmatter `category` != its manifest/directory category
//   - any frontmatter tag outside the controlled vocabulary
// Warning (non-blocking):
//   - a tag used on >6 articles spanning >1 category (SYNC-2 review rule)

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

// --- Controlled tag vocabulary (SYNC-2) -------------------------------------
// MACHINE-READABLE SOURCE OF ENFORCEMENT. The human-readable mirror lives in
// src/content/user-guide/_authoring.md block 4. A vocabulary extension is a
// deliberate one-line PR touching BOTH this constant and that mirror.
const TAG_VOCABULARY = new Set([
  "basics", "vault", "notes", "editor", "markdown", "links", "tags", "search",
  "attachments", "import", "backup", "recovery", "snapshots", "templates",
  "folders", "sidebar", "workspace", "settings", "privacy", "security",
]);
// ---------------------------------------------------------------------------

const UG_DIR = fileURLToPath(new URL("../src/content/user-guide/", import.meta.url));
const MANIFEST = fileURLToPath(new URL("../src/content/user-guide/_sidebar.json", import.meta.url));

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// --- Minimal frontmatter reader (YAML subset: `key: scalar` + inline arrays) -
function readFrontmatter(absPath) {
  const text = readFileSync(absPath, "utf8");
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const block = text.slice(3, end).trim();
  const fm = {};
  for (const line of block.split("\n")) {
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      // inline array — accept "quoted" or bare tokens
      fm[key] = val
        .slice(1, -1)
        .split(",")
        .map((t) => t.trim().replace(/^["']|["']$/g, ""))
        .filter((t) => t.length > 0);
    } else {
      fm[key] = val.replace(/^["']|["']$/g, "");
    }
  }
  return fm;
}

// --- Load + schema-check the manifest ---------------------------------------
let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
} catch (e) {
  console.error(`validate-sidebar: cannot read/parse _sidebar.json — ${e.message}`);
  process.exit(1);
}
if (!Array.isArray(manifest)) {
  console.error("validate-sidebar: _sidebar.json must be a JSON array of categories");
  process.exit(1);
}

const manifestSlugs = new Set(); // `${category}/${article}`
const isStr = (v) => typeof v === "string" && v.trim().length > 0;

for (const [i, cat] of manifest.entries()) {
  const where = `category[${i}]${cat && cat.slug ? ` (${cat.slug})` : ""}`;
  if (!cat || typeof cat !== "object") { err(`${where}: not an object`); continue; }
  if (!isStr(cat.slug)) err(`${where}: missing/empty "slug"`);
  if (!isStr(cat.label)) err(`${where}: missing/empty "label"`);
  if (!isStr(cat.description)) err(`${where}: missing/empty "description"`);
  if (!Array.isArray(cat.articles) || cat.articles.length === 0) {
    err(`${where}: "articles" must be a non-empty array`);
    continue;
  }
  for (const a of cat.articles) {
    if (!isStr(a)) { err(`${where}: article slug must be a non-empty string`); continue; }
    manifestSlugs.add(`${cat.slug}/${a}`);
  }
  if (cat.intro !== undefined) {
    if (!isStr(cat.intro)) err(`${where}: "intro" must be a non-empty string when present`);
    else if (!cat.articles.includes(cat.intro)) err(`${where}: intro "${cat.intro}" is not listed in articles`);
  }
}

// --- Every manifest slug must have a file on disk ---------------------------
for (const slug of manifestSlugs) {
  if (!existsSync(`${UG_DIR}${slug}.md`)) {
    err(`manifest slug "${slug}" has no file at src/content/user-guide/${slug}.md`);
  }
}

// --- Walk disk: orphan check + frontmatter category + tag vocabulary --------
const tagCategories = new Map(); // tag -> Set(category)
const tagArticleCount = new Map(); // tag -> count

for (const entry of readdirSync(UG_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue; // top-level _sidebar.json / _authoring.md ignored
  const category = entry.name;
  const dirPath = `${UG_DIR}${category}/`;
  for (const f of readdirSync(dirPath)) {
    if (!f.endsWith(".md")) continue;
    if (f.startsWith("_")) continue; // underscore convention: not a collection entry
    if (!statSync(`${dirPath}${f}`).isFile()) continue;
    const slug = `${category}/${f.replace(/\.md$/, "")}`;

    if (!manifestSlugs.has(slug)) {
      err(`orphan file "src/content/user-guide/${slug}.md" is not listed in the manifest`);
      // still inspect frontmatter below for completeness
    }

    const fm = readFrontmatter(`${dirPath}${f}`);
    if (!fm) { err(`"${slug}.md": missing or malformed frontmatter`); continue; }

    if (fm.category !== category) {
      err(`"${slug}.md": frontmatter category "${fm.category}" != directory/manifest category "${category}"`);
    }
    const tags = Array.isArray(fm.tags) ? fm.tags : [];
    for (const t of tags) {
      if (!TAG_VOCABULARY.has(t)) {
        err(`"${slug}.md": tag "${t}" is outside the controlled vocabulary (_authoring.md block 4)`);
      }
      tagArticleCount.set(t, (tagArticleCount.get(t) || 0) + 1);
      if (!tagCategories.has(t)) tagCategories.set(t, new Set());
      tagCategories.get(t).add(category);
    }
  }
}

// --- Non-blocking warning: generic tag spanning >1 category on >6 articles ---
for (const [tag, count] of tagArticleCount) {
  if (count > 6 && (tagCategories.get(tag)?.size ?? 0) > 1) {
    warn(`tag "${tag}" is used on ${count} articles across ${tagCategories.get(tag).size} categories (SYNC-2: >6-article category-spanning generic tag)`);
  }
}

// --- Report -----------------------------------------------------------------
for (const w of warnings) console.warn(`  warning: ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`  error: ${e}`);
  console.error(`\nvalidate-sidebar: FAILED with ${errors.length} error(s)${warnings.length ? `, ${warnings.length} warning(s)` : ""}.`);
  process.exit(1);
}
console.log(`validate-sidebar: OK — ${manifestSlugs.size} manifest entries, all files present, no orphans, tags in vocabulary${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
process.exit(0);
