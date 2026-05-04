---
title: "Privacy defaults"
category: "settings-privacy"
updated: 2026-05-04
summary: "Encryption is on by default and cannot be turned off. There is no plaintext mode. There is no email field at signup. The defaults are the contract — settings only adjust ergonomics, never the privacy floor."
tags: ["privacy", "encryption", "defaults"]
---

Myne does not have a "privacy mode" toggle. Encryption is the only mode. The
defaults are the floor; the settings panel only changes things you can
adjust without weakening the floor.

## What is fixed

Encryption at rest. No email at signup. Account number derived from the
key, not from anything we collect. Sync layer never sees plaintext.

### Why these are not toggles

If we offered a "skip encryption for speed" switch, somebody would flip it
and not turn it back on. The only way to deliver the privacy claim
consistently is to refuse to give people a way to break it.

## What you can adjust

Editor theme, font size, default vault location on disk, sync server URL
(if self-hosting), and timeout before the vault auto-locks. None of these
change what the server can see or what is stored unencrypted.

> The threat model document on the public spec describes the full set of
> guarantees. Settings live underneath those guarantees, never above them.
