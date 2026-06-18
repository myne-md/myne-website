---
title: "The attachments library"
category: "attachments-and-import"
updated: 2026-06-18
summary: "How the attachments library lists every file in your vault, how to search and sort it, and how to see which notes use a given attachment."
tags: ["attachments"]
---

The attachments library is where every file in your vault lives in one place. It opens as a full-pane view in the center of the window, the same space your notes use. You leave it by opening a note again; there is nothing to close.

![The attachments library, the central place where files added to the vault are listed.](./attachments-library.png)

## Opening the library

Open it from the **Open attachments…** command in the palette, or from its button in the sidebar.

## Browsing

The library shows your attachments as a grid or a list. To find one:

- **Search by filename**: the search box matches file names (it does not look inside the files).
- **Filter by type**: All types, Images, or Other. The type filter predates audio attachments, so a [voice note](/user-guide/attachments-and-import/voice-notes/) or imported audio file falls under Other.
- **Sort**: Newest first, Oldest first, or by name (A-Z / Z-A).

## Seeing where a file is used

Each attachment shows **used in N notes**, computed live from your current notes, so there is no separate list to maintain or to fall out of date. Open that to jump straight to a note that uses the file. A file that no note embeds shows **zero references**; it is not deleted on its own and stays in the library until you remove it.

## Cleaning unused attachments

Deleting a note never deletes the files it embedded, so files with zero references can build up. The **Clean unused attachments** command, run from the library, finds every file that no current note references. It reads your notes at the moment you run it to work out which files are still in use, then shows you the list to review before anything happens.

When you confirm, the files are erased from the vault. This is not reversible: there is no trash tier for a cleanup, so the review-and-confirm step is the only undo. Files that any note still embeds are never offered for cleanup.

## Acting on a file

A per-item menu gives you **preview**, **rename**, **export**, and **delete**, the same actions covered in [Attachments](/user-guide/attachments-and-import/attachments/) (rename changes the display name only; delete is explicit and leaves a tombstone in any note that embedded the file). **Export** opens a native Save dialog and writes a plaintext copy of the file to a path you choose; the copy you save sits outside the vault and is no longer encrypted.

## Importing from the library

You can bring a file in from the library with its **Import attachment** picker. Importing makes the file available; **embedding it into a note still happens in the editor**, the same as adding any attachment.
