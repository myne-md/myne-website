---
title: "Upgrade your vault format"
category: "safety-and-recovery"
updated: 2026-10-22
summary: "Myne has two upgrades: the storage-format upgrade that re-encrypts a v0.1 vault, and the one-phrase upgrade that retires a vault's own recovery phrase in favour of your identity. Which one you see, what each asks for, what cannot be undone, and what changes afterwards."
tags: ["vault", "recovery", "backup", "sync"]
---

Myne can upgrade a vault in two different ways, and they are easy to confuse because both sit in Settings and both are one-way. One moves a vault from the original storage format to the current one, re-encrypting every note. The other stops a vault relying on its own recovery phrase and moves it onto your identity, so one phrase recovers every vault you own. Which one you are offered depends on the vault.

Both are explicit: nothing upgrades on its own, and unlocking a vault never changes its format. One decision in the second upgrade is permanent, so read the section that applies to you before you press anything.

## Which upgrade is yours

- **A vault with a `Migrate` block** in **Settings → Sync → Connection** is in the original v0.1 format. Run the first upgrade below.
- **A vault with a `Vault format` block** in **Settings → Vault**, offering **Upgrade to one-phrase recovery**, still has its own recovery phrase. Run the second upgrade below, once the first is done if it applies.
- **A vault created from your identity** is already on the one-phrase model and has no block for it: there is nothing left to upgrade there.

## The storage-format upgrade

This is the upgrade that moves a v0.1 vault to the newer storage format, in which notes edited on two devices merge by themselves instead of forking into conflict copies. A vault you create on a current version of Myne is already past it, so **Settings → Sync** carries no **Migrate** block for it. Where the block does appear, the upgrade re-encrypts the whole vault under new keys in one pass. It asks for your master password **and** your full 24-word recovery phrase, and it is not finished until you either confirm it or put the old vault back.

### Before you start

Read this part before you open the form, because two of the steps cannot be undone.

- **Back up the vault first.** Make a fresh [backup](/user-guide/safety-and-recovery/back-up-your-vault/) and keep it. It is the only route back to the old format once the upgrade is settled.
- **Confirming the upgrade is permanent.** The upgrade keeps the whole pre-upgrade vault on this device. When you choose to remove that old copy, its keys are erased with it and there is no undo.
- **Putting the old vault back stops being possible once this device has pushed the upgraded vault to the sync server.** The push is what closes the door, not another device picking the vault up: a single device with no peers loses the roll-back on its first push, and a vault you never sync keeps it. After the push, Myne refuses to roll back, and a backup restore is the only way to the old format.
- Anything you write after the upgrade is not part of the old copy, so if you are going to put it back, do it before you write much.

You also need the desktop app with the vault unlocked (the browser does not offer this), your master password, all 24 recovery words, every syncing device on a current version of Myne, and time and disk space: the vault uses roughly twice its usual space until you remove the old copy.

### Why it needs your recovery phrase

Your vault key is wrapped twice: once by your password, once by your recovery phrase. The upgrade mints a new key and has to wrap the new one under both. A password-only upgrade would produce a vault that no recovery phrase could ever open, so Myne refuses to start without a phrase that actually opens this vault, and refuses before writing anything. A wrong phrase is a refusal, not a half-done upgrade.

### Running it

1. Make a backup, if you have not already.
2. Open **Settings → Sync → Connection** and find the **Migrate** block.
3. Enter your **Master password** and your **Recovery phrase**. Both are required before the button becomes available.
4. Choose **Migrate**. While it runs, a counter beside the button reports how many items of the total have been re-encrypted. Leave the app open.
5. When it finishes, the counter stops and Myne returns you to the unlock screen. There is no completion message to read. That is expected: the keys the vault was open under no longer exist. Unlock again with the same password, or the same recovery phrase. Neither credential changed.

If it cannot run, Myne says which of four things happened, and in each case the vault is unchanged: the phrase did not match, the password did not match, the vault is already on the new format, or it could not complete.

### Finishing it, or putting the old vault back

After you unlock again, **Settings → Sync → Connection** shows a block that was not there before: your vault was upgraded, and the old copy is still on this device until you finish up. That sentence is the reason not to leave this half-done. The old copy carries its own copy of the old vault key, wrapped under your old password and your old recovery phrase, so while it is staged, the old password still opens the notes inside it.

- **Everything looks right, remove the old copy** erases the old keys and the staged copy for good. This is the step with no undo. Open a few notes first.
- **Something's wrong, put the old vault back** restores the vault exactly as it stood, then locks the session. Myne offers it only while it is still safe: once this device has pushed the upgraded vault to the sync server, the button is not there.

## The one-phrase upgrade

This is the upgrade that retires a vault's own recovery phrase. The vault starts wrapping its key to your **identity** as well, so the 24 words you saved when you created the identity open this vault too, and a saved vault phrase is no longer part of how you get back in.

**This is the irreversible part, and it happens on the confirming press.** Your saved vault recovery phrase stops opening this vault. Myne says both warnings on screen before you confirm: the phrase will stop working, and every device you use must be updated first, because an older version of Myne cannot open the vault once this change syncs. There is no undo, no "put it back" button, and a backup restore is the only way back to the older shape.

### What it needs

- The desktop or mobile app, not a browser. Myne in the browser does not offer this yet.
- The vault open, because it re-wraps that vault's key.
- An identity on this device, **unlocked**, and the same identity that owns the vault. If the identity is locked, Myne stops and asks you to unlock it first; a shared vault is refused unless you are its owner.
- A vault already past the storage-format upgrade. If yours is not, Myne sends you to Sync settings to finish that one first.

### Running it

1. Open **Settings → Vault** and find the **Vault format** block. Its helper text says the vault still uses its own recovery phrase, and what upgrading changes.
2. Choose **Upgrade to one-phrase recovery**. This is only the offer: nothing has happened yet.
3. Read the two warnings, then choose **Retire my vault phrase and upgrade**. This is the press that retires the phrase.
4. The button reads **Upgrading…** while it runs, then the block reports that the vault now uses your identity phrase and names the format it came from. There is only one file to rewrite, so this is quick and does not touch your notes.

If it refuses, the message names why and nothing was changed: the identity is locked, there is no identity on this device, the vault belongs to a different identity, this is a shared vault you do not own, the vault is not open, another security operation is running, the vault already uses the one-phrase model, or the storage upgrade is still owed.

### What changes afterwards

- **Your password still works.** Unlock with the master password exactly as before; the upgrade does not touch the password side of the vault.
- **Your identity phrase is now the way back in.** On a new device, the phrase that recovers this vault is the identity's, and the unlock screen's recovery door asks for the identity phrase rather than a vault phrase.
- **Notes, attachments and snapshots are untouched.** Nothing is re-encrypted and no note is rewritten, which is why this upgrade is fast and why snapshots keep working. It changes how the vault's key is sealed, not the vault's contents.
- **Quick unlock keeps working.** The key underneath it did not change.
- **Older versions of Myne cannot open this vault.** Update every device before you upgrade, and remember that nothing in the app can check how many devices you have.

## Limits

Neither upgrade is a backup and neither is a repair. The storage upgrade's protection is unchanged by it: your password and recovery phrase still decide who gets in. The one-phrase upgrade changes which recovery credential exists, and it weakens nothing, but it does **concentrate**: one phrase now opens this vault and every other vault you own, where before each vault had its own. If that phrase is exposed, more is exposed with it.

Two other consequences are worth stating plainly. The storage upgrade's old copy lives on this device only: it is never synced and never included in a backup, so restoring a backup you took while an upgrade was unsettled gives you the upgraded vault with no old copy beside it. And after the one-phrase upgrade there is no vault phrase to fall back on: a device that loses both the password and the identity phrase has lost the vault.
