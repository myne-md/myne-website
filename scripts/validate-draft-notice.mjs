#!/usr/bin/env node
// Post-build gate for the site-wide draft notice (myne-md/myne-website#33).
//
// ── What it prevents ────────────────────────────────────────────────────────
//
// Four silent failures, none of them visible to the compiler, to `astro check`
// or to a reader of the diff that causes them.
//
// 1. A PAGE WITH NO NOTICE. The notice renders from LandingLayout, which every
//    other layout wraps, so coverage is inherited rather than declared. A route
//    that builds its own <html> (pages/themes/preview-frame.html.ts does, and
//    it is right to) inherits nothing, and nothing says so. The exclusion list
//    below is therefore the roster: an unlisted page without the notice fails,
//    and so does a listed one that no longer needs listing.
//
// 2. A LEGAL PAGE WITH THE WRONG NOTICE, which is worse than none. The layout
//    prop defaults to the product-status wording ("no feature described here is
//    a commitment"). On a document the reader is being asked to accept, that
//    sentence is both wrong and load-bearing, and a presence check passes it
//    happily, since the notice IS there. So every page that puts itself in the
//    legal section must state a variant out loud, and a German one must state
//    its language too: `noticeLang` defaults to English, so a German legal page
//    that drops it ships an English disclaimer under German prose.
//
// 3. A NOTICE THAT RENDERS INVISIBLE. Check 1 is a grep for a class attribute,
//    and this component has already shipped once with that attribute present
//    and its stylesheet unparseable, so every grep passed while nothing was
//    drawn. Check 3 closes that by requiring each covered page to link a
//    stylesheet that actually carries a `.draft-notice` rule.
//
// 4. A ROSTER THAT QUIETLY EMPTIES. Checks 1 and 2 are loops, and a loop over
//    an empty set passes. Check 2's trigger is a presentational nav prop, so a
//    nav refactor moves it and the roster silently drops to zero while the
//    success line still reports check 1's healthy numbers. Both counts now
//    carry a floor and both are printed.
//
// ── Why it reads dist/ and src/ ─────────────────────────────────────────────
//
// Checks 1 and 3 are claims about what shipped. Reading the sources would
// re-derive the layout nesting this script exists to stop trusting. Check 2 is
// the opposite: the variant is an authoring decision, so it is read from the
// page source, where the author sees the failure at the file they edited.
//
// Verify it by breaking it, per the parent repo's CLAUDE.md. The executable
// form of that is scripts/validate-draft-notice.test.mjs, which injects every
// class above and asserts this script names it.
//
// Run: node scripts/validate-draft-notice.mjs  (wired into `pnpm build`, AFTER
// astro build, unlike the two pre-build validators beside it)

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
const PAGES = "src/pages";

// Word-bounded on purpose. The first version matched the prefix
// `class="draft-notice`, which `class="draft-notice-label"` also satisfies, so
// a page whose strip had been renamed away still reported OK as long as the
// label span survived. Injecting exactly that is what found it.
const MARKER = /class="draft-notice[ "]/;
// Word-bounded for the same reason MARKER is, and it was NOT at first: a
// bare `.draft-notice` substring is satisfied by a sheet holding only
// `.draft-notice-label`, so renaming just the strip rule left every
// position, z-index, background and border declaration gone while this
// check still reported a styled chunk.
const CSS_RULE = /\.draft-notice[^-\w]/;
const CSS_RULE_NAME = ".draft-notice";

// Floors, so a loop that stops seeing anything fails instead of passing.
// MIN_LEGAL_PAGES is the exact current count, because that roster is a fixed
// set of documents and one leaving it is an event. MIN_COVERED_PAGES carries
// deliberate slack under the measured 140: the guide and ledger subtrees are
// content-driven, so pages legitimately come and go there, and a floor pinned
// to the exact count would fail on every article added or removed. The slack
// is what the per-page checks above cover; this floor only catches the whole
// mechanism falling out.
const MIN_LEGAL_PAGES = 9;
const MIN_COVERED_PAGES = 130;

// Legal routes whose prose is German, so their notice must be too. A roster
// rather than a heuristic, because "is this page German" is not something a
// scan decides; it is compared in both directions, so an entry naming a page
// that no longer exists fails as stale.
const GERMAN_LEGAL_PAGES = [
  "behoerdenanfragen.astro",
  "datenschutz.astro",
  "meldung.astro",
  "nutzungsbedingungen.astro",
];

// Pages that legitimately ship no notice. Each entry carries a reason, and the
// reason is length-checked so "" cannot be used to wave one through.
const EXCLUDED = {
  "impressum/index.html":
    "An Impressum is a statutory identity declaration under section 5 DDG. It is complete or it is not, and no draft state exists for it, so a notice qualifying its force would be qualifying a declaration whose truth is not disclaimable. Its missing ladungsfaehige Anschrift is already stated on the page as a placeholder, so the incompleteness is disclosed rather than hidden (example-org/operations#9).",
  "themes/builder/index.html":
    "The theme builder is the only page in the site with body{overflow:hidden}: its pane is fixed to the viewport bottom and the document never scrolls, so the strip cannot settle into its own flow height at the end of the page the way it does everywhere else. It would paint opaquely over the bottom band of a drag-driven colour editor and swallow clicks there, permanently.",
  "themes/preview-frame.html":
    "The theme-preview iframe builds its own <html> and is rendered INSIDE the builder as a specimen of a theme. A notice there would be drawn as part of the theme being previewed.",
};

const fail = [];

// ── self-check: the exclusion list has to mean something ────────────────────
for (const [path, reason] of Object.entries(EXCLUDED)) {
  if (!reason || reason.trim().length < 40) {
    fail.push(`EXCLUDED["${path}"] has no usable reason. Say why this page ships no notice.`);
  }
}

const walk = (dir, test, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, test, out);
    else if (test(entry)) out.push(full);
  }
  return out;
};

// ── check 1 + 3: every built page carries the notice, and it is styled ──────
if (!existsSync(DIST)) {
  console.error(`validate-draft-notice: FAIL. No ${DIST}/ to read; run this AFTER astro build.`);
  process.exit(1);
}
const html = walk(DIST, (e) => e.endsWith(".html"));
if (html.length === 0) {
  console.error(`validate-draft-notice: FAIL. ${DIST}/ holds no HTML at all.`);
  process.exit(1);
}

// The stylesheets that actually carry the rule. Astro decides which chunk the
// is:global block lands in, and today it is a chunk named for an unrelated
// component, so the association is real but incidental and must be measured
// rather than assumed.
const styled = walk(DIST, (e) => e.endsWith(".css"))
  .filter((f) => CSS_RULE.test(readFileSync(f, "utf8")))
  .map((f) => relative(DIST, f));
if (styled.length === 0) {
  fail.push(`no built stylesheet carries a ${CSS_RULE_NAME} rule, so the notice renders unstyled`);
}

let redirects = 0;
const covered = new Set();
for (const file of html) {
  const rel = relative(DIST, file);
  const body = readFileSync(file, "utf8");
  if (MARKER.test(body)) {
    covered.add(rel);
    if (rel in EXCLUDED) {
      fail.push(`${rel}: listed in EXCLUDED but now carries the notice. Drop the entry.`);
    }
    if (styled.length && !styled.some((css) => body.includes(css))) {
      fail.push(`${rel}: carries the notice but links no stylesheet holding the ${CSS_RULE_NAME} rule`);
    }
    continue;
  }
  // Redirect stubs are exempt BY CONTENT, never by path: Astro.redirect
  // generates them, so a path entry goes stale the moment a redirect moves.
  if (/<meta\s+http-equiv="refresh"/i.test(body)) {
    redirects++;
    continue;
  }
  if (rel in EXCLUDED) continue;
  fail.push(`${rel}: built page carries no draft notice, and is not in EXCLUDED`);
}
for (const path of Object.keys(EXCLUDED)) {
  if (!html.some((f) => relative(DIST, f) === path)) {
    fail.push(`EXCLUDED["${path}"] names a page that no longer builds. Stale entry.`);
  }
}
if (covered.size < MIN_COVERED_PAGES) {
  fail.push(
    `only ${covered.size} pages carry the notice, floor is ${MIN_COVERED_PAGES}. ` +
      `Either coverage regressed or the floor needs a deliberate move.`,
  );
}

// ── check 2 + 4: every legal page declares its variant, and its language ────
const astro = walk(PAGES, (e) => e.endsWith(".astro"));
let legalPages = 0;
const germanSeen = new Set();
for (const file of astro) {
  const src = readFileSync(file, "utf8");
  if (!/active=\{?"legal"\}?/.test(src)) continue;
  legalPages++;
  const rel = relative(PAGES, file);
  if (!/\bnotice="(status|draft|updating|none)"/.test(src)) {
    fail.push(
      `src/pages/${rel}: legal page with no explicit notice=, so it inherits the ` +
        `product-status wording under a document the reader is asked to accept`,
    );
  }
  if (GERMAN_LEGAL_PAGES.includes(rel)) {
    germanSeen.add(rel);
    if (!/\bnotice="none"/.test(src) && !/\bnoticeLang="de"/.test(src)) {
      fail.push(
        `src/pages/${rel}: German legal page with no noticeLang="de", so it ships an ` +
          `English disclaimer under German prose`,
      );
    }
  }
}
for (const rel of GERMAN_LEGAL_PAGES) {
  if (!germanSeen.has(rel)) {
    fail.push(`GERMAN_LEGAL_PAGES names ${rel}, which is not a legal page here. Stale entry.`);
  }
}
// ── check 5: the declared language survived into the built page ────────────
// The evidence is already in the output: the aside carries lang="de". Reason 2
// in the header is a claim about what SHIPPED, and until this check it was
// only ever tested against what the author wrote.
for (const rel of GERMAN_LEGAL_PAGES) {
  const built = join(DIST, rel.replace(/\.astro$/, ""), "index.html");
  if (!existsSync(built)) continue; // the stale-roster check above owns this case
  const body = readFileSync(built, "utf8");
  if (!MARKER.test(body)) continue; // a notice-free page is check 1's business
  if (!/<aside class="draft-notice[^>]*\blang="de"/.test(body)) {
    fail.push(
      `${relative(DIST, built)}: German legal page, but its built notice does not carry ` +
        `lang="de". The prop is declared in the source, so the threading through the ` +
        `layout is what broke.`,
    );
  }
}

if (legalPages < MIN_LEGAL_PAGES) {
  fail.push(
    `check 2 examined only ${legalPages} legal pages, floor is ${MIN_LEGAL_PAGES}. ` +
      `The trigger is a nav prop, so a nav refactor empties this roster silently.`,
  );
}

if (fail.length) {
  console.error(`validate-draft-notice: FAIL (${fail.length})`);
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `validate-draft-notice: OK. ${covered.size}/${html.length} pages carry it and link one of ` +
    `${styled.length} styled chunks, ${legalPages} legal pages declare a variant ` +
    `(${germanSeen.size} German), ${Object.keys(EXCLUDED).length} excluded with reasons, ` +
    `${redirects} redirect stubs exempt`,
);
