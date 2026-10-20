---
title: "Upgrade your vault format"
category: "safety-and-recovery"
updated: 2026-10-16
summary: "How the one-time upgrade to Myne's new vault format works, who still has a vault to upgrade, why it asks for your recovery phrase as well as your password, how to finish it or put the old vault back, and what changes about snapshots, backups and sync afterwards."
tags: ["vault", "recovery", "backup", "sync"]
---

Myne can upgrade a vault created in its original format to a newer storage format, in which notes edited on two devices merge by themselves instead of forking into conflict copies. A vault you create on a current version of Myne is already on that format, so there is nothing to upgrade and **Settings → Sync** carries no **Migrate** block for it. Where the block does appear, the upgrade re-encrypts the whole vault under new keys in one pass. It asks for your master password **and** your full 24-word recovery phrase, and it is not finished until you either confirm it or put the old vault back.

## Before you start

Read this part before you open the form, because two of the steps cannot be undone.

- **Back up the vault first.** Make a fresh [backup](/user-guide/safety-and-recovery/back-up-your-vault/) and keep it. It is the only route back to the old format once the upgrade is settled.
- **Confirming the upgrade is permanent.** The upgrade keeps the whole pre-upgrade vault on this device. When you choose to remove that old copy, its keys are erased with it and there is no undo.
- **Putting the old vault back stops being possible once this device has pushed the upgraded vault to the sync server.** The push is what closes the door, not another device picking the vault up: a single device with no peers loses the roll-back on its first push, and a vault you never sync keeps it. After the push, Myne refuses to roll back, and a backup restore is the only way to the old format.
- Anything you write after the upgrade is not part of the old copy, so if you are going to put it back, do it before you write much.

You also need:

- The desktop app, with the vault unlocked. Myne in the browser does not offer this — a browser joins an account that is already on the current format.
- Your master password.
- All 24 recovery words.
- Every device you sync with running a current version of Myne. A device on an older version refuses the upgraded vault rather than half-reading it: **This vault was upgraded to a newer format this version of Myne doesn’t support yet. Your data is fine. Update Myne to the latest version to open it.** Update those devices before you upgrade, not after.
- Time and disk space. Every note is re-encrypted in one pass, which takes minutes on a large vault, and the vault uses roughly twice its usual space until you remove the old copy.

## Why it needs your recovery phrase

Your vault key is wrapped twice: once by your password, once by your recovery phrase. The upgrade mints a new key and has to wrap the new one under both. A password-only upgrade would produce a vault that no recovery phrase could ever open, so Myne refuses to start without a phrase that actually opens this vault, and refuses before writing anything. The form says so plainly:

> Required: your new keys are wrapped under this phrase, so recovery keeps working. Enter all your recovery words.

A wrong phrase is a refusal, not a half-done upgrade: **That recovery phrase didn’t match this vault. Enter your correct recovery phrase to migrate. It’s required so recovery keeps working.** The vault is untouched.

## Running the upgrade

1. Make a backup, if you have not already.
2. Open **Settings → Sync → Connection** and find the **Migrate** block. If there is no such block, this vault is already on the newer format and there is nothing to do here.
3. Enter your **Master password** and your **Recovery phrase**. Both are required before the button becomes available.
4. Choose **Migrate**. While it runs, a counter beside the button reports how many items of the total have been re-encrypted. Leave the app open.
5. When it finishes, the counter stops and Myne returns you to the unlock screen, closing Settings with it. There is no completion message to read. That is expected: the keys the vault was open under no longer exist. Unlock again with the same password, or the same recovery phrase — neither credential changed.

If it cannot run, Myne says which of four things happened, and in each case the vault is unchanged: the phrase did not match, the password did not match (**That password didn’t match this vault.**), the vault is already on the new format (**This vault is already on the new format.**), or it could not complete (**The migration couldn’t complete. Your vault is unchanged; try again.**).

## Finishing it, or putting the old vault back

After you unlock again, **Settings → Sync → Connection** shows a block that was not there before:

> Your vault was upgraded. The old copy is still on this device until you finish up. Until then, changing your password won't lock it away.

That sentence is the reason not to leave this half-done. The old copy carries its own copy of the old vault key, wrapped under your old password and your old recovery phrase. Changing your master password rewrites the upgraded vault's copy only, so while the old one is staged, the old password still opens the notes inside it.

Two choices are offered:

- **Everything looks right, remove the old copy** erases the old keys and the staged copy for good. This is the step with no undo, and it is what makes a password change mean what it says again. Open a few notes first and confirm the vault looks the way you expect.
- **Something's wrong, put the old vault back** restores the vault exactly as it stood at the moment of the upgrade, then locks the session. Myne offers it only while it is still safe: once this device has pushed the upgraded vault to the sync server, the button is not there, and a click that races that push is refused with **This vault has already synced in the new format, so it can't be put back. Restore from a backup if you need the old one.**

Until you pick one, nothing is lost either way — the upgrade is simply unsettled, and the block stays.

## What changes afterwards

- **Snapshots stop for this vault.** No new snapshots are taken, the snapshots taken before the upgrade move into the old copy and are erased when you confirm, and the snapshots panel shows its empty state from then on. Each note carries its own edit history instead, and nothing in the app shows that history to you yet. See [Snapshots](/user-guide/safety-and-recovery/note-snapshots/).
- **Backups carry more than they used to.** Because a note's history lives inside the note, a backup of an upgraded vault contains every past revision of every note, not only the note as it stands. See [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/).
- **Conflicts become merges.** A note edited on two devices merges by itself and raises a quiet **Updated from another device** notice, instead of appearing in the Conflicts list. See [Resolving conflicts](/user-guide/sync-and-devices/resolving-conflicts/).
- **Your other devices re-derive their keys.** Each one shows **This vault was upgraded to the new format on another device. Unlock again to continue. Nothing was lost.** and unlocks normally afterwards.
- **Quick unlock is switched off on this device.** The PIN or Touch ID credential wrapped the old key, so the upgrade removes it. Set it up again from **Settings → Privacy → Locking** if you want it. See [Quick unlock with a PIN or Touch ID](/user-guide/settings-and-privacy/quick-unlock/).
- **Rebuilt things rebuild.** The search index and the other on-device caches are rebuilt after the upgrade, so the first unlock does some extra work.
- **Your attachments keep their identity.** Links to attachments in your notes are not rewritten and do not break.

## Limits

Upgrading changes the vault's format, not what protects it. Your password and recovery phrase are unchanged and are still the only way in, and the upgrade is not a backup and not a repair.

Two consequences are worth stating plainly. The old copy the upgrade stages lives on this device only: it is never synced and it is never included in a backup, so restoring a backup you took while an upgrade was unsettled gives you the upgraded vault with no old copy beside it. And after the upgrade a note's edit history travels with the note — it syncs to your other devices and it sits in every backup — where a snapshot never left the device that made it. That history is kept without a limit for now, so it grows with how much you edit, and anyone who can open the vault — with your password, with your recovery phrase, or with a copy of its keys — reads past revisions and drafts you rewrote, not only the current text.

Backups made before the upgrade are unaffected, and the three [backup facts](/user-guide/safety-and-recovery/back-up-your-vault/) still hold for them: they are in the old format, and they still open with the password and the recovery phrase that were in use when they were made.

Automatic merging keeps both sets of edits; it does not decide which one you meant. Two devices editing the same sentence produce a merged sentence, not a chosen one.
