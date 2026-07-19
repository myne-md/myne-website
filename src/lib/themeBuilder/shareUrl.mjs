/**
 * Theme Builder — "Share to the gallery" deep-link (SYNC-2, no phone-home).
 *
 * A pure client-side navigation: opens a PREFILLED, labeled myne-themes issue
 * carrying both files in the body (a maintainer turns it into the canonical
 * `themes/<slug>/{theme.json,meta.json}` PR). No API, no token, no tracker.
 * Honest framing: it "starts a gallery submission", not a one-click PR.
 *
 * A theme.json is ~1–2 KB, so the prefilled body fits GitHub's URL budget with
 * room to spare; the guard drops the JSON blocks (with instructions) only in the
 * pathological oversized case.
 */

const REPO = "myne-md/myne-themes";
/** GitHub silently truncates very long prefill URLs; stay well under ~8 KB. */
export const MAX_URL_LEN = 8000;

/**
 * @param {{ slug: string, name: string, author?: string, description?: string,
 *   appearance: "light" | "dark", themeJson: string, metaJson: string }} input
 * @returns {string} a github.com issues/new URL
 */
export function buildShareUrl(input) {
  const { slug, name, author, description, appearance, themeJson, metaJson } = input;

  const header = [
    `**Theme name:** ${name}`,
    author ? `**Author:** ${author}` : null,
    description ? `**Description:** ${description}` : null,
    `**Appearance:** ${appearance}`,
    `**Suggested folder:** \`themes/${slug}/\``,
    "",
    "Built with the [Theme Builder](https://myne.md/themes/builder). A maintainer can turn " +
      `this into the \`themes/${slug}/{theme.json,meta.json}\` PR.`,
    "",
  ].filter((l) => l !== null);

  const withFiles = [
    ...header,
    "<details><summary>theme.json</summary>",
    "",
    "```json",
    themeJson,
    "```",
    "",
    "</details>",
    "",
    "<details><summary>meta.json</summary>",
    "",
    "```json",
    metaJson,
    "```",
    "",
    "</details>",
  ].join("\n");

  const fallback = [
    ...header,
    "_The theme is large — please **download** `theme.json` + `meta.json` from the builder and " +
      "attach them here, or open the PR directly._",
  ].join("\n");

  const make = (body) => {
    const params = new URLSearchParams({
      labels: "theme-submission",
      title: `[theme] ${name}`,
      body,
    });
    return `https://github.com/${REPO}/issues/new?${params.toString()}`;
  };

  const full = make(withFiles);
  return full.length <= MAX_URL_LEN ? full : make(fallback);
}
