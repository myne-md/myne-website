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
 * registry `%1` command line). {@link MAX_URL_LEN} is the guard for a
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

/** Payload-format version. Bump ONLY together with the app-side parser. */
export const THEME_LINK_VERSION = "1";

/**
 * Length ceiling for a generated link. 2000 chars is the conservative floor
 * across desktop platforms (Windows passes the URL as a registry-expanded
 * command line; macOS and Linux are far more generous). Real themes come in
 * around 1 KB, so this only ever trips on something pathological.
 */
export const MAX_URL_LEN = 2000;

/** App-side display cap; mirrored so the emitted name is never silently cut. */
export const MAX_NAME_LEN = 64;

/**
 * base64url-encode UTF-8 text, unpadded — the encoding the app's decoder
 * expects. Works in both Node (build time) and the browser.
 *
 * @param {string} text
 * @returns {string}
 */
export function base64UrlEncode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const b64 =
    typeof btoa === "function"
      ? btoa(binary)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Build the `myne://theme/install` link for one theme.
 *
 * Returns `null` when the theme cannot be handed off — no palette, or a link
 * that would exceed {@link MAX_URL_LEN}. A `null` is not an error: the caller
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
  const tokens = Object.entries(palette).filter(([k, v]) => typeof v === "string" && k.startsWith("--"));
  if (tokens.length === 0) return null;

  // Minified and key-ordered exactly as it will be validated app-side: the app
  // hands `themes_import` the decoded bytes verbatim, so what is encoded here
  // is literally what the host validator sees.
  const json = JSON.stringify(Object.fromEntries(tokens));

  const params = new URLSearchParams();
  params.set("v", THEME_LINK_VERSION);
  params.set("name", String(name).slice(0, MAX_NAME_LEN));
  if (author) params.set("author", String(author));
  // Provenance the dialog displays. The app never follows it — and drops it
  // entirely unless it is http(s) — so only ever pass a real web URL.
  if (source) params.set("src", String(source));
  params.set("payload", base64UrlEncode(json));

  const url = `myne://theme/install?${params.toString()}`;
  return url.length > MAX_URL_LEN ? null : url;
}
