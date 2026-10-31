---
title: "If you forget your password"
category: "safety-and-recovery"
updated: 2026-10-30
summary: "What happens when a vault's master password is forgotten, why a current vault has no second way in, which vaults still have a recovery phrase, what a vault shared with you offers instead, and what to do before you are in that position."
tags: ["recovery", "security"]
---

A vault created today opens with its master password and with nothing else. If you forget that password, the vault cannot be opened: not by you, not by Myne, not by anyone. This article says that plainly, then covers the two cases where a way back still exists, and what to do now rather than later.

## The short answer

**A vault created from your identity since 2026-10-30 has no recovery credential.** Its key is wrapped once, under your master password. There is no recovery phrase for the vault, no reset email, no support request that recovers it, and no backdoor. Myne never holds a copy of your keys, which is exactly the property that keeps your notes private.

Your **identity phrase** does not change this. It recovers your identity, which is a different thing: the keypair, the account number, and the list of vaults that account owns. It opens no notes. A device that still has the vault's files and a password you remember is a working vault; a forgotten password with no backup is a lost one.

That is why the backup is the answer, and it is worth taking seriously before you need it: [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/).

## The two cases where a way back exists

### A vault that still carries its own recovery phrase

Myne stopped creating vault recovery phrases on 2026-10-30, but vaults made before that keep theirs until their owner runs the format upgrade. If your vault has one, the unlock screen still offers it.

You can tell by opening **Settings → Vault** and looking for a **Vault format** block that offers **Retire my vault phrase**. That block means the vault still has a phrase of its own. No block means there is nothing to recover with.

With such a vault:

1. On the Unlock screen, choose **Forgot your password? Unlock with recovery phrase**.
2. Pick the vault, if you have more than one.
3. Enter your 24 recovery words. Each word is checked as you go, so a mistyped word is caught immediately.
4. **Set a new password.** This step is required: unlocking with the phrase always ends by giving the vault a fresh password.

If the vault belongs to an account that holds other vaults, Myne tells you how many more there are and offers **Recover another vault**, so you do not silently leave a sibling behind. The count is a number only; it says nothing about the other vaults beyond what the picker already shows.

Setting a new password this way also turns quick unlock off on that device. The PIN or Touch ID credential is deleted as part of the reset, without a prompt, so that anyone who knew the old PIN loses access along with the old password. Set it up again from **Settings → Privacy → Locking and unlocking** when you want it back.

### A vault someone shared with you

A vault you were invited into does not use the owner's password, and the owner cannot reset yours. The password is the one you chose when you accepted the invite, stored on that device only.

Forgetting it is not the end of the vault, and the way back is the owner rather than a phrase. Ask for a **fresh invite**, or for the owner to admit this device again. Accepting it gives you a new password on this device and leaves the notes, the other members and your access untouched. Myne offers no recovery-phrase arm for a shared vault at all: there is no toggle and no 24-word grid, and a device with no credential shows a sentence naming the fresh invite as the only way in.

Your identity phrase still matters here, but for a different job: it is what makes you the same member to everyone else. Losing it does not lock you out of a vault that this device already holds a credential for, and it does not cost you your notes. What it costs is appearing as yourself anywhere new: the owner cannot reissue your identity, and inviting you again with a fresh phrase makes you a new member with a new fingerprint. See [Sharing a vault with members](/user-guide/sync-and-devices/sharing-a-vault-with-members/) for what a member's credentials are.

## What a phrase can still be asked for

Myne asks for your 24 words in more than one situation, and none of them is "open my notes":

- creating your identity, and typing its words back;
- registering the identity with a sync server;
- bringing a new device into the account;
- unlocking the identity on a device that holds it but has it locked.

**The check is yours:** read the address before you type the words, and if the page reached you as a link in a message or an email, do not type them at all. Anyone who has your identity phrase can be you on a new device. That is a different loss from losing notes, and it is worth knowing which one you are exposed to.

A browser extension you have granted access to the site can read what is on the page, including the words as you type them. No Myne setting changes that, and the page cannot detect it. If you are not certain about every extension in that browser profile, do this in the desktop or mobile app, or use a clean profile.

## On a new computer

A phrase unlocks things; it does not fetch them. On a fresh machine with no vault yet, the identity phrase alone restores nothing to read: it recovers the identity, and the vaults appear once this device is admitted to the account (see [Add a device](/user-guide/sync-and-devices/add-a-device/)) or once you restore a [backup](/user-guide/safety-and-recovery/restore-from-a-backup/). After that, each vault still asks for its own password.

## Starting over

If the password is gone and there is no phrase and no backup, the only path forward is to start fresh. The Unlock screen has a last-resort link, **Lost both password and recovery phrase? Delete vault and start over**, which lets you delete the unopenable vault (you type DELETE to confirm) and create a new one. It recovers nothing; it only clears the way for a new vault.

## Limits

This page is not a recovery procedure for a current vault, because there is none. What protects you is a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) kept somewhere other than the device the vault lives on, and a password you can still produce.

A backup restores notes; it does not restore a forgotten password, because the backup's contents are sealed under that same password. Keep the backup and the password in separate places, and treat "I will remember it" as the weakest of the three things you are relying on.
