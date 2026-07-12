---
title: "Backlinks"
category: "find-and-connect"
updated: 2026-07-11
summary: "How the backlinks tab in the editor's right panel shows every note that links to the one you are reading, how to open the panel and switch to that tab, how to jump from a backlink to its source, and when the list refreshes."
tags: ["links"]
---

Backlinks answer the question "what links here?". While you read a note, the backlinks tab in the right panel lists every other note that links to it. It is the reverse of the wikilinks you write.

![A note's backlinks panel listing the other notes that link to it.](./backlinks.png)

## Opening the panel and finding the tab

The editor's right panel is a multi-tab surface. It holds Backlinks, [Unlinked mentions](/user-guide/find-and-connect/unlinked-mentions/), and [Outline](/user-guide/find-and-connect/outline/), plus the AI chat tab, with one tab shown at a time.

1. If the right panel is hidden, show it with the sidebar toggle in the title bar, or run **Toggle backlinks sidebar** from the [command palette](/user-guide/find-and-connect/search/).
2. Along the top of the panel is a strip of tabs. Each tab is an icon; hover to read its label. Click the Backlinks tab to make it the active one.

You can drag the tabs to reorder them, and right-click the strip to hide a tab or restore a hidden one. If you hide every tab, right-click the empty strip to bring them back.

## The backlinks tab

The tab is headed **Linked from N**, where N is the number of notes that link to the one you're reading. Each row is a linking note, with a count of how many times it links here. Click a row to jump to that note. When nothing links to the current note, the tab reads **No backlinks yet.**

The list refreshes as you work: add a link in another note and this note's backlinks update to match.

## What it shows

Each row names the source note; it does not show a snippet of where the link sits. As in search, results never decrypt your notes just to preview them. A note linking to itself is not listed, since a backlink is always from another note. Links from notes in the Trash don't count, because trashed notes are set aside. A backlink from an archived note still resolves and carries a small archive badge, so you can tell its source lives in the Archive rather than the working set.

## Limits

Backlinks follow **resolved** wikilinks only: a link to a note that doesn't exist yet creates no backlink (see [Wikilinks](/user-guide/find-and-connect/wikilinks/)). Backlinks are within the current vault.
