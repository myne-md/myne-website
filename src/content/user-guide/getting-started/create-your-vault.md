---
title: "Create your vault"
category: "getting-started"
updated: 2026-11-03
summary: "The vault-creation flow after your identity exists: a short safety briefing, a name for the vault, a master password, and the vault opens. No vault recovery phrase and no account number, because the identity you just created is both."
tags: ["vault", "basics"]
---

Creating your first vault opens with a short safety briefing, then asks for a name and a master password, and creates the vault. There is no recovery phrase to save and no account number to copy, because your identity covers both. The whole thing takes a couple of minutes, and one of the screens still asks you to understand something permanent before you start.

![A vault is a folder of encrypted files on your device: each note is its own encrypted file, and until you turn on sync, nothing leaves your device.](./create-your-vault.svg)

## Getting here

There is one way in. On a fresh Myne, the welcome screen offers **Create your identity and vault**, which runs the [identity ceremony](/user-guide/getting-started/create-your-identity/) and then continues here. There is no separate door for a vault on its own, and no step to skip: the identity is what makes the vault recoverable, so it comes first.

You come back here later through **Create another vault**, from the vault picker or the vault switcher. That entry skips the briefing and goes straight to the name, because you have already read it once.

Creating a vault needs your identity to be unlocked. In the first run it is, because you just made it. If you are creating an additional vault in a later session and the identity is locked, Myne stops and says **Unlock your identity first**: the key it is about to seal belongs to the identity, and sealing it while the identity is locked would leave a vault nobody could recover.

## Before you begin: the safety briefing

The first time you create a vault, Myne opens with a short briefing — three plain facts about how your vault is protected, so nothing about the recovery model surprises you later:

- **Your password unlocks your vault, and Myne does not store it.** There is no copy on any server to reset it from.
- **Your recovery phrase is your only backup.** It is the one way back in if you forget the password. If you lose both your password and recovery phrase, your notes are unrecoverable. We cannot help.
- **There is no email recovery, and there never will be.** Myne never asks for your email, so there is no reset link.

The phrase the second fact names is your **identity phrase**, which you saved a moment ago. Each fact has a **Why?** you can expand for the reasoning, and its own acknowledgement checkbox. **Continue to vault creation** stays disabled until all three are ticked; **Back** returns to the screen you came from without creating anything.

## Step 1: Name your vault

Give the vault a name. You will see it on the lock screen and in your vault list, and you can change it later. The name is stored encrypted inside the vault, but it is shown on the startup picker before you unlock, so anyone who can see that screen can read it; the Privacy setting to hide vault names turns that off.

## Step 2: Set a master password

Choose a password that protects this vault. Myne enforces a floor: at least 12 characters, and a strength the meter accepts. There is no email, no security question, and no reset link behind it. This password, and your identity phrase, are the two things that can open the vault.

After you continue, Myne pauses for about a second. That pause is the key derivation: Myne deliberately makes turning your password into a key slow, so that guessing passwords is expensive for anyone who copies your files.

> **This is the decision to understand.** Your vault has two credentials: this password and the identity phrase you saved a minute ago. Either one alone unlocks the vault. But if you lose **both**, the data is permanently unrecoverable. No support channel, no email, and no server can recover it or provide a partial way back.

## Step 3: Create it

Choose **Create vault**. Myne encrypts the vault and opens it. If creation does not finish, Myne says why and the vault is not created: a password below the floor, a session that timed out after ten minutes, or a disk that is out of space are the common cases, and each names itself.

## Your vault is ready

When it finishes you see **Your vault is ready.** and a **Done** button that takes you straight into the [editor](/user-guide/editor-and-writing/overview/), with no second password prompt; the Unlock screen first appears the next time you launch Myne. Rather than an empty editor, your new vault opens on **Start here**, the first of five example notes Myne seeds under a single **Getting started** folder. They are ordinary notes (edit, rename or delete any of them), and right-clicking the folder and choosing **Delete** moves the whole set to Trash together, where you can still restore it. Two more things sit on that screen, on the desktop:

- **Show vault folder** opens the directory on disk where Myne keeps this vault's encrypted files.
- **Back up this vault now** writes an encrypted backup you can keep elsewhere. It is worth taking. How backups work and the habit worth building are in [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/).

When Myne has written the vault, this device publishes its own signing key: that is what lets it sync afterwards without asking for your phrase every time. It happens once per device, at creation, because that is the last moment your identity is open, which is why the ceremony asks for the phrase before the vault exists rather than after the first lock. A platform with no OS key store (a browser, or a Linux session with no keyring) cannot keep a key, so nothing is published there and the phrase is asked for once per session instead. See [Unlocking your vault](/user-guide/getting-started/unlocking-your-vault/#when-myne-asks-for-the-phrase).

Neither appears in a browser, and neither is missing by accident: there is no folder to open and no save dialog to write a backup through, so both controls are left out of the browser build rather than shown and refused. Your notes there live in the browser's own storage for the site, and the server keeps the copy a new browser re-downloads. See [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/).

## If your vault has its own recovery phrase

A vault that carries its own recovery phrase still works exactly as it always did, and you will meet one if it was created before identities existed, or by an older version of Myne. A browser now creates vaults through the identity ceremony too, so a vault made there today does not take this shape. That older flow has more steps, and the middle three are the ones this article no longer has:

1. After the password, Myne shows a **recovery kit**: your 24-word vault phrase and the vault's **account number**, on one sheet you save or copy. The phrase is the second way into that vault; the number is what a second device needs to find it.
2. Next it asks you to type back four of the phrase's words, one drawn from the last third of the list, to catch a copy that stopped early.
3. Then the vault is created, and the kit is never shown again.

Keep that sheet. [Your recovery phrase](/user-guide/getting-started/your-recovery-phrase/) explains the phrase screen in full, and [Upgrade your vault format](/user-guide/safety-and-recovery/upgrade-your-vault-format/) is how such a vault moves onto one-phrase recovery later.

## Limits

The flow's protection is only as strong as the password and phrase you choose and keep. Myne enforces a password floor and shows the identity phrase once, but it cannot recover either for you, and it cannot stop someone who has written your phrase where others can read it. Treat both like keys to a safe.

An identity phrase is the larger of the two: it opens every vault you own, not only this one. The password you set here opens this vault alone, which is why a different password per vault is worth the small inconvenience.
