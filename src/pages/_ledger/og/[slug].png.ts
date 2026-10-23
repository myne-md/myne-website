import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getPublishedLedgerEntries } from "../../../lib/ledger";
import { people } from "../../../data/people";
import { renderOgPng, TYPE_LABEL, TYPE_COLOR, ACCENT } from "../../../lib/og";

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const SUMMARY_MAX = 165;
const trim = (s: string) =>
  s.length > SUMMARY_MAX
    ? s
        .slice(0, SUMMARY_MAX)
        .replace(/\s+\S*$/, "")
        .replace(/[.,;:—\-\s]+$/, "") + "…"
    : s;

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getPublishedLedgerEntries();
  return entries.map((entry: CollectionEntry<"ledger">) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props, site }) => {
  const entry = props.entry as CollectionEntry<"ledger">;
  const { title, date, type, summary, author } = entry.data;
  const host = site?.host ?? "myne.md";

  const png = await renderOgPng({
    kicker: TYPE_LABEL[type] ?? type,
    accent: TYPE_COLOR[type] ?? ACCENT,
    dot: true,
    title,
    description: trim(summary),
    url: `${host}/ledger/${entry.id}`,
    note: `${people[author].name} · ${formatDate(date)}`,
  });

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
