---
title: "What Myne doesn't do"
category: "settings-and-privacy"
updated: 2026-06-18
summary: "The things Myne deliberately does not do (no plaintext mode, no email recovery, no telemetry) and why each omission is a commitment rather than a missing feature."
tags: ["privacy", "security"]
---

Some of what defines Myne is what it refuses to do. These are not features that haven't been built yet; they are commitments, and building them would break the promise the rest of the app makes. Here is the list, in plain terms.

## Commitments

- **No plaintext mode, and no way to turn encryption off.** Encryption is the only mode. There is no "skip encryption for speed" switch, because a switch like that gets left off.
- **No email at sign-up, and no email recovery, ever.** Adding an email reset would mean someone other than you could trigger access to your vault. You hold the only keys; that is the whole point.
- **No telemetry and no analytics.** Myne sends no usage data — no counters, no crash pings, nothing about how you use the app. This holds whether or not you turn on sync: sync moves your *encrypted* notes between your devices, never usage data, and the server can never read them.
- **No way to disable auto-lock.** You can make the timer longer, but auto-lock is always on. See [Auto-lock and screen-capture protection](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/). You can opt in to [quick unlock](/user-guide/settings-and-privacy/quick-unlock/), which lets a fast credential (a PIN or Touch ID) reverse an auto-lock instead of retyping the master password — but that is a convenience layer over the always-on lock, not a way to switch it off. The PIN path is honestly bounded: someone who copies the vault can try to guess the PIN offline, slowed only by the PIN's length and the same memory-hard key derivation Myne uses elsewhere, so a short PIN buys less protection than the master password does.
- **No claim to protect a compromised machine.** Myne encrypts your notes on disk. It does not claim to defend against malware running on your computer or someone using it while a vault is open, and it won't pretend to.
- **No hidden or deniable vaults.** Myne doesn't offer a secret second vault behind a decoy password; it doesn't claim a property it can't actually provide.

## On attachments

The walk-away promise (that your notes are plain markdown once decrypted) is about your **notes**. Attachments are different. Attachments live as encrypted files inside the vault; today they're accessible only through the app. There is no bulk attachment-export tool.

## On sync

Sync is **off by default**. Until you turn it on, Myne runs entirely on your device; nothing leaves it. When you do turn it on, sync is zero-knowledge: only encrypted blobs move between your devices, and the server — whether Myne's hosted one or [a server you run yourself](/user-guide/sync-and-devices/) — never holds a key and can never read your notes. The hosted service is currently a free, invite-only beta; self-hosting is available now. See [Sync and devices](/user-guide/sync-and-devices/).

## Limits

This list reflects what Myne is today and the lines it commits not to cross. The full, precise account of what it defends against and what it doesn't lives in Myne's public threat model, and the everyday version of it is in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).
