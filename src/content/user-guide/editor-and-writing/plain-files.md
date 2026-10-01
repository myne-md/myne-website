---
title: "Plain files"
category: "editor-and-writing"
updated: 2026-10-01
summary: "Open and edit your own .md and .markdown files from disk in a desktop surface that never touches your vault: what turns it on, how a file gets in, how autosave and conflicts work, and what it deliberately leaves out."
tags: ["editor", "privacy"]
---

The plain-file editor is an optional surface for opening and editing your own `.md` and `.markdown` files from disk, without adding them to a vault. It is desktop-only, off by default, and it sits behind Developer mode. It is not a plaintext mode for your vault: your notes are never stored in plaintext, and a file you open this way stays unencrypted, unsynced, and unbacked-up by Myne.

## Turning the plain-file editor on

The editor is off by default and sits behind Developer mode, so there are two steps when this device already has a vault:

1. Open **Settings → About** and turn on **Developer mode**. It is a device-local switch that reveals the advanced settings Myne keeps out of the way by default.
2. Open **Settings → Editor**. Under **Editing**, turn on **Plain-file editor**.

The helper text under the switch states the terms plainly: "Open and edit the .md files you already have on disk, in place, without adding them to a vault. These files are plaintext: Myne does not encrypt them, and changes to them are not synced or backed up. Off by default."

On a device with no vault yet, Settings is unreachable, so the same switch waits in the footer of the Welcome screen, beside the version marker. Turn it on there; opening a file brings up the surface.

Turning the switch off closes whatever the surface has open, after it writes the edits it still holds. A file whose changes could not be written to disk stays open and the switch reports it, rather than dropping your text on the way out.

The switch is stored on this device rather than in your vault. That is deliberate: the surface has to work with the vault locked and even with no vault at all, and a vault setting cannot be read in those states.

## Opening a file

There is no **New** and no **Save As** on this surface. A file always arrives from outside Myne, and Myne edits it where it already is. It can arrive in any of these ways:

- **From a terminal:** `myne open <path>` hands the file to the running app through the [Myne CLI](/user-guide/command-line/the-myne-cli/).
- **Passed to the app at launch:** starting Myne with a file's path as its argument opens that file. This is the route a Windows or Linux file association will use; Myne does not register itself as the handler for `.md` files yet, so for now the path has to be passed at launch.
- **On macOS, through the system open event:** when another app or a system action hands Myne a `.md` file, it opens on the surface.
- **A link:** a `myne://open-file?path=...` link. Myne resolves the path and shows a confirmation first, stating that the file lives outside every vault, and nothing opens until you choose **Open**.
- **From the surface itself:** the **Open a local file** button opens another file through the system's file picker. Each open file gets its own tab in the surface's own tab strip.

Only `.md` and `.markdown` files open here, up to 64 MiB. Anything else is refused with a message rather than opened.

Dragging a file onto the Myne window is not a way in today: the drop is ignored and no file opens.

## Writing, autosave and conflicts

While the surface is open it says what it is, in a strip that never goes away: **Local file. Not encrypted, and not part of any vault.**

Your edits save on their own a moment after you stop typing, and again when you close the window. There is no Save button. A save checks the file's content first: if the file changed on disk since Myne read it, nothing is overwritten and a banner appears instead. It reads **This file changed on disk while you were editing. Myne has not written anything.** and offers **Reload from disk**, **Overwrite with my changes**, or **Save a copy…** under a name you choose. If a save fails for another reason, Myne says so and keeps your edits in the tab.

The surface's tabs are its own, kept apart from your notes' tabs. Locking the vault flushes and parks the open files; unlocking again in the same session brings them back. Quitting does not: nothing reopens on the next launch, because Myne keeps no recents list for these files.

## Importing a file into your vault

**Import to vault** copies the open file into a new note and closes the tab. The file on disk stays exactly where it is. The vault has to be unlocked: with it locked, Myne says so and asks you to unlock first, and on a device with no vault yet it asks you to create one.

## Limits

- It is not a plaintext mode for your vault. No note is ever stored in plaintext, the surface never reads vault content, and your notes are unchanged by anything here. Import to vault is the one deliberate crossing, and it copies in one direction only.
- The file you open is the only copy. It stays unencrypted, outside every backup Myne takes, and outside sync. If it lives in a folder another program watches, that program sees every save, and if it is deleted or replaced outside Myne, there is no Myne-side copy to restore.
- Autosave runs on a short delay after you stop typing. If Myne is killed inside that window, the last edits may not have reached disk; closing the window normally waits for the pending write first.
- Only `.md` and `.markdown`, up to 64 MiB. There is no **New** and no **Save As**. Drag-and-drop onto the window does nothing. Spell check, image rendering, and split panes are not part of this surface.
