---
title: "Back up your vault"
category: "safety-and-recovery"
updated: 2026-06-18
summary: "How to export an encrypted backup of your vault, what the backup file contains, and how to build a backup habit that protects your notes."
tags: ["backup", "vault"]
---

A backup is your protection against losing the vault files themselves: a disk dying, a laptop lost, a folder deleted by accident. Myne exports your vault as a single encrypted `.myne-backup` file that you keep somewhere safe. This article covers making one, what it contains, and the limits of what it protects.

![The Storage settings panel showing the back-up controls for the vault.](./back-up-your-vault.png)

## Making a backup

You can export a backup from three places:

- **Settings → Storage**.
- The **Back up vault…** command in the palette.
- The **Back up this vault now** button on the Ready screen, right after creating a vault.

Choose where to save the file. When the export finishes and Myne has checked it, you see **Backup verified and saved.** The file existing means it was written and verified. The file's name is one you choose; it is not tied to your vault's label.

## What's in the file

The backup is a **byte-for-byte copy** of your vault's encrypted files (your notes, attachments, and the vault's keys-as-stored) bundled into one file. (The search index isn't included; Myne rebuilds it on first unlock.) Because it is the same encrypted bytes, it opens **with your password or your recovery phrase**, exactly like unlocking the vault: not with the phrase only, and not with anything Myne keeps.

The backup carries checksums, but they exist to **detect accidental corruption** (a truncated download, a bad sector) at export and restore time. They are not a tamper seal: they prove nothing about who made the file, and a backup is no safer "forever" than the place you keep it. What an onlooker can tell from the file is the same as from your vault folder, how many items it holds and their sizes, never your titles, content, or when you wrote them.

## What a backup does not protect you from

A backup is a copy frozen at the moment you made it, and that has three consequences worth understanding before you rely on one:

- An **old password opens old backups**. After you change your password, every backup taken before the change still opens with the old password.
- The **recovery phrase opens every backup of the vault, forever**. The phrase never changes, so it unlocks any backup you have ever made.
- **Restoring resurrects permanently-deleted notes**. A backup made before you deleted a note still contains it, so restoring that backup brings the note back.

And the file itself is a new copy of your encrypted data living wherever you put it (a USB stick, a synced folder) outside Myne's sight. Treat a backup like a spare key to the vault, because that is what it is.

## A backup habit

You can let Myne keep the habit for you. **Settings → Storage** has an **Automatic backups** block: turn it on, pick a **frequency** (Every unlock, Daily, or Weekly), choose a **backup folder**, and set **Keep last** to how many backups to retain (7 by default). A **Last backup** line shows when the most recent automatic backup ran, or that none has yet. The manual **Back up vault…** control still works exactly as before, alongside the schedule.

How the schedule works, stated plainly:

- It runs **only while the app is open and the vault is unlocked**. There is no operating-system-level scheduling and no backup while the app is closed or the vault is locked. The check is an opportunistic elapsed-time one — Myne looks at whether enough time has passed when you unlock and roughly every five minutes while you keep working, so a missed window catches up on your next unlock rather than firing on a fixed clock.
- If the target folder is missing or can't be written, the **Last backup** line shows the failure plainly — it is never silent — and the schedule **stays on** so it retries on the next cycle. Myne does not quietly turn the schedule off.
- **Nothing is sent off your device.** There is no email and no cloud delivery; the schedule only writes a backup file to the folder you chose. If you want a copy offsite, point the folder at one your own file-sync handles, or copy the file yourself.

A few habits still worth keeping, scheduled or not:

- Back up **before you change your password**, on top of whatever the schedule does.
- **Occasionally test a restore**: bring a backup back with "Keep both" (see [Restore from a backup](/user-guide/safety-and-recovery/restore-from-a-backup/)) and confirm it opens, so you find a problem before you need the backup for real.
- **Store at least one copy on a different disk** than the vault, so one failure doesn't take both.

### How the schedule is stored

The schedule settings live in a small **plaintext file on this device** that records the target folder's path and a list of the backups Myne itself has written. That file is plaintext because it only holds a folder location and filenames — the backups it points at are the same encrypted bytes as your vault, so a known location reveals nothing about your notes. Because the settings are tied to a device-specific folder, they do not travel between devices: you set the schedule up once per device. The **Keep last** count prunes only the backup files Myne wrote on this schedule — a file you put in that folder yourself is never touched.

## Limits

A backup protects against losing your vault files; it does not protect against losing your credentials. That's what your [recovery phrase](/user-guide/getting-started/your-recovery-phrase/) is for. If you change your password, make a fresh backup and don't rely on the old ones being opened by a password you've moved on from.
