---
title: "Your first note"
category: "getting-started"
updated: 2026-08-29
summary: "The example notes a new vault is seeded with, how to create a note of your own and name it, how Myne autosaves as you type, how each note is encrypted, and what the 'Local-only' indicator in the bottom bar means."
tags: ["notes", "editor", "basics"]
---

When you create a vault, Myne opens it into the editor with a few example notes already there. You start inside a note, not in front of an empty editor, and that is where autosave and per-note encryption start doing their work quietly in the background. This article walks through writing your first note and explains what is happening underneath it.

## The example notes

A new vault is seeded with five notes in one **Getting started** folder: **Start here**, **Writing with Markdown**, **Tasks**, **Links and tags**, and **Make it yours**. Each one demonstrates a feature by using it — a note that links to the others, a checklist that fills the Tasks view, a note carrying tags — so the folder is a worked example rather than a paragraph about one.

They are ordinary notes with no special handling: edit them, rename them, or delete them like any other. To clear the whole set, right-click the **Getting started** folder in the sidebar and choose **Delete**. Everything moves to Trash together, and you can restore it from there.

## Create a note

When you want a note of your own, use the **+** button at the top of the sidebar's Notes list and choose **New note** — the same menu also holds a new note from a template, a new drawing, and a new folder. Myne creates the note and puts the cursor in its name in the sidebar, so you type the title first and press Enter. A note you never name shows as **Untitled** until you rename it, either from the sidebar or from the note's properties.

Pressing `⌘T` / `Ctrl T` opens a new tab on a chooser card instead: search your notes to open one, pick from **Recent**, or create a new note or drawing from there. The command palette (`⌘K` / `Ctrl K`) reaches the same actions.

## There is no save button

Myne saves as you type. There is no save button to press and nothing to remember:

- While you type, Myne saves in the background a moment after you pause.
- It also flushes your latest edits immediately when you **switch away** from the window, **lock** the vault, or **close** the app, so nothing in flight is lost.

The bottom bar shows the current state so you can see it happen: a dashed ring while what you have typed is still waiting to be written, a turning one while it is being written, and a filled dot with the time once it is saved. You never lose work to a forgotten save, and you never have to interrupt your writing to keep it.

When sync is set up, a small crossed-out cloud sits beside a note that has not reached the server yet, both in the bottom bar and on the note's row in the sidebar. It stands still rather than spinning, because a note waiting on a device that is offline is not work in progress; it means the server has not seen this version, which stays true whether you are online or the laptop has been shut for a week.

## Private by design

Each note is encrypted with its own key, which is stored wrapped by your vault's keys. You don't manage any of this; it happens automatically as notes are created and saved. The full picture of what is encrypted and how is in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).

## Local-only

The bottom bar reads **Local-only · not synced**. That is the literal, honest state of your notes:

Until you turn on sync or name a remote AI provider, Myne runs entirely on your device; nothing leaves it.

AI is the one other door out, and it is off until you turn it on. Myne never sends your notes anywhere you have not named, and never downloads a model — but if the provider you name runs somewhere other than this computer, what you send it leaves this device. [Turning on AI](/user-guide/ai/turning-on-ai/) covers what each option means.

## Bringing notes in from somewhere else

The first time you unlock a fresh vault, Myne asks whether you want to import your existing notes. Choosing **Choose folder…** opens the importer, where you pick the source: Obsidian, Notion, Evernote, HTML, or CSV. Each note is encrypted as it is imported, and your original files stay exactly where they are.

The offer appears until you act on it once. **Not now** is safe: it dismisses the offer for good and does not come back. You can import at any time afterwards from Settings → Storage. What each importer does, and how it maps notes, links and attachments, is in [Import from Obsidian](/user-guide/attachments-and-import/import-from-obsidian/).

## Limits

Autosave protects you from forgetting to save; it is not a backup, and it will happily save a mistake over the version you meant to keep. [Note snapshots](/user-guide/safety-and-recovery/note-snapshots/) are what let you go back, and [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/) is what protects you from losing the vault itself. Per-note encryption protects the file on disk; it does nothing for a note open on your screen, or for anything you export back out as plain markdown.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| New note | ⌘T (also ⌘N) | Ctrl T (also Ctrl N) |
| Open command palette | ⌘K (alias ⌘P) | Ctrl K (alias Ctrl P) |
