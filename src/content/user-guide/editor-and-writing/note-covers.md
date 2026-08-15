---
title: "Note covers"
category: "editor-and-writing"
updated: 2026-08-15
summary: "How to give a note a cover image, where the cover appears and where it deliberately does not, and what happens to a note when its cover attachment is deleted."
tags: ["notes", "attachments", "editor"]
---

A cover is an image shown across the top of a note, above the title. It is a property of the note itself, so every surface that draws the note draws the cover. A cover is always a file from your vault: Myne never fetches an image from the internet, so a web address is not a cover.

## Prerequisites

You need an unlocked vault and at least one image already in it. Anything you have pasted, dropped or attached to a note is available to pick from; if the vault has no images yet, the picker tells you so rather than showing an empty grid.

## Adding a cover

1. Open the note.
2. Hover the note's title. An **Add cover** button appears beside it.
3. Pick an image from the grid, or use **Upload** to bring a new one in.

The picker is the same one used everywhere else in Myne, so you can also drag an image onto it.

Two other ways reach the same picker, and both work without a pointer:

- The **"…"** menu in the top right of the note.
- The command palette: press <kbd>Ctrl</kbd>+<kbd>K</kbd> (<kbd>Cmd</kbd>+<kbd>K</kbd> on macOS) and run **Set note cover**.

## Changing or removing a cover

Hover the cover itself. Two controls appear on it:

- **Change cover** opens the picker again.
- **Remove cover** clears it immediately. The image stays in your vault; only the note stops using it as a cover.

On a touch screen there is no hover, so these controls are always visible. On the mobile app a cover is shown but cannot yet be changed from inside the note.

## Where a cover appears

- **In the note**, as a banner above the title. It scrolls with the note rather than staying pinned, so it does not take up room while you read.
- **In a cards view**, if you use saved views and that view's image setting is still on its default `cover` property. A view pointed at a different property shows whatever that property holds.
- **In HTML and PDF exports**, at the top of the exported document, so what you share looks like what you wrote.
- **In a markdown export**, as an ordinary frontmatter line. If you export with attachments, the image file is written alongside and the reference is rewritten to point at it, so the exported folder stands on its own.

## Where a cover does not appear

The note list in the left sidebar stays text only, and so do tabs, search results and the quick switcher. This is a deliberate choice rather than something not built yet: a tree of several hundred notes reads differently once every row carries a thumbnail, and Myne keeps that panel text-first.

## Limits

- **A cover is a vault attachment, never a remote image.** Myne does not fetch images from the internet, so a cover never causes a network request. That is a statement about covers, not about the app as a whole.
- **The cover is stored inside the note, and the note is encrypted.** The cover line is part of the note's frontmatter, so it is inside the same encrypted file as the rest of the note and syncs with it. The image itself is an ordinary attachment, encrypted the same way as any other.
- **Deleting the image removes the cover from view, silently.** If you delete the attachment a note uses as its cover, the note simply renders without a banner. There is no broken-image placeholder and no warning, because a note reads perfectly well without a cover. The `cover` line stays in the note's frontmatter, where you can see and clear it in the note's properties.
- **The crop is fixed.** The image is cropped to a fixed band from its centre. You cannot yet drag the image to choose which part shows.
- **A cover is not a note icon.** Small per-note icons in the sidebar and tabs are a separate feature and do not exist today.
