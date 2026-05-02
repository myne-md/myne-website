import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getSortedLedgerEntries, ledgerHref } from "../../lib/ledger";

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
    })),
    customData: `<language>en</language>`,
    stylesheet: false,
  });
}
