#!/usr/bin/env node
// Injection tests for scripts/validate-draft-notice.mjs.
//
// The parent repo's AGENTS.md is explicit that a guard nobody has broken is a
// guard nobody has tested, and that "the tree is still green" is not evidence
// after a guard is edited, because a guard that has stopped checking is green
// by definition. The guard's own header used to carry those instructions as
// prose. Prose does not run, and the first version of that guard shipped with
// four blind spots that three separate reviewers found by hand.
//
// Each case builds a throwaway site tree, injects exactly one defect, runs the
// real script against it, and asserts the failure names that defect. The clean
// case runs first, so a fixture that fails for an unrelated reason is caught
// before any injection is interpreted.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";

const GUARD = resolve("scripts/validate-draft-notice.mjs");

const STYLED_CSS = "_astro/site.css";
const notice = (lang = "en") =>
  `<aside class="draft-notice mono" role="note" lang="${lang}"><span>x</span></aside>`;
const NOTICE = notice();

// The bilingual pairs, in the direction the guard derives them: an English
// legal page names its German twin in its last section, which is what lets the
// German roster be compared against something other than itself.
const TWINS = {
  terms: "nutzungsbedingungen",
  privacy: "datenschutz",
};
const GERMAN = Object.values(TWINS).slice().sort();
const ENGLISH_LEGAL = Object.keys(TWINS);
const twinLink = (de) => `Deutsche Fassung: <a href="/${de}/" style="color:#8aa4d0;">x</a>.`;

// The excluded roster is read out of the guard rather than copied here. A copy
// would make "clean fixture passes" fail every time a page is legitimately
// added to EXCLUDED, which reads as a broken guard and is really a stale test,
// and the stale-entry case below would then be testing the copy instead of the
// roster. Reading it keeps one source and leaves that case meaningful.
const GUARD_SRC = readFileSync(GUARD, "utf8");
const EXCLUDED_BLOCK = GUARD_SRC.slice(
  GUARD_SRC.indexOf("const EXCLUDED = {"),
  GUARD_SRC.indexOf("\n};", GUARD_SRC.indexOf("const EXCLUDED = {")),
);
// Both formattings, because nothing enforces one: this repo has no prettier
// config, so a valid entry written on a single line is a real possibility. The
// first version required a line break and silently extracted 3 of 4, which
// turned the CLEAN case red with a message blaming the guard's roster for what
// was this regex.
const EXCLUDED_PAGES = [...EXCLUDED_BLOCK.matchAll(/"([^"]+\.html)":/g)].map((m) => m[1]);
// Counted independently of the extraction that produced the list, so a regex
// that reads some of the roster fails here rather than downstream.
const EXCLUDED_KEYS = (EXCLUDED_BLOCK.match(/^\s*"[^"]+\.html":/gm) || []).length;
assert.equal(
  EXCLUDED_PAGES.length,
  EXCLUDED_KEYS,
  "the EXCLUDED extraction read fewer entries than the guard declares",
);
assert.ok(EXCLUDED_PAGES.length > 0, "could not read EXCLUDED out of the guard");

const write = (root, rel, body) => {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, body);
};

// A tree the guard passes. Sized past both floors on purpose: the floors are
// calibrated to the real site, so a fixture below them would fail for a reason
// that has nothing to do with the case under test.
const buildFixture = () => {
  const root = mkdtempSync(join(tmpdir(), "draft-notice-"));
  write(root, join("dist", STYLED_CSS), ".draft-notice{position:sticky}");

  const page = (name, lang = "en") =>
    write(
      root,
      `dist/${name}/index.html`,
      `<link rel="stylesheet" href="/${STYLED_CSS}">${notice(lang)}`,
    );
  for (let i = 0; i < 135; i++) page(`filler-${i}`);
  for (const n of GERMAN) page(n, "de");
  for (const n of ENGLISH_LEGAL) page(n);

  // Every page the guard's own EXCLUDED roster names, plus one redirect stub.
  for (const rel of EXCLUDED_PAGES) write(root, join("dist", rel), "<p>excluded</p>");
  write(root, "dist/user-guide/index.html", '<meta http-equiv="refresh" content="2;url=/x/">');

  const legal = (name, props, body = "") =>
    write(
      root,
      `src/pages/${name}.astro`,
      `<LandingLayout ${props}>\n<GlassNav active="legal" />\n${body}\n</LandingLayout>`,
    );
  for (const n of GERMAN) legal(n, 'notice="draft" noticeLang="de"');
  for (const [en, de] of Object.entries(TWINS)) legal(en, 'notice="draft"', twinLink(de));
  legal("impressum", 'notice="none"');
  // A non-legal page, to prove check 2 filters rather than counting everything.
  write(root, "src/pages/index.astro", "<LandingLayout>\n<GlassNav active=\"home\" />\n</LandingLayout>");

  return root;
};

const run = (root) => {
  const r = spawnSync(process.execPath, [GUARD], { cwd: root, encoding: "utf8" });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};

const withFixture = (fn) => {
  const root = buildFixture();
  try {
    return fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

test("clean fixture passes", () => {
  withFixture((root) => {
    const { code, out } = run(root);
    assert.equal(code, 0, out);
    assert.match(out, /5 legal pages declare a variant \(2 German, 2 verified in dist\)/);
  });
});

test("a built page with no notice is named", () => {
  withFixture((root) => {
    write(root, "dist/filler-7/index.html", `<link rel="stylesheet" href="/${STYLED_CSS}">no strip`);
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, /filler-7\/index\.html: built page carries no draft notice/);
  });
});

test("the label alone does not satisfy the marker", () => {
  withFixture((root) => {
    write(
      root,
      "dist/filler-8/index.html",
      `<link rel="stylesheet" href="/${STYLED_CSS}"><span class="draft-notice-label">Draft</span>`,
    );
    const { code, out } = run(root);
    assert.equal(code, 1, "a prefix match would accept draft-notice-label and pass");
    assert.match(out, /filler-8\/index\.html: built page carries no draft notice/);
  });
});

test("a legal page with no notice= is named", () => {
  withFixture((root) => {
    write(root, "src/pages/terms.astro", '<LandingLayout>\n<GlassNav active="legal" />\n</LandingLayout>');
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, /terms\.astro: legal page with no explicit notice=/);
  });
});

test("a legal page in a subdirectory is not invisible", () => {
  withFixture((root) => {
    write(root, "src/pages/legalsub/probe.astro", '<LandingLayout>\n<GlassNav active="legal" />\n</LandingLayout>');
    const { code, out } = run(root);
    assert.equal(code, 1, "a non-recursive scan would never open this file");
    assert.match(out, /legalsub\/probe\.astro: legal page with no explicit notice=/);
  });
});

test("a German legal page that drops noticeLang is named", () => {
  withFixture((root) => {
    write(root, "src/pages/datenschutz.astro", '<LandingLayout notice="updating">\n<GlassNav active="legal" />\n</LandingLayout>');
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, /datenschutz\.astro: German legal page with no noticeLang="de"/);
  });
});

test("an emptied legal roster fails instead of passing", () => {
  withFixture((root) => {
    // Semantically identical to `active="legal"` in JSX, which is exactly how a
    // nav refactor empties the roster without changing any behaviour.
    for (const n of [...GERMAN, ...ENGLISH_LEGAL, "impressum"]) {
      write(root, `src/pages/${n}.astro`, "<LandingLayout>\n<GlassNav active={NAV.legal} />\n</LandingLayout>");
    }
    const { code, out } = run(root);
    assert.equal(code, 1, "a loop over an empty roster passes without a floor");
    assert.match(out, /check 2 examined only 0 legal pages/);
  });
});

test("a notice with no stylesheet behind it is named", () => {
  withFixture((root) => {
    write(root, join("dist", STYLED_CSS), "body{margin:0}");
    const { code, out } = run(root);
    assert.equal(code, 1, "the class attribute is present; only the rule is gone");
    assert.match(out, /no built stylesheet carries a \.draft-notice rule/);
  });
});

test("a page that carries the notice but links no styled chunk is named", () => {
  withFixture((root) => {
    write(root, "dist/filler-9/index.html", NOTICE);
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, /filler-9\/index\.html: carries the notice but links no stylesheet/);
  });
});

test("a stale EXCLUDED entry is named", () => {
  withFixture((root) => {
    const victim = EXCLUDED_PAGES[0];
    rmSync(join(root, "dist", victim));
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, new RegExp(`${victim.replace(/[/.]/g, "\\$&")}.*no longer builds`));
  });
});

test("an EXCLUDED page that regained the notice is named", () => {
  withFixture((root) => {
    const victim = EXCLUDED_PAGES[0];
    write(root, join("dist", victim), `<link rel="stylesheet" href="/${STYLED_CSS}">${NOTICE}`);
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(
      out,
      new RegExp(`${victim.replace(/[/.]/g, "\\$&")}: listed in EXCLUDED but now carries`),
    );
  });
});

test("a stale GERMAN_LEGAL_PAGES entry is named", () => {
  withFixture((root) => {
    rmSync(join(root, "src/pages/datenschutz.astro"));
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, /GERMAN_LEGAL_PAGES names datenschutz\.astro/);
  });
});

test("a missing dist fails closed rather than reporting nothing to check", () => {
  withFixture((root) => {
    rmSync(join(root, "dist"), { recursive: true });
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, /No dist\/ to read/);
  });
});

test("a partially renamed stylesheet does not count as styled", () => {
  withFixture((root) => {
    // Only the strip rule is renamed; the label rule survives, which a bare
    // substring test accepts while every visual declaration is gone.
    write(root, join("dist", STYLED_CSS), ".draft-notice-label{color:red}");
    const { code, out } = run(root);
    assert.equal(code, 1, "a bare `.draft-notice` substring would match the label rule");
    assert.match(out, /no built stylesheet carries a \.draft-notice rule/);
  });
});

test("a German page whose built notice lost lang=de is named", () => {
  withFixture((root) => {
    // The source still declares noticeLang="de"; only the built output lost it,
    // which is what a hardcoded lang in the layout would produce.
    write(
      root,
      "dist/datenschutz/index.html",
      `<link rel="stylesheet" href="/${STYLED_CSS}"><aside class="draft-notice mono" role="note" lang="en"><span>x</span></aside>`,
    );
    const { code, out } = run(root);
    assert.equal(code, 1, "check 2 reads the source, so only a dist-side check sees this");
    assert.match(out, /datenschutz\/index\.html: German legal page, but its built notice/);
  });
});

test("coverage falling off a cliff fails even when every page passes", () => {
  withFixture((root) => {
    // Every surviving page is still correct; there are just far fewer of them.
    for (let i = 0; i < 130; i++) rmSync(join(root, `dist/filler-${i}/index.html`));
    const { code, out } = run(root);
    assert.equal(code, 1, "per-page checks all pass here; only the floor can catch it");
    assert.match(out, /pages carry the notice, floor is/);
  });
});

test("an exclusion whose reason is a token fails the self-check", () => {
  withFixture((root) => {
    // Not an empty string: a short one, since "" is the case anyone would try.
    const guard = readFileSync(GUARD, "utf8").replace(
      /("[^"]+\.html":\s*\n?\s*)"[^"]{40,}"/,
      '$1"iframe"',
    );
    const local = join(root, "guard.mjs");
    writeFileSync(local, guard);
    const r = spawnSync(process.execPath, [local], { cwd: root, encoding: "utf8" });
    assert.equal(r.status, 1);
    assert.match(`${r.stdout}${r.stderr}`, /has no usable reason/);
  });
});

test("a stylesheet whose only .draft-notice rule is inside @media print is not styled", () => {
  withFixture((root) => {
    // The screen rule is gone; the component's real print block survives. Every
    // page still links this chunk, so only a print-aware read sees it.
    write(
      root,
      join("dist", STYLED_CSS),
      "@media print{.draft-notice{position:static;background:transparent}" +
        ".draft-notice-label{color:#000}}",
    );
    const { code, out } = run(root);
    assert.equal(code, 1, "a selector-only test passes this: the selector is right there");
    assert.match(out, /no built stylesheet carries a \.draft-notice rule with position:sticky/);
  });
});

test("a .draft-notice rule with no load-bearing declaration is not styled", () => {
  withFixture((root) => {
    // Not a rename and not a print block: the rule is on screen and has lost
    // the one property that makes the strip a strip.
    write(root, join("dist", STYLED_CSS), ".draft-notice{color:#c4c4c0;font-size:11px}");
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, /position:sticky/);
  });
});

test("a screen rule survives a print block earlier in the sheet", () => {
  withFixture((root) => {
    // The stripper has to be brace-balanced and has to resume: a naive scan
    // that drops everything after the first @media print reports this as
    // unstyled, which would be a false failure rather than a caught defect.
    write(
      root,
      join("dist", STYLED_CSS),
      "@media print{.draft-notice{position:static}@media (min-width:1px){.x{color:red}}}" +
        ".draft-notice{position:sticky;bottom:0}",
    );
    const { code, out } = run(root);
    assert.equal(code, 0, out);
  });
});

test("a legal page declaring notice=\"status\" is named", () => {
  withFixture((root) => {
    // The presence check is satisfied: the page declares a variant out loud.
    // It declares the one variant reason 2 says must never appear here.
    write(
      root,
      "src/pages/terms.astro",
      `<LandingLayout notice="status">\n<GlassNav active="legal" />\n${twinLink("nutzungsbedingungen")}\n</LandingLayout>`,
    );
    const { code, out } = run(root);
    assert.equal(code, 1, "an explicit declaration passed the presence check");
    assert.match(out, /terms\.astro: legal page declaring notice="status"/);
  });
});

test("a German twin nobody listed is named", () => {
  withFixture((root) => {
    // A new bilingual pair, added the way every existing one is, with the
    // German half missing from the roster. Its noticeLang goes unchecked.
    write(
      root,
      "src/pages/widerruf.astro",
      '<LandingLayout notice="draft" noticeLang="de">\n<GlassNav active="legal" />\n</LandingLayout>',
    );
    write(
      root,
      "src/pages/withdrawal.astro",
      `<LandingLayout notice="draft">\n<GlassNav active="legal" />\n${twinLink("widerruf")}\n</LandingLayout>`,
    );
    const { code, out } = run(root);
    assert.equal(code, 1, "the roster was only ever checked for entries it should not have");
    assert.match(out, /widerruf\.astro is linked as the German version/);
  });
});

test("a roster entry whose twin link was dropped is named", () => {
  withFixture((root) => {
    // The English page loses its "Deutsche Fassung" link, so the roster becomes
    // the only witness that datenschutz.astro is German.
    write(
      root,
      "src/pages/privacy.astro",
      '<LandingLayout notice="draft">\n<GlassNav active="legal" />\n</LandingLayout>',
    );
    const { code, out } = run(root);
    assert.equal(code, 1);
    assert.match(out, /GERMAN_LEGAL_PAGES names datenschutz\.astro, but no English legal page/);
  });
});

test("check 5 fails vacuously-empty instead of reporting OK", () => {
  withFixture((root) => {
    // What a build.format change looks like from here: the sources are
    // untouched and correct, and every dist/<name>/index.html check 5 reaches
    // for is somewhere else. Coverage stays above its floor, so only check 5's
    // own floor can catch it.
    for (const n of GERMAN) rmSync(join(root, `dist/${n}`), { recursive: true, force: true });
    const { code, out } = run(root);
    assert.equal(code, 1, "every other check passes here");
    assert.match(out, /check 5 inspected only 0 of 2 German built pages/);
  });
});
