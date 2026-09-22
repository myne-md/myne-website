---
title: "Sharing a vault with members"
category: "sync-and-devices"
updated: 2026-09-22
summary: "Invite other people to work in one shared vault with you. Each member joins with their own identity and their own credentials; your master password and recovery phrase never leave your control. Covers what sharing is, the owner and member roles, inviting and accepting, key-change checks, and what removal does and does not do."
tags: ["devices", "sync", "security"]
---

A Myne vault can be shared with the people you work with. Each member joins the vault with their own identity and their own credentials. Your master password and your recovery phrase stay yours: nobody you invite ever needs either one.

## What sharing is

Sharing is per person. Each member holds their own identity, a keypair derived from their own recovery phrase, so the same phrase gives the same identity on every device they own. The vault's content key is wrapped to each member separately; the vault's own recovery phrase and master password are never shared.

A shared vault has exactly one owner, the person who created it, and zero or more members. The member list is carried inside the encrypted vault metadata: your sync server relays it but cannot read it.

## Before you start

- Sharing requires sync. A vault that has never been synced cannot have members.
- The owner and each invited person need a Myne identity. An identity can be created on its own, without a personal vault, from the welcome screen.

## Invite someone

1. Open **Settings → Sync → Members & Security**. On a first visit, unlock your member identity with your recovery phrase. It stays on your device until you lock the vault or close the app.
2. Share your own **identity code** with the person you are inviting. It contains only public information, never your phrase.
3. Ask them for their identity code and paste it into the invite field. Nothing leaves your device yet.
4. Check the fingerprint the code produces against the one the other person reads you. Confirm it explicitly before continuing.
5. Confirm. Your device seals the invite and posts it to the relay; the recipient is told when an invite is waiting.
6. The member list shows each invitation you sent as accepted or not accepted yet. A member rotates from "not accepted yet" to "accepted" once that person takes the invite.

## Accept an invite

1. Open Myne. At zero vaults, an identity-only home shows the invites addressed to you.
2. Paste the owner's identity code and check the fingerprint it produces against the one the owner reads you. Confirm it explicitly.
3. Enter your own recovery phrase to finish. The shared vault unlocks as a member. You keep your own credentials, and you are never shown an owner-only control.

## After acceptance

Every member of a shared vault can read and write the vault's notes and attachments, because they hold the vault's content key. Roles are administrative, not cryptographic: there is no read-only viewer role, and a member can change anything the owner can.

A member vault has no password of its own. On a later start you unlock it with your recovery phrase, the same phrase as your identity.

## Key changes

If a member's identity changes (for example, after re-enrolling on a new device), the member list shows it as a key change you have not yet vouched for. Check the new fingerprint with that person out of band. Once you confirm it, the row is marked as relinked by the owner. A cryptographic key change and an owner-confirmed relink are shown differently on purpose.

## Removing a member

Only the owner can remove a member. Removing someone rotates the vault's keys, so they no longer receive future changes, and the server stops accepting their access.

## Limits

- **Removal stops future access only.** It cannot erase anything a removed member already synced, copied, or exported, and it does not recall content from their device or their AI provider. Anyone who already holds a copy of the vault keeps it.
- **There is no viewer role.** Every member can read and write. If you need someone to look without changing anything, sharing is not the tool for that today.
- **Authorship is attributable, not preventible.** Each sync push is signed, so a change can be traced to the person who pushed it. That is attribution at push granularity, not a block on what a member can do, and it is not a per-note signature.
- **A member's private AI settings stay private.** Their AI provider choice, provider credential, and consent are stored only on their own devices; they are never shared with the vault or the other members.
- **A removed member's private AI profile is scheduled for deletion after a retention period**, an operator policy rather than a cryptographic guarantee; anything they already copied is not recalled.
- **The identity list and the membership graph.** Your sync server knows only the pseudonymous account-to-vault mapping, the accepted exposure described in [How sync works](/user-guide/sync-and-devices/how-sync-works/); it reads no names, no fingerprints, and no note content.
- **Sharing is not on the web client.** Myne in a browser does not offer member sharing, because it depends on the recovery phrase as a credential, which does not belong in a served page.
