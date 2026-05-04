---
title: "Tags and organization"
category: "daily-use"
updated: 2026-05-04
summary: "Tags are inline `#tag` tokens. Myne aggregates them at render time and shows the tag list in a side panel. There is no folder structure — your vault is flat by design."
tags: ["tags", "organization", "markdown"]
---

Type `#tag-name` anywhere in a note's body and Myne treats it as a tag. The
side panel lists every tag in the current vault with a count.

## Why no folders

Folders force a single hierarchy. Tags let a note belong to several contexts
at once without you having to pick one. If you really want folders, prefix
your titles or use date-stamped IDs — the file system will sort them.

### Tag rules

Tags are case-insensitive. Hyphens are part of the token; spaces end it.
`#kdf-tuning` is one tag, `#kdf tuning` is the tag `#kdf` followed by the
word "tuning".

## What the panel shows

Click a tag in the side panel to filter the note list. Filters do not stack
in this iteration; clicking another tag replaces the filter. Multi-tag
filtering lands with the search overhaul in Phase 2.
