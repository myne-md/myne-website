---
title: "Storage and account limits"
category: "sync-and-devices"
updated: 2026-10-18
summary: "The Storage and devices block in Sync settings shows encrypted data stored against a ceiling, your signed-in device count against a cap, and a frozen badge when uploads are paused. It also covers the refusal states — over your limit, an oversize file, a frozen account — where your device keeps downloading but uploads are held, so nothing is lost."
tags: ["sync", "devices", "settings", "security"]
---

The **Storage and devices** block in **Settings → Sync** shows how much encrypted data your account stores on its server, how many devices are signed in, and whether an operator has frozen the account. This page explains how to read those figures and the sync-refusal states you can reach — being over your storage limit, trying to sync a file the server will not accept, or a frozen account — each of which pauses uploads while your device keeps downloading, so nothing you have written is silently lost.

## When the block appears

The block reads its figures from your account's server, so it appears only once sync is set up and the server reports usage. A server that reports no limits shows your figures without a meter; a server too old to report usage at all shows no block. Either way this is an ordinary state, not an error — see the [Limits](#limits) below.

The figures are read once when you open the panel; they reflect what the server was enforcing at that moment rather than a live gauge. Reopen **Settings → Sync** to refresh them.

## Storage

The **Storage** row shows the encrypted data stored for your account against its ceiling, with a small meter beneath it. The number counts ciphertext — the server stores only encrypted blobs it cannot read, so this is a measure of size, not of anything readable (see [How sync works](/user-guide/sync-and-devices/how-sync-works/)).

When your account has no ceiling, the row shows the amount stored with no meter and no limit language. There is nothing to measure against, so Myne does not invent a bar.

## Devices

The **Devices** row shows the devices signed in to your account against the cap on how many may be enrolled at once. The count is an availability figure — the same one the server already sees — not a measure of anything readable. If you are at the cap, remove a device you no longer use to free a slot before adding another — see [Managing devices](/user-guide/sync-and-devices/managing-devices/).

## When the account is frozen

An operator can freeze an account. While it is frozen, the block shows a badge that reads: "This account is frozen. New changes can't be uploaded; your notes still download." A freeze pauses uploads and blocks enrolling a new device; it never blocks downloads, and it does not let the server read or forge your notes. The notes already on this device are unaffected.

A freeze is one of two things an operator can do to a hosted account on a substantiated report; the other is to delete the account. Neither can reach a single note — the server cannot tell your notes apart, so it acts on the whole account or not at all. The beta terms say what the server's operator can see and do, and each device accepts them before it first syncs (see [Add a device](/user-guide/sync-and-devices/add-a-device/)).

## When sync refuses to upload

There are a few states in which the server accepts your device's downloads but refuses its uploads. In each one the [sync status indicator](/user-guide/sync-and-devices/sync-status/) names the reason rather than showing a generic error, and your device keeps pulling other devices' changes — only pushing your own is held:

- **Over your storage limit**: the status reads "Storage full: uploads paused." Your account is at its storage ceiling, so no new encrypted data can be stored. Your local edits stay on this device and upload once you are back under the limit.
- **A file too large to upload** — the status reads "A file is too large to upload." A single note or attachment is larger than the server accepts in one piece. That item stays on this device and will not sync until it is smaller; the rest of your notes continue to sync normally.
- **A frozen account**: the status reads "Account frozen: uploads paused," matching the badge above.

In all three, uploads are held, not discarded. A refusal does not drop the change you made and does not delete anything already on this device; the held changes upload once the condition clears.

There is a fourth state that reads almost the same and is not about your account at all: **Storage full: syncing paused** means the disk of the machine you are on is full. Nothing on the server is over its ceiling, and freeing space on the device is what clears it. The two labels are worded differently on purpose, because only one of them is fixable from an account page.

## Limits

These are the server's availability limits, not properties of your encryption. Myne states what they do and do not cover, and does not claim more:

- **The figures are usage metadata, not a new exposure.** Counting your stored ciphertext bytes and your device count does not require reading your notes, and both figures are the same usage metadata the operator can already see, described in [How sync works](/user-guide/sync-and-devices/how-sync-works/). The meter shows a size, never content.
- **The numbers are the server's own report.** They are the server's accounting of your account, read once when you open the panel. A server you do not run reports its own figures; treat them as its bookkeeping, not an independent guarantee, and reopen the panel to refresh them.
- **A freeze is an availability control, not a cryptographic one.** An operator can pause what your account uploads, block a new enrolment, and — on a substantiated report — delete the account outright. None of that lets the server read or forge your notes, and none of it reaches the notes already on this device. Downloads are never blocked by a freeze, so a frozen account keeps receiving other devices' changes. Keep your own [backups](/user-guide/safety-and-recovery/back-up-your-vault/) if an account you do not run holds your only copy.
- **Refusing an upload does not lose it.** A quota, oversize, or freeze refusal holds your change on this device; it does not delete it and does not silently drop it. This is not a durability promise for the vault as a whole — for that, keep your own [backups](/user-guide/safety-and-recovery/back-up-your-vault/).
- **A self-hosted server may set no limits at all.** When it does, there is no ceiling, meter, or limit language to show, and a server predating this feature shows no block. That is the ordinary self-hosted state, not a degraded one.
