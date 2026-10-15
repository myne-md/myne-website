---
title: "Folder notes"
category: "notes-and-organization"
updated: 2026-10-15
summary: "Give a folder one index note that represents it. A folder note is hidden from the sidebar tree and opened by double-clicking the folder row; it stays findable in search and is the target of a trailing-slash wikilink like [[Projects/]]. The feature is off by default."
tags: ["notes", "folders", "links"]
---

A folder can have one note that stands in as its index — its "folder note". A folder note is not stored anywhere special; it is an ordinary note whose content you read as the folder's overview. What is different is that it does not get its own row in the sidebar tree. Instead you reach it from the folder itself: double-click the folder row to open it. A folder has at most one folder note, and it stays findable in search and resolvable as a link the same way any other note is.

## Turning it on

Folder notes are **off by default**, so the controls below are hidden until you switch them on. Open **Settings → Files** and turn on **Folder notes**. The switch is a presentation gate, not a migration: turning it off and on again changes nothing on disk.

## Opening a folder note

Double-click a folder's row in the sidebar to open its folder note. If the folder does not have one yet, the double-click creates one and opens it, titled after the folder's last path segment.

A folder that already has a folder note carries a small book icon on its row; the icon is named **Open folder note**, and clicking it opens the note. A folder that has none reveals the same icon when you hover its row, named **Create a folder note**; clicking it mints the folder note and opens it. Both controls are icon-only, so the name shows on hover rather than on the row itself.

You can reach the same actions from the folder's right-click menu:

- **Open folder note** when the folder already has one.
- **Create folder note** when it does not.

## Setting an existing note as the folder note

If you already have a note you want to use as the folder's index, promote it in place instead of creating a new one.

1. Right-click the note in the sidebar. It must live inside the folder you want it to represent — a root or unfiled note has no folder to index.
2. Choose **Set as folder note**.

This option is offered only when the folder does not already have a folder note, because a folder can have at most one. Once you set it, the note leaves the sidebar tree: it no longer has its own row, and the folder's row becomes the way to open it.

The binding is path-free: the note indexes whichever folder its own `folder:` field names. If you later rename the folder, the binding follows automatically, with no link to repair.

## Removing a folder note

To turn a folder note back into an ordinary note, right-click the folder and choose **Remove folder note**. The note returns as a normal, visible row in the sidebar tree, in its folder, where you can open it directly again. Its title, body, folder, and "last edited" time are left untouched, so this does not count as an edit.

## Linking to a folder note

A folder note is a wikilink target through the trailing-slash form `[[Folder/]]`. The trailing slash is the sole difference from a title-only link: `[[Projects]]` links to a note titled "Projects", while `[[Projects/]]` links to the folder note of the folder named "Projects".

These links reuse the ordinary wikilink machinery, so a folder-target link shows up in backlinks, hover, and the graph the same way any other link does.

When a folder-target link does not resolve, the hint tells you which case you are in:

- **(no folder note)** means the folder exists but has not been given a folder note yet.
- **(no match)** means there is no folder by that name.

## Limits

A folder note is recorded as `folder_index: true` in the note's frontmatter, which lives inside the same encrypted `.myn` file as the rest of the note. There is no new on-disk format and no new file: nothing is stored in a different or less protected place. Like the rest of a note's frontmatter, the flag is encrypted at rest under your master password and recovery phrase, within the bounds described in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).

The folder note is hidden only from the sidebar tree. It stays a full, real note everywhere else — in search, saved views, backlinks, the graph, and `[[Folder/]]` resolution — so its at-rest exposure is exactly that of any other note; hiding it from the tree is a presentation choice, not a quieter form of storage.

If a vault imported from elsewhere already carries more than one note flagged as a folder note in the same folder, only one is treated as the folder's index and hidden. The extras stay visible as ordinary rows so you can pick which one to keep and clear the rest.
