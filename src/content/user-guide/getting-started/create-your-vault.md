---
title: "Create your vault"
category: "getting-started"
updated: 2026-06-11
summary: "The four-step vault-creation wizard (set a master password, save your recovery phrase, confirm a few words, and note your account number) and the one consequence to understand before you start."
tags: ["vault", "basics"]
---

Creating a vault is a four-step wizard: set a master password, save your recovery phrase, confirm a few of its words, and note your account number. At the end Myne opens the vault straight into the editor. The whole thing takes a couple of minutes, but one decision in it is permanent, so read the password step before you rush through it.

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

When the wizard finishes you see **Your vault is ready.** and a **Done** button that takes you straight into the editor, with no second password prompt; the Unlock screen first appears the next time you launch Myne. Two more things on that screen:

- **Show vault folder** opens the directory on disk where Myne keeps this vault's encrypted files.
- **Back up this vault now** writes an encrypted backup you can keep elsewhere. It is worth taking. How backups work and the habit worth building are in [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/).

## Limits

The wizard's protection is only as strong as the password and phrase you choose and keep. Myne enforces a password floor and shows the phrase once, but it cannot recover either for you, and it cannot stop someone who has written your phrase where others can read it. Treat both like keys to a safe.
