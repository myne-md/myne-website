---
title: "Your recovery phrase"
category: "getting-started"
updated: 2026-08-16
summary: "What the 24-word recovery phrase is, why Myne shows it once when you create a vault, and how to write it down and store it so you can recover access later."
tags: ["recovery", "vault", "security"]
---

Your recovery phrase is 24 standard English words that act as a second, independent way to unlock your vault. You see it once, during vault creation. This article explains what it is, the confirmation step that follows it, how the phrase screen protects the words while they are on display, and where to keep them.

![Your master password and your 24-word recovery phrase are two independent ways to open the same vault; the phrase is the offline backup and is never uploaded.](./your-recovery-phrase.svg)

## What the phrase is

- **24 words from a standard list.** They are ordinary recovery words (the BIP-39 wordlist), chosen so they are easy to copy by hand and check for typos.
- **A second, independent credential.** The phrase unlocks the vault on its own; you do not need the password as well. It is the backstop for the day you forget the password.
- **It survives password changes.** Changing your master password does not change the phrase; the same 24 words keep working.
- **It is never sent anywhere.** There is no server copy and no upload, by design. That is also why no one can recover it for you; see the limit at the end.

## Confirming the phrase

After Myne shows you the phrase, it asks you to type **four** of the 24 words back. It does not pick them evenly: it asks for **one word from positions 1 to 8, two words from positions 9 to 16, and one word from positions 17 to 24**, so one of the four always comes from the **last third** of the list.

That bias is deliberate. The most common way people lose a phrase is writing down only the first few lines and stopping; guaranteeing a word from the end catches exactly that mistake before your vault depends on an incomplete copy.

Typing is forgiving about case and surrounding spaces. Myne compares the normalized words, so a stray capital or a trailing space will not block you. The words themselves must match.

## How the phrase screen protects the words

While the phrase is on screen, Myne guards it:

- The grid is **blurred until you choose to reveal it**, and it **re-blurs when you switch away** from the window (for example, when you Cmd-Tab to another app), so the words are not left uncovered behind other windows.
- **Copy** puts the phrase on your clipboard and **clears it automatically after 30 seconds**, so it does not linger for the next thing you paste. That clear runs inside Myne, so quitting the app within those 30 seconds leaves the phrase on the clipboard; clear it yourself if you do. Copy also tells you whether it worked, so a failure does not look like a success. Treat it as a way to move the phrase into a password manager, not as somewhere to keep it.
- **On a phone, Copy is not offered for the phrase.** Use **"Save to file"** there; the desktop button is labelled **"Save as file"**. A phone would need the system to keep the phrase on that one device and expire it on its own timer. Android does neither. iOS can do both, and Myne does not yet use it.
- If you try to **close the window mid-step**, Myne asks you to confirm, so you cannot lose the phrase by accidentally closing the wizard before you have saved it.

## Where to keep it

Store the phrase the way you would store a spare key:

- **On paper, somewhere safe** (a drawer, a safe, a sealed envelope) is the simplest good option.
- **In a password manager** is fine if you already trust one with your other secrets.
- **"Save as file"** writes a plaintext `myne-recovery-phrase.txt`. Where your operating system supports it, Myne writes that file readable only by your own user account, and never touches it again — after that, protecting it is yours. Use it only as a transfer step. A plaintext copy of the phrase left **on the same device it protects** defeats the point: anyone who reaches that device gets both the vault and the key to it. Move the file to separate, safe storage, then delete the local copy.

If you later forget your password, the phrase is how you get back in; see [If you forget your password](/user-guide/safety-and-recovery/if-you-forget-your-password/). The flow is "unlock with recovery phrase".

## Limits

The recovery phrase is exactly as powerful as your password: anyone who has it can open this vault, and any backup ever made of it, without the password. Myne cannot revoke it, rotate it, or recover it for you, because it never had a copy. Store it like a key, not like a note.
