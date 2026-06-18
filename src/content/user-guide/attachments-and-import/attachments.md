---
title: "Attachments"
category: "attachments-and-import"
updated: 2026-06-18
summary: "How to attach files to your notes, how renderable and generic files differ, the size limits, and how attachments are stored inside the encrypted vault."
tags: ["attachments", "notes"]
---

An attachment is a file you keep inside your vault and embed in a note. Like everything else in Myne, attachments are encrypted on disk. This article covers adding them, the size limits, and how they behave.

## Adding an attachment

You add attachments from the editor, in any of these ways:

- **Paste** an image straight from your clipboard.
- **Drop** a file onto the editor.
- Use the **`/attach`** command.
- Pick a file through the attachment picker.

Insertion always happens in the editor. That is where an attachment becomes part of a note.

## File types and sizes

Any file type may be attached. An attachment can be up to **64 MiB** (note text itself is capped at 16 MiB); a file over the limit is rejected with a message saying why, and nothing is added.

What differs is how a file appears in the note, which depends on whether Myne can render it. To decide that, Myne checks the file's actual contents, not its extension: renaming a `.zip` to `.png` won't make it render as an image.

## How attachments render

In a note, an embedded image shows inline. A PDF shows a first-page preview where it can, and an icon otherwise.

A file Myne cannot render — a `.docx`, a `.zip`, anything that isn't an image or PDF — surfaces as a **file-card**: a file-type icon, the filename, a `type · size` line, and a `⋯` menu with **Export**, **Rename**, **Remove**, and **Reveal in library**. A file-card's contents are never previewed inline; "using" a generic file means exporting it to disk through the native Save dialog.

A recorded voice note or an attached audio file shows as an inline player with a play control and a time readout. See [Voice notes](/user-guide/attachments-and-import/voice-notes/) for recording one with the `/record` command.

Identical files are stored once: if you add the same file twice, Myne keeps a single copy and both embeds point at it.

## Renaming, exporting, and deleting

Renaming an attachment changes its **display name in the library only**; it never rewrites the embeds in your notes, so links don't break.

**Export** writes one attachment back to a file you choose through the native Save dialog — the same Save-As action that backs a file-card's `⋯` menu. The export is decrypted to the path you pick; the copy on disk is no longer protected by your vault.

Attachments are not removed automatically. When you remove a note, the files it embedded stay in the library as **unused attachments** (zero references) rather than disappearing. The only way to erase them is the explicit **Clean unused attachments** sweep in the attachments library, which reviews and then permanently deletes the files you confirm; Myne also reconciles **stray attachment files** when you unlock. If you delete an attachment that a note still embeds, that embed becomes a "deleted attachment" marker (a tombstone) rather than a broken image, so you can see what used to be there.

## How they're stored

An attachment's name, contents, and type are encrypted; what a copy of the vault folder can still reveal is how many attachments there are and how big each one is.

Attachments live as encrypted files inside the vault; today they're accessible only through the app. There is no bulk attachment-export tool.

## Limits

Native operating-system drag-and-drop from a file manager is deliberately off; use one of the editor methods above. The exact `![[att:…]]` embed syntax is in [Footnotes and reference links](/user-guide/markdown/footnotes-and-reference-links/#wikilinks). Attachment **contents are not searched**: [Search](/user-guide/find-and-connect/search/) covers note text, not what's inside a PDF or image.
