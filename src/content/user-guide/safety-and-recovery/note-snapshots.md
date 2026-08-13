---
title: "Snapshots"
category: "safety-and-recovery"
updated: 2026-08-13
summary: "How Myne keeps a short version history of each note, how to review and restore an earlier snapshot, how long snapshots are kept, and what replaces them once you upgrade the vault format."
tags: ["snapshots", "notes", "vault"]
---

Snapshots are your note's version history. As you edit a note, Myne quietly keeps earlier versions of it for a while, so you can look back or roll back without thinking about it.

## How snapshots are taken

Myne takes a snapshot on its own; there is no save-version button. It groups your edits rather than capturing every keystroke: a snapshot is taken after a few minutes of changes, and when you close or lock the note. So a burst of typing becomes one snapshot, not a hundred.

Snapshots are kept for **about seven days**, then aged out. The panel's empty state says it plainly:

> No snapshots yet. Snapshots are saved automatically as you edit and kept for about 7 days. They're encrypted, and disappear when the note is permanently deleted.

Each snapshot is encrypted under the note's own key: a snapshot is as private as the note itself, and nothing more is claimed for it.

## Reviewing and restoring

Open the snapshots panel for a note to see its earlier versions. Pick one and Myne shows what changed as a diff. **Compare against** chooses what it is compared with: **Current note** answers "what would restoring this undo?", and **Previous snapshot** answers "what did this snapshot itself change?". The oldest snapshot has nothing before it, and says so. Restoring a snapshot is **always undoable**: before it rolls the note back, Myne takes a snapshot of the current version, so the state you restored *from* is itself in the history if you change your mind.

## What snapshots are not

Snapshots are a short-term undo for edits, not a deletion safety net. When a note is **permanently deleted, its snapshots go with it**: version history is part of the note, not a separate copy that outlives it. For protection across deletion, use the tools that are built for it:

- For a note you deleted, the [Trash](/user-guide/notes-and-organization/trash/) holds it until you empty it.
- For longer-term safety, a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) made before the deletion still contains the note.

## After you upgrade the vault format

Snapshots are how version history works for a vault in the original format. If you [upgrade the vault format](/user-guide/safety-and-recovery/upgrade-your-vault-format/), snapshots stop for that vault: no new ones are taken, the existing ones move into the upgrade's old copy and are erased when you confirm the upgrade, and the snapshots panel shows its empty state from then on.

Each note carries its own edit history instead, and two things about that are worth knowing before you upgrade. It travels: the history is part of the encrypted note, so it syncs to your other devices and is included in every backup, where a snapshot never left the device that made it. And nothing in the app shows it to you yet, so an upgraded note has no version history you can browse or restore. If there is a revision you want to keep, take a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) before you upgrade.

## Limits

Snapshots cover roughly the last week of a note's edits, live only inside the vault that holds the note, and are not exported on their own. They are not a substitute for a backup. All of that describes a vault in the original format; after the format upgrade the note carries its own history instead, and that history syncs and is backed up with the note.
