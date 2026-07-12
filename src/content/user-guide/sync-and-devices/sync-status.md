---
title: "Reading sync status"
category: "sync-and-devices"
updated: 2026-07-11
summary: "How to read the sync status indicator and the banners: the coloured status dot and its states, the manual sync-now action, the catching-up notice after a device was offline, the building-search-index state, and the honest integrity alert when Myne rejects out-of-date or altered data."
tags: ["sync", "security"]
---

Sync surfaces its state in one place and a few banners. The status indicator in **Settings → Sync** tells you whether the device is synced, working, or needs attention; a small set of banners appear when something worth explaining happens. This page covers how to read each.

## The status indicator

Under **Settings → Sync → Sync status**, a coloured dot and a short label show the current state:

- **Sync off** — no server is configured. Nothing syncs.
- **Not enrolled** — a server is set, but this device is not yet a member of the account. Add it (see [Add a device](/user-guide/sync-and-devices/add-a-device/)).
- **Awaiting approval** — this device is connected but waiting for an existing device to approve it.
- **Synced** — this device is up to date.
- **Syncing…** — a sync is in progress.
- **Sync error** — the last sync did not complete.
- **N conflicts to review** — the same note was edited on two devices; resolve them in [Resolving conflicts](/user-guide/sync-and-devices/resolving-conflicts/).

A **Sync now** button triggers an immediate sync. It is hidden when there is nothing to trigger — when sync is off, when the device is not enrolled, or while it is awaiting approval.

## The catching-up notice

If a device has been offline for a while, its next sync may do a fuller reconcile to catch up. During that, a reassuring, dismissable banner appears: it says the device was offline for a while and is catching up, and that your notes are safe. It is informational, does not block the editor, and never implies data loss.

## Building the search index

After a full reconcile or a fresh device enrolment, Myne rebuilds the device's local [search](/user-guide/find-and-connect/search/) index rather than syncing it (the index is a rebuildable cache, not synced content). While that runs, you may see a **Building search index…** state. Search works normally once it finishes.

## The integrity alert

If Myne rejects data because it looks out of date or altered — for example a server serving an older version than your device already has — it raises a hard, honest alert rather than accepting it quietly. The alert states that there is a *possible* sync integrity problem, that the server may have sent out-of-date or altered data which Myne did not accept, and that your local notes are safe, and it suggests verifying your devices if it keeps happening. It is acknowledgeable and does not block your work.

## Limits

The integrity alert is deliberately worded as a *possible* problem, not a proof of tampering. Myne can catch some dishonest-server behaviour — such as rolling your own edits backward — but it cannot in general detect a server that simply withholds the newest update, so a quiet "nothing new" is not something the alert can flag. Treat the alert as a prompt to compare your devices, not as a general tamper-detector. The absence of an alert is not a positive proof that the server is behaving. The full model is in [How sync works](/user-guide/sync-and-devices/how-sync-works/).
