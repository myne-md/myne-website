---
title: "Trash"
category: "notes-and-organization"
updated: 2026-06-11
summary: "How deleted notes move to Trash, how to restore a note from Trash, and what happens when you permanently delete a note from the vault."
tags: ["notes", "recovery"]
---

Deleting a note in Myne is a two-stage process: first it goes to the Trash, where you can get it back, and only emptying the Trash removes it for good. This article covers both stages and what "for good" actually means.

## Deleting a note

When you delete a note, it moves to the **Trash** and disappears from the sidebar. An **undo** appears immediately so you can put it straight back if you didn't mean it. Deleting a folder that still contains notes asks you to confirm first, then moves the whole subtree to the Trash together.

Notes in the Trash and notes marked as templates are hidden from the sidebar and never appear in search results.

## Getting a note back

Open the Trash to see what's in it; each note is listed with how long ago it was trashed. **Restore** returns a note to the folder it came from, exactly where it was. Nothing in the Trash expires on its own: notes stay there until you remove them yourself. That is deliberate: the Trash is a safety net you control, not a timer.

## Permanent deletion

Removing a note from the Trash, the opposite of **Restore**, is the only irreversible step. You can delete a single note permanently, or use **Empty trash** to clear everything at once (Myne shows a count and asks you to confirm, because this cannot be undone).

When a note is permanently deleted, its encrypted file is removed, and with it the only on-disk copy of the key that note was encrypted under, so the content is not just unlinked, it becomes unrecoverable. The note's [snapshots](/user-guide/safety-and-recovery/note-snapshots/) are removed in the same step. After this, the recovery phrase cannot bring the note back, because there is nothing left to decrypt.

## Limits

Permanent deletion is final within the vault, but a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) made *before* you deleted a note still contains it, and restoring that backup brings the note back. Deletion erases the live vault, not copies you have already exported. Plan deletions and backups with that in mind.
