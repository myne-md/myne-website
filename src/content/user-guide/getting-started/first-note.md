---
title: "Write your first note"
category: "getting-started"
updated: 2026-05-04
summary: "Once the vault is unlocked, writing a note is plain markdown. The note is encrypted before it touches disk, and any sync layer never sees the plaintext."
tags: ["vault", "markdown", "onboarding"]
---

With the vault unlocked, the editor opens to an empty document. Type
markdown, hit save, done. The file extension on disk is `.myn`, not `.md` —
the bytes are encrypted, so a regular markdown reader cannot open them.

## How saving works

Each save encrypts the note with a per-note key derived from your vault's
master key, then writes it to disk. The plaintext never lives outside RAM.

### When you sync later

If you connect to a sync server (Phase 1 hosted or self-hosted in Phase 2),
the encrypted blobs travel; the server stores opaque ciphertext keyed by
account number. The server cannot decrypt your notes, and it cannot list the
titles either — titles live inside the encrypted body.

## What is not in scope yet

Live multi-device sync is Phase 1; collaborative editing is not on the
roadmap. Notes are single-user by default, and that is intentional.
