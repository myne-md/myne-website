---
title: "Import from Obsidian"
category: "attachments-and-import"
updated: 2026-06-18
summary: "How to import an existing Obsidian vault into Myne, how notes, links, and attachments are mapped, and the edge cases to check in the import summary."
tags: ["import", "attachments"]
---

If you are coming from Obsidian, Myne can import an existing vault (your notes, your folder structure, your links, and your attachments) in one pass. The import is a one-time, one-way copy: Myne reads your Obsidian vault and builds a Myne vault from it. It is **not** sync; nothing connects the two afterward, and nothing leaves this device.

## Before you start

- Know where your Obsidian vault folder is on disk.
- The import **reads your Obsidian files and never changes them**; the originals are left exactly as they are.
- Decide what you want to happen if a note already exists in your Myne vault (you choose this on the setup screen, below).

## Starting an import

Myne offers the importer the first time you unlock a fresh vault. You can also start it any time from the command palette with **Import Obsidian vault…**. The flow has three phases: set up, run, and review.

### 1. Set up

Point Myne at your Obsidian vault folder. One choice matters here: how to handle a note that would collide with one you already have. A single toggle covers it. **Skip** (the default) leaves your existing note untouched, or **Import as copy** brings the incoming one in alongside it. Either way, **nothing is ever overwritten**.

### 2. Run

The import runs through your vault. If you dismiss or cancel partway, what was already imported stays (it is not rolled back), and running the import again picks up the rest. Re-running is safe: the import is idempotent, so notes already brought in are not duplicated.

### 3. Review the summary

When it finishes, Myne shows a summary so you can see exactly what happened.

## Reading your import summary

The summary reports each outcome:

- **Notes imported**: how many Markdown notes came across.
- **Attachments imported**: how many referenced files were brought in.
- **Skipped (non-Markdown)**: files that aren't notes or supported attachments.
- **Canvas files**: listed on their own line (see Limits).
- **Needs attention**: notes the import couldn't map cleanly, listed so you can fix them by hand.

## How things map

| In Obsidian | In Myne |
|---|---|
| A folder | the note's `folder:` (your structure is preserved) |
| A file's name | the note's `title:` (when the note has none of its own) |
| A `[[wikilink]]` | kept exactly as written |
| A referenced image/PDF (supported type, within size) | brought in as an attachment and embedded with `![[att:…]]` |
| A referenced file Myne can't take | left as a searchable placeholder (see Limits) |
| A remote image URL | left as-is and **never fetched** |

Your wikilinks are preserved byte-for-byte; imported links stay as you wrote them and resolve by title. When you want to rewrite the title-links in a note into Myne's own path form, run **Convert imported wikilinks in this note…** from the command palette while that note is open. It acts on the note in front of you and shows a diff preview before changing anything; if nothing resolves, it tells you so and leaves the note untouched.

## Limits & edge cases

A few things to check after a large import:

1. **Same filename in two folders.** If two notes share a base name, a link by that name resolves to the first match; check those links if you relied on folder-specific names.
2. **Dot-prefixed files are skipped.** A file whose name starts with a dot (including a note like `.draft.md`) is treated as hidden and not imported.
3. **Notes that already had a `folder:` field** appear in the **Needs attention** list rather than being silently moved; review and set their folder yourself.
4. **Omitted attachments leave a marker.** A reference Myne couldn't import becomes a literal `<!-- omitted attachment: … -->` comment in the note. To find them all after importing, search your notes for `<!-- omitted attachment:`.
5. **Rename suggestions are copy-paste.** Where the importer suggests a corrected name, you apply it yourself; it is not a one-click fix.

## What doesn't come across

- **Obsidian Canvas (`.canvas`) files are not imported.** A whiteboard is a deliberate non-feature in Myne, so canvases are reported and left behind rather than converted.
- **Obsidian Bases (`.base`) views** come in through a separate importer, not the vault import above. Run **Import .base view…** from the command palette to bring a Bases view in as a Myne saved view; like the vault import it is one-time and one-way. See [Saved views](/user-guide/editor-and-writing/saved-views/) for what a Bases view maps to and what does not carry over.
- **Plugins and themes** are out of scope: the importer brings content, not Obsidian's configuration.

## Limits

The importer is a point-in-time copy, not a live link: changes you make in Obsidian afterward do not flow into Myne, and Myne changes do not flow back. To bring later changes over, run the import again.
