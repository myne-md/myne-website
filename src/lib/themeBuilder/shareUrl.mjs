/**
 * Theme Builder: "Share to the gallery" deep-links (SYNC-2, no phone-home).
 *
 * Two destinations, one job, and the caller picks which fits:
 *
 *  - {@link buildSubmissionUrl} opens GitHub's NEW-FILE page with
 *    `themes/<slug>/theme.json` already written. "Propose new file" turns that
 *    into a pull request (forking first for anyone without write access), which
 *    is what "share it" should mean: a diff someone can review, not an issue
 *    asking a maintainer to copy-paste. meta.json rides in the PR description,
 *    because a URL can prefill one file.
 *  - {@link buildShareUrl} is the issue-form fallback, unchanged, and it is what
 *    a very large palette falls back to when the encoded URL would be truncated
 *    by GitHub.
 *
 * Both are pure client-side navigation: no API, no token, no tracker.
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

/**
 * The pull-request destination: GitHub's new-file page, prefilled.
 *
 * @param {{ slug: string, name: string, author?: string, description?: string,
 *   appearance: "light" | "dark", themeJson: string, metaJson: string }} input
 * @returns {{ kind: "pr" | "issue", url: string }}
 */
export function buildSubmission({ slug, name, author, description, appearance, themeJson, metaJson }) {
  const path = `themes/${slug}/theme.json`;
  const message = `theme(${slug}): add ${name}`;
  const body = [
    `**Theme:** ${name}`,
    author ? `**Author:** ${author}` : null,
    description ? `**Description:** ${description}` : null,
    `**Appearance:** ${appearance}`,
    "",
    "Built with the [Theme Builder](https://myne.md/themes/builder).",
    "",
    "This pull request adds `theme.json`. The matching `meta.json` for the folder is:",
    "",
    "```json",
    metaJson,
    "```",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const params = new URLSearchParams({
    filename: path,
    value: themeJson,
    message,
    description: body,
  });
  const url = `https://github.com/${REPO}/new/main?${params.toString()}`;
  if (url.length <= MAX_URL_LEN) return { kind: "pr", url };
  // Too large to prefill: the issue form is shorter and still works.
  return {
    kind: "issue",
    url: buildShareUrl({ slug, name, author, description, appearance, themeJson, metaJson }),
  };
}
