---
title: "Vault names on the lock screen"
category: "settings-and-privacy"
updated: 2026-08-15
summary: "The vault picker shows a vault's real name once this device has unlocked it at least once, on macOS and iOS, and a placeholder everywhere else. A Privacy setting keeps names off that screen and destroys the copies stored here, two bounds: it cannot reach a copy of the machine taken earlier, and a rename reaches your other devices only as each unlocks it."
tags: ["vault", "privacy", "settings"]
---

When you keep more than one vault, Myne shows a picker before anything is unlocked. A vault this device has unlocked at least once appears there under its real name. A vault this device has never unlocked appears under a neutral placeholder such as **Vault 2**, because that vault's name is sealed inside it and there is no key to read it yet. This article covers where the name on the picker comes from, the Privacy setting that keeps names off that screen, and what turning that setting on does and does not reach.

Names on the picker need a system keychain, which Myne uses on macOS and iOS. On Windows, Linux and Android it stores no names yet and every row shows a placeholder. [Where this works today](#where-this-works-today) has the detail.

## Prerequisites

- A vault open. Settings is only available once a vault is unlocked.

## Where the name on the picker comes from

Your vault's name is the **Vault label** you set in **Settings → Account**, and it lives inside the vault's encrypted preferences along with the rest of its contents. That is why a locked vault cannot simply be read for its name: until you unlock it, Myne holds no key for it.

So Myne remembers instead. When you unlock a vault, it writes that vault's name into a small sealed file beside the vault on this device, and keeps the key to that file in your operating system's keychain. One file and one key per vault. At the next launch the picker can open that file and show the real name while every vault is still locked.

Three things follow from storing it that way:

- A vault you have never unlocked on this device keeps its placeholder. Myne is not withholding the name; it does not have it.
- The placeholder number belongs to the vault rather than to the row, so **Vault 2** stays **Vault 2** from launch to launch, even as the list reorders by when each vault was last opened.
- This stored copy never leaves the device that wrote it. It is not synced, and a `.myne-backup` cannot carry it: the backup format accepts a fixed list of contents, and this file is not on that list.

## Keeping names off the lock screen

Names are shown by default. To keep them off:

1. Unlock any vault and open settings from the gear in the bottom bar, or with `⌘,`.
2. Choose **Privacy** in the left rail.
3. Turn on **Hide vault names on the lock screen**.

The setting applies to this device rather than to one vault, and it is visible to everyone: you do not need [Developer mode](/user-guide/settings-and-privacy/developer-mode/) to find it. Turning it on does two things at once. Every name already stored on this device becomes unreadable, because Myne destroys the per-vault keys that open those files and then removes the files themselves; and no further name is written while the setting stays on. The picker falls back to placeholders on every row.

Destroying the keys reaches the copy on this disk and nothing else: a full-system backup made by your operating system, a disk image, or any other system-level copy of this disk, taken while names were still showing, carries both the stored names and the keys that open them, and turning this setting on afterwards does not reach that copy.

Turning the setting back off brings nothing back. Names return one vault at a time, as you unlock each one again.

## Renaming a vault

Renaming is the same **Vault label** field in **Settings → Account**. On the device where you rename, the stored copy is updated as you save, so the picker shows the new name at the next launch. Clearing the label removes that device's stored file for the vault, and the row falls back to its placeholder.

**A rename does not reach a device that is locked.** The stored copy is device-local and does not sync, so every other device that has stored the old name keeps showing it on its lock screen until you unlock that vault there. A locked device has no way to learn otherwise, because reading the new name would mean opening the vault. If you are renaming a vault precisely to get a name off the screen, the rename alone does not achieve that: unlock the vault once on each of your other devices, or turn on **Hide vault names on the lock screen** there.

## Where this works today

Storing a name needs somewhere safe to keep its key, and that is your operating system's keychain. Myne uses the system keychain on **macOS and iOS**. On Windows, Linux and Android it has no keychain to use yet, so it stores no names at all and the picker shows placeholders on every row.

That is a limit on where names can be stored, not a gap in the protection: a device that cannot seal a name does not write one anywhere. Myne never falls back to plain text, because a name written in the clear would look identical on screen while none of what this page says about erasing it would be true.

The Privacy row tells you which of the two you are on, rather than sitting there appearing to do nothing.

## Placeholders after moving your data

You may also see placeholders after moving this app's data folder to another machine. The sealed files travelled with the folder, their keys did not, and a sealed file whose key is gone can never be opened again. Myne removes those files and shows placeholders. Nothing is damaged, and each vault gets its name back on the picker the next time you unlock it here.

## Limits

Hiding names does not make the picker silent about you. Whether names show or not, that screen still tells anyone in front of it how many vaults this device holds and when each was last opened, and a copy of your vault folder reveals the same. The setting covers the names, which is the part written in your own words. [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/) has the wider picture.

While names are showing, they are showing to whoever is at your screen. That is the point of the feature and also its cost: a name you would not want read over someone's shoulder is a name to keep off the lock screen.

The stored copy is protected against someone who reads the disk afterwards, not against software running on your device now. A program with access to your session and your keychain can read what you can read. That is true of an unlocked vault in general, and the stored name is no exception.

Erasing is real, and it is bounded exactly as stated above: a copy of this machine taken while names were showing still carries them, and nothing you do here reaches a copy someone already has.

Finally, this setting covers this device. Each of your other devices keeps its own stored names, and its own stale ones, until you turn the setting on there as well.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
