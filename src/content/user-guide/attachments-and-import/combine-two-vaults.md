---
title: "Combine two Myne vaults"
category: "attachments-and-import"
updated: 2026-10-15
summary: "How to bring notes from one Myne vault into another by exporting a .myne-backup from the source and importing it into the vault you have open: what comes across, what stays behind, and why the vault you exported from is left exactly as it was."
tags: ["import", "vault"]
---

If you keep more than one Myne vault, you can bring notes from one into another. It is the same importer you would use for an Obsidian vault, with Myne itself as the source: you point it at a `.myne-backup` file exported from the other vault, and it copies those notes into the vault you have open. It copies in one direction, it adds to the vault you have open rather than replacing anything in it, and it leaves the vault you exported from exactly as it was.

This is not the same as restoring a backup. A restore **places** a whole vault on this device and never opens a note; an import **adds** notes to the vault you already have open. If what you want is your vault back, restore a backup instead.

## Before you start

- A **`.myne-backup` file** exported from the vault you want to take notes from. If the source vault is on this device, open it and export one (Settings → Storage, or **Back up vault…** in the palette); the file can sit anywhere you can reach it. See [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/).
- The password for the vault that backup was made from, or its 24-word recovery phrase. Either one works, exactly as it would to unlock that vault.
- Unlock the vault you want the notes to end up **in**. That is the vault the import writes to.

## Starting the import

Open **Import notes…** from the command palette, or Settings → Storage → Import. Choose **Myne vault** on the source picker.

### 1. Choose the backup and open it

Choose the `.myne-backup` file to import from. The file is read **for reading only**, for as long as the import runs: it is never unlocked into the app, you are not switched into it, and nothing you do here can change it or the vault it came from.

Then enter the source vault's password, or switch to the recovery phrase if you do not have the password.

### 2. Name the import

Myne fills in a name for the import. You can change it.

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

- **Version history.** The notes arrive with a clean history. The old history stays in the vault the backup came from, which is still there.
- **Deleted notes.** Anything that vault's trash held when the backup was taken stays behind. Your deletions are not undone.
- **Templates.** A note marked as a template stays a template in the vault it is in. Templates are how you start a new note, so they belong with the vault you use to write, and bringing them across would put a second copy of every one of them in your template list.
- **Attachments no imported note uses.** Files sitting in the source vault's attachment library with nothing pointing at them are not brought over.
- **Settings, themes, window layout, search index, your devices and sync setup.** This brings notes and their attachments, not a whole vault.

The summary counts the notes it left in the source vault's trash, the templates it left, the attachments this vault would not accept, and any link that now points at a note that did not come across. Version history and unused attachments are not counted, because Myne would have to read the whole backup a second time to count them; they are named here instead so you know they stayed.

Myne also writes all of this into a note, so the numbers are still there after you close the summary.

## Limits

**The vault you exported from is not changed, and it is not disconnected.** After the import, the same notes exist in two vaults. If you sync the vault you exported from, it keeps syncing. If you want it gone, delete it yourself from vault management, and read the summary first: it lists exactly what did not come across. The `.myne-backup` file you imported from is left untouched too; delete it yourself when you no longer need it.

**A link that was already broken in the source vault may find a target here.** Myne resolves links by note name. If a note you import links to `Beta`, that `Beta` did not exist in the source vault, and a note called `Beta` does exist here, the link will now point at your `Beta`. Myne lists every link this happened to in the summary so you can check them. It cannot prevent it: there is no way to write a link that deliberately points at nothing.

**An attachment that was already deleted in the source vault stays shown as deleted.** If an imported note referred to a file that vault no longer had, the note arrives with the same "this file is gone" marker rather than with the reference silently removed.

**This is not a merge and it is not sync.** It runs once, in one direction, and nothing connects the two vaults afterward. Notes that already exist here are left alone; nothing you have is overwritten.

**Everything happens on this device.** No note, attachment or key is sent anywhere during an import.

**The notes join the target vault's sync, if it syncs.** They land in the vault you imported into, so from then on they are that vault's notes and follow whatever you have set up for it. If you imported from a vault you kept only on this device into a vault that syncs, the notes will sync from now on, encrypted, like everything else in it.
