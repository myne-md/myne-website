---
title: "Wikilinks"
category: "find-and-connect"
updated: 2026-06-11
summary: "How to link notes together with wikilinks, how Myne resolves a link to its target note, and what happens when a link points to a note that does not exist yet."
tags: ["links", "notes"]
---

A wikilink connects one note to another inside your vault. You write it in double brackets, and Myne turns the connection into something you can use in three places. This article is about what wikilinks *do*; the exact syntax (aliases, headings, paths, embeds) is in [Footnotes and reference links](/user-guide/markdown/footnotes-and-reference-links/#wikilinks).

## What a link does

Write `[[Another note]]` and Myne renders it as a chip you can read past, and the link starts working:

1. **In the editor**: the chip stands in for the bracketed text, so the prose stays clean.
2. **In backlinks**: the linked note gains an entry pointing back to yours (see [Backlinks](/user-guide/find-and-connect/backlinks/)).
3. **In the graph**: the link becomes an edge between the two notes (see [Graph view](/user-guide/find-and-connect/graph-view/)).

## Resolved and unresolved links

A wikilink to a note that exists is **resolved**: it points somewhere, powers a backlink, and draws a graph edge. A link to a note that doesn't exist yet is **unresolved**. Myne keeps the text exactly as you wrote it, but with nothing to point at, it doesn't create a backlink or a graph edge. Create a note with that title and the link resolves.

## Limits

Wikilinks connect notes within the **current vault** only; there are no links across vaults. Resolution is by the note's title or vault path, as described in the syntax reference.
