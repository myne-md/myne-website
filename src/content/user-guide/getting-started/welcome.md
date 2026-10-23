---
title: "Welcome to Myne"
category: "getting-started"
updated: 2026-10-22
summary: "An orientation to Myne, the local-first encrypted markdown notebook, and a map of the Getting started section: installing the app, creating your identity and your first vault, saving your recovery phrase, and finding your way around the editor."
tags: ["basics", "vault"]
---

Myne is a local-first, encrypted markdown notebook. You write in plain markdown, and Myne encrypts every note on disk, so the files on your computer stay unreadable without your password. There is no account email, no sign-up form, and no Myne server that can read what you write. This section gets you from a fresh install to your first note in about five minutes. You don't start from a blank page either: when setup finishes, Myne seeds a small example vault — five ordinary notes in one **Getting started** folder — and opens the first of them, **Start here**.

![A vault open in Myne: a sidebar with note titles on the left, an editor on the right showing a markdown note in progress.](./welcome-vault.svg)

## What makes Myne different

- **Encrypted by default.** Encryption is the only mode; there is no plaintext option to forget to turn on.
- **No account, no email, no server.** You don't sign up. Your identity and your vault are created on your device, protected by secrets only you hold, and nothing is transmitted while you do it.
- **A vault is a set of encrypted files that stay where you are.** It is not a single file and not a cloud account: each note is its own encrypted file. On a computer or a phone that is a directory Myne creates and manages on your disk. In a browser it is the browser's own storage for the site, with no folder to open; see [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/).

Until you turn on sync or name a remote AI provider, Myne runs entirely on your device; nothing leaves it.

AI is the one other door out, and it is off until you turn it on. Myne never sends your notes anywhere you have not named, and it downloads a model only when you ask, from Myne's own origin. If the provider you name runs somewhere other than this computer, what you send it leaves this device. [Turning on AI](/user-guide/ai/turning-on-ai/) covers what each option means.

## What this section covers

1. [Install Myne](/user-guide/getting-started/install/): how the app is distributed and verified.
2. [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/): running Myne in a desktop browser you serve yourself, and the trust boundary that differs from the desktop app.
3. [Create your identity](/user-guide/getting-started/create-your-identity/): the one thing a fresh install asks for, created offline, with one 24-word phrase that recovers every vault you own.
4. [Create your vault](/user-guide/getting-started/create-your-vault/): a name, a master password, and the vault opens, with no second phrase to keep.
5. [Your recovery phrase](/user-guide/getting-started/your-recovery-phrase/): the 24-word backstop, how to store it, and the screen that shows it once.
6. [Unlocking your vault](/user-guide/getting-started/unlocking-your-vault/): what you see each time you open Myne.
7. [Your first note](/user-guide/getting-started/your-first-note/): the example notes Myne seeds for you, plus writing, autosave, and where notes live.
8. [A tour of the interface](/user-guide/getting-started/interface-tour/): every region of the window, named.

## Already have a vault somewhere else?

If you are not starting fresh, two of the Welcome screen's three doors are for you instead of this chapter. The third, **Create your identity and vault**, is the one this chapter describes.

- **Restore from backup** takes a `.myne-backup` file from another machine and rebuilds the vault from it; follow [Restore from a backup](/user-guide/safety-and-recovery/restore-from-a-backup/).
- **Add this device to an account** is for a vault that already exists on another device and syncs. The vault arrives over sync rather than from a file, and a device already signed in has to approve this one; follow [Add a device](/user-guide/sync-and-devices/add-a-device/).

Either way, come back here once your vault is open.

## Limits

Encryption protects the files at rest on your disk. It does not protect a vault that is unlocked and open on your screen, and it cannot help if your password and recovery phrase are both lost — there is no reset, because a reset would mean someone else held a key to your notes. Anything you deliberately take out of Myne — an exported note, a PDF, a recovery phrase saved to a file — is an ordinary unencrypted file from the moment it is written. [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/) sets out where the guarantees start and stop.
