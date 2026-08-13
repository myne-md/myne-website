---
title: "Import from Obsidian"
category: "attachments-and-import"
updated: 2026-08-13
summary: "How to import an existing Obsidian vault into Myne — and, through the same flow, from Notion, Evernote, HTML, and CSV. How notes, links, and attachments map, and the edge cases to check in the import summary and report."
tags: ["import", "attachments"]
---

If you are coming from Obsidian, Myne can import an existing vault (your notes, your folder structure, your links, and your attachments) in one pass. Obsidian is one of five sources the same importer reads — Notion, Evernote, HTML, and CSV are the others — so this article walks the Obsidian path in full and covers the other four under "Other sources", below. The import is a one-time, one-way copy: Myne reads your Obsidian vault and builds a Myne vault from it. It is **not** sync; nothing connects the two afterward, and nothing leaves this device.

## Before you start

- Know where your Obsidian vault folder is on disk.
- The import **reads your Obsidian files and never changes them**; the originals are left exactly as they are.
- Decide what you want to happen if a note already exists in your Myne vault (you choose this on the setup screen, below).

## Starting an import

Myne offers the importer the first time you unlock a fresh vault. You can also start it any time from the command palette with **Import notes…**, or from Settings → Storage → Import. The importer opens on a source picker; after you choose Obsidian, the flow has three phases: set up, run, and review.

### 1. Set up

Point Myne at your Obsidian vault folder. One choice matters here: how to handle a note that would collide with one you already have. A single toggle covers it. **Skip it** (the default, and the one marked recommended) leaves your existing note untouched, or **Import as a copy** brings the incoming one in alongside it. Either way, **nothing is ever overwritten**.

### 2. Run

The import runs through your vault. If you dismiss or cancel partway, what was already imported stays (it is not rolled back), and running the import again picks up the rest. Re-running is safe: the import is idempotent, so notes already brought in are not duplicated.

A file Myne can't read is flagged and skipped, and the import carries on — one unreadable file does not end the run. A file Myne can't **write** does stop it, because a full disk will not fix itself on the next file. Nothing is rolled back either way: the summary opens with a banner saying how many of how many notes were imported, which file it stopped on, and why. Those notes are in your vault and safe to keep, and re-running the import after you have fixed the cause picks up the rest.

### 3. Review the summary

When it finishes, Myne shows a summary so you can see exactly what happened.

## Reading your import summary

The summary leads with the number of notes imported, then reports each other outcome on its own row:

- **Skipped (already exist)**: notes that collided with one you already had, under the choice you made on the setup screen.
- **Media**: how many referenced files came across, and how many were omitted.
- **Images compressed**: how much smaller the imported images are, when image compression is on.
- **.canvas files skipped** and **Excalidraw drawings skipped**: drawings the importer reports and leaves behind rather than converting.
- **Other files skipped**: files that are neither notes nor referenced media.
- **Empty folders kept**: folders that came across with nothing in them.
- **Cancelled**: how many notes were left unimported if you stopped the run.
- **Needs attention**: everything the import wants you to look at by hand.

A line at the bottom says how many config and hidden items were ignored.

### What lands in Needs attention

Four kinds of finding, each as its own row:

- A note whose **title or folder name Myne can't use as written** — with a suggested name you copy and apply yourself.
- A note that **already carried its own `folder:` field** — Myne kept that value rather than moving the note, so its folder may differ from where it sat on disk.
- A **file Myne couldn't read** — skipped, with the reason (an older text encoding, a permission refusal, a file that vanished, no space left). The rest of the import carried on.
- A **shortcut to a folder that wasn't followed** — because it pointed outside the folder you picked, because it looped back into a folder Myne was already inside, or because its target is gone. A shortcut to a folder inside the vault you picked is followed like an ordinary folder.

Very long names are shortened in the middle so a row stays readable; the full name is in the note itself.

## How things map

| In Obsidian | In Myne |
|---|---|
| A folder | the note's `folder:` (your structure is preserved) |
| A file's name | the note's `title:` (when the note has none of its own) |
| A `[[wikilink]]` | kept exactly as written |
| A referenced image/PDF (supported type, within size) | brought in as an attachment and embedded with `![[att:…]]` |
| A referenced MP4 or WebM video (within size) | brought in as an attachment and embedded as an inline player |
| A referenced file Myne can't take | left as a searchable placeholder (see Limits) |
| A remote image URL | left as-is and **never fetched** |

MOV files and anything over the 64 MiB attachment cap are not brought in as playable video — they arrive as an export-only file-card, or leave a placeholder if they could not be imported at all. The exact embed syntax an imported attachment lands as is in [Embeds](/user-guide/markdown/embeds/).

Images are re-encoded on the way in when **Compress images on import** is on (it is on by default, in Settings → Files). The original bytes are not kept, and the summary reports how much was saved on an "Images compressed" row. Turn the setting off before you import if you need your images kept byte-for-byte.

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

## Other sources

Obsidian is one of five sources the same importer reads. When the flow opens, you land on a card grid asking "Where are your notes coming from?" — one card per source. Each card names a format, not a Myne feature:

- **Obsidian** — a vault folder of Markdown notes (the walkthrough above).
- **Notion** — an unzipped export folder. Unzip the export yourself first: Myne reads the folder, not the `.zip`.
- **Evernote** — a single `.enex` export file.
- **HTML** — a folder of saved web pages.
- **CSV** — one spreadsheet file, which becomes a single note holding the table (one note, not one note per row — Myne is not a database).

Whichever you pick, the setup step shows that source's own **keeps / leaves behind** disclosure before the import starts, so you see the fidelity bar for that format up front. For HTML, for example, it keeps headings, lists, tables, links, code and emphasis, and leaves behind styling, scripts and embeds — remote images stay as links and are never downloaded.

Every source funnels through the same ingest path, so the outcomes above hold for all five: nothing is overwritten, re-running is safe, and your original files are never changed. Where a note imports but loses a construct the format has and Myne does not — a Notion toggle, an HTML callout — the importer collects those into an **import report**: an ordinary note it writes at the end, when there is anything to report, titled `Import report — <source> <time>`, linking each affected note next to what was dropped. It is a plain note you can read, act on, and delete.

## Limits

The importer is a point-in-time copy, not a live link — for every source, not only Obsidian. Changes you make in the original app afterward do not flow into Myne, and Myne changes do not flow back. To bring later changes over, run the import again.

While an import is running, [auto-lock on idle](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/) is deferred. A large import takes longer than the timeout and the machine is genuinely idle throughout — you are watching a progress bar — so locking mid-run would destroy the import rather than protect anything you had not already left on screen. The deferral is renewed in short steps and does not reset the idle clock: idle keeps counting underneath, so once the import stops, the next check locks a vault whose owner really did walk away, and an import window that has stopped responding stops renewing and the vault locks within a minute. The import window is on screen the whole time.
