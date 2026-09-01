---
title: "What Myne doesn't do"
category: "settings-and-privacy"
updated: 2026-08-24
summary: "The things Myne deliberately does not do (no plaintext mode, no email recovery, no telemetry, no request for your recovery phrase to sign you in, no egress until you name where it goes) and why each omission is a commitment rather than a missing feature."
tags: ["privacy", "security"]
---

Some of what defines Myne is what it refuses to do. These are not features that haven't been built yet; they are commitments, and building them would break the promise the rest of the app makes. Here is the list, in plain terms.

## Commitments

- **No plaintext mode, and no way to turn encryption off.** Encryption is the only mode. There is no "skip encryption for speed" switch, because a switch like that gets left off.
- **No email at sign-up, and no email recovery, ever.** Adding an email reset would mean someone other than you could trigger access to your vault. You hold the only keys; that is the whole point.
- **Myne never asks for your recovery phrase to sign you in, or to add a device.** In a browser there is exactly one screen that asks for those 24 words: an unlock with recovery phrase that you started yourself, after forgetting your password. Adding a device takes your account number and your master password and nothing else, and the phrase grid the desktop app uses for that is left out of the browser bundle entirely rather than merely hidden. This is a commitment rather than a description of today, and it exists so that a web page asking you for your phrase is something you can act on: outside an unlock you began yourself, the answer is no.
- **No telemetry and no analytics.** Myne sends no usage data — no counters, no crash pings, nothing about how you use the app. This holds whether or not you turn on sync: sync moves your *encrypted* notes between your devices, never usage data, and the server can never read them.
- **Nothing leaves your device until you name where it goes.** Sync is off by default. A remote AI provider is off by default and has to be named, with a consent step stating what is sent, before anything reaches it. Myne makes no request of its own — no telemetry, no reachability probe — and it never downloads a model. What Myne cannot promise is what a provider you named does with what it receives; it can only tell you what it sent and to whom.
- **No way to disable auto-lock.** You can make the timer longer, but auto-lock is always on. See [Auto-lock and screen-capture protection](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/). You can opt in to [quick unlock](/user-guide/settings-and-privacy/quick-unlock/), which lets a fast credential (a PIN or Touch ID) reverse an auto-lock instead of retyping the master password — but that is a convenience layer over the always-on lock, not a way to switch it off. The PIN path is honestly bounded: someone who copies the vault can try to guess the PIN offline, slowed only by the PIN's length and the same memory-hard key derivation Myne uses elsewhere, so a short PIN buys less protection than the master password does.
- **No claim to protect a compromised machine.** Myne encrypts your notes on disk. It does not claim to defend against malware running on your computer or someone using it while a vault is open, and it won't pretend to.
- **No hidden or deniable vaults.** Myne doesn't offer a secret second vault behind a decoy password; it doesn't claim a property it can't actually provide.

## On attachments

The walk-away promise (that your notes are plain markdown once decrypted) is about your **notes**. Attachments are different: inside the vault they are encrypted files, and the app is the only thing that can read them there. Getting them out is a deliberate export rather than a matter of opening the folder. The whole-vault Markdown export writes every attachment your notes reference into an `attachments/` folder as ordinary files, and a single note's Markdown export can write its attachments out beside it. An attachment no note references is not carried by either, so a copy of the whole library is something you would have to assemble yourself. See [Exporting notes and your vault](/user-guide/editor-and-writing/export-notes/).

## On sync

Two opt-ins move data off this device, and both are off until you turn them on: sync, and naming a remote AI provider. Sync is **off by default**. Until you turn on sync or name a remote AI provider, Myne runs entirely on your device; nothing leaves it. When you do turn sync on, it is zero-knowledge: only encrypted blobs move between your devices, and the server — whether Myne's hosted one or [a server you run yourself](/user-guide/sync-and-devices/) — never holds a key and can never read your notes. The hosted service is currently a free, invite-only beta; self-hosting is available now. See [Sync and devices](/user-guide/sync-and-devices/).

## On AI

Myne never downloads a model. Models are either bundled with the app or files you fetch yourself and point Myne at; the app has no fetch path of its own. Myne never sends your notes anywhere you have not named, and every provider setting starts unset — unset means the path is unreachable, not merely switched off.

The features that fire without you asking — inline suggestions as you type, automatic tag suggestions, and the search index — can never reach a remote provider at all. That is a rule in the code rather than a setting you could flip. A remote provider serves only work you ask for.

And there is still no telemetry here: naming a provider sends the work you asked for, and nothing about how you use the app. What Myne cannot see, and so does not claim, is what a provider keeps, how long it keeps it, or whether it forwards the request onward. See [Where your AI runs](/user-guide/ai/where-your-ai-runs/).

## Limits

This list reflects what Myne is today and the lines it commits not to cross. The full, precise account of what it defends against and what it doesn't lives in Myne's public threat model, and the everyday version of it is in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).
