---
title: "Create your vault"
category: "getting-started"
updated: 2026-06-18
summary: "The vault-creation wizard — a short safety briefing, then set a master password, save your recovery phrase, confirm a few words, and note your account number — and the one consequence to understand before you start."
tags: ["vault", "basics"]
---

Creating your first vault opens with a short safety briefing, then runs a four-step wizard: set a master password, save your recovery phrase, confirm a few of its words, and note your account number. At the end Myne opens the vault straight into a seeded welcome note. The whole thing takes a couple of minutes, but one decision in it is permanent, so read the briefing and the password step before you rush through them.

![A vault is a folder of encrypted files on your device: each note is its own encrypted file, and nothing leaves your device.](./create-your-vault.svg)

## Before you begin: the safety briefing

The first time you create a vault, Myne opens with a short briefing — three plain facts about how your vault is protected, so nothing about the recovery model surprises you later:

- **Your password unlocks your vault, and Myne does not store it.** There is no copy on any server to reset it from.
- **Your recovery phrase is your only backup.** It is the one way back in if you forget the password. If you lose both your password and recovery phrase, your notes are unrecoverable. We cannot help.
- **There is no email recovery, and there never will be.** Myne never asks for your email, so there is no reset link.

Each fact has a **Why?** you can expand for the reasoning, and its own acknowledgement checkbox. **Continue to vault creation** stays disabled until all three are ticked; **Back** returns to the Welcome screen without creating anything. The briefing is shown only the first time, on this create flow — when you later create an additional vault from the picker, Myne goes straight to the password step.

## Step 1: Set a master password

Choose a password that protects this vault. Myne enforces a floor: at least 12 characters, and a strength the meter accepts. There is no email, no security question, and no reset link behind it. The password is one of the two things that can open the vault.

After you continue, Myne pauses for about a second. That pause is the key derivation: Myne deliberately makes turning your password into a key slow, so that guessing passwords is expensive for anyone who copies your files.

> **This is the decision to understand.** Your vault has two credentials: this password and the recovery phrase you are about to see. Either one alone unlocks the vault. But if you lose **both**, the data is permanently unrecoverable. No support channel, no email, and no server can recover it or provide a partial way back; Myne never holds a copy of your keys. Save both before you go on.

## Step 2: Save your recovery phrase

Myne shows you a 24-word recovery phrase. This is your second credential, an independent way to unlock the vault if you forget the password. Write it down now. The phrase screen, its protective behaviours, and where to keep the words are covered in full in [Your recovery phrase](/user-guide/getting-started/your-recovery-phrase/).

## Step 3: Confirm a few words

To check that you actually recorded the phrase, Myne asks you to type back four of your 24 words. This catches the most common mistake: writing down only the first few lines. The full explanation of which words it asks for, and why, is in [Your recovery phrase](/user-guide/getting-started/your-recovery-phrase/#confirming-the-phrase).

## Step 4: Your account number

Last, Myne shows your **account number**. It is an identifier, **not a key**: knowing it grants no access to your notes, since only your password or recovery phrase can open the vault. It displays as `MY-` followed by five groups of four characters (for example, `MY-XXXX-XXXX-XXXX-XXXX-XXXX`), and it is **shown only once**, here at creation. Settings does not display it again. Save it now, alongside your phrase.

## Your vault is ready

When the wizard finishes you see **Your vault is ready.** and a **Done** button that takes you straight into the [editor](/user-guide/editor-and-writing/overview/), with no second password prompt; the Unlock screen first appears the next time you launch Myne. Rather than an empty editor, your new vault opens on a seeded **Welcome to Myne** note — an ordinary note you can edit, rename, or delete like any other. Two more things on that screen:

- **Show vault folder** opens the directory on disk where Myne keeps this vault's encrypted files.
- **Back up this vault now** writes an encrypted backup you can keep elsewhere. It is worth taking. How backups work and the habit worth building are in [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/).

## Limits

The wizard's protection is only as strong as the password and phrase you choose and keep. Myne enforces a password floor and shows the phrase once, but it cannot recover either for you, and it cannot stop someone who has written your phrase where others can read it. Treat both like keys to a safe.
