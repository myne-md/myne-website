---
title: "Sharing a vault with members"
category: "sync-and-devices"
updated: 2026-09-18
summary: "Invite other people to work in one shared vault with you. Each member joins with their own identity and their own credentials; your master password and recovery phrase never leave your control. Covers what sharing is, the owner and member roles, what a member can see, and the current limits."
tags: ["devices", "sync", "security"]
---

A Myne vault can be shared with the people you work with. Each member joins the vault with their own identity and their own credentials. Your master password and your recovery phrase stay yours: nobody you invite ever needs either one.

## What sharing is

Sharing is per person. Each member holds their own identity: a keypair that is established on the device where they first unlock it and sealed under their own recovery phrase. A member keeps their own master password and their own recovery phrase.

## Adding a member

The invite is minted on your device: Myne wraps the vault's content key to the member's public identity and signs the result. The member's public identity is entered from their own Myne. The invitation is then handed to the member through the shared sync server.

The invited member applies the invite from their own Myne and unlocks the shared vault with their own credentials. They never need your master password or your recovery phrase.

## What a member can see

Every member of a shared vault can read and write the vault's notes and attachments, because they hold the vault's content key. The member list itself (who else is in the vault) is carried inside the encrypted vault metadata, so the server does not read it.

## Roles: owner and member

A shared vault has exactly one owner: the person who created it. Everyone else is a member. The member list in Settings → Sync marks each person with their role.

Roles are administrative, not cryptographic. A member can read and write everything in the vault, just like the owner; there is no read-only viewer role. The difference is administration: only the owner can invite new members, and a member is never shown an invite control they cannot use.

## Limits

- **There is no viewer role.** Every member can read and write. If you need someone to look without changing anything, sharing is not the tool for that today.
- **Edits carry no signature.** Nothing records who changed a note, so one member's edit is indistinguishable from another's. Signed authorship arrives with a later update.
- **Member removal is currently disabled.** Inviting members and viewing the member list work. Removing a member is disabled in the app until the roster synchronization ships.
- **Losing a device loses that person's identity.** A member's identity lives on the device where it was established. Their recovery phrase unwraps it on that same device; on a new device the phrase establishes a fresh identity, which the vault owner must invite again.
- **Device loss, for you as the vault owner, is separate.** Your own master password and recovery phrase still recover the vault itself, exactly as without sharing.
- The list of members in a shared vault is visible to your sync server only as opaque ciphertext: it can see that the vault metadata grew and that it is marked as a shared vault, consistent with [how sync works](/user-guide/sync-and-devices/how-sync-works/).
- Sharing across several people requires sync. A vault that has never been synced cannot have members.

## Related reading

- [Managing devices](/user-guide/sync-and-devices/managing-devices/) for the device-level view of who is connected, and what removing a device does.
- [How sync works](/user-guide/sync-and-devices/how-sync-works/) for the zero-knowledge boundary the server sees.
