---
title: "Attachments"
category: "attachments-and-import"
updated: 2026-08-16
summary: "How to attach files to your notes, which file types render in place and which are kept as an export-only card, the size limits, and how attachments are stored inside the encrypted vault."
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

What differs is how a file appears in the note, which depends on whether Myne can render it. Myne decides how to serve a file from its actual contents, not its extension: renaming a `.zip` to `.png` won't make it render as an image. The inline text and spreadsheet previews are the one exception — they route on the filename, because a generic file is stored without a content type of its own, so a `.csv` renamed to `.dat` gets a file-card instead of a preview.

## Image compression on import

When an image enters your vault — pasted, dropped, or brought in by the importer — Myne downscales and re-encodes it on the way in, so a vault full of screenshots doesn't grow without bound on disk, in backups, or over sync. This happens before the file is stored, and **the original bytes are not kept**: the re-encoded copy is what lives in your vault, with no way to recover the file exactly as it came in. If you need an image kept byte-for-byte, turn the setting below off before you add it.

A few rules keep the transform from costing you anything unexpected:

- Myne stores whichever of the original and the re-encoded copy is **smaller**, so an import is never made larger.
- **SVG and animated images are never re-encoded** — doing so would discard something Myne cannot rebuild, such as vector geometry or animation.
- If an image cannot be decoded or re-encoded, the original is stored unchanged and the import still succeeds; compression is best-effort and never turns a working import into a failed one.
- Only images added from now on are affected — by any route. Attachments already in the vault are left exactly as they are.

The control is **Compress images on import** in Settings → Files. It is a single vault-wide switch, **on by default**. When compression actually changes an image, a one-time notice after the import reports the size before and after; an import that changed nothing — a file that was already small, a duplicate you already had, or the switch turned off — shows no notice.

## How attachments render

In a note, an embedded image shows inline. A PDF shows a first-page preview where it can, and an icon otherwise.

An MP4 or WebM video shows an inline player with your system's own video controls; nothing plays until you press play, and a video your system has no codec for falls back to a file-card. A recorded voice note or an attached audio file shows as an inline player with a play control and a time readout. See [Voice notes](/user-guide/attachments-and-import/voice-notes/) for recording one with the `/record` command.

A plain-text or source-code file — `.txt`, `.md`, `.csv`, `.json`, `.yaml` and the common source extensions — shows a read-only preview of its first lines; a long one ends with "Preview truncated — Export for the full file." A `.docx` or `.xlsx` shows a read-only structured preview: headings and paragraphs for a document, the first rows and columns for a sheet. Neither preview is editable: changing such a file means exporting it, editing it outside Myne, and attaching it again.

Anything else — an archive, an installer, a font — surfaces as a **file-card**: a file-type icon, the filename, a `type · size` line, and a `⋯` menu with **Export**, **Rename**, **Remove**, and **Reveal in library**. "Using" a file-card file means exporting it to disk through the native Save dialog.

Identical files are stored once: if you add the same file twice, Myne keeps a single copy and both embeds point at it.

## The embed menu

Every embedded image and PDF carries its own `⋯` menu in the top-right corner. It has the same four file actions as a file-card (**Export**, **Rename**, **Remove** and **Reveal in library**), plus the controls for how the embed looks in the note:

- **Size**: Small, Medium, Large or Full width. Picking the size that is already ticked clears it and returns the embed to the default. **Custom size…** takes an exact width in pixels, or a percentage of the text column.
- **Align left**, **Align center**, **Align right**. Picking the one already ticked clears it.
- **Edit alt text…**: what a screen reader announces, and what [Search](/user-guide/find-and-connect/search/) can match on. To mark an image decorative so a screen reader skips it instead of reading out a camera filename, give it alt text and then clear that back to empty. Submitting an empty box on an embed that never had alt text leaves it as it was, because those are two different requests and only one of them is a decision about the image.
- If Myne cannot read something in the embed, it says so rather than fixing it quietly: a warning sits beside the `⋯` and a **Could not read:** line at the bottom of the menu quotes the text as written. Your file is not changed.

A size is a maximum, not a fixed frame: an image never grows wider than your text column, so changing the column width in **Settings → Editor** re-flows your notes rather than breaking them. **Full width** is the way to say "fill the page" and keeps meaning that on any screen, where a large pixel number does not.

Your choices are written into the note itself, so they travel with it: they survive sync, and they are still there when you read the file outside Myne. Which surfaces **apply** them is a shorter list than which surfaces keep them. The desktop and browser apps lay the embed out as you set it; the phone app currently shows every embed at its default size and reads the filename rather than your alt text; and an HTML or PDF export uses the filename as the alt and its own layout. The bytes are intact in all four cases, which is why an embed laid out on a computer is still laid out when you open that note there again. Opening an exported note in **Obsidian** is a partial match rather than a promise: a pixel width comes across, because Obsidian has its own way of writing one, while a percentage width and an alignment do not, so it falls back to its own default for those. Nothing is lost from the file either way. The exact syntax is in [Embeds](/user-guide/markdown/embeds/), though you never need to type it.

## Renaming, exporting, and deleting

Renaming an attachment changes its **display name in the library only**; it never rewrites the embeds in your notes, so links don't break.

**Export** writes one attachment back to a file you choose through the native Save dialog — the same Save-As action that backs a file-card's `⋯` menu. The export is decrypted to the path you pick; the copy on disk is no longer protected by your vault.

Attachments are not removed automatically. When you remove a note, the files it embedded stay in the library as **unused attachments** (zero references) rather than disappearing. The only way to erase them is the explicit **Clean unused attachments** sweep in the attachments library, which reviews and then permanently deletes the files you confirm; Myne also reconciles **stray attachment files** when you unlock. If you delete an attachment that a note still embeds, that embed becomes a "deleted attachment" marker (a tombstone) rather than a broken image, so you can see what used to be there.

## How they're stored

An attachment's name, contents, and type are encrypted; what a copy of the vault folder can still reveal is how many attachments there are and how big each one is.

Attachments live as encrypted files inside the vault; the app is the only thing that reads them there. There is no attachments-only export, but [Export vault as Markdown](/user-guide/editor-and-writing/export-notes/#exporting-the-whole-vault) writes every attachment the exported notes embed into an `attachments/` folder beside them, decrypted, with the embeds rewritten to point at the files. An attachment no note embeds is not carried out that way — export those one at a time from the library.

## Limits

Dragging files in from your file manager works: drop an image or any other file onto the editor or the attachments library to attach it, and drop markdown or text files (`.md`, `.markdown`, `.mdown`, `.txt`) onto a folder in the sidebar to import each one as a note. A non-markdown file dropped onto a folder is skipped, and a folder drop is not the full importer — to migrate a whole vault at once, use [Import your notes](/user-guide/attachments-and-import/import-your-notes/). The exact `![[att:…]]` embed syntax is in [Embeds](/user-guide/markdown/embeds/). Attachment **text is searchable** where Myne can read it — the text layer of PDFs and Word documents, plain-text files, and, through on-device text recognition, images and scanned PDFs — so a note can turn up in [Search](/user-guide/find-and-connect/search/#attachment-text) on words that appear inside its attachments, not only its own prose; the extraction runs on your device and nothing is uploaded.
