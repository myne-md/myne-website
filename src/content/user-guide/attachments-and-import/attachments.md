---
title: "Attachments"
category: "attachments-and-import"
updated: 2026-06-11
summary: "How to attach images and documents to your notes, which file types Myne accepts, the size limits, and how attachments are stored inside the encrypted vault."
tags: ["attachments", "notes"]
---

An attachment is an image or document you keep inside your vault and embed in a note. Like everything else in Myne, attachments are encrypted on disk. This article covers adding them, the accepted types, and how they behave.

## Adding an attachment

You add attachments from the editor, in any of these ways:

- **Paste** an image straight from your clipboard.
- **Drop** a file onto the editor.
- Use the **`/attach`** command.
- Pick a file through the attachment picker.

Insertion always happens in the editor. That is where an attachment becomes part of a note.

## Accepted types and sizes

Myne accepts exactly six formats: **PNG, JPEG, GIF, WebP, SVG, and PDF**. It checks the file's actual contents, not its extension: renaming a `.zip` to `.png` won't get it in. An attachment can be up to **64 MiB** (note text itself is capped at 16 MiB). A file of the wrong type or over the limit is rejected with a message saying why; nothing is added.

## How attachments render

In a note, an embedded image shows inline. A PDF shows a first-page preview where it can, and an icon otherwise. Identical files are stored once: if you add the same image twice, Myne keeps a single copy and both embeds point at it.

## Renaming and deleting

Renaming an attachment changes its **display name in the library only**; it never rewrites the embeds in your notes, so links don't break. Attachments are removed only when you delete them explicitly; there is no automatic cleanup. If you delete an attachment that a note still embeds, that embed becomes a "deleted attachment" marker (a tombstone) rather than a broken image, so you can see what used to be there.

## How they're stored

An attachment's name, contents, and type are encrypted; what a copy of the vault folder can still reveal is how many attachments there are and how big each one is.

Attachments live as encrypted files inside the vault; today they're accessible only through the app. There is no bulk attachment-export tool.

## Limits

Native operating-system drag-and-drop from a file manager is deliberately off; use one of the editor methods above. The exact `![[att:…]]` embed syntax is in [Footnotes and reference links](/user-guide/markdown/footnotes-and-reference-links/#wikilinks). Attachment **contents are not searched**: [Search](/user-guide/find-and-connect/search/) covers note text, not what's inside a PDF or image.
