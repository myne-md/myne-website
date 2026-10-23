#!/usr/bin/env node
// Guard for the site-wide light/dark theme. Read this header before changing
// the checks: every one of them exists because the failure it catches is
// invisible to `astro check`, to `pnpm build` and to a reader of the diff.
//
// ── What it protects ────────────────────────────────────────────────────────
//
// 1. THE SHIPPED DARK VIEW. The whole site was dark before the theme switch,
//    and the switch was allowed to add a light theme only by promising the
//    dark one does not move. That promise is a claim about the VALUE LAYER, so
//    this check pins the dark palette: every token the codemod mapped a
//    literal onto must still resolve, in the dark `:root` block, to the exact
//    colour the literal was. A palette edit that quietly shifts `--ink-1` a
//    step fails here, by name, instead of shipping as an "invisible" tint.
//
//    Literals that deliberately NORMALISE to a ramp step (a handful of muted
//    greys, and the `#0c0c0c` panel shade that became `--paper-2`) are recorded
//    in the table with their target, so the drift is stated rather than
//    inferred, and a codemod typo (mapping `#c4c4c0` onto `--ink-1`) fails.
//
// 2. NO STRAY LITERALS IN THE CHROME (the drift ratchet). A colour literal in
//    an inline style or a rule outranks every token, so it is unreachable to
//    the light theme and to any future theme, permanently. Outside the token
//    sheet there are now ZERO, apart from a handful of intentional ones (the
//    hero mask's `#000`, the print block's `#000`/`#999`, the no-JS
//    `theme-color` meta, and black shadows). The check allows exactly those, by
//    occurrence count, and fails on any other hex literal or numeric `rgb()`,
//    in BOTH spellings (comma and space/slash).
//
//    Two deliberate scope cuts, both stated rather than silent: black shadows
//    and scrims stay literal (they are theme-neutral), and `themes/builder.astro`
//    is not scanned at all (it is pinned dark with its own `--tb-*` palette and
//    a live-preview iframe, so a light-theme ratchet does not apply).
//
//    On the dark view moving: the token sheet reproduces the shipped dark values
//    exactly for the ramp, the accent, the state colours and every alpha
//    hairline. A handful of off-ramp literals deliberately NORMALISE onto a ramp
//    step (the muted greys `#6a6a66`/`#6f6f6c`/`#9a8a8a`/`#a0a09b`/`#8f8f88`
//    onto `--ink-3`, `#cfcfca`/`#cfd6e6` onto `--ink-1`, `#a7a7a2` onto
//    `--ink-2`, `#d8b76a` onto `--warning`, `#5fbf8f` onto `--success`, the
//    `#0c0c0c`/`#111`/`#0f0f0f` panel shade onto `--paper-2`, and `#ffffff`/`#fff`
//    onto `--ink-0`). Each is recorded in MAPPINGS with its `drift` target, so
//    the move is declared and pinned, not prevented; every entry that is not
//    listed here must still resolve to the literal it replaced.
//
// 3. THE PRE-PAINT KEY CANNOT DRIFT FROM THE RUNTIME KEY. The no-flash snippet
//    is inline in LandingLayout's <head> (it must run before the stylesheet,
//    so it cannot import lib/theme.mjs) and therefore duplicates the
//    localStorage key. If the two disagree, a reader's stored choice is written
//    under one name and read under another, so the switch silently never
//    persists, with no error anywhere. The key is compared against THEME_KEY, and
//    the snippet's theme-lock short-circuit is required so the builder stays
//    pinned dark.
//
// Verify these by breaking them: scripts/check-theme-tokens.test.mjs injects a
// shifted palette, a stray literal, and a drifted key, and asserts each is
// named.
//
// Run: node scripts/check-theme-tokens.mjs

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { THEME_KEY } from "../src/lib/theme.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const TOKENS = "src/styles/tokens.css";

/** The literal → token contract the tokenisation applied.
 *  `drift` records a literal that deliberately normalises to another value. */
export const MAPPINGS = [
  // exact ramp
  { from: "#e6e6e4", token: "var(--ink-1)" },
  { from: "#c4c4c0", token: "var(--ink-2)" },
  { from: "#8a8a86", token: "var(--ink-3)" },
  { from: "#54544f", token: "var(--ink-4)" },
  { from: "#0a0a0a", token: "var(--paper)" },
  { from: "#101010", token: "var(--paper-2)" },
  { from: "#1a1a1a", token: "var(--paper-3)" },
  { from: "#f2f2ef", token: "var(--ink-0)" },
  { from: "#8aa4d0", token: "var(--accent)" },
  { from: "#c2a35e", token: "var(--warning)" },
  { from: "#7fb89a", token: "var(--success)" },
  { from: "#d99086", token: "var(--danger)" },
  { from: "#a6bce0", token: "var(--accent-hover)" },
  { from: "#c0d2ee", token: "var(--accent-press)" },
  { from: "rgba(255,255,255,0.1)", token: "rgb(var(--line-rgb) / 0.1)" },
  { from: "rgba(138,164,208,0.12)", token: "rgb(var(--accent-rgb) / 0.12)" },
  { from: "rgba(194,163,94,0.4)", token: "rgb(var(--warning-rgb) / 0.4)" },
  { from: "rgba(230,230,228,0.2)", token: "rgb(var(--ink-rgb) / 0.2)" },
  { from: "rgba(10,10,10,0.18)", token: "rgb(var(--paper-rgb) / 0.18)" },
  { from: "rgba(10,10,10,0.7)", token: "rgb(var(--paper-rgb) / 0.7)" },
  { from: "rgba(10,10,10,0.95)", token: "rgb(var(--paper-rgb) / 0.95)" },
  { from: "rgba(232,231,225,0.3)", token: "rgb(var(--particle-a-rgb) / 0.3)" },
  { from: "rgba(214,226,247,0.9)", token: "rgb(var(--particle-b-rgb) / 0.9)" },
  { from: "rgba(224,233,250,0.9)", token: "rgb(var(--particle-b-rgb) / 0.9)", drift: "rgba(214,226,247,0.9)" },
  { from: "rgba(236,235,231,0.06)", token: "rgb(var(--particle-c-rgb) / 0.06)" },
  // recorded normalisations (the dark value moves to the ramp step)
  { from: "#0c0c0c", token: "var(--paper-2)", drift: "#101010" },
  { from: "#111", token: "var(--paper-2)", drift: "#101010" },
  { from: "#111111", token: "var(--paper-2)", drift: "#101010" },
  { from: "#0f0f0f", token: "var(--paper-2)", drift: "#101010" },
  { from: "#d8b76a", token: "var(--warning)", drift: "#c2a35e" },
  { from: "#5fbf8f", token: "var(--success)", drift: "#7fb89a" },
  { from: "#6a6a66", token: "var(--ink-3)", drift: "#8a8a86" },
  { from: "#6f6f6c", token: "var(--ink-3)", drift: "#8a8a86" },
  { from: "#a7a7a2", token: "var(--ink-2)", drift: "#c4c4c0" },
  { from: "#9a8a8a", token: "var(--ink-3)", drift: "#8a8a86" },
  { from: "#cfcfca", token: "var(--ink-1)", drift: "#e6e6e4" },
  { from: "#cfd6e6", token: "var(--ink-1)", drift: "#e6e6e4" },
  { from: "#ffffff", token: "var(--ink-0)", drift: "#f2f2ef" },
  { from: "#fff", token: "var(--ink-0)", drift: "#f2f2ef" },
  { from: "#a0a09b", token: "var(--ink-3)", drift: "#8a8a86" },
  { from: "#8f8f88", token: "var(--ink-3)", drift: "#8a8a86" },
  // alpha hairlines that become a white-alpha hairline (no solid equivalent)
  { from: "#33332f", token: "rgb(var(--line-rgb) / 0.18)", drift: "rgba(255,255,255,0.18)" },
  { from: "rgba(154,138,138,0.22)", token: "rgb(var(--line-rgb) / 0.22)", drift: "rgba(255,255,255,0.22)" },
  { from: "rgba(6,6,6,0.92)", token: "rgb(var(--scrim-rgb) / 0.92)", drift: "rgba(10,10,10,0.92)" },
  { from: "rgba(8,8,8,0.6)", token: "rgb(var(--scrim-rgb) / 0.6)", drift: "rgba(10,10,10,0.6)" },
];

/** Literals allowed to remain, per file, with the exact occurrence COUNT.
 *  The count is the point: a per-file allow of `#0a0a0a` would exempt it
 *  everywhere in the file, including the `background` sites this change
 *  converted, which is the highest-risk regression in the highest-traffic
 *  layout. Each entry is intentional and named. */
export const ALLOWED_LITERALS = {
  "src/pages/index.astro": [
    { literal: "#000", count: 2, reason: "hero mask gradient (alpha, not a colour)" },
  ],
  "src/layouts/LandingLayout.astro": [
    { literal: "#0a0a0a", count: 1, reason: "<meta name=theme-color> no-JS fallback" },
  ],
};

/** Roots scanned by the drift ratchet. tokens.css is the sheet, not chrome. */
export function guardedFiles(root = ROOT) {
  const out = [];
  const walk = (rel) => {
    const abs = root + rel;
    for (const e of readdirSync(abs)) {
      const r = rel + e;
      const s = statSync(root + r);
      if (s.isDirectory()) walk(r + "/");
      // themes/builder.astro is excluded on purpose: it is pinned dark with its
      // own `--tb-*` palette and a live-preview iframe, so a light-theme literal
      // ratchet does not apply. Its ~65 literals are a decision, not debt.
      else if (r.endsWith(".astro") && !r.includes("themes/builder.astro")) out.push(r);
    }
  };
  walk("src/pages/");
  walk("src/components/");
  walk("src/layouts/");
  out.push("src/styles/userguide.css", "src/styles/ledger.css", "src/styles/global.css");
  return out;
}

/** Remove comments so a literal mentioned in prose is not a finding. */
export function stripComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    if (src.startsWith("<!--", i)) {
      const j = src.indexOf("-->", i + 4);
      if (j < 0) return out;
      i = j + 3;
      continue;
    }
    if (src[i] === "/" && src[i + 1] === "*") {
      const j = src.indexOf("*/", i + 2);
      if (j < 0) return out;
      i = j + 2;
      continue;
    }
    if (src[i] === "/" && src[i + 1] === "/" && src[i - 1] !== ":") {
      let j = src.indexOf("\n", i);
      if (j < 0) j = n;
      i = j;
      continue;
    }
    out += src[i];
    i++;
  }
  return out;
}

/** Parse the FIRST `:root { … }` block of tokens.css into name → raw value. */
export function parseDarkPalette(tokensCss) {
  const start = tokensCss.indexOf(":root {");
  const end = tokensCss.indexOf("}", start);
  const body = tokensCss.slice(start + 6, end);
  const palette = {};
  for (const m of body.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    palette[m[1]] = m[2].trim();
  }
  return palette;
}

/** Resolve a palette value (var() chains + `rgb(var(--x) / a)`) to a raw string. */
export function resolveValue(value, palette, seen = new Set()) {
  const v = value.trim();
  const varOnly = /^var\((--[a-z0-9-]+)\)$/.exec(v);
  if (varOnly) {
    const name = varOnly[1].slice(2);
    if (seen.has(name)) return v;
    seen.add(name);
    return resolveValue(palette[name] ?? v, palette, seen);
  }
  const alpha = /^rgb\(\s*var\((--[a-z0-9-]+)\)\s*\/\s*([0-9.]+)\s*\)$/.exec(v);
  if (alpha) {
    const inner = resolveValue(`var(${alpha[1]})`, palette, seen);
    return `rgb(${inner.trim()} / ${alpha[2]})`;
  }
  const noAlpha = /^rgb\(\s*var\((--[a-z0-9-]+)\)\s*\)$/.exec(v);
  if (noAlpha) {
    const inner = resolveValue(`var(${noAlpha[1]})`, palette, seen);
    return `rgb(${inner.trim()})`;
  }
  return v;
}

/** Canonicalise a colour to [r,g,b,a]; null when it is not a flat colour. */
export function toColor(value) {
  const v = value.trim();
  let m = /^#([0-9a-fA-F]{6})$/.exec(v);
  if (m) return hexToColor(m[1]);
  m = /^#([0-9a-fA-F]{3})$/.exec(v);
  if (m) return hexToColor(m[1].replace(/./g, (c) => c + c));
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+)\s*)?\)$/.exec(v);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])];
  m = /^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\/\s*([0-9.]+)\s*\)$/.exec(v);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  m = /^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\)$/.exec(v);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3]), 1];
  return null;
}

function hexToColor(h) {
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
    1,
  ];
}

const same = (a, b) => a && b && a.every((n, i) => n === b[i]);

/** Check 1: dark value preservation against the mapping contract. */
export function checkValuePreservation(tokensCss) {
  const palette = parseDarkPalette(tokensCss);
  const findings = [];
  for (const { from, token, drift } of MAPPINGS) {
    const got = toColor(resolveValue(token, palette));
    const want = toColor(drift ?? from);
    if (!got) findings.push(`mapping ${from} → ${token}: dark value did not resolve to a colour`);
    else if (!same(got, want))
      findings.push(
        `mapping ${from} → ${token}: dark resolves to [${got}] but the contract says [${want}]`,
      );
  }
  return findings;
}

const HEX_RE = /(?<![\w#])#[0-9a-fA-F]{3,8}\b/g;
// Both spellings the codemod could leave behind: the comma form and the
// space/slash form this change introduced. Missing the second is the near-miss
// that matters, because the token form of every hairline IS that shape, so a
// literal `rgb(255 255 255 / 0.1)` slipping past would look like a token.
const RGB_RE =
  /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[0-9.]+\s*)?\)|rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*[0-9.]+\s*)?\)/g;

/** Check 2: the drift ratchet over the chrome roots. */
export function checkNoStrayLiterals(files) {
  const findings = [];
  for (const [path, src] of Object.entries(files)) {
    const allowed = ALLOWED_LITERALS[path] ?? [];
    const clean = stripComments(src);
    const hexCounts = new Map();
    for (const m of clean.matchAll(HEX_RE)) {
      const k = m[0].toLowerCase();
      hexCounts.set(k, (hexCounts.get(k) ?? 0) + 1);
    }
    for (const [literal, count] of hexCounts) {
      const permit = allowed.find((a) => a.literal === literal);
      if (!permit)
        findings.push(`${path}: colour literal ${literal} outside the token sheet`);
      else if (count > permit.count)
        findings.push(
          `${path}: colour literal ${literal} appears ${count} times but only ${permit.count} is allowed (${permit.reason})`,
        );
    }
    for (const m of clean.matchAll(RGB_RE)) {
      const r = m[1] ?? m[4],
        g = m[2] ?? m[5],
        b = m[3] ?? m[6];
      // Black shadows / scrims are theme-neutral and stay.
      if (r === "0" && g === "0" && b === "0") continue;
      findings.push(`${path}: numeric colour ${m[0]} outside the token sheet`);
    }
  }
  return findings;
}

/** Check 3: the inline pre-paint key matches the runtime key. */
export function checkHeadScript(landingLayout) {
  const findings = [];
  const m = /root\.dataset\.themeLock\s*===\s*"dark"/.exec(landingLayout);
  if (!m) findings.push("LandingLayout head snippet is missing the data-theme-lock short-circuit");
  if (!landingLayout.includes(`localStorage.getItem("${THEME_KEY}")`))
    findings.push(
      `LandingLayout head snippet does not read localStorage("${THEME_KEY}"), drifted from THEME_KEY`,
    );
  return findings;
}

/** Run every check over injected inputs (all real reads live in main()). */
export function analyse({ tokensCss, files, landingLayout }) {
  const findings = [
    ...checkValuePreservation(tokensCss),
    ...checkNoStrayLiterals(files),
    ...checkHeadScript(landingLayout),
  ];
  return { ok: findings.length === 0, findings };
}

function main() {
  const tokensCss = readFileSync(ROOT + TOKENS, "utf8");
  const files = {};
  for (const f of guardedFiles(ROOT)) files[f] = readFileSync(ROOT + f, "utf8");
  const landingLayout = files["src/layouts/LandingLayout.astro"];
  const { ok, findings } = analyse({ tokensCss, files, landingLayout });
  for (const f of findings) console.error("  ✗ " + f);
  if (!ok) {
    console.error(`check-theme-tokens: ${findings.length} finding(s)`);
    process.exit(1);
  }
  console.log(
    `ok: ${MAPPINGS.length} mappings preserve the dark value, ${Object.keys(files).length} files carry no stray literal, head snippet matches THEME_KEY (${THEME_KEY})`,
  );
}

if (process.argv[1] && process.argv[1].endsWith("check-theme-tokens.mjs")) main();
