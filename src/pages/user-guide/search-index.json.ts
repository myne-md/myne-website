import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getManifest } from "../../lib/userGuide";

// Full-text search index for the user guide. Built once at build time and
// fetched lazily by the navbar search palette the first time a reader opens it
// (GuideSearchDialog). Keeping it a static JSON file — rather than an inline
// island payload — means the ~90-article corpus never lands in the page bundle;
// it only downloads if the reader actually searches. Everything here is content
// already published under /user-guide/, so it adds no new disclosure surface.
export const prerender = true;

// Reduce a markdown body to plain, searchable text. It keeps the things a
// reader would search for — link text, image alt text, code contents — and
// drops the syntax that carries no query value.
function toPlainText(md: string): string {
  return (
    md
      // Fenced code blocks → keep the inner text, drop the fences + info string.
      .replace(/```[^\n]*\n([\s\S]*?)```/g, " $1 ")
      .replace(/~~~[^\n]*\n([\s\S]*?)~~~/g, " $1 ")
      // Inline code → drop the backticks, keep the token.
      .replace(/`([^`]+)`/g, "$1")
      // Images ![alt](src) → keep alt.
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, " $1 ")
      // Links [text](url) → keep text.
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      // Wikilinks [[text]] → keep text.
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      // Raw HTML tags.
      .replace(/<[^>]+>/g, " ")
      // Line-leading markers: headings, blockquotes, list bullets, ordered nums.
      .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
      // Table pipes.
      .replace(/\|/g, " ")
      // Emphasis / strikethrough markers.
      .replace(/[*_~]/g, "")
      // Collapse all whitespace.
      .replace(/\s+/g, " ")
      .trim()
  );
}

export const GET: APIRoute = async () => {
  const manifest = getManifest();
  const labelBySlug = new Map(manifest.map((c) => [c.slug, c.label]));

  // The sidebar manifest is the source of truth for what is "in the guide" and
  // in what order — mirror the [category]/[slug] route's own filter so the
  // index never lists an article the guide itself does not render.
  const known = new Set<string>();
  const orderById = new Map<string, number>();
  let order = 0;
  for (const cat of manifest) {
    for (const slug of cat.articles) {
      const id = `${cat.slug}/${slug}`;
      known.add(id);
      orderById.set(id, order++);
    }
  }

  const articles = await getCollection("userGuide");
  const docs = articles
    .filter((entry) => known.has(entry.id))
    .map((entry) => {
      const category = entry.id.split("/")[0]!;
      return {
        id: entry.id,
        url: `/user-guide/${entry.id}/`,
        title: entry.data.title,
        category,
        categoryLabel: labelBySlug.get(category) ?? category,
        summary: entry.data.summary,
        tags: entry.data.tags ?? [],
        text: toPlainText(entry.body ?? ""),
      };
    })
    .sort((a, b) => (orderById.get(a.id) ?? 0) - (orderById.get(b.id) ?? 0));

  return new Response(JSON.stringify({ version: 1, docs }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
