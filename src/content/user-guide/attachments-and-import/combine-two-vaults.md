---
title: "Combine two Myne vaults"
category: "attachments-and-import"
updated: 2026-08-30
summary: "How to bring notes from one Myne vault into another on the same device: what comes across, what stays behind, and why the vault you import from is left exactly as it was."
tags: ["import", "vault"]
---

If you have more than one Myne vault on this device, you can bring notes from one into the other. It is the same importer you would use for an Obsidian vault, with Myne itself as the source. It copies in one direction, it adds to the vault you have open rather than replacing anything in it, and it leaves the vault you import from exactly as it was.

This is not the same as restoring a backup. A restore **places** a whole vault on this device and never opens a note; an import **adds** notes to the vault you already have open. If what you want is your vault back, restore a backup instead.

## Before you start

- Both vaults have to be on this device. If the notes you want are on another device or in a `.myne-backup` file, restore that backup first, and it becomes a vault you can import from here.
- You need the password for the vault you are importing **from**, or its 24-word recovery phrase. Either one works.
- Unlock the vault you want the notes to end up **in**. That is the vault the import writes to.

## Starting the import

Open **Import notes…** from the command palette, or Settings → Storage → Import. Choose **Myne vault** on the source picker.

### 1. Choose the vault and unlock it

Pick the vault to import from. The vault you are currently in is not on the list: a vault cannot be its own source.

Then enter that vault's password, or switch to the recovery phrase if you do not have the password. Myne opens that vault for **reading only**, for as long as the import runs. It is not unlocked, you are not switched into it, and nothing you do here can change it.

### 2. Name the import

Myne fills in the name of the vault you chose. You can change it.

The name is used in one place, and it matters more than it looks. If a note you are importing has the same name as one you already have, **and** something else you are importing links to it, Myne brings the incoming note in under a new name built from this label: a note called `Project` arrives as `Project (Eski laptop)`. That is what keeps the imported link pointing at the note that came with it, instead of quietly pointing at your existing note of the same name.

Keep the same name if you run this import again later. Myne recognises what it already brought in and does not bring it in twice. Change the name and it will not recognise it.

### 3. Run and review

The import runs note by note. Cancelling partway keeps what already arrived, and running it again picks up the rest.

The summary counts everything, including what did not come across. Read it: this is where the import tells you what it left behind.

## What comes across

- Your notes, with their folders, tags and properties.
- Links between the notes you import.
- Attachments the imported notes use. If you already have the same file, Myne notices and does not store it twice.
- Words you added to the source vault's dictionary, so the terms in your imported notes are not all marked as misspelled.

## What stays behind

- **Version history.** The notes arrive with a clean history. The old history stays in the vault you imported from, which is still there.
- **Deleted notes.** Anything in that vault's trash stays in its trash. Your deletions are not undone.
- **Templates.**
- **Attachments no imported note uses.** Files sitting in the source vault's attachment library with nothing pointing at them are not brought over.
- **Settings, themes, window layout, search index, your devices and sync setup.** This brings notes and their attachments, not a whole vault.

The summary gives you a count for each of these, so you can see what was left rather than discover it later.

## Limits

**The vault you import from is not changed, and it is not disconnected.** After the import, the same notes exist in two vaults. If you sync the vault you imported from, it keeps syncing. If you want it gone, delete it yourself from vault management, and read the summary first: it lists exactly what did not come across.

**A link that was already broken in the source vault may find a target here.** Myne resolves links by note name. If a note you import links to `Beta`, that `Beta` did not exist in the source vault, and a note called `Beta` does exist here, the link will now point at your `Beta`. Myne lists every link this happened to in the summary so you can check them. It cannot prevent it: there is no way to write a link that deliberately points at nothing.

**An attachment that was already deleted in the source vault stays shown as deleted.** If an imported note referred to a file that vault no longer had, the note arrives with the same "this file is gone" marker rather than with the reference silently removed.

**This is not a merge and it is not sync.** It runs once, in one direction, and nothing connects the two vaults afterward. Notes that already exist here are left alone; nothing you have is overwritten.

**Everything happens on this device.** No note, attachment or key is sent anywhere during an import.

**The notes join the target vault's sync, if it syncs.** They land in the vault you imported into, so from then on they are that vault's notes and follow whatever you have set up for it. If you imported from a vault you kept only on this device into a vault that syncs, the notes will sync from now on, encrypted, like everything else in it.
