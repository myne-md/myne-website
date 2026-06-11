---
title: "Snapshots"
category: "safety-and-recovery"
updated: 2026-06-11
summary: "How Myne keeps a short version history of each note, how to review and restore an earlier snapshot, and how long snapshots are kept."
tags: ["snapshots", "notes"]
---

Snapshots are your note's version history. As you edit a note, Myne quietly keeps earlier versions of it for a while, so you can look back or roll back without thinking about it.

## How snapshots are taken

Myne takes a snapshot on its own; there is no save-version button. It groups your edits rather than capturing every keystroke: a snapshot is taken after a few minutes of changes, and when you close or lock the note. So a burst of typing becomes one snapshot, not a hundred.

Snapshots are kept for **about seven days**, then aged out. The panel's empty state says it plainly:

> No snapshots yet. Snapshots are saved automatically as you edit and kept for about 7 days. They're encrypted, and disappear when the note is permanently deleted.

Each snapshot is encrypted under the note's own key: a snapshot is as private as the note itself, and nothing more is claimed for it.

## Reviewing and restoring

Open the snapshots panel for a note to see its earlier versions, with a preview of what changed. Restoring a snapshot is **always undoable**: before it rolls the note back, Myne takes a snapshot of the current version, so the state you restored *from* is itself in the history if you change your mind.

## What snapshots are not

Snapshots are a short-term undo for edits, not a deletion safety net. When a note is **permanently deleted, its snapshots go with it**: version history is part of the note, not a separate copy that outlives it. For protection across deletion, use the tools that are built for it:

- For a note you deleted, the [Trash](/user-guide/notes-and-organization/trash/) holds it until you empty it.
- For longer-term safety, a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) made before the deletion still contains the note.

## Limits

Snapshots cover roughly the last week of a note's edits and live only inside the vault that holds the note. They are not exported on their own and are not a substitute for a backup.
