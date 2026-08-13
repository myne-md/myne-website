---
title: "Drawings"
category: "notes-and-organization"
updated: 2026-08-13
summary: "A drawing is an ordinary note you draw in rather than type in. Make one from the sidebar, from a folder, or from the new-tab chooser, or type /drawing to create one beside the note you are writing and embed it inline as an editable canvas."
tags: ["notes", "editor", "markdown"]
---

A drawing is a note you draw in rather than type in. It is not a separate file type and not an attachment: it lives in a folder, has a title, appears in the sidebar, and is encrypted exactly like your writing. You can make a drawing on its own, or type `/drawing` inside a note to create one beside it and embed it in place.

## Making a drawing

There are four ways in, and all of them make the same thing:

- The **+** button at the top of the sidebar has a **New drawing** row.
- Right-click a folder and choose **New drawing here** to make one inside that folder.
- Right-click empty sidebar space and choose **New drawing** to make one at the vault root.
- A new, empty tab offers **New drawing** alongside **Create a new note**; see [Tabs and split view](/user-guide/notes-and-organization/tabs-and-split-view/).

The new drawing opens with its title ready to edit, the same as a new note.

## The canvas

A drawing opens as a canvas with a drawing toolbar. Its menu offers a light/dark theme for the drawing, a canvas background colour, and a reset that clears every element on the canvas — reset asks you to confirm first, because it empties the drawing.

The menu has no open-a-file, save-to-file, or export-image action. That is deliberate rather than missing: a drawing is a note in your vault, not a file on disk, so there is nothing to open from or save to. Myne owns export, and a drawing embedded in a note is carried by that note's export.

## Drawing inside a note

Type `/drawing` in an ordinary note. Myne creates a drawing in that note's folder, titles it `Drawing 1` (then `Drawing 2`, and so on, skipping titles already taken), and inserts `![[Drawing 1]]` on its own line at the caret. That reference is ordinary markdown — the same `![[…]]` embed syntax the rest of the editor uses. The drawing itself is a real note and shows up in the sidebar like any other.

The embed renders as a thumbnail of the drawing. Click it, or the **Edit** button that appears when you hover it, and the canvas opens in place at the same size, so nothing on the page jumps. **Done** collapses it back to the thumbnail. Only the embed you are editing runs a live canvas; every other drawing on the page stays a picture, so a note with several drawings in it stays light.

Whether an embed is open or collapsed is interface state and nothing more. It is never written into the note, so the note's text is the same `![[Drawing 1]]` either way. In reading mode an embedded drawing is always the thumbnail — reading mode does not edit, so it does not open a canvas.

An empty drawing shows **Empty drawing — click to draw** instead of a blank frame, so a drawing you made and have not drawn in yet does not read as broken.

## Renaming and removing

Rename a drawing from the title field in the embed's header, or from the sidebar the way you rename any note. Both go through the same rename, so it does not matter which one you use: the `![[…]]` reference is rewritten in every note that embeds the drawing, and the rename and those rewrites land as one all-or-nothing write. The embed keeps working either way.

Deleting the embed's line removes the reference and leaves the drawing note itself where it is, in the sidebar. That is the difference worth knowing: removing an embed unlinks a drawing, it does not delete one. To get rid of the drawing, delete that note the way you delete any note — it goes to the Trash and can be restored from there. See [Trash](/user-guide/notes-and-organization/trash/).

## Limits

A drawing is stored as an ordinary note, so everything true of your other notes is true of it: it is encrypted the same way, it goes to the Trash rather than being erased, it is included in a [vault backup](/user-guide/safety-and-recovery/back-up-your-vault/), and with [sync](/user-guide/sync-and-devices/) on it travels to your other devices. There is no separate drawing store and no separate drawing format on disk. Until you turn on sync or name a remote AI provider, Myne runs entirely on your device; nothing leaves it.

Search reaches a drawing's **title** and the **text you typed inside it** — text elements on the canvas are indexed as plain text. Shapes, lines, and images on a canvas are not text, so they are not searchable by any query; a drawing made entirely of boxes and arrows is findable only by its title.

Whether an embed is expanded or collapsed is not part of the note. It is not saved, not backed up, and not carried to your other devices — opening a drawing on one device does not open it on another.
