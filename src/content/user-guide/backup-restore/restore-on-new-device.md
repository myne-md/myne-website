---
title: "Restore on a new device"
category: "backup-restore"
updated: 2026-05-04
summary: "Bring an exported vault back on a fresh device. The flow is import-archive plus your password — the recovery phrase is only needed if the password was lost in transit."
tags: ["backup", "vault", "recovery"]
---

Restoring an archive on a new device replays the vault as it was at export
time. Everything between export and restore that lived only on the old
device is left behind.

## Import the archive

Install Myne. On first launch choose **Restore from archive** instead of
**Create new vault**. Point at the `.myn-archive` file. Myne reads the
header, confirms the format version, and prompts for the password.

### When the password is correct

The vault unlocks and you have your notes back. Sync state is reset; if you
were syncing to a server, you will need to re-pair the device with the same
account number. Account-pairing is covered in the *Settings & privacy*
section.

## When you also lost the password

You will need the recovery phrase as well. Without either, the archive is
exactly as opaque on this device as it would be on a stranger's. Treat
losing both as a permanently sealed file.

> Backups are insurance. Test your backup occasionally by restoring it to
> a clean install — that is the only way to know it actually works.
