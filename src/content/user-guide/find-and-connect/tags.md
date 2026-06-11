---
title: "Tags"
category: "find-and-connect"
updated: 2026-06-11
summary: "How tags group related notes, how Myne indexes them including nesting and case folding, and where tagged notes surface across the app."
tags: ["tags", "search"]
---

Tags are a lightweight way to group related notes (`#project`, `#reading/2026`), written inline in your text. This article is about what tags *do*; the exact syntax for writing one is in [HTML and inline extras](/user-guide/markdown/html-and-inline-extras/#tags).

## How Myne indexes tags

Myne reads the tags across your notes and treats them as structured metadata:

- **Tags fold for matching.** `#Project` and `#project` are the same tag; accent and case differences are folded together.
- **Tags nest with slashes.** `#area/topic` is a tag in its own right, and it also counts under its parent `#area`, so grouping by `#area` includes everything beneath it.

Both the inline `#tags` you write in the body and a frontmatter `tags:` list feed this same index.

## Where tags surface

Today, tags have one interactive surface: the **graph view** has a tag filter that narrows the graph to notes carrying a tag (and its nested children). See [Graph view](/user-guide/find-and-connect/graph-view/).

## Limits

Tags in the editor are plain text: there is no click surface on a `#tag` in a note that opens a list of everything sharing it. The graph's tag filter is the way to browse by tag. Tags are not folders; a note keeps its place in the tree regardless of how it's tagged.
