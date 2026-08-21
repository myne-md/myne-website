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
//
// It is also not enough on its own, and that took a second pass to see. The
// component ships a `@media print` block that RE-DECLARES `.draft-notice`
// (position:static and a light palette, so the draft status travels with a
// printed legal page). Delete the screen rule and leave the print block and
// this check stayed green: the selector is present, `styled` is non-empty,
// every page still links the chunk, and the notice renders unstyled on
// screen. That is exactly the failure check 3 exists for, wearing the shape
// check 3 was looking for.
//
// So two things are required now. Print blocks come out before the sheet is
// read, and the surviving rule has to carry `position: sticky`, which is the
// declaration that makes the strip a strip and is the one the print block
// deliberately overrides. Requiring a load-bearing declaration rather than a
// selector means a stripper that misses a block still cannot pass a print-only
// survivor.
// The word boundary is a LOOKAHEAD rather than a character class, which the
// first version got wrong and the clean fixture caught: `[^-\w]` consumes the
// character it tests, so on the minified `.draft-notice{position:sticky}` it
// ate the opening brace and the rule body never matched. Nothing else would
// have said so, since the result is a guard that reports every sheet unstyled.
const CSS_RULE = /\.draft-notice(?![-\w])[^{}]*\{([^{}]*)\}/g;
const CSS_LOAD_BEARING = /position\s*:\s*sticky/;
const CSS_RULE_NAME = ".draft-notice";

// Brace-balanced, because a nested block inside the print block would end the
// removal early on a naive scan. `@media not print` would be removed too and
// is not used here; if it ever is, this reads as a missing screen rule, which
// fails loudly rather than passing quietly.
const stripPrintBlocks = (css) => {
  const at = /@media[^{]*\bprint\b[^{]*\{/g;
  let out = "";
  let cut = 0;
  let m;
  while ((m = at.exec(css))) {
    out += css.slice(cut, m.index);
    let depth = 1;
    let j = at.lastIndex;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    cut = j;
    at.lastIndex = j;
  }
  return out + css.slice(cut);
};

const carriesScreenRule = (css) => {
  for (const m of stripPrintBlocks(css).matchAll(CSS_RULE)) {
    if (CSS_LOAD_BEARING.test(m[1])) return true;
  }
  return false;
};

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
//
// Staleness was the only direction it was compared in at first, and that is
// the weaker half. A roster is checked for entries it should not have; nothing
// checked it for entries it should. So a NEW German legal page that dropped
// noticeLang="de" shipped an English disclaimer under German prose, and every
// check passed, because the list it needed to be in was the list nobody had
// updated. The roster only ever covered pages that existed when it was written.
//
// The completeness half is derived instead of listed. Every legal document
// here is a bilingual pair and each side links the other in its last section
// ("Deutsche Fassung: <a href="/meldung/">"), so an English legal page NAMES
// its German twin and the roster has a second witness. Compared both ways: a
// twin nobody listed fails, and a listed page nothing links to fails too,
// since losing the link is losing the witness.
//
// Residual, stated rather than hidden: a German legal page with no English
// twin carries no signal a scan can read. The convention that every legal page
// links its counterpart is what makes this work, and a page breaking it has to
// be added here by hand and will be named until it is.
const GERMAN_TWIN_LINK = /Deutsche Fassung:[\s\S]{0,120}?href="\/([a-z0-9-]+)\//g;
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
  .filter((f) => carriesScreenRule(readFileSync(f, "utf8")))
  .map((f) => relative(DIST, f));
if (styled.length === 0) {
  fail.push(
    `no built stylesheet carries a ${CSS_RULE_NAME} rule with position:sticky outside ` +
      `@media print, so the notice renders unstyled on screen`,
  );
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
const germanLinked = new Set();
for (const file of astro) {
  const src = readFileSync(file, "utf8");
  if (!/active=\{?"legal"\}?/.test(src)) continue;
  legalPages++;
  const rel = relative(PAGES, file);
  for (const m of src.matchAll(GERMAN_TWIN_LINK)) germanLinked.add(`${m[1]}.astro`);
  const declared = src.match(/\bnotice="(status|draft|updating|none)"/);
  if (!declared) {
    fail.push(
      `src/pages/${rel}: legal page with no explicit notice=, so it inherits the ` +
        `product-status wording under a document the reader is asked to accept`,
    );
  } else if (declared[1] === "status") {
    // The presence check above was satisfied by the one answer reason 2 in this
    // file's header says must never be given here: `status` IS the wording it
    // describes ("Features described here are not commitments"), so declaring
    // it out loud on a legal page is not different from inheriting it, and the
    // check that exists to stop the inheritance was accepting it as the fix.
    fail.push(
      `src/pages/${rel}: legal page declaring notice="status", which is the product-status ` +
        `wording on a document the reader is asked to accept. That is the case reason 2 ` +
        `exists for; declaring it explicitly is not different from inheriting it.`,
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
  if (!germanLinked.has(rel)) {
    fail.push(
      `GERMAN_LEGAL_PAGES names ${rel}, but no English legal page links to it as its ` +
        `"Deutsche Fassung". The roster's second witness is gone, so from here on it is ` +
        `the only thing asserting this page is German.`,
    );
  }
}
for (const rel of germanLinked) {
  if (!GERMAN_LEGAL_PAGES.includes(rel)) {
    fail.push(
      `src/pages/${rel} is linked as the German version of an English legal page but is ` +
        `not in GERMAN_LEGAL_PAGES, so nothing checks that it declares noticeLang="de" ` +
        `and it can ship an English disclaimer under German prose.`,
    );
  }
}
// ── check 5: the declared language survived into the built page ────────────
// The evidence is already in the output: the aside carries lang="de". Reason 2
// in the header is a claim about what SHIPPED, and until this check it was
// only ever tested against what the author wrote.
let germanBuilt = 0;
for (const rel of GERMAN_LEGAL_PAGES) {
  const built = join(DIST, rel.replace(/\.astro$/, ""), "index.html");
  if (!existsSync(built)) continue; // counted below, so it cannot be a silent skip
  germanBuilt++;
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

// The non-vacuity floor checks 1, 2 and 4 all carry, and this loop did not.
// Its comment said the stale-roster check above owned the missing-file case, and
// that check reads the page SOURCE; nothing there says anything about the built
// path. That path is assembled as dist/<name>/index.html, which holds only
// while astro.config.mjs leaves build.format at its default `directory`. A
// format change turns this whole check into a no-op for all four pages while
// check 2 keeps passing, which is the roster-empties-quietly shape reason 4
// exists to prevent.
if (germanBuilt < GERMAN_LEGAL_PAGES.length) {
  fail.push(
    `check 5 inspected only ${germanBuilt} of ${GERMAN_LEGAL_PAGES.length} German built ` +
      `pages. It reads dist/<name>/index.html, so a build.format change makes it a silent ` +
      `no-op rather than a failure.`,
  );
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
    `(${germanSeen.size} German, ${germanBuilt} verified in dist), ` +
    `${Object.keys(EXCLUDED).length} excluded with reasons, ` +
    `${redirects} redirect stubs exempt`,
);
