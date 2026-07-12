---
title: "Managing devices"
category: "sync-and-devices"
updated: 2026-07-11
summary: "View the devices on your account and remove one. Covers what the device list shows, the honest meaning of removing a device (it revokes sync access but is not a remote wipe), recovering a device that was removed elsewhere, and resetting sync locally without touching your notes."
tags: ["devices", "sync", "security"]
---

The **Devices** section of **Settings → Sync** lists the devices connected to your account and lets you approve pending ones or remove ones you no longer want syncing. Before removing a device, it is worth being precise about what removal does and does not do — the honest answer is narrower than "kick it off," and this page states it plainly.

## The device list

Under **Settings → Sync → Devices**, you see:

- **Your devices** — the approved devices on the account. The one you are using is marked **This device**. Until you can rename devices, each shows a short default name derived from its identifier.
- **Awaiting approval** — devices that have connected with a password and are waiting for an existing device to approve them. Approving one starts the verification-code compare described in [Add a device](/user-guide/sync-and-devices/add-a-device/).

## Removing a device

Removing a device revokes its sync access: the server stops syncing to it. That is the whole of what removal does. It is **not** a remote wipe, and it does **not** lock a device that already has your vault and password — that device keeps whatever it already synced. Remove a device you no longer use to stop it receiving further updates, but do not treat removal as a way to reach into a lost or stolen device.

To remove a device, find it under **Your devices** and choose **Remove**. The current device shows no Remove action against itself.

## When a device was removed elsewhere

If this device was removed from your account on another device, its sync will start being refused, and the Devices panel says so and offers **Reset and re-add this device**. Resetting clears this device's stale sync credentials so you can add it again from scratch.

## Resetting sync on this device

If sync gets stuck with a rejected credential, the panel offers **Reset sync on this device**. This clears the device's local sync token and its sync baseline so it can be re-added. It never touches your notes and makes no changes on the server — it only resets this device's local sync state. If the trouble is instead that the server moved or its certificate changed, re-enter the server URL under **Sync server** to re-trust it rather than resetting.

## Limits

Removing a device is an availability control, not a cryptographic one. Because Myne's v0.1 keys have no forward secrecy, revoking a device's sync token cannot cryptographically claw back the notes it already holds, and there is no remote wipe — a removed or compromised device retains whatever it synced before removal. If a device is lost and you are worried about its contents, rely on its own device lock and your vault's [auto-lock](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/), and change your password if you believe your credentials are exposed. The at-rest strength of your vault does not depend on the sync token: the token authorises a device to sync, it does not wrap or unlock your notes.
