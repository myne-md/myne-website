---
title: "Turn on sync"
category: "sync-and-devices"
updated: 2026-08-13
summary: "Choose a sync server, understand the account number that identifies you instead of an email, accept the beta terms on this device, and connect your first device. Covers entering a hosted or self-hosted server address, the certificate fingerprint to compare across devices, and the first-device self-approval."
tags: ["sync", "settings", "devices"]
---

Turning on sync has three parts: pointing Myne at a server, accepting the beta terms on this device, and connecting the device to your account. This page covers the first device — the one that seeds the account. Adding a second device is covered separately in [Add a device](/user-guide/sync-and-devices/add-a-device/).

![The Sync settings panel, where a sync server is configured and this device's sync is turned on.](./turn-on-sync.png)

## Prerequisites

- An unlocked vault.
- A sync server address — either Myne's hosted server or the `https://` address of a server you run yourself. A server you run yourself is available now; Myne's hosted server is currently a free, invite-only beta.
- Your account number, which Myne showed once when you [created your vault](/user-guide/getting-started/create-your-vault/). Settings does not display it again, so use the copy you saved then.

## Your account number

Myne identifies you by an **account number**, not an email address. It is a self-generated value that starts with `MY-`, shown once when you [created your vault](/user-guide/getting-started/create-your-vault/) — where you could copy it or save it to a file. Settings does not display it again, so keep the copy you saved. It is what you type to connect a device. It is not a key and grants no read access on its own — your password or recovery phrase is still required to decrypt anything. Because there is no email, there is also no email-based recovery; keep your account number and [recovery phrase](/user-guide/getting-started/your-recovery-phrase/) somewhere safe.

## Set the server

1. Open **Settings** (the gear in the bottom bar, or `⌘,` / `Ctrl ,`) and select the **Sync** panel.
2. Under **Sync server**, enter the server URL. Use the `https://` address for a hosted or self-hosted server; a local server on the same machine can use its loopback `http://` address.
3. Choose **Connect**. Once connected, the button rests as a disabled **Connected**; it becomes available again as soon as you edit the address.

For an `https` server, Myne pins the server's certificate on first connect and shows its **fingerprint** — a line you can eye-compare across your devices to confirm they are all talking to the same server. If you connect to Myne's hosted server, the fingerprint is verified against Myne's built-in certificate instead. A loopback `http` server has no TLS, so there is no fingerprint to show.

Enter the **same** server URL on every device you want to sync.

## Accept the beta terms

Setting a server does not start any syncing. Under **Add a device**, Myne shows a screen headed **Before you turn on sync** and holds the enrolment form behind it until you accept. It states that sync is a free beta with no warranty and no uptime promise, that your notes cannot be recovered if you lose both your password and your recovery phrase, what happens when the beta ends, and what the operator can and cannot see. **Read the full terms** opens the published text on myne.md.

Choose **I understand — turn on sync**. Every device you add later is asked the same thing on its own screen: the acceptance is recorded on the device in front of you and is never carried across by sync.

## The first device

The first device on an account is the one you are setting up now, so there is nothing yet to approve it against — it self-approves. From this point, sync status shows **Synced** when the device is up to date (see [Reading sync status](/user-guide/sync-and-devices/sync-status/)), and any further device you connect will wait for approval from a device that already has access.

## Limits

Setting a server does not weaken your at-rest protection: your notes are still encrypted with keys derived from your password, and the server stores only ciphertext (see [How sync works](/user-guide/sync-and-devices/how-sync-works/)). The certificate fingerprint confirms your devices reach the same server; it is not a guarantee about the operator, who can still see connection metadata. Sync is not a substitute for a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) — it keeps devices in step, including propagating deletions, rather than preserving a fixed snapshot.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
