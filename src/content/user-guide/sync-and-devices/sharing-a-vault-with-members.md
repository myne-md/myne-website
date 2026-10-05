---
title: "Sharing a vault with members"
category: "sync-and-devices"
updated: 2026-10-05
summary: "Invite other people into one shared vault. Each member joins with their own identity and credentials; your master password and recovery phrase never leave your control. Covers sharing, owner and member roles, inviting and accepting, unlocking your identity on a device, and what removal does and does not do."
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

1. Open **Settings → Sync**. At the top, under **Identity**, choose **Enter recovery phrase** and enter your recovery phrase if the identity is locked. Once unlocked on a device, the vault remembers the identity there (sealed with the vault's own key), so a later unlock of that vault installs it automatically and you are not asked for the phrase again. **Lock member identity**, in the **Vault members** panel below, stands it down until you unlock it again.
2. Share your own **identity code**, shown in the **Vault members** panel, with the person you are inviting. It contains only public information, never your phrase.
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

## Unlocking your identity on a device

Sync signs everything you push with your identity, so a shared vault syncs only while your identity is unlocked for the session. If it is not, the sync status reads **Unlock your identity to sync** with an action that opens the **Identity** block's recovery-phrase entry.

You only do this once per device. The first time you unlock the identity, the vault remembers it in a device-local file sealed with the vault's own key, so a later unlock of that vault installs it for you. To drop it, use **Lock member identity** in the **Vault members** panel (which stands it down until you unlock again) or **Forget this identity** (which erases the remembered copy). The remembered copy is never synced and never leaves the device.

Because that copy is sealed with the vault's own key, anyone who can unlock the vault on that device (your master password, or a quick-unlock PIN or biometric) can also act as your identity there. Myne records this trade-off in its threat model, and a later release will decouple the identity from the vault credential.

## Key changes

Myne does not yet show a key-change or owner-confirmed-relink state on the member list: identities are derived from the recovery phrase, so re-enrolling on a new device with the same phrase yields the same fingerprint rather than a key change. A future release will surface a genuine key change for out-of-band review. Until then, compare the fingerprint shown for a member out of band if you need certainty about who they are.

## Removing a member

Only the owner can remove a member. Removing someone rotates the vault's keys, so they no longer receive future changes, and the server stops accepting their access.

## Limits

- **Removal stops future access only.** It cannot erase anything a removed member already synced, copied, or exported, and it does not recall content from their device or their AI provider. Anyone who already holds a copy of the vault keeps it.
- **There is no viewer role.** Every member can read and write. If you need someone to look without changing anything, sharing is not the tool for that today.
- **Authorship is attributable, not preventable.** Each sync push is signed, so a change can be traced to the person who pushed it. That is attribution at push granularity, not a block on what a member can do, and it is not a per-note signature.
- **AI provider settings are shared, writable, and each member's consent is their own.** A shared vault's preferences sync, so the AI provider, the provider key and the chosen model are part of the shared vault settings. Every member of the vault can read them **and change them**: there is no owner of the provider key and no per-member copy of it, so the key that sends your notes is whichever one the shared settings currently hold, and another member can replace it. Whether to send to that provider at all is a per-device consent, and each member grants it on their own device, but consent is not authorship: consenting on one device does not pin the key that device will use. Treat a shared vault's provider credential as visible to everyone in the vault and changeable by everyone in it. The practical consequence is that a provider key another member pasted badly, with a stray line break from a copy out of a terminal, leaves every member who has consented to send unable to send, until it is replaced. Myne does not repair a key on your behalf and cannot show you the stored one, so the fix is for a member to paste a fresh one from the provider's own page, and the other members see the effect of that paste the way they see any other shared setting.
- **A removed member's private AI profile is scheduled for deletion after a retention period**, an operator policy rather than a cryptographic guarantee; anything they already copied is not recalled.
- **The identity list and the membership graph.** Your sync server knows only the pseudonymous account-to-vault mapping, the accepted exposure described in [How sync works](/user-guide/sync-and-devices/how-sync-works/); it reads no names, no fingerprints, and no note content.
- **Sharing is not on the web client.** Myne in a browser does not offer member sharing, because it depends on the recovery phrase as a credential, which does not belong in a served page.
