---
title: "Sync & devices"
category: "sync-and-devices"
updated: 2026-07-11
summary: "An overview of Myne's multi-device sync: it keeps your encrypted notes in step across devices through a server it cannot read, uses no email, and connects a new device with your account number rather than a login. This page is the map for the section."
tags: ["sync", "devices", "privacy"]
---

Sync keeps your notes in step across the devices you own. Each device encrypts its notes before anything leaves it, so the server only ever holds ciphertext it cannot read. There is no email and no separate login: you connect a device with your account number and either your password or your recovery phrase. Sync stays off until you set a server and add a second device, and you can run it on Myne's hosted server or one you host yourself.

## What sync is

- **Zero-knowledge by construction.** Your keys are derived from your password (or recovery phrase). The server stores encrypted blobs and cannot decrypt your notes, titles, folders, or tags. See [How sync works](/user-guide/sync-and-devices/how-sync-works/).
- **No email, no account login.** A device joins your account with your account number plus a credential you already have. Nothing new to remember, nothing to reset by email.
- **Conflict detection without reading content.** The server tracks changes with an opaque per-note version counter — a number, not your text. When two devices edit the same note, the copies are reconciled on your device after decryption, and Myne keeps both so nothing is lost.
- **Hosted or self-hosted, same model.** Whether you use Myne's server or your own, the server sits outside the trust boundary and gets the same access — which is to say, none to your content.

## What sync is not

- It is not a backup. A [local backup](/user-guide/safety-and-recovery/back-up-your-vault/) is a separate, deliberate copy you keep. Sync propagates deletions between your devices; a backup does not.
- It is not anonymity. Zero-knowledge protects your note content, not the fact that a device connected. A server operator can see connection metadata (see the limits in [How sync works](/user-guide/sync-and-devices/how-sync-works/)).
- It is not always on. Sync does nothing until you configure a server and add a device.

## What's in this section

- **[How sync works](/user-guide/sync-and-devices/how-sync-works/)** explains the zero-knowledge model and exactly what the server can and cannot see.
- **[Turn on sync](/user-guide/sync-and-devices/turn-on-sync/)** covers choosing a server and the first device.
- **[Add a device](/user-guide/sync-and-devices/add-a-device/)** covers the pairing and approval flow.
- **[Reading sync status](/user-guide/sync-and-devices/sync-status/)** covers the status indicator and the banners.
- **[Resolving conflicts](/user-guide/sync-and-devices/resolving-conflicts/)** covers keep-both and choosing a version.
- **[Managing devices](/user-guide/sync-and-devices/managing-devices/)** covers viewing and removing devices.

## Limits

Sync moves encrypted note content between devices you own. It does not hide connection metadata: an operator of the server (hosted or self-hosted) can observe that a device connected, the current connection IP for the duration of that connection, the number of devices on the account, the size and count of your encrypted blobs, and the timing of your pushes and pulls over time. None of that reveals note content, but it is not anonymity, so Myne does not claim it. The deeper cryptographic bounds — what a malicious server could still attempt, and what Myne can and cannot detect — are in [How sync works](/user-guide/sync-and-devices/how-sync-works/).
