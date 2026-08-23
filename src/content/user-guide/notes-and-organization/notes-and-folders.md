---
title: "Notes and folders"
category: "notes-and-organization"
updated: 2026-08-23
summary: "How to create, rename, move, and delete notes and folders in Myne — the sidebar's + menu, the editor's Note actions menu, how the folder tree maps to your vault on disk, and how nesting works."
tags: ["notes", "folders"]
---

Notes and folders are the backbone of a vault. This article covers creating and naming notes, how folders work, how autosave keeps your edits, and what happens when you delete something.

![The sidebar with notes organized into folders alongside loose top-level notes.](./notes-and-folders.png)

## Creating a note

New items come from the **+** button at the top of the sidebar. Its menu has four rows — **New note**, **New note from template…**, **New drawing**, and **New folder** — and the same actions are on the right-click menu of a folder row and of empty sidebar space.

**New note**, `⌘N` / `Ctrl N`, and the new-note-in-pane shortcut all make an **instant blank note** and drop you into it, ready to type. There is no dialog and no template to pick. A note built from a template is the separate, deliberate path; see [Templates](/user-guide/notes-and-organization/templates/). **New drawing** makes a note you draw in instead of type in; see [Drawings](/user-guide/notes-and-organization/drawings/).

The first line of the note becomes its title. Renaming a note updates wherever its title comes from: the heading in the note, or the `title` in its frontmatter if it has one.

To copy a note as a starting point, **Duplicate** makes a clone with a fresh title. When you want to act on several notes at once, you can select multiple notes and move, archive, or delete them together, or drag a selection into a folder; an **Open random note** action in the command palette pulls up a live note at random for serendipitous review. These are covered in [Bulk note actions](/user-guide/notes-and-organization/bulk-note-actions/).

## Acting on the note you have open

The sidebar's right-click menu is not the only way in. While a note is open, a **Note actions** menu sits at the top right of the editor with the actions that apply to that one note: **Rename**, **Move to folder…**, **Duplicate**, **Version history**, **Turn into template** (or **Convert to note** on a template), the four **Export as…** formats, and **Move to trash**. They do exactly what their sidebar equivalents do — the menu is there so you do not have to find the note's row first. It is absent on a new, empty tab, where there is no note for it to act on.

## Folders

Folders group your notes in the sidebar. You can nest them, drag notes between them, and create as many as you like. Deleting a folder that still contains notes moves the whole subtree to the Trash rather than destroying it, so nothing is lost to a misclick (see [Trash](/user-guide/notes-and-organization/trash/)).

A folder can have an **index note** — an ordinary note marked as that folder's landing page, pinned and badged at the top of the folder. A wikilink that ends in a slash, like `[[Projects/]]`, opens the folder's index note. See [Folder notes](/user-guide/notes-and-organization/folder-notes/).

### Private by design

Folders are an organizational layer, not a disk layout. The folder names you choose, and the structure you build, live **inside** the encrypted vault. They never become real directories on disk, so the names are not visible to anyone who only sees the vault folder. What that protects, and what it doesn't, is covered in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).

## Autosave, in detail

Myne autosaves; there is no save button. Concretely:

- It saves about **one second** after you stop typing.
- If you type continuously, it saves at least **every ten seconds** anyway.
- It also flushes immediately when you switch away from the window, lock the vault, or close the app.

So in a normal session nothing is ever unsaved for long. In the worst case, a hard crash or power loss mid-edit, you could lose **at most about the last ten seconds** of typing. If a save ever fails, Myne shows the error and a **Retry** so you know, rather than failing silently. Each note also records its own "last edited" time inside the encrypted note.

While a save is failing, actions that would rewrite the same note from disk are **declined rather than half-applied**: renaming a note or a folder, setting a cover, turning a note into a template, ticking a task from the Tasks panel. Myne says an open note has not finished saving and leaves the note alone. That is deliberate. Those actions read the file, change one field and write it back, so running one against a note whose newest text is still in the editor would write over your typing. Nothing is lost either way, and the action works normally as soon as the save lands.

One action can land partly, and it is worth knowing which. Renaming a **folder** moves every note in it in a single all-or-nothing write, and then records separately that the folder is one you created. If that second, smaller write fails, the rename itself has still happened: Myne says so, and an empty folder may reappear under the old name the next time you open the vault. Deleting it then is safe.

## Setting notes aside

The Archive is a separate place to set notes aside without deleting them: an archived note leaves the active sidebar but is not headed for deletion the way a trashed note is, and you can bring it back to its folder unchanged at any time. Archiving and Trash are distinct — a note is one or the other, never both. See [Archive](/user-guide/notes-and-organization/archive/).

## Limits

Autosave bounds your exposure to a hard crash at roughly ten seconds; it cannot protect against a disk that loses already-written data, which is what [backups](/user-guide/safety-and-recovery/back-up-your-vault/) are for. Deletion sends notes to the Trash, but emptying the Trash is permanent, as covered next.
