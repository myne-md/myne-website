---
title: "Turn on sync"
category: "sync-and-devices"
updated: 2026-08-24
summary: "Choose a sync server, understand the account number that identifies you instead of an email, accept the beta terms on this device, and connect your first device. Covers the certificate fingerprint to compare across devices, what happens when that certificate changes, the browser client's fixed server, and the first-device self-approval."
tags: ["sync", "settings", "devices"]
---

Turning on sync has three parts: pointing Myne at a server, accepting the beta terms on this device, and connecting the device to your account. This page covers the first device — the one that seeds the account. Adding a second device is covered separately in [Add a device](/user-guide/sync-and-devices/add-a-device/).

![The Sync settings panel, where a sync server is configured and this device's sync is turned on.](./turn-on-sync.png)

## Prerequisites

- An unlocked vault.
- A sync server address — either Myne's hosted server or the `https://` address of a server you run yourself. A server you run yourself is available now; Myne's hosted server is currently a free, invite-only beta. If you do not have one yet, [Run your own sync server](/user-guide/sync-and-devices/run-your-own-sync-server/) brings one up on a machine you control.
- Your account number, which Myne showed once when you [created your vault](/user-guide/getting-started/create-your-vault/). Settings does not display it again, so use the copy you saved then.

## Your account number

Myne identifies you by an **account number**, not an email address. It is a self-generated value that starts with `MY-`, shown once when you [created your vault](/user-guide/getting-started/create-your-vault/), where you could copy it or save it to a file. Settings does not display it again, so keep the copy you saved. It is what you type to connect a device.

It is not an encryption key and it decrypts nothing on its own. It is, though, what a sync server accepts as your identity, and a joining device has to fetch your account's encrypted key file before it can authenticate, so anyone holding your account number can ask the server for that file, from anywhere, with no device of yours. The file reveals nothing by itself; what it hands someone is the material to start guessing your master password on their own hardware. Treat the number like cash: fine to type into your own devices, not something to put in a screenshot or a support thread. [Create your vault](/user-guide/getting-started/create-your-vault/) makes the same point at the moment the number is first shown.

Because there is no email, there is also no email-based recovery; keep your account number and [recovery phrase](/user-guide/getting-started/your-recovery-phrase/) somewhere safe.

## Set the server

1. Open **Settings** (the gear in the bottom bar, or `⌘,` / `Ctrl ,`) and select the **Sync** panel.
2. Under **Sync server**, enter the server URL. Use the `https://` address for a hosted or self-hosted server; a local server on the same machine can use its loopback `http://` address.
3. Choose **Connect**. Once connected, the button rests as a disabled **Connected**; it becomes available again as soon as you edit the address.

For an `https` server, Myne pins the server's certificate on first connect and shows its **fingerprint**, a line you can eye-compare across your devices to confirm they are all talking to the same server. Myne has no built-in certificate for its hosted server yet, so a hosted endpoint is pinned on first connect in exactly the same way a self-hosted one is. Compare the fingerprint across your devices either way. A loopback `http` server has no TLS, so there is no fingerprint to show.

Enter the **same** server URL on every device you want to sync.

## When the server's certificate changes

A certificate has a lifetime, so a pinned one is replaced eventually. When that happens sync stops and names the reason rather than retrying (see [Reading sync status](/user-guide/sync-and-devices/sync-status/)).

Re-entering the same server URL does not quietly accept the new certificate. Myne compares it against the one this device pinned and refuses when they differ, changing nothing: "This server presented a different certificate than the one this device trusts. Nothing was changed. If you renewed it, paste the new fingerprint below; if you did not, do not connect."

Below that refusal a block appears, headed **Check this server's certificate before trusting it**, with an **Expected certificate fingerprint** field. Get the fingerprint from the server itself. The **Where do I find this fingerprint?** disclosure gives the `openssl` command that prints it, and names a device that is already connected as the other source. Myne echoes what you typed in groups of four characters so you can read it against your own copy, and connects only once the certificate the server presents matches. Colons, spaces and a leading `sha256:` are accepted, so the whole line the `openssl` command prints can be pasted as it is. If it does not match, nothing is saved. **I don't have it, cancel** backs out and leaves the device on the certificate it already trusted.

Do this only when you know why the certificate changed. A renewal and an impostor look the same from here, which is why Myne asks rather than guessing.

## In a browser

The browser client does not have these steps. It syncs with one server, fixed when the deployment was built, so **Sync server** shows that address read-only, with no field to edit and no **Connect** button: "This client syncs with one server, set when it was deployed. It cannot be changed from here: the page is only allowed to talk to this one address."

There is no fingerprint to compare there either, and no certificate for Myne to pin or re-pin. A page cannot read a server's certificate, so the panel names what does the checking instead: "Verified by your browser’s certificate store. This client cannot pin a certificate itself." The check is real, but it is your browser's rather than Myne's.

## Accept the beta terms

Setting a server does not start any syncing. Under **Add a device**, Myne puts a **Review the beta terms** button where the enrolment form would be, and does not render the form until you accept. Pressing it opens a dialog headed **Before you turn on sync**, which states that sync is a free beta with no warranty and no uptime promise, that your notes cannot be recovered if you lose both your master password and your recovery phrase, what happens when the beta ends, and what the operator can and cannot see. **Read the full terms** opens the published text on myne.md.

Choose **I understand, turn on sync** to accept, or **Cancel** to close the dialog and leave the gate standing. Every device you add later is asked the same thing on its own screen: the acceptance is recorded on the device in front of you and is never carried across by sync.

## The first device

The first device on an account is the one you are setting up now, so there is nothing yet to approve it against — it self-approves. From this point, sync status shows **Synced** when the device is up to date (see [Reading sync status](/user-guide/sync-and-devices/sync-status/)), and any further device you connect will wait for approval from a device that already has access.

## Limits

Setting a server does not weaken your at-rest protection: your notes are still encrypted with keys derived from your password, and the server stores only ciphertext (see [How sync works](/user-guide/sync-and-devices/how-sync-works/)). The certificate fingerprint confirms your devices reach the same server; it is not a guarantee about the operator, who can still see connection metadata. Sync is not a substitute for a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) — it keeps devices in step, including propagating deletions, rather than preserving a fixed snapshot.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
