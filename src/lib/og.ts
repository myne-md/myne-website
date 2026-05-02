import type { CollectionEntry } from "astro:content";

export const ledgerOgPath = (entry: CollectionEntry<"ledger">) =>
  `/ledger/og/${entry.id}.png`;

export const absoluteLedgerOg = (
  entry: CollectionEntry<"ledger">,
  site: URL,
) => new URL(ledgerOgPath(entry), site).toString();
