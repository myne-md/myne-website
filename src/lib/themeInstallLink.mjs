/**
 * Themes gallery: the `myne://theme/install` hand-off link (MYND-568).
 *
 * Clicking a theme hands it to the desktop app instead of dropping a JSON file
 * in the user's Downloads folder: the OS resolves `myne://` to the installed
 * Myne, which shows a confirm dialog (name, author, source, palette preview)
 * before applying anything. The app-side half is MYND-567.
 *
 * ## The palette travels IN the link
 *
 * The app cannot fetch it. Myne has no network egress path at all: the desktop
 * WebView's CSP `connect-src` is an allowlist of local schemes and the Rust host
 * carries no HTTP client, both enforced by a build gate. So a `src=` parameter
 * would be undereferenceable; the link carries the whole palette as base64url
 * JSON and the app dereferences nothing. `src` rides along as displayed
 * provenance only.
 *
 * That is cheap here: a gallery theme is ~480–730 bytes minified, so a complete
 * link lands near 1 KB: well inside the tightest platform budget (the Windows
 * registry `%1` command line). {@link MAX_INSTALL_URL_LEN} is the guard for a
 * pathological future theme; over it, `buildThemeInstallUrl` returns `null` and
 * the card falls back to the plain `.json` download rather than emitting a link
 * the OS would truncate into something that fails confusingly.
 *
 * ## The payload is a LOSSY projection of the shipped theme
 *
 * `buildThemeJson` keeps only the 44 canonical tokens in `themeBuilder/tokens.mjs`.
 * Shipped themes may carry extra keys the app does not read (nocturne has
 * `--label-red`, which is not one of the app's `--label-clay`/… tokens), and
 * those are dropped rather than spending URL budget. That is safe only while
 * `tokens.mjs` is a superset of what the app actually consumes: if the app
 * gains a token family and that list is not updated in lockstep, deep-link
 * installs would silently ship a degraded palette while the `.json` download
 * ships the full one. The test suite pins the projection against the real
 * `themes-full.json` so the divergence is at least visible.
 *
 * ## Keep in lockstep with the app
 *
 * The desktop parser is `src/lib/themeDeepLink.ts` in the `myne` repo. It pins
 * `v=1`, decodes unpadded base64url as fatal-mode UTF-8, caps the decoded
 * payload at 16 KiB and the name at 64 characters, and rejects anything else
 * with a visible error. Changing the shape emitted here without bumping `v`
 * there breaks every already-published link, so treat the format as a contract.
 *
 * No dependency, no server, no tracker: the link is built at build time from
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

/** App-side display caps, mirrored so a link never carries more than the app
 *  will keep. The app slices too, so exceeding these is not fatal: but a link
 *  that already fits is one the user sees in full. */
export const MAX_NAME_LEN = 64;
export const MAX_AUTHOR_LEN = 96;
export const MAX_SOURCE_LEN = 256;

/**
 * Mirror of the app's display sanitisation: strip C0/C1 controls and the bidi
 * overrides (a name carrying those could render as something other than what
 * gets stored), collapse whitespace, trim, then cap by CODE POINT.
 *
 * Sanitise-THEN-slice, in that order, exactly as the app does: slicing first
 * would let stripped characters eat into the budget. Returns `null` when
 * nothing printable survives, which is the app's `"invalid-name"` rejection:
 * catching it here means the user gets the promised `.json` fallback instead of
 * an error dialog.
 *
 * @param {unknown} raw @param {number} maxLen @returns {string | null}
 */
export function sanitizeDisplay(raw, maxLen) {
  if (raw === null || raw === undefined) return null;
  const stripped = String(raw).replace(
    /[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,
    "",
  );
  const collapsed = stripped.replace(/\s+/g, " ").trim();
  if (collapsed === "") return null;
  const points = Array.from(collapsed);
  return points.length <= maxLen ? collapsed : points.slice(0, maxLen).join("");
}

/**
 * base64url-encode UTF-8 text, unpadded: the encoding the app's decoder
 * expects.
 *
 * Runs in BOTH environments this module is loaded from: Node at build time
 * (the gallery builds each card's link in Astro frontmatter) and the browser at
 * runtime (the builder's "Open in Myne" button hands over the palette WITHOUT a
 * round trip through the export modal). `Buffer` is the Node path; `btoa` is
 * the browser one, and the browser path chunks its bytes rather than spreading
 * them into `String.fromCharCode`, which throws on a long array.
 *
 * @param {string} text
 * @returns {string}
 */
export function base64UrlEncode(text) {
  if (typeof Buffer !== "undefined") return Buffer.from(text, "utf8").toString("base64url");
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Build the `myne://theme/install` link for one theme.
 *
 * Returns `null` when the theme cannot be handed off: no palette, or a link
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

  // A name the app would reject is a link we must not emit: the caller's
  // fallback is a working download, an error dialog is not.
  const safeName = sanitizeDisplay(name, MAX_NAME_LEN);
  if (safeName === null) return null;

  const params = new URLSearchParams();
  params.set("v", THEME_LINK_VERSION);
  params.set("name", safeName);
  const safeAuthor = sanitizeDisplay(author, MAX_AUTHOR_LEN);
  if (safeAuthor !== null) params.set("author", safeAuthor);
  // Provenance the dialog displays. The app never follows it: and drops it
  // entirely unless it is http(s): so emit only what will actually survive.
  const safeSource = sanitizeDisplay(source, MAX_SOURCE_LEN);
  if (safeSource !== null && /^https?:\/\//i.test(safeSource)) params.set("src", safeSource);
  params.set("payload", base64UrlEncode(json));

  const url = `myne://theme/install?${params.toString()}`;
  return url.length > MAX_INSTALL_URL_LEN ? null : url;
}
