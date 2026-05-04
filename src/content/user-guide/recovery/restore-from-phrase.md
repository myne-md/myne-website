---
title: "Restore from your phrase"
category: "recovery"
updated: 2026-05-04
summary: "Walks through the mechanical steps to bring a vault back from the 24-word recovery phrase. The same procedure works whether you forgot the password or are setting up on a new device."
tags: ["recovery", "phrase", "vault"]
---

The recovery flow is the same in both cases — forgotten password on the
existing device, or fresh device with the phrase in hand.

## On the unlock screen

Choose "Restore from recovery phrase". You will see 24 numbered text fields.
Type each word as written. Order matters; spelling matters. Myne checks each
word against the BIP-39 list as you type.

### When the words are validated

Once all 24 are accepted, you set a new password. The new password will
derive the same encryption key the original did, because both passwords pass
through the same key-derivation function fed with the phrase.

## After restoration

The vault opens with whatever notes were synced or stored locally. If you are
on a new device that has never synced, the vault is empty until you connect
to a sync server. There is no "import from another device" mode that
bypasses sync.

### What did not get restored

A new password. Sync state needs to be re-established if this is a new
device. Local-only drafts that were never synced and only existed on the
old device are gone — Myne is not a backup service.
