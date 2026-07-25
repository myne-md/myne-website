/**
 * Themes gallery — the `myne://theme/install` hand-off link (MYND-568).
 *
 * Clicking a theme hands it to the desktop app instead of dropping a JSON file
 * in the user's Downloads folder: the OS resolves `myne://` to the installed
 * Myne, which shows a confirm dialog (name, author, source, palette preview)
 * before applying anything. The app-side half is MYND-567.
 *
 * ## The palette travels IN the link
 *
 * The app cannot fetch it. Myne has no network egress path at all — the desktop
 * WebView's CSP `connect-src` is an allowlist of local schemes and the Rust host
 * carries no HTTP client, both enforced by a build gate. So a `src=` parameter
 * would be undereferenceable; the link carries the whole palette as base64url
 * JSON and the app dereferences nothing. `src` rides along as displayed
 * provenance only.
 *
 * That is cheap here: a gallery theme is ~480–730 bytes minified, so a complete
 * link lands near 1 KB — well inside the tightest platform budget (the Windows
 * registry `%1` command line). {@link MAX_INSTALL_URL_LEN} is the guard for a
 * pathological future theme; over it, `buildThemeInstallUrl` returns `null` and
 * the card falls back to the plain `.json` download rather than emitting a link
 * the OS would truncate into something that fails confusingly.
 *
 * ## Keep in lockstep with the app
 *
 * The desktop parser is `src/lib/themeDeepLink.ts` in the `myne` repo. It pins
 * `v=1`, decodes unpadded base64url as fatal-mode UTF-8, caps the decoded
 * payload at 16 KiB and the name at 64 characters, and rejects anything else
 * with a visible error. Changing the shape emitted here without bumping `v`
 * there breaks every already-published link, so treat the format as a contract.
 *
 * No dependency, no server, no tracker — the link is built at build time from
 * data already in the repo (SYNC-2, the same posture as the Theme Builder).
 */

import { buildThemeJson, canExport } from "./themeBuilder/serialize.mjs";

/** Payload-format version. Bump ONLY together with the app-side parser. */
export const THEME_LINK_VERSION = "1";

/**
 * Length ceiling for a generated link. 2000 chars is the conservative floor
 * across desktop platforms (Windows passes the URL as a registry-expanded
 * command line; macOS and Linux are far more generous). Real themes come in
 * around 1 KB, so this only ever trips on something pathological.
 */
export const MAX_INSTALL_URL_LEN = 2000;

/** App-side display cap; mirrored so the emitted name is never silently cut. */
export const MAX_NAME_LEN = 64;

/**
 * base64url-encode UTF-8 text, unpadded — the encoding the app's decoder
 * expects.
 *
 * Node-only by design: this module is imported from Astro frontmatter, which
 * runs at BUILD time, and the Themes page ships no client JS. If it ever needs
 * to run in a browser, swap in a `btoa` path — don't add one speculatively.
 *
 * @param {string} text
 * @returns {string}
 */
export function base64UrlEncode(text) {
  return Buffer.from(text, "utf8").toString("base64url");
}

/**
 * Build the `myne://theme/install` link for one theme.
 *
 * Returns `null` when the theme cannot be handed off — no palette, or a link
 * that would exceed {@link MAX_INSTALL_URL_LEN}. A `null` is not an error: the caller
 * simply shows the plain `.json` download as the only path, which always works.
 *
 * @param {{
 *   name: string,
 *   palette: Record<string, string> | null | undefined,
 *   author?: string | null,
 *   source?: string | null,
 * }} theme
 * @returns {string | null}
 */
export function buildThemeInstallUrl({ name, palette, author, source }) {
  if (!palette || typeof palette !== "object") return null;
  // The SAME completeness gate the builder's Download/Submit uses: a palette
  // missing a required token would produce a link the desktop then refuses as
  // "damaged or incomplete", instead of the graceful fall-back-to-download this
  // module promises.
  if (!canExport(palette).ok) return null;

  // `buildThemeJson` is the one definition of "what counts as a theme token":
  // canonical tokens only, blanks dropped, key-sorted. Reusing it keeps a
  // non-canonical key a shipped theme happens to carry (the app ignores those)
  // out of the URL budget, and makes the emitted link deterministic.
  const json = JSON.stringify(buildThemeJson(palette));

  const params = new URLSearchParams();
  params.set("v", THEME_LINK_VERSION);
  params.set("name", String(name).slice(0, MAX_NAME_LEN));
  if (author) params.set("author", String(author));
  // Provenance the dialog displays. The app never follows it — and drops it
  // entirely unless it is http(s) — so only ever pass a real web URL.
  if (source) params.set("src", String(source));
  params.set("payload", base64UrlEncode(json));

  const url = `myne://theme/install?${params.toString()}`;
  return url.length > MAX_INSTALL_URL_LEN ? null : url;
}
