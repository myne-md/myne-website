---
title: "Upgrade your vault format"
category: "safety-and-recovery"
updated: 2026-10-30
summary: "Myne has two upgrades: the storage-format upgrade that re-encrypts a v0.1 vault, and the one-way change that retires a vault's own recovery phrase so the vault opens with its password alone. Which one you see, what each asks for, what cannot be undone, and what changes afterwards."
tags: ["vault", "recovery", "backup", "sync"]
---

Myne can change a vault's format in two different ways, and they are easy to confuse because both sit in Settings and both are one-way. One moves a vault from the original storage format to the current one, re-encrypting every note. The other retires a vault's own recovery phrase, so from then on the vault opens with its password and nothing else. Which one you are offered depends on the vault.

Both are explicit: nothing upgrades on its own. Unlocking a vault does quietly move it to the current format the first time you open it, which is covered at the end because it changes nothing you can see. One decision in the second upgrade is permanent, so read the section that applies to you before you press anything.

## Which upgrade is yours

- **A vault with a `Migrate` block** in **Settings → Sync → Connection** is in the original v0.1 format. Run the first upgrade below.
- **A vault with a `Vault format` block** in **Settings → Vault**, offering **Retire my vault phrase**, still has a recovery phrase of its own. Run the second upgrade below, once the first is done if it applies.
- **A vault created from your identity** is already past both. It has no recovery phrase and no block for one, so Settings shows you nothing to press.

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

A vault in this older format has its key wrapped twice: once by your password, once by its recovery phrase. The upgrade mints a new key and has to wrap the new one under both. A password-only upgrade would produce a vault that no recovery phrase could ever open, so Myne refuses to start without a phrase that actually opens this vault, and refuses before writing anything. A wrong phrase is a refusal, not a half-done upgrade.

### Running it

1. Make a backup, if you have not already.
2. Open **Settings → Sync → Connection** and find the **Migrate** block.
3. Enter your **Master password** and your **Recovery phrase**. Both are required before the button becomes available.
4. Choose **Migrate**. While it runs, a counter beside the button reports how many items of the total have been re-encrypted. Leave the app open.
5. When it finishes, the block reports how many notes it moved, and then the vault locks and Myne returns you to the unlock screen, because the keys it was open under no longer exist. Unlock again with the same password, or the same recovery phrase. Neither credential changed.

If it cannot run, Myne says which of four things happened, and in each case the vault is unchanged: the phrase did not match, the password did not match, the vault is already on the new format, or it could not complete.

### Finishing it, or putting the old vault back

After you unlock again, the same block says your vault was upgraded and that the old copy is still on this device until you finish up. It also says what that costs while it waits: changing your password will not lock the old copy away, because the old copy carries its own copy of the old vault key, wrapped under your old password and your old recovery phrase. That is the reason not to leave this half-done.

- **Everything looks right, remove the old copy** erases the old keys and the staged copy for good. This is the step with no undo. Open a few notes first.
- **Something's wrong, put the old vault back** restores the vault exactly as it stood, then locks the session. Myne offers it only while it is still safe: once this device has pushed the upgraded vault to the sync server, the button is not there.

## The upgrade that retires a vault phrase

This is the upgrade that removes a vault's own recovery phrase. It does **not** replace that phrase with anything: after it runs, the vault opens with its master password and nothing else. Your identity phrase is not a way into the vault either, before or after, because it recovers who you are rather than the notes.

**This is the irreversible part, and it happens on the confirming press.** Your saved vault recovery phrase stops opening this vault, and there is no credential behind it. Myne says both warnings on screen before you confirm: the phrase will stop working, and every device you use must be updated first, because an older version of Myne cannot open the vault once this change syncs. There is no undo, no "put it back" button, and a backup restore is the only way back to the older shape.

### Why anyone runs it

Two reasons, and both are about the vault, not about convenience. A vault in the older shape keeps a second wrapped copy of its key on disk, and that copy is a target: whoever gets the file and the phrase gets the notes. Removing it leaves exactly one wrapped key, under your password. And a vault in the current shape is what the rest of Myne is built around: a vault with no phrase behaves the same on every client, including the ones that cannot show a phrase at all.

### What it needs

- The desktop or mobile app, not a browser. Myne in the browser does not offer this yet.
- The vault open, because it re-writes that vault's key wrap.
- An identity on this device, **unlocked**, and the same identity that owns the vault. If the identity is locked, Myne stops and asks you to unlock it first; a shared vault is refused unless you are its owner.
- A vault already past the storage-format upgrade. If yours is not, Myne sends you to Sync settings to finish that one first.

### Running it

1. Open **Settings → Vault** and find the **Vault format** block. Its helper text says the vault still carries its own recovery phrase, and what upgrading changes.
2. Choose **Retire my vault phrase**. This is only the offer: nothing has happened yet.
3. Read the two warnings, then choose **Retire the phrase and upgrade**. This is the press that retires the phrase.
4. The button reads **Upgrading…** while it runs, then the block reports that the vault now opens with its password alone and names the format it came from. There is only one file to rewrite, so this is quick and does not touch your notes.

If it refuses, the message names why and nothing was changed: the identity is locked, there is no identity on this device, the vault belongs to a different identity, this is a shared vault that only its owner may change, the vault is not open, another security operation is running, the vault already opens with its password alone, the storage upgrade is still owed, or the upgrade did not complete and nothing was changed.

### What changes afterwards

- **Your password still works.** Unlock with the master password exactly as before; the upgrade does not touch the password side of the vault.
- **Your saved vault phrase stops working, and nothing replaces it.** On a new device there is no phrase that opens this vault. A forgotten password means a vault nobody can open, which is why the confirming press names it.
- **The unlock screen stops offering a recovery door for this vault.** It says instead that the vault opens with its password only, rather than showing a link that could only fail.
- **Notes, attachments and snapshots are untouched.** Nothing is re-encrypted and no note is rewritten, which is why this upgrade is fast and why snapshots keep working. It changes how the vault's key is sealed, not the vault's contents.
- **Quick unlock keeps working.** The key underneath it did not change.
- **Older versions of Myne cannot open this vault.** Update every device before you upgrade, and remember that nothing in the app can check how many devices you have.

## The upgrade you never see

Unlocking a vault also moves it forward, silently, and there is nothing to press. A vault written before 2026-10-30 carries a second wrapped copy of its key, sealed to its owner's identity; unlocking it once removes that copy and leaves the password wrap. The vault opens with your password exactly as it did a second earlier, nothing on screen mentions it, and the only way to notice is afterwards: the unlock screen no longer offers a phrase door for that vault.

If it cannot complete, the vault is left as it was and the next unlock tries again. Nothing is lost, and there is no state you have to repair.

## Limits

Neither upgrade is a backup and neither is a repair. The storage upgrade's protection is unchanged by it: your password and recovery phrase still decide who gets in. The second upgrade removes a credential, and a removed credential is not a stronger one: after it there is exactly one way into the vault, so the vault is only as safe as the password you remember and as the backup you keep.

Two other consequences are worth stating plainly. The storage upgrade's old copy lives on this device only: it is never synced and never included in a backup, so restoring a backup you took while an upgrade was unsettled gives you the upgraded vault with no old copy beside it. And after the phrase-retiring upgrade, a forgotten password is a lost vault, full stop. Keep a recent [backup](/user-guide/safety-and-recovery/back-up-your-vault/) somewhere else, and read [If you forget your password](/user-guide/safety-and-recovery/if-you-forget-your-password/) before you need it.
