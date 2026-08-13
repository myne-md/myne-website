---
title: "Clean up leftover files"
category: "safety-and-recovery"
updated: 2026-08-13
summary: "What leftover files are, when Myne offers to clean them up, and what the cleanup does and does not touch in your vault."
tags: ["vault", "security"]
---

Sometimes a vault deletion is interrupted partway (the app is force-quit, the machine loses power) and a few files are left behind. Myne notices this and offers to clean them up. This article explains what they are and why the cleanup is safe.

## When you see the offer

If leftover files are found, a banner appears on the Welcome screen: **Leftover files from an incomplete deletion**. It tells you how many there are and offers to clear them.

## Why it only asks once

The leftover files are unreadable junk. When a vault is deleted, its keys go first, so anything left behind is already encrypted bytes with no way to decrypt them: there is nothing recoverable in them. That's why the cleanup asks for a single confirmation rather than a stern warning: in Myne's own words, **they're already unreadable; nothing recoverable is lost**. Confirm and Myne removes them.

## If some can't be removed

If some files can't be cleared, Myne says how many rather than pretending they are gone, and names the usual cause: another program — antivirus, file sync, or search indexing — is holding them open. Close that program and run the cleanup again, or remove the vault folder yourself with your file manager. Since the files are unreadable, deleting them by hand is safe.

## Limits

This is housekeeping, not recovery: cleaning up leftover files removes dead bytes from an interrupted deletion. It never touches a live vault, and there is nothing to recover from the files it clears.
