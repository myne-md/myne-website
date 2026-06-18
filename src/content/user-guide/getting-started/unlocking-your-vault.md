---
title: "Unlocking your vault"
category: "getting-started"
updated: 2026-06-18
summary: "How to unlock an existing vault with your master password each time you open Myne, what the unlock screen shows, and what it means for a vault to be locked."
tags: ["vault", "security"]
---

Once a vault exists, Myne keeps it locked until you enter your master password. This article covers what you see when you open the app, the message you get when a password doesn't work and why it is deliberately vague, and how to lock the vault yourself when you step away.

## What you see when you open Myne

Myne checks your device on launch and opens the right screen for what it finds:

- **No vault yet** → the Welcome screen, where you create a vault or restore one.
- **One vault** → the Unlock screen for that vault.
- **Two or more vaults** → the vault picker, where you choose which one to open.

If you keep more than one vault, [Multiple vaults](/user-guide/safety-and-recovery/multiple-vaults/) covers the picker, switching, and what each vault does and doesn't share.

## Unlocking

Type your master password and confirm. Myne derives your keys from the password and decrypts the vault; this takes about a second, which is deliberate: the key derivation is intentionally slow to make password guessing expensive. When it succeeds, you land in the editor.

### Quick unlock after auto-lock

If you turn on quick unlock, the Unlock screen shows a faster re-entry option above the password form after the vault auto-locks: a PIN, or Touch ID on macOS. The master-password form is always there below it, so you can still type your password instead. Quick unlock is off until you enable it from Settings → Privacy, and the master password is always required again after you restart the app. Touch ID is macOS-only and the app marks it experimental. See [Quick unlock](/user-guide/settings-and-privacy/quick-unlock/) for how to set it up and what it does and does not protect.

### When the password doesn't work

If unlocking fails, you see one message:

> Wrong password or vault file is corrupted.

The message is intentionally ambiguous, and the ambiguity is a privacy property, not a missing feature. Myne genuinely cannot tell you which of the two it is: distinguishing "wrong password" from "damaged file" would mean checking your data against something it could only know by holding a copy of what it is protecting. It refuses to know that. So it reports the honest, combined outcome. Check your password first; if you are sure it is right, the vault file may be damaged, and [Restore from a backup](/user-guide/safety-and-recovery/restore-from-a-backup/) is the way back.

## Restoring instead of unlocking

The Welcome screen also carries a **Restore from backup** door. If you are setting up on a new machine, or your vault file is damaged, you restore from a `.myne-backup` file rather than unlocking an existing vault. The how and the caveats live in [Restore from a backup](/user-guide/safety-and-recovery/restore-from-a-backup/).

## Locking the vault

The bottom bar has a **Lock vault** control. Selecting it locks the vault immediately and returns you to the Unlock screen, which is useful when you leave your desk. Myne also locks the vault on its own after a period of inactivity; the timing and the screen-capture protection that goes with it are covered in [Auto-lock and screen-capture protection](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/).

## Limits

The Unlock screen protects your vault against someone who has your computer but not your password; its strength is your password's strength and the deliberately slow key derivation behind it. It does not protect a vault that is already unlocked and open on screen; lock it when you step away. Quick unlock is a convenience layer over that same encrypted vault, not a stronger gate — [Quick unlock](/user-guide/settings-and-privacy/quick-unlock/) covers its trade-offs.
