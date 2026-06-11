---
title: "Unlinked mentions"
category: "find-and-connect"
updated: 2026-06-11
summary: "How Myne surfaces other notes that mention the current note's title without linking to it, and how to turn an unlinked mention into a wikilink."
tags: ["links", "search"]
---

An unlinked mention is a note that writes the current note's title in its prose but never links to it. Myne can surface these so you can turn a passing mention into a real connection.

## Finding mentions

Below the backlinks pane is an **Unlinked mentions** section, collapsed by default. It stays collapsed, and does no scanning, until you expand it, so it never slows down reading a note. Expand it (or refresh it) and Myne looks for other notes that mention this note's title.

Matching is by whole words and is not case-sensitive, so "Project Apollo" mentioned mid-sentence is found, but a title buried inside a longer word is not. Very common or very short titles are held back from the list, so the section stays useful rather than flooding with noise.

## Linking a mention

Each mention has a **Link** action that turns that occurrence into a proper wikilink, writing the link into the mentioning note for you. It edits through the normal save path, so it won't overwrite unsaved changes in another open note; if there is nothing to change, the row simply stays put.

Once a mention is linked, it becomes a [backlink](/user-guide/find-and-connect/backlinks/) and drops off the unlinked-mentions list.

## Limits

Unlinked mentions are a suggestion surface, not an index: they are scanned on demand when you expand the section, not maintained continuously. They match on title text within the current vault.
