---
title: "Add a device"
category: "sync-and-devices"
updated: 2026-07-11
summary: "Connect another device to your account and approve it. Covers joining from a fresh device or enrolling one that already holds the vault, entering your account number with as-you-type formatting, and comparing a verification code between the two devices before they sync."
tags: ["devices", "sync", "recovery"]
---

Adding a device connects it to your account so it syncs the same notes. A device you add with your password waits until a device that already has access approves it, and both devices then compare a short verification code to confirm they are on the same account. This page covers both ends of that flow.

## Prerequisites

- Sync already turned on for the account (see [Turn on sync](/user-guide/sync-and-devices/turn-on-sync/)).
- Your account number, and either your password or your 24-word recovery phrase.
- The sync server URL.

## On the new device

There are two starting points, depending on whether the device already has your vault:

- **A fresh device with no vault.** On the welcome screen, choose **Add this device to an account**. Enter the sync server URL, your account number, and your password. Myne fetches your encrypted vault from the server, unlocks it, and connects the device. This path does not need your recovery phrase.
- **A device that already has the vault.** Open **Settings → Sync**. If the device is not yet a member of the account, an **Add a device** section appears. Enter your account number, then sign in with either your **password** or your **recovery phrase** (a 24-cell grid — you can paste all 24 words at once to distribute them).

As you type your account number, Myne formats it for you (grouping and the `MY-` prefix), so you can type or paste it in whatever form you have it.

When you submit, the device connects and — for the password path — shows that it is **waiting for approval**. Keep that window open. The first device on an account, and any device added with the recovery phrase, self-approve and skip the wait.

## Approve it from an existing device

On a device that already has access:

1. Open **Settings → Sync** and find the new device under **Devices**, listed as awaiting approval.
2. Choose **Approve**.
3. Myne then shows a **verification code** for the new device. This is the out-of-band check: compare it against the code shown on the new device.
4. If the codes match, choose **They match**. If they do not, choose **They don't match**, which removes the device — a mismatch can mean the server tried to seat a device you did not add.

## Confirm on the new device

A device you joined from the welcome screen shows the same **verification code** once it is approved and finishes its first sync. Compare it with the code on the approving device:

- **They match — continue** finishes joining, and the device starts syncing.
- **They don't match — remove this device** stops the device trusting the synced data and undoes the join.

## Limits

The verification code is what protects a newly added device: a fresh device has no prior history to check against, so on its first sync it cannot detect a rolled-back or forked history on its own. Comparing the code out of band — reading it off both screens — is the step that closes that gap, which is why a mismatch removes the device rather than continuing. Adding a device with your recovery phrase self-approves and so skips the pending gate; that is a deliberate, accepted trade-off. Approving a device grants it ongoing sync access to your account's notes; if you later remove it, that revokes access going forward but does not reach back into what the device already holds (see [Managing devices](/user-guide/sync-and-devices/managing-devices/)).
