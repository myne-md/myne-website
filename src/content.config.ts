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
    pattern: "**/*.md",
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
