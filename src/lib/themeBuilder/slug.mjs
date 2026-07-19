/**
 * Theme Builder — slug derivation + offline collision check.
 *
 * `<slug>` is the myne-themes folder name (`themes/<slug>/…`): lowercase,
 * hyphenated, ascii. Collisions are checked against the already-bundled gallery
 * index (no network — CI is the final authority).
 */

/**
 * Lowercase, hyphenated, ascii-folded slug from a theme name.
 * @param {string | undefined | null} name
 */
export function slugify(name) {
  return String(name ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics (Café → Cafe)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // any run of non-alnum → single hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * True if `slug` already exists among the published gallery slugs.
 * @param {string} slug @param {string[]} existingSlugs
 */
export function slugCollides(slug, existingSlugs) {
  return existingSlugs.includes(slug);
}

/**
 * True when `slug` can name a gallery folder — i.e. it survived folding to at
 * least one ascii-alphanumeric run. A name with no Latin letters or digits (a
 * fully non-Latin or emoji name) folds to `""`, which is NOT shareable: it would
 * yield a `themes//` folder and also slip past `slugCollides` (no published slug
 * is empty). Such a theme can still be downloaded — only gallery-share is gated.
 * @param {string} slug
 */
export function isShareableSlug(slug) {
  return typeof slug === "string" && slug.length > 0;
}
