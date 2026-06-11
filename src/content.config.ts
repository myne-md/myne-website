import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { ENTRY_TYPES } from "./lib/ledger";

const stripDatePrefix = (entry: string) =>
  entry.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");

const ledger = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/ledger",
    generateId: ({ entry }) => stripDatePrefix(entry),
  }),
  schema: z.object({
    title: z.string().min(8).max(80),
    date: z.coerce.date(),
    type: z.enum(ENTRY_TYPES as unknown as [string, ...string[]]),
    author: z.enum(["furkan", "omer"]),
    summary: z.string().min(80).max(360),
    tags: z.array(z.string()).max(5).default([]),
    draft: z.boolean().default(false),
  }),
});

const userGuide = defineCollection({
  loader: glob({
    // Exclude underscore-prefixed files (e.g. `_authoring.md`, the authoring
    // conventions canon) from the collection. The glob loader does NOT honor
    // the underscore convention on its own, so the negation is explicit — this
    // keeps `_*.md` from being loaded as articles, matching how `_sidebar.json`
    // already sits outside the `**/*.md` glob.
    pattern: ["**/*.md", "!_*.md", "!**/_*.md"],
    base: "./src/content/user-guide",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    updated: z.coerce.date(),
    summary: z.string().min(80).max(360),
    tags: z.array(z.string()).max(5).default([]),
  }),
});

export const collections = { ledger, userGuide };
