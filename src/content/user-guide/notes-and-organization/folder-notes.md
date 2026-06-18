---
title: "Folder notes"
category: "notes-and-organization"
updated: 2026-06-18
summary: "Designate one note in a folder as its index note. A folder note stays a normal child but gets an index badge, can be opened from the folder row, and is the target of a trailing-slash wikilink like [[Projects/]]."
tags: ["notes", "folders", "links"]
---

You can pick one note inside a folder to act as that folder's index note, the note that represents the folder. A folder note is not hidden or special storage; it stays a fully visible, enumerable child of its folder. What changes is that its sidebar row gains a book-open index badge, the folder's own row gets an affordance to open it in one click, and it becomes the target of a trailing-slash wikilink such as `[[Projects/]]`.

## Setting a folder note

Designating a folder note is done from a note's right-click menu in the sidebar. The note must live inside a folder, because a root or unfiled note has no folder to index.

1. Right-click a note that lives in the folder you want it to represent.
2. Choose **Set as folder note**. The note's row gains a book-open index badge, and the folder's row gains an affordance that opens this note.

To undo this, right-click the same note and choose **Remove as folder note**. The note stays an ordinary, live note; only the index designation is removed. Its title, body, folder, and "last edited" time are left untouched, so flipping the flag does not count as an edit.

The binding is path-free: the note indexes whichever folder its own `folder:` field names. If you later rename the folder, the binding follows automatically, with no link to repair.

## Opening a folder note

A folder that has an index note shows a book-open affordance on its row in the sidebar. Click it to open the index note. Opening it is its own action, so the click never expands or collapses the folder.

A folder with no index note shows a **folder note** create affordance when you hover its row. Clicking it mints a new note inside that folder, titled after the folder's last segment, and designates it as the index note.

You can also reach both from the folder's right-click menu:

- **Open folder note** when the folder already has an index note.
- **Create folder note** when it does not.

## Linking to a folder note

A folder note is a wikilink target through the trailing-slash form `[[Folder/]]`. The trailing slash is the sole difference from a title-only link: `[[Projects]]` links to a note titled "Projects", while `[[Projects/]]` links to the index note of the folder named "Projects".

These links reuse the ordinary wikilink machinery, so a folder-target link shows up in backlinks, hover, and the graph the same way any other link does.

When a folder-target link does not resolve, the hint tells you which case you are in:

- **(no folder note)** means the folder exists but has not been given an index note yet.
- **(no match)** means there is no folder by that name.

## When two notes are flagged

If two notes in the same folder are both set as folder notes, Myne does not leave it ambiguous. It picks a deterministic winner, the note with the smallest internal id, and treats that one as the folder's index. The other note is flagged with a conflict indicator that reads "This folder already has an index note". To resolve it, remove the folder-note designation from whichever note you do not want, leaving exactly one.

## Limits

A folder note is recorded as `folder_index: true` in the note's frontmatter, which lives inside the same encrypted `.myn` file as the rest of the note. There is no new on-disk format and no new file: nothing is stored in a different or less protected place. Like the rest of a note's frontmatter, the flag is encrypted at rest under your master password and recovery phrase, within the bounds described in the privacy model.

Because the binding is a path-free boolean rather than a stored path, a folder rename follows the binding with no drift; there is no second copy of the folder path to fall out of sync. Folder-target wikilinks that point at the folder are a separate matter: they carry the folder name in their text, so a rename refreshes them on a best-effort pass, and a stale one shows the broken hint rather than silently pointing somewhere wrong.
