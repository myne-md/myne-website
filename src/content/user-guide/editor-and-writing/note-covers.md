---
title: "Note covers"
category: "editor-and-writing"
updated: 2026-08-22
summary: "How to give a note a cover image, where the cover appears and where it deliberately does not, and what happens to a note when its cover attachment is deleted."
tags: ["notes", "attachments", "editor"]
---

A cover is an image shown across the top of a note, above the title. It is a property of the note itself rather than of one view, so it travels with the note wherever the note's own content is shown. A cover is always a file from your vault: Myne never fetches an image from the internet, so a web address is not a cover.

## Prerequisites

You need an unlocked vault and at least one image already in it. Anything you have pasted, dropped or attached to a note is available to pick from; if the vault has no images yet, the picker tells you so rather than showing an empty grid.

## Adding a cover

1. Open the note.
2. Hover the note's title. An **Add cover** button appears beside it.
3. Pick an image from the grid, or use **Upload** to bring a new one in.

The picker is the same one used everywhere else in Myne, so you can also drag an image onto it.

Two other ways reach the same picker:

- The **"…"** menu in the top right of the note.
- The command palette (⌘K / Ctrl K), which is the keyboard route: run **Set note cover…**, or **Remove note cover** to clear one. The hover controls are the only other way, so the palette is what makes covers reachable without a pointer.

## Changing or removing a cover

Hover the cover itself. Two controls appear on it:

- **Change cover** opens the picker again.
- **Remove cover** clears it. The image stays in your vault; only the note stops using it as a cover.

Both controls act on the note whose cover you clicked, so in a split you can use them on a pane you have not clicked into first. A pending edit is saved before the cover is written, so you do not have to let your typing settle first.

On a touch screen there is no hover, so these controls are always visible. The mobile app has the same two controls; the picker they open is a bottom sheet, without drag and drop.

## Where a cover appears

- **In the note**, as a banner above the title. It scrolls with the note rather than staying pinned, so it does not take up room while you read.
- **In a cards view**, but only if that view's **Cover image property** is set to `cover`. It is empty by default, and an empty setting means the cards show no image at all. Setting a cover from a card's own button points the view at `cover` for you.
- **In HTML and PDF exports**, at the top of the exported document, so what you share looks like what you wrote.
- **In a markdown export**, as an ordinary frontmatter line. If you export with attachments, the image file is written alongside and the reference is rewritten to point at it, so the exported folder stands on its own.

## Where a cover does not appear

The note list in the left sidebar stays text only, and so do tabs, search results and the quick switcher. This is a deliberate choice rather than something not built yet: a tree of several hundred notes reads differently once every row carries a thumbnail, and Myne keeps that panel text-first.

## Limits

- **A cover is a vault attachment, never a remote image.** Myne does not fetch images from the internet, so a cover never causes a network request. That is a statement about covers, not about the app as a whole.
- **The cover is stored inside the note, and the note is encrypted.** The cover line is part of the note's frontmatter, so it is inside the same encrypted file as the rest of the note and syncs with it. The image itself is an ordinary attachment, encrypted the same way as any other.
- **Deleting the image removes the banner, silently.** If you delete the attachment a note uses as its cover, the note renders without a banner. There is no placeholder and no warning, because a note reads perfectly well without a cover. A cards view is the exception: the card still tries to draw the image, so it shows as a broken image until you clear the line. The `cover` line stays in the note's frontmatter either way, where you can see and clear it in the note's properties.
- **The `cover` line holds a reference Myne writes, not a filename you type.** Clearing the row is the supported manual edit. Typing a filename, a web address or anything else there leaves the note with no cover and says nothing, because the line is only read when it holds exactly one attachment reference in Myne's own form.
- **A `cover` brought in from another app is left alone.** Vaults from other tools often carry a nested `cover` under something like `seo:`, and Myne does not read that as a cover, does not touch it, and writes its own line separately if you set one.
- **The crop is fixed.** The image is cropped to a fixed band from its centre. You cannot yet drag the image to choose which part shows.
- **A cover is not a note icon.** Small per-note icons in the sidebar and tabs are a separate feature and do not exist today.
