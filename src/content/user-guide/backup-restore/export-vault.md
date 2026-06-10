---
title: "Back up your vault"
category: "backup-restore"
updated: 2026-06-10
summary: "Export the entire vault as a single encrypted backup file you can copy to external storage. The file stays exactly as encrypted as your vault — portable across devices, opaque to anyone without your password or recovery phrase."
tags: ["backup", "vault", "encryption"]
---

A vault backup bundles every encrypted note, your encrypted preferences, your
attachments, and the vault's version history into one file. Nothing is
re-encrypted and nothing is decrypted along the way — the backup carries the
same ciphertext that sits on your disk. Moving it to another device does not
expose the contents.

## How to back up

In **Settings → Storage**, choose **Back up vault…**. Pick a destination.
Myne writes a single file with the `.myne-backup` extension, then reads it
back and verifies every byte before reporting success — if the success
message appears, the file at the destination has been checked, not just
written.

### What ends up in the file

Every note (including notes in the trash), your vault preferences, your
attachments and their catalog, the vault's recent version history, and the
vault's metadata header. The search index is not included — it is a cache
Myne rebuilds automatically the first time you unlock the restored vault.

### What the file does and does not reveal

Note content, titles, tags, folder structure, and your timestamps are all
inside the encryption — a backup file reveals none of them. Like the vault
directory itself, the file does reveal coarse shape: roughly how many items
it contains, how large they are, and roughly when they were created. The built-in integrity checks exist to
catch accidental corruption (a failing USB stick, an interrupted copy); they
are not a tamper seal — the encryption itself is what protects the contents.

## Two things worth knowing

- **Backups outlive deletion.** Restoring an old backup brings back notes
  you permanently deleted after taking it. If you delete something sensitive,
  remember that older backup files still contain it.
- **Backups keep their unlock credentials.** A backup taken before a password
  change still opens with the old password, and your recovery phrase opens
  every backup of the vault, forever. Store backup files like you store the
  vault itself.

## What this is not

This is not a "share my notes" feature, and not the way to leave Myne — your
notes are plain markdown after decryption, no export tool needed for that.
The backup file is for *you*: moving a vault between devices, and insurance
against disk failure. Anyone who picks up the file without the password or
the recovery phrase cannot read it.
