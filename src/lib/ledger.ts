import { getCollection, type CollectionEntry } from "astro:content";

export type EntryType = "shipped" | "thinking" | "milestone";
export type FilterKey = "all" | "shipped" | "thinking" | "milestones";

export const ENTRY_TYPES: readonly EntryType[] = ["shipped", "thinking", "milestone"] as const;

const FILTER_TO_TYPE: Record<Exclude<FilterKey, "all">, EntryType> = {
  shipped: "shipped",
  thinking: "thinking",
  milestones: "milestone",
};

export interface FilterDescriptor {
  key: FilterKey;
  label: string;
  href: string;
  /** Title used by feed pages other than the canonical /ledger/. */
  pageTitle: string;
  /** Meta description for the filter view. */
  description: string;
}

export const FILTERS: readonly FilterDescriptor[] = [
  {
    key: "all",
    label: "All",
    href: "/ledger/",
    pageTitle: "Ledger — Myne",
    description:
      "Notes from building Myne. An append-only record of threat-model, protocol, and spec changes — and the reasoning behind them.",
  },
  {
    key: "shipped",
    label: "Shipped",
    href: "/ledger/shipped/",
    pageTitle: "Ledger — Shipped — Myne",
    description: "Shipped changes to the Myne protocol, spec, and public-facing behavior.",
  },
  {
    key: "thinking",
    label: "Thinking",
    href: "/ledger/thinking/",
    pageTitle: "Ledger — Thinking — Myne",
    description: "Decision rationale published before it gets buried by the next month of work.",
  },
  {
    key: "milestones",
    label: "Milestones",
    href: "/ledger/milestones/",
    pageTitle: "Ledger — Milestones — Myne",
    description: "Project moments worth marking in public.",
  },
];

// Reserved by sibling routes under /ledger/: filter views (shipped/thinking/
// milestones), the OG-image route, and the RSS feed. An entry whose id collides
// would either overwrite a sibling page silently or crash the build with a
// confusing duplicate-route error. Fail loudly with a useful message instead.
const RESERVED_SLUGS = new Set(["shipped", "thinking", "milestones", "og", "rss", "rss.xml"]);

export async function getPublishedLedgerEntries(): Promise<CollectionEntry<"ledger">[]> {
  const entries = await getCollection("ledger", ({ data }) => !data.draft);
  for (const e of entries) {
    if (RESERVED_SLUGS.has(e.id)) {
      throw new Error(
        `Ledger entry "${e.id}" uses a reserved slug. Rename the source file ` +
          `(e.g. add a more specific suffix). Reserved: ${[...RESERVED_SLUGS].join(", ")}`,
      );
    }
  }
  return entries;
}

export async function getSortedLedgerEntries(): Promise<CollectionEntry<"ledger">[]> {
  const entries = await getPublishedLedgerEntries();
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function applyFilter(
  entries: CollectionEntry<"ledger">[],
  active: FilterKey,
): CollectionEntry<"ledger">[] {
  if (active === "all") return entries;
  const want = FILTER_TO_TYPE[active];
  return entries.filter((e) => e.data.type === want);
}

export const ledgerHref = (entry: CollectionEntry<"ledger">) => `/ledger/${entry.id}/`;

export const formatLedgerDate = (date: Date) => date.toISOString().slice(0, 10);
