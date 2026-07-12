---
title: "Files"
category: "settings-and-privacy"
updated: 2026-07-11
summary: "The Files panel sets which file opens when Myne starts and where newly created notes are placed. Choosing a startup file other than the last-opened one never overwrites your saved workspace layout, so switching back restores your panes."
tags: ["settings", "notes", "folders"]
---

The Files panel holds two file-oriented preferences: which file opens when the app starts, and where new notes are created. Both are stored in your vault's encrypted preferences and take effect the next time the relevant action happens.

![The Files settings panel, with the default file to open on startup and where new notes are created.](./files.png)

## Prerequisites

- A vault open. Settings is only available once a vault is unlocked.

## Opening the Files panel

Open Settings from the gear in the bottom bar or with `⌘,`, then choose **Files** in the left rail. It sits after **Editor** and before **Hotkeys**.

## Default file to open

The **Default file to open** control decides what you see when the app starts. It offers three choices:

- **Last opened** reopens the note and layout you had when you last quit.
- **New note** starts a fresh, empty note.
- **Specific note** opens one note you pick. Choosing it reveals a **Note to open on startup** picker; search for and select the note.

Choosing **New note** or **Specific note** does not touch your saved workspace. Myne skips restoring the saved layout for that session but leaves it on disk, so switching the setting back to **Last opened** brings your panes back. If a specific note is later deleted or cannot be read, its pane shows a missing-note state rather than clearing the setting on a transient read miss.

## Default location for new notes

The **Default location for new notes** control decides where a newly created note is placed. It offers three choices:

- **Vault folder** places new notes at the top level of the vault.
- **Same folder as current note** places a new note beside the note you have open. When no note is selected, it falls back to the vault folder.
- **In the folder specified below** reveals a **Folder for new notes** field; type a folder path such as `Inbox/`.

This is only the default. Creating a note through a folder's own "new note here" action always places it in that folder, regardless of this setting. See [Notes and folders](/user-guide/notes-and-organization/notes-and-folders/) for the sidebar actions that create notes.

## Limits

Both settings are stored inside your vault's encrypted preferences. They change where notes land and which one opens on launch — not what is protected or how. Selecting **New note** or **Specific note** as the startup file never deletes or overwrites the multi-pane layout saved from your last **Last opened** session; that layout stays on disk untouched until you return to **Last opened**.
