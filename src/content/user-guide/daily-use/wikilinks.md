---
title: "Wikilinks between notes"
category: "daily-use"
updated: 2026-05-04
summary: "Cross-link notes by typing the title in double brackets. The link resolves at render time against the current vault — no global graph database, no remote lookup, just filename matching."
tags: ["wikilinks", "markdown", "editor"]
---

Type `[[Other note title]]` and Myne resolves the link to the matching note
when it renders. No special syntax beyond the brackets, no auto-suggest UI
on the first iteration.

## Resolution rules

The match is exact and case-sensitive against note titles in the current
vault. If two notes have the same title, the link goes to the most recently
modified one (and a small caret beside the link tells you it was ambiguous).

### What happens to broken links

A `[[link]]` that does not match any note in the vault renders in muted
color. Click it to create the note with that title. We do not automatically
create stub files — that surprised people in the prototype.

## What stays local

The link graph is computed from your vault on your device. We do not send
anything anywhere to render it. There is no public knowledge graph mode.
