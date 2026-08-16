---
title: "Exporting notes and your vault"
category: "editor-and-writing"
updated: 2026-08-16
summary: "Export a single note as Markdown, PDF, HTML, or plain text, or export the whole vault as a Markdown folder tree. Every export is unencrypted plaintext that leaves Myne's protection the moment it is written."
tags: ["notes", "markdown", "attachments"]
---

Exporting writes your notes out to ordinary files you can open anywhere. A single note can leave as Markdown, PDF, HTML, or plain text; the whole unlocked vault can leave as a plain Markdown folder tree shaped like your folders. Every one of these files is unencrypted plaintext — the moment it is written, it is outside Myne's protection. An export is never a backup file and never a snapshot, and there is no plaintext mode that mirrors your notes automatically: you choose the destination, every time.

## Exporting a single note

Single-note export has three surfaces, and they run the exact same flow:

- **Right-click a note** in the sidebar to open its context menu. The export items are there, one per format: **Export as Markdown…**, **Export as PDF…**, **Export as HTML…**, and **Export as Plain Text…**.
- **Open the command palette** while a note is open. The same export actions live in the **Editor** category, and they only appear when a note is open; in the palette each item reads **Export note as Markdown…**, **Export note as PDF…**, **Export note as HTML…**, and **Export note as Plain Text…** (the palette spells out "note").
- **The note-actions menu** in the editor's top-right. While a note is open, the **…** button (**Note actions**) opens a menu with the same four export items — **Export as Markdown…**, **Export as PDF…**, **Export as HTML…**, and **Export as Plain Text…** — alongside Rename, Move to folder, Duplicate, Turn into template, Version history, and Move to trash.

Picking any of them opens your operating system's save dialog so you choose where the file goes; if a file with that name is already there, the dialog's own Replace prompt is your consent to overwrite. When the export finishes, a toast reads **Exported to &lt;filename&gt;** with a **Show in folder** action that reveals the file in your file manager. When attachments or images are written out beside the file, the toast names them too — **Exported to &lt;filename&gt; + N attachment(s)** for Markdown, **+ N image(s)** for HTML.

The four formats differ in how faithfully they carry the note. Markdown is a byte-for-byte copy of the note's text; PDF, HTML, and plain text are projections that drop or transform parts of it. The sections below cover each.

## Markdown export

**Export as Markdown…** writes the note's body to a `.md` file byte-for-byte, exactly as Myne stores it — your [properties](/user-guide/markdown/frontmatter-properties/) and all. This is the only export that is a faithful round-trip of the note's text: what you export is what you wrote.

If the note embeds attachments, a short modal appears first and asks whether to include them. It states plainly: **The exported file is plain Markdown — it is not encrypted.** The **Include N attachments** toggle, with the sub-label "Files are placed in the same folder as the note", controls whether the referenced attachments are written out beside the `.md`. When you include them, each embed is rewritten to the `![[filename]]` wikilink form pointing at the file next to the note; if two attachments would land on the same name, the second gets a deterministic ` (1)` suffix so nothing is overwritten. A [note cover](/user-guide/editor-and-writing/note-covers/) travels the same way: it is a frontmatter line naming an attachment, so an attachments-included export writes the image beside the note and rewrites the line to point at it. HTML and PDF exports draw the cover at the top of the document. The size, alignment and alt text you set on an image or PDF travel with it. A width in pixels is written the way Obsidian writes one, so it survives into Obsidian; a percentage width and an alignment have no Obsidian equivalent, so they ride along in the file untouched and Obsidian falls back to its own default for them. Nothing you set is dropped from the exported text. What Obsidian then makes of a percentage width or an alignment is its own business and not something Myne has tested against it; what Myne guarantees is that the bytes are there. When a note has no attachments, there is no modal — the same egress sentence rides the save dialog's title instead, so it is said once, at the point you decide.

The modal also carries a **Copy note text to clipboard** button. It copies that note's Markdown and writes no file — the export stops there, and a toast confirms with **Note text copied**. The clipboard holds unencrypted text like any other export, so treat it the same way. The button rides the same modal, so it appears only when the note references attachments. It always targets the note the modal is about, which is not necessarily the note you have open.

## PDF export

**Export as PDF…** renders the note to a standalone page — math (KaTeX), [diagrams](/user-guide/markdown/diagrams/) (mermaid), and highlighted code all rendered — and hands it to your operating system's built-in print-to-PDF engine. The page size follows your system region: A4 by default, Letter in US regions, with fixed 20 mm margins.

Non-image embedded attachments are **not** carried into the PDF. When the note embeds any, a notice appears before the save dialog listing what will be left out — "Attached files (PDFs and other non-image attachments) are not included in the generated PDF." — and you **Continue** or **Cancel**. A PDF is a fixed, rendered picture of the note, not a copy of its text: it does not round-trip back into Myne. Reach for PDF when you want something to read or print, not something to re-import.

## HTML export

**Export as HTML…** writes a single, self-contained `.html` document you can open in any browser. If the note references image attachments, a modal first asks whether to include them. This is the same include-attachments modal the Markdown flow uses, so today it still carries the shared **Export as Markdown** heading and the **The exported file is plain Markdown — it is not encrypted.** sentence; the **plain HTML** wording appears only on the save dialog's title, and only when the note has no image attachments to write out. Opting in writes each image as a file beside the `.html` and rewrites the note's internal image references to point at those neighbouring files, so the page shows its images when opened. Editor-only `%%` [comments](/user-guide/editor-and-writing/comments/) are stripped from the output, the same as they never render in reading view. Like PDF, HTML is a projection of the note, not a faithful copy of its source.

## Plain-text export

**Export as Plain Text…** writes a stripped `.txt` of just the readable prose. There is no modal — plain text never includes attachments — so the save dialog appears straight away, with the egress sentence on its title: **The exported file is plain text — it is not encrypted.**

The stripping keeps what you would read aloud and drops the markup around it: properties and embeds are removed, headings become bare lines, list items keep their `- ` marker, code-block bodies are kept as-is, tables flatten to tab-separated rows, an image's alt text is kept (the image itself is not), and `%%` comments are stripped. Binary attachments are dropped entirely. Use plain text when you want the words with none of the formatting; it does not round-trip back into Myne.

## Exporting the whole vault

To export everything at once, open **Settings → Storage**, find the **Export** row, and click **Export…**; or run **Export vault as Markdown…** from the command palette's **Vault** category. Both open the same export window, which moves through three phases: a setup step, a running step, and a summary.

In setup you choose a destination folder and whether to export the whole vault or just one folder subtree, and the window restates the egress plainly: **The exported files are plain Markdown — they are not encrypted.** The export builds a plain, Obsidian-shape Markdown folder tree: the folder layout mirrors each note's folder, filenames come from each note's title with a `.md` extension, the bodies are byte-verbatim, and any referenced attachments land in an `attachments/` folder at the root of the tree. The default name for the new tree is the product name and the local date — for example `Myne export 2026-06-18 1430` — never your [vault label](/user-guide/getting-started/create-your-vault/).

Two things are deliberately left out of the tree: notes in the [trash](/user-guide/notes-and-organization/trash/) and per-note version history ([snapshots](/user-guide/safety-and-recovery/note-snapshots/)). The export carries your live notes, not their deletions or their past. The folder tree only appears once the export is complete — if it is cancelled or interrupted, no partial tree is left behind, so a half-finished export can never be mistaken for a whole one. To carry trash and snapshots too, use a [vault backup](/user-guide/safety-and-recovery/back-up-your-vault/) instead, which is the encrypted everything-carrier.

## Limits

Every export is a deliberate, one-time, plaintext crossing that you start. The files it writes are **not encrypted**, and from the moment they are written they are outside Myne's protection — at the mercy of whatever can read that folder. The encrypted vault itself is never altered by any export; exporting only ever reads.

An export is **not a backup and not a snapshot**. A [vault backup](/user-guide/safety-and-recovery/back-up-your-vault/) is the encrypted, restorable container; a [snapshot](/user-guide/safety-and-recovery/note-snapshots/) is per-note version history. An export folder is neither — it cannot be restored into Myne, and it carries no trash and no history.

Only Markdown export is a faithful, byte-stable copy of the note's text. PDF, HTML, and plain text are lossy projections: they render or strip the note and do not round-trip back in. If you want a file you can re-import later, export Markdown.

There is no plaintext mode. Myne does not watch a folder, mirror your notes to disk, or export anything on save — every plaintext file exists only because you asked for it. The vault stays encrypted until you choose otherwise. For how that fits the wider model, see [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/). Until you turn on sync or name a remote AI provider, Myne runs entirely on your device; nothing leaves it.
