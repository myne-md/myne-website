---
title: "Restore from a backup"
category: "backup-restore"
updated: 2026-06-10
summary: "Bring a vault back from a .myne-backup file — on a fresh device or next to your existing vaults. Unlocking the restored vault works exactly like unlocking the original: your password alone, or your recovery phrase alone."
tags: ["backup", "vault", "recovery"]
---

Restoring a backup recreates the vault exactly as it was at export time.
Everything you wrote after taking the backup lives only where you wrote it —
a restore never silently merges or overwrites; it brings back a faithful
copy.

## On a fresh device

Install Myne. On first launch choose **Restore from backup** instead of
**Create new vault**, and point at the `.myne-backup` file. Myne verifies the
file's integrity before touching anything, then adds the vault — locked, like
any other vault.

## On a device that already has vaults

The same entry point appears in the vault list and in **Settings → Storage →
Restore from backup…**. If the backup belongs to a vault that already exists
on this device, Myne detects it and asks what you want: **keep both**
side-by-side, or **replace the existing vault** — replacement happens only
after the restore has fully succeeded, so a failed restore never costs you
the original.

## Unlocking the restored vault

Exactly like unlocking the original: your master password alone works, and
your recovery phrase alone works. Both unlock paths travel inside the backup.
One caveat — the backup remembers the credentials *as of export time*: if you
changed your password after taking the backup, the restored vault opens with
the **old** password (or the recovery phrase, which never changes).

## If the file is damaged

Myne rejects a damaged backup before anything is restored and tells you so.
If it is all you have, an explicit *salvage* option recovers the intact notes
and lists exactly what could not be read — a salvaged restore is always
labeled as partial, never passed off as complete.

> Backups are insurance. Test yours occasionally by restoring it — with
> "keep both", a test restore sits harmlessly next to your real vault, and
> that is the only way to know the backup actually works.
