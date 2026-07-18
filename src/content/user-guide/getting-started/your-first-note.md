---
title: "Your first note"
category: "getting-started"
updated: 2026-06-18
summary: "Create your first note and learn how Myne autosaves as you type, how each note is encrypted, and what the 'Local-only' indicator in the bottom bar means."
tags: ["notes", "editor", "basics"]
---

When you create a vault, Myne opens it straight into the editor with a "Welcome to Myne" note already there and waiting. You start inside a note, not in front of an empty editor, and that is the point where Myne's autosave and per-note encryption start doing their work quietly in the background. This article walks through writing your first note and explains what is happening underneath it.

## The welcome note

The "Welcome to Myne" note is an ordinary note, with no special handling: you can edit it, rename it, or delete it like any other. Nothing about it is locked or protected. Type over it to make it your own, or set it aside and start fresh.

## Create a note

When you want a new note of your own, make one from the sidebar's new-note control or the command palette, then start typing. The first line becomes the note's title. That is the whole ceremony; there is nothing else to set up.

## There is no save button

Myne saves as you type. There is no save button to press and nothing to remember:

- While you type, Myne saves in the background a moment after you pause.
- It also flushes your latest edits immediately when you **switch away** from the window, **lock** the vault, or **close** the app, so nothing in flight is lost.

The bottom bar shows the current state ("Saving…" while a save is in progress) so you can see it happen. You never lose work to a forgotten save, and you never have to interrupt your writing to keep it.

## Private by design

Each note is encrypted with its own key, which is stored wrapped by your vault's keys. You don't manage any of this; it happens automatically as notes are created and saved. The full picture of what is encrypted and how is in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).

## Local-only

The bottom bar reads **Local-only · not synced**. That is the literal, honest state of your notes:

Until you turn on sync, Myne runs entirely on your device; nothing leaves it.

## Coming from Obsidian?

The first time you unlock a fresh vault, Myne offers to import an existing Obsidian vault. The offer appears until you act on it once, either by choosing a folder to import or by clicking **Not now**. "Not now" is safe: it dismisses the offer for good and does not nag you again. You can read what the importer does, and how it maps notes, links, and attachments, in [Import from Obsidian](/user-guide/attachments-and-import/import-from-obsidian/).
