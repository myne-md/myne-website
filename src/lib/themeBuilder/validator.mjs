/**
 * Theme Builder — vendored zero-dep validation (SYNC-4).
 *
 * This is a **UX pre-check only**. The authoritative gate stays the desktop Rust
 * `theme-validator` on import + the myne-themes CI Rust binary — so any drift
 * here is a UX bug (telling the user "ok" when the app/CI would reject), NOT a
 * CSS-injection hole. Do NOT surface "safe/validated" copy beyond "checked on
 * your device".
 *
 * `isAllowedValue` is a faithful port of `theme-validator/src/value.rs` — the
 * PRIMARY CSS-injection control (the site has no CSP; a value that reaches the
 * DOM executes). Keep it byte-faithful to the Rust accept/reject grammar.
 *
 * @typedef {import("./tokens.mjs").Palette} Palette
 */

import { REQUIRED_TOKENS, ALL_TOKENS } from "./tokens.mjs";
import { contrastRatio } from "./contrast.mjs";

// ── value-shape allowlist (port of value.rs) ─────────────────────────────────

/** `#` followed by exactly 3, 4, 6, or 8 hex digits. */
function isHex(v) {
  if (!v.startsWith("#")) return false;
  const rest = v.slice(1);
  return [3, 4, 6, 8].includes(rest.length) && /^[0-9a-fA-F]+$/.test(rest);
}

/**
 * `rgb()/rgba()/hsl()/hsla()` whose body is only digits, `.`, `,`, `%`, `/`, and
 * whitespace. No letters (blocks nested url()/var()), no `;`, single trailing `)`.
 */
function isColorFunction(v) {
  const open = v.indexOf("(");
  if (open < 0) return false;
  const name = v.slice(0, open).toLowerCase();
  if (!["rgb", "rgba", "hsl", "hsla"].includes(name)) return false;
  if (!v.endsWith(")")) return false;
  const body = v.slice(open + 1, -1);
  return body.length > 0 && /^[0-9.,%/ \t]+$/.test(body);
}

/** A bare keyword / named color: ASCII letters only, length 1..=24. */
function isBareKeyword(v) {
  return v.length >= 1 && v.length <= 24 && /^[a-zA-Z]+$/.test(v);
}

/** `<number><unit?>`: optional sign, digits with ≤1 `.`, optional unit (`%` or 1..4 letters). */
function isNumberUnit(v) {
  let s = v;
  if (s[0] === "+" || s[0] === "-") s = s.slice(1);
  if (s.length === 0) return false;
  let i = 0;
  while (i < s.length && (/[0-9]/.test(s[i]) || s[i] === ".")) i += 1;
  const num = s.slice(0, i);
  const unit = s.slice(i);
  if (!/[0-9]/.test(num)) return false;
  if ((num.match(/\./g) || []).length > 1) return false;
  if (unit === "" || unit === "%") return true;
  return unit.length >= 1 && unit.length <= 4 && /^[a-zA-Z]+$/.test(unit);
}

/**
 * `true` iff `value` matches one of the known-safe value grammars (port of
 * `value.rs::is_allowed_value`). Empty / whitespace-only → false.
 * @param {string} value
 */
export function isAllowedValue(value) {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (v.length === 0) return false;
  return isHex(v) || isColorFunction(v) || isBareKeyword(v) || isNumberUnit(v);
}

// ── palette-level checks ─────────────────────────────────────────────────────

/**
 * Required-key completeness gate (mirrors `schema.rs` REQUIRED_KEYS). A key that
 * is absent OR blank counts as missing — the builder must not export a blank.
 * @param {Palette} palette @returns {string[]} the missing required tokens (in canonical order)
 */
/**
 * Faithful port of Rust `theme_validator::schema::is_allowed_key`.
 *
 * `--` followed by 1..=64 ASCII alphanumerics, `_` or `-`. Note that `_` IS
 * admissible — which is why the reserved `--_` namespace needs its own check
 * (see {@link isReservedKey}) rather than falling out of the grammar.
 * @param {string} key
 */
export function isAllowedKey(key) {
  if (typeof key !== "string" || !key.startsWith("--")) return false;
  const rest = key.slice(2);
  return rest.length >= 1 && rest.length <= 64 && /^[A-Za-z0-9_-]+$/.test(rest);
}

/**
 * The ornament layer's private namespace, which a theme may never write.
 *
 * `--_o-ceiling` is the bound the tint wash is clamped by, so a palette that
 * could set it could raise its own ceiling. Mirrors the refusal
 * `validate_theme_for_import` performs at the import boundary and the filter
 * every client performs on read.
 * @param {string} key
 */
export function isReservedKey(key) {
  return typeof key === "string" && key.startsWith("--_");
}

export function missingRequired(palette) {
  return REQUIRED_TOKENS.filter((t) => {
    const v = palette?.[t];
    return v == null || String(v).trim() === "";
  });
}

/**
 * Value-shape check over an authored palette (mirrors `value.rs::validate_theme`
 * inner loop). Returns each token whose value fails the allowlist.
 * @param {Palette} palette @returns {{token: string, value: string}[]}
 */
export function invalidValues(palette) {
  /** @type {{token: string, value: string}[]} */
  const out = [];
  for (const token of ALL_TOKENS) {
    const v = palette?.[token];
    if (v == null) continue; // absence is missingRequired's job, not an invalid value
    if (!isAllowedValue(v)) out.push({ token, value: v });
  }
  return out;
}

/**
 * The 5 canonical contrast rules — vendored verbatim from
 * myne-themes/tools/lint-theme.mjs `CONTRAST_RULES`. Do not add pairs (that would
 * diverge from the marketplace/CI gate). `--ink-3` is intentionally ungated.
 */
export const CONTRAST_RULES = [
  { fg: "--ink-0", bg: "--paper", min: 4.5, label: "display text on page" },
  { fg: "--ink-1", bg: "--paper", min: 4.5, label: "primary text on page" },
  { fg: "--ink-1", bg: "--paper-2", min: 4.5, label: "primary text on surface" },
  { fg: "--ink-2", bg: "--paper", min: 3.0, label: "secondary text on page" },
  { fg: "--accent", bg: "--paper", min: 3.0, label: "accent on page" },
];

/**
 * Readability report over a palette (mirrors `lint-theme.mjs::lintContrast`).
 * Non-hex values are skipped (contrast is only defined on hex).
 * @param {Palette} palette
 */
export function contrastReport(palette) {
  /** @type {{fg: string, bg: string, ratio: number, min: number, label: string}[]} */
  const failures = [];
  for (const rule of CONTRAST_RULES) {
    const fg = palette?.[rule.fg];
    const bg = palette?.[rule.bg];
    if (fg == null || bg == null) continue;
    const ratio = contrastRatio(fg, bg);
    if (ratio == null) continue; // non-hex; can't compute — skip
    if (ratio < rule.min) {
      failures.push({ fg: rule.fg, bg: rule.bg, ratio, min: rule.min, label: rule.label });
    }
  }
  return {
    ok: failures.length === 0,
    failures,
    errors: failures.map(
      (f) => `${f.fg} on ${f.bg} (${f.label}): contrast ${f.ratio.toFixed(2)} < ${f.min}`,
    ),
  };
}
