---
title: "Your recovery phrase"
category: "getting-started"
updated: 2026-10-30
summary: "The 24-word phrase Myne shows you once, which phrase you were given and what it opens, the confirmation step that follows it, how the phrase screen protects the words while they are on display, and where to keep them."
tags: ["recovery", "vault", "security"]
---

Your recovery phrase is 24 standard English words that prove who you are. You see it once, while something is being created. This article explains which phrase you were given, what it does and does not open, the confirmation step that follows it, how the phrase screen protects the words while they are on display, and where to keep them.

![Your identity phrase and your master password do different jobs: the password opens your notes, the phrase proves who you are.](./your-recovery-phrase.svg)

## Which phrase you have

Myne has two phrases that look and behave the same. They differ in what they open, and only one of them is created today.

- **The identity phrase** is created first, on a fresh install, and it is the one most people have. It recovers your **identity**: it is how you prove the identity is yours, how you bring a new device into your account, and how you find the vaults that account owns. It opens **no vault**. The vaults you create under an identity open with their own password and with nothing else.
- **A vault recovery phrase** belonged to **one** vault. You have one of these if the vault was created before identities existed or by an older version of Myne. It arrived in a **recovery kit** together with that vault's account number. Myne no longer creates these, and the vaults that still have one keep it until their owner runs the format upgrade.

If you are not sure which you have, open the vault's **Settings → Vault**. A **Vault format** block offering **Retire my vault phrase** means that vault still has a recovery phrase of its own. No block means there is nothing to retire. [Upgrade your vault format](/user-guide/safety-and-recovery/upgrade-your-vault-format/) covers what that upgrade does and what it removes.

Everything below applies to both.

## What the phrase is

- **24 words from a standard list.** They are ordinary recovery words (the BIP-39 wordlist), chosen so they are easy to copy by hand and check for typos.
- **A credential in its own right, for one job.** The identity phrase is who you are; a vault phrase was the way into one vault. Neither needs the other's password.
- **It survives password changes.** Changing a vault's master password does not change any phrase; the same 24 words keep working for the job they have.
- **It is never sent anywhere.** There is no server copy and no upload, by design. That is also why no one can recover it for you; see the limit at the end.

## Confirming the phrase

After Myne shows you the phrase, it asks you to type **four** of the 24 words back. It does not pick them evenly: it asks for **one word from positions 1 to 8, two words from positions 9 to 16, and one word from positions 17 to 24**, so one of the four always comes from the **last third** of the list.

That bias is deliberate. The most common way people lose a phrase is writing down only the first few lines and stopping; guaranteeing a word from the end catches exactly that mistake before anything depends on an incomplete copy.

Typing is forgiving about case and surrounding spaces. Myne compares the normalized words, so a stray capital or a trailing space will not block you. The words themselves must match.

## How the phrase screen protects the words

While the phrase is on screen, Myne guards it:

- The grid is **blurred until you choose to reveal it**, and it **re-blurs when you switch away** from the window (for example, when you Cmd-Tab to another app), so the words are not left uncovered behind other windows.
- **Copy** puts the phrase on your clipboard and tells you whether it worked, so a failure does not look like a success. **Save as file** reports its outcome too, and how much it can report differs: on the desktop it says whether the write landed, while in a browser it can only confirm the download was sent, because your browser chooses where the file goes and never tells the page whether it arrived. Treat either as a way to move the phrase into a password manager, not as somewhere to keep it. What happens to the clipboard afterwards depends on where you are:
  - **On the desktop**, Myne clears it after 30 seconds, so the phrase does not linger for the next thing you paste. That clear runs inside Myne, so quitting the app within those 30 seconds leaves the phrase on the clipboard; clear it yourself if you do.
  - **In a browser**, nothing is cleared, and the screen says so rather than leaving you to assume otherwise. A page is not allowed to read the clipboard, and the clear is gated on reading the value back so that it can never destroy something you copied afterwards, so nothing is scheduled at all. The 24 words stay on your clipboard until you copy something else. Paste them into your password manager, then copy anything.
  - **On a phone**, Copy appears only where the system can hold the phrase to the standard this screen already asks for: confined to that one device, and expired on its own timer. iPhone can do both, so the button is there. Android can do neither, so the button is absent rather than present and weaker, and **Save to file** is what that screen offers instead. The desktop button is labelled **Save as file**.
- **In a browser, an extension can read this screen.** Myne says so on the phrase step, and there is nothing it can do about it: an extension you have granted access to the site reads the page directly, and no setting changes that. If you are not sure about every extension in that browser profile, create your identity and your vault in the desktop app, or use a clean profile for this step.
- **In a browser, the phrase is also asked for again after a reload** when the account is an identity, because the browser keeps no copy of the key that the phrase unlocks. The step says so. That is a cost of holding nothing on disk, not a failure to remember you.
- **On a phone, you do not choose where the file goes.** Neither iPhone nor Android gives an app a way to ask, so **Save to file** writes `myne-recovery-phrase.txt` into Myne's own Documents folder and then offers you the system share sheet to send it somewhere. Two things follow from that. Your phone's automatic cloud backup would otherwise copy that folder to iCloud or Google Drive, carrying a saved recovery phrase off your device; Myne tells both systems to leave that folder out, though the iPhone half of that has not yet been confirmed on a real device. And on a current Android, the system file browsers will not open that folder and the share sheet does nothing there, so the file is written and you cannot reach it. Type the words into a password manager on Android instead.
  The message you get says which of those two happened rather than guessing: on iPhone and iPad it points you at the share sheet, and tells you to tap Save again if you closed it; on Android it names the folder, because there the write is the delivery. If Myne cannot tell which system it is on, it says only that the file was saved inside the app, rather than pointing you at a folder or a sheet it has not confirmed.
- **If you saved a recovery phrase on a phone before this changed**, and that phone's automatic backup was on, a copy of the phrase is inside an existing cloud backup and nothing in the app can reach in and remove it. The phrase cannot be rotated, so treat it as exposed: create new items and move your notes across, rather than keeping the exposed one.
- If you try to **close the window mid-step**, Myne asks you to confirm, so you cannot lose the phrase by accidentally closing the wizard before you have saved it.

## Where to keep it

Store the phrase the way you would store a spare key:

- **On paper, somewhere safe** (a drawer, a safe, a sealed envelope) is the simplest good option.
- **In a password manager** is fine if you already trust one with your other secrets.
- **"Save as file"** writes a plaintext `myne-recovery-phrase.txt`. On the desktop app it says whether the write landed, so a save that failed is not left looking like one that worked, on the one screen where the words are shown once and never again. In a browser it can only tell you the file was sent to your downloads: your browser chooses where it goes and Myne never sees whether it arrived, so check. In the **desktop and mobile apps**, and where the operating system supports file permissions, Myne writes that file readable only by your own user account, and never touches it again. A browser download is the browser's file, written wherever your downloads go and with whatever permissions that folder gives it; Myne has no hand in either. After that, protecting it is yours. Use it only as a transfer step. A plaintext copy of the phrase left **on the same device it protects** defeats the point: anyone who reaches that device gets both the vault and the key to it. Move the file to separate, safe storage, then delete the local copy.

Your password and your phrase are two different jobs, and only one of them gets your notes back: see [If you forget your password](/user-guide/safety-and-recovery/if-you-forget-your-password/) for what is and is not recoverable.

## Limits

The two phrases protect different things, and it is worth being blunt about the difference.

The **identity phrase** recovers who you are: the keypair, the account number, and the list of vaults that account owns. Anyone who has it can register as you, accept invitations addressed to you, and be treated as you on a device that has no other copy of your identity. It does not open a single note.

A **vault recovery phrase** opened one vault and any backup ever made of it, without that vault's password. Vaults created today do not have one, and the format upgrade removes the ones that do, after which a forgotten password means a lost vault.

Neither phrase can be revoked, rotated, or recovered by Myne, because Myne never had a copy. That is also the shape of the attack worth knowing about: anyone who has the words and can reach a page that asks for them is you. [Recovery phrase scams](/user-guide/safety-and-recovery/recovery-phrase-scams/) covers how to tell a real prompt from a fake one.
