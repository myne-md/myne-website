---
title: "Export your vault"
category: "backup-restore"
updated: 2026-05-04
summary: "Export the entire vault as a single encrypted archive you can copy to external storage. The archive is the same format the auto-backup writes — portable across devices, opaque to anything that does not have your key."
tags: ["backup", "vault", "encryption"]
---

Vault export bundles every encrypted note plus the vault metadata into one
file. The file is still encrypted with your vault key — moving it to another
device does not expose the contents.

## How to export

In the app menu, choose **Vault → Export**. Pick a destination. Myne writes
a single file with the `.myn-archive` extension. The file extension is the
only thing that signals what is inside; the bytes themselves do not leak the
note count, titles, or tags.

### What ends up in the file

Every note in the vault, the encrypted metadata index, and a small header
that identifies the archive format version. Sync state and local UI
preferences are not included — those are not portable.

## What this is not

This is not a "share my notes" feature. The archive is for *you* moving
state between devices, or for offline backups. Anyone who picks up the file
without the password and the recovery phrase cannot read it.
