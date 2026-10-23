import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import { getSortedLedgerEntries, ledgerHref } from "../../lib/ledger";

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

export async function GET(context: APIContext) {
  const entries = await getSortedLedgerEntries();
  return rss({
    title: "Myne ledger",
    description: "Notes from building Myne. Threat-model, protocol, and spec changes.",
    site: context.site!,
    items: entries.map((e) => ({
      title: e.data.title,
      pubDate: e.data.date,
      description: e.data.summary,
      link: ledgerHref(e),
      categories: e.data.tags,
      content: md.render(e.body ?? ""),
    })),
    customData: `<language>en</language>`,
    stylesheet: false,
  });
}
