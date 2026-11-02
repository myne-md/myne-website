---
title: "Sync & devices"
category: "sync-and-devices"
updated: 2026-08-13
summary: "An overview of Myne's multi-device sync: it keeps your encrypted notes in step across devices through a server it cannot read, uses no email, and connects a new device with an invitation rather than a login. This page is the map for the section."
tags: ["sync", "devices", "privacy"]
---

Sync keeps your notes in step across the devices you own. Each device encrypts its notes before anything leaves it, so the server only ever holds ciphertext it cannot read. There is no email and no separate login: you connect a device by inviting it from one you already have, and confirming on both that they show the same short code. Sync stays off until you set a server and add a second device. It runs on a server you set up yourself: Myne operates no sync service of its own, and the server it ships is open source and available to run today.

## What sync is

- **Zero-knowledge by construction.** Your keys are derived from your password (or recovery phrase). The server stores encrypted blobs and cannot decrypt your notes, titles, folders, or tags. See [How sync works](/user-guide/sync-and-devices/how-sync-works/).
- **No email, no account login.** A device joins because a device you already own invited it, and the two compare a short code. Nothing new to remember, nothing to reset by email.
- **Conflict detection without reading content.** The server tracks changes with an opaque per-note version counter — a number, not your text. When two devices edit the same note, the copies are reconciled on your device after decryption: on the original vault format Myne keeps both copies for you to choose between, and on the upgraded format it merges the two sets of edits into one note.
- **Any server sits outside the trust boundary.** Whoever operates it, the server gets the same access, which is to say none to your content. the server sits outside the trust boundary and gets the same access — which is to say, none to your content.

## What sync is not

- It is not a backup. A [local backup](/user-guide/safety-and-recovery/back-up-your-vault/) is a separate, deliberate copy you keep. Sync propagates deletions between your devices; a backup does not.
- It is not anonymity. Zero-knowledge protects your note content, not the fact that a device connected. A server operator can see connection metadata (see the limits in [How sync works](/user-guide/sync-and-devices/how-sync-works/)).
- It is not always on. Sync does nothing until you configure a server, accept the beta terms on that device, and add it to your account.

## What's in this section

- **[How sync works](/user-guide/sync-and-devices/how-sync-works/)** explains the zero-knowledge model and exactly what the server can and cannot see.
- **[Turn on sync](/user-guide/sync-and-devices/turn-on-sync/)** covers choosing a server and the first device.
- **[Run your own sync server](/user-guide/sync-and-devices/run-your-own-sync-server/)** covers bringing up a server you operate, and what that makes you responsible for.
- **[Add a device](/user-guide/sync-and-devices/add-a-device/)** covers the pairing and approval flow.
- **[Reading sync status](/user-guide/sync-and-devices/sync-status/)** covers the status indicator and the banners.
- **[Storage and account limits](/user-guide/sync-and-devices/storage-and-limits/)** covers the usage meters and the over-limit, oversize, and frozen refusal states.
- **[Resolving conflicts](/user-guide/sync-and-devices/resolving-conflicts/)** covers keep-both and choosing a version, and what changes once the vault format is upgraded.
- **[Managing devices](/user-guide/sync-and-devices/managing-devices/)** covers viewing, renaming and removing devices, and the notes kept back when a deletion arrives by sync.
- **[Live collaboration](/user-guide/sync-and-devices/live-collaboration/)** covers seeing another person's cursor, selection and name while a note is open, the Who's here tab, and click to jump.
- **[Upgrade your vault format](/user-guide/safety-and-recovery/upgrade-your-vault-format/)**, in the safety chapter, covers the one-way upgrade that gives notes automatic cross-device merging.

## Limits

Sync moves encrypted note content between devices you own. It does not hide connection metadata: an operator of the server (hosted or self-hosted) can observe that a device connected, the current connection IP for the duration of that connection, the number of devices on the account, the size and count of your encrypted blobs, and the timing of your pushes and pulls over time. None of that reveals note content, but it is not anonymity, so Myne does not claim it. The deeper cryptographic bounds — what a malicious server could still attempt, and what Myne can and cannot detect — are in [How sync works](/user-guide/sync-and-devices/how-sync-works/).
