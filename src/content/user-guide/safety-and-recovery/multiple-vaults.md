---
title: "Multiple vaults"
category: "safety-and-recovery"
updated: 2026-08-30
summary: "How to keep more than one vault, how to switch between them, how to give each a name and icon, what you can see before a vault is unlocked, and how vaults stay independent of one another."
tags: ["vault", "privacy"]
---

You can keep more than one vault, say one for work and one for personal notes. They are fully separate, and Myne keeps only one open at a time. This article covers switching, what's visible before you unlock, and how vaults stay independent.

If you have decided you no longer want two, you can bring the notes from one into the other: see [Combine two Myne vaults](/user-guide/attachments-and-import/combine-two-vaults/).

![The vault switcher menu open from the sidebar, listing your vaults with an option to create or switch to another.](./multiple-vaults.png)

## One vault open at a time

Myne unlocks one vault at a time. Switching to another means locking the current one and unlocking the next with its own password. There is no way to hop between vaults without unlocking, and no way to **open or edit** a second vault while one is open.

There is one way Myne reads from a second vault without opening it, and it is worth knowing about because the sentence above is otherwise easy to over-read. While you are [importing notes from another vault](/user-guide/attachments-and-import/combine-two-vaults/), Myne holds that vault's key in memory for as long as the import runs, so it can read the notes it is copying. It is not an unlock: you cannot open that vault, edit it, or switch into it, and no editor ever opens on it. The key is dropped when the import finishes or fails, when you lock or switch the vault you are in, and when that vault is deleted or its password changed. If the app is killed mid-import so none of those happen, a timer drops it anyway.

When you have two or more vaults, Myne shows a **picker** at launch, and the vault-switcher chip at the top of the sidebar lets you switch while you work.

## What's visible before you unlock

On macOS and iOS, a vault this device has unlocked before is listed by its real name, from a sealed copy Myne keeps locally after that first unlock. On Windows, Linux and Android there is no keychain to seal that copy with yet, so every row stays neutral. A vault this device has never unlocked is shown neutrally instead, as **Vault 1**, **Vault 2**, and so on, because its name is still sealed inside it. A Privacy setting keeps names off that screen entirely and destroys the copies already stored here: see [Vault names on the lock screen](/user-guide/settings-and-privacy/vault-names-on-the-lock-screen/). Either way, be aware of what *is* visible before any vault is unlocked: how many vaults you have, and when each was last opened. Their contents and notes stay sealed until you unlock them.

## Naming a vault and giving it an icon

Each vault can carry its own name and icon, so the switcher tells them apart at a glance. Both show on the vault-switcher chip at the top of the sidebar and next to each vault in the switcher dropdown. A vault with no icon set shows a neutral **M** wordmark instead.

To set them, open **Settings → Account** while the vault is unlocked. The **Vault label** field names the vault; the **Icon** grid below it picks a glyph, and **Default (wordmark)** clears the icon back to the neutral mark.

Like the vault's contents, its name and icon live inside the vault's encrypted prefs, so neither is readable until that vault is unlocked. The icon follows that rule strictly: a vault you have not unlocked this session shows the neutral mark. The name is the deliberate exception. After a first unlock on a device, Myne keeps a sealed copy of it there so the locked picker can show it, which also means a rename reaches only the device you rename on: your other devices keep showing the old name until you unlock the vault there. [Vault names on the lock screen](/user-guide/settings-and-privacy/vault-names-on-the-lock-screen/) covers that store, its limits, and the setting that turns it off.

## Vaults are independent

Each vault is its own world: its own notes, folders, settings, recovery phrase, and backups. A backup is of one specific vault and restores only that vault. Changing your password in one vault does nothing to another. Nothing moves between them on its own.

The one way anything crosses is if you ask for it: [importing notes from another vault](/user-guide/attachments-and-import/combine-two-vaults/) copies notes and their attachments into the vault you have open. It is one-directional, it runs once, and the vault you import from is not changed.

## Managing the list

From the picker you can open an existing vault, **create another vault**, **restore from backup**, or **add this device to an account** you already sync (see [Add a device](/user-guide/sync-and-devices/add-a-device/)). The vault switcher in the sidebar carries the create and add-a-device entries too, so you can reach them without locking up first. Removing a vault from the list means **deleting** it: there is no "remove from the list but keep the files" option, and Myne doesn't pretend there is. Deleting a vault is permanent (see what that entails in [Delete a vault](/user-guide/settings-and-privacy/delete-a-vault/)).

## Limits

Because only one vault is open at a time, search, the graph, backlinks, and backups all act on the **current** vault only. There is no cross-vault search or linking.
