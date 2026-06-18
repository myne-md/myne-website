---
title: "Archive"
category: "notes-and-organization"
updated: 2026-06-18
summary: "Set a note aside without deleting it. Archived notes leave the sidebar but stay searchable and linkable, are kept indefinitely with no auto-purge, and are mutually exclusive with Trash."
tags: ["notes", "sidebar"]
---

Archiving sets a note aside without deleting it. The note leaves the sidebar, the folder tree, and the Favorites list, but it is kept indefinitely — there is no auto-purge and no way to empty the Archive. Unlike a trashed note, an archived note stays findable in search and still resolves as a link target. A note can be live, archived, or trashed, but never two of those at once.

## Archiving a note

To archive a single note, right-click its row in the sidebar and choose **Arşivle**. The note leaves the working set straight away: it disappears from the sidebar tree, from the folder tree, and from the Favorites display. It does not go to the Trash, and nothing about its content changes.

Archiving and trashing are two positions on one axis, so a note can only be in one of them. Archiving a note that was in the Trash clears its trashed marker; trashing a note that was archived clears its archived marker. You never have to manage that yourself — the app keeps the states exclusive.

The archived state lives inside the note, written into the encrypted `.myn` frontmatter (`archived:`) rather than as a device-local preference. It records when you archived the note, which is what the Archive panel sorts on.

## The Archive panel

Open the Archive from the **Archive** button in the sidebar footer, next to **Trash**. When the Archive holds anything, the button shows a count. The panel opens as a modal listing your archived notes newest-first, each with how long ago it was archived. Press **Esc**, click the backdrop, or use **Close** to dismiss it.

Each row has two actions:

- **Restore** returns the note to its original folder, live again, exactly where it was filed.
- **Delete** moves the note to the Trash. From there, permanent deletion is a separate, deliberate step in the Trash panel — see [Trash](/user-guide/notes-and-organization/trash/).

There is no "empty archive" action. The Archive is meant to be kept, not cleared on a timer.

## Archive versus Trash

The Archive and the Trash both take a note out of the sidebar, but they behave differently on purpose.

A trashed note is hidden everywhere: it drops out of the sidebar and stops appearing in search results, and a link pointing at it reads as broken. An archived note is only set aside. It still turns up in full-text search and still resolves as a wikilink or backlink target, so the rest of your notes stay connected to it. In the command palette, an archived note that matches your search shows a small archive badge so you can tell why it is not in the sidebar.

So: reach for the Archive when you want a note out of the way but still part of your knowledge base, and reach for the Trash when you want a note gone.

## Limits

Because an archived note stays in the encrypted search index and stays resolvable as a link target, its at-rest exposure is exactly that of any live note — archive is discoverable-but-hidden, not a quieter form of deletion. Archiving does not reduce what a copy of the vault folder can reveal about a note; if you want a note out of reach, delete it rather than archive it.

The Archive is kept indefinitely, with no auto-purge and no empty-archive action, so an archived note persists until you restore it or delete it yourself.
