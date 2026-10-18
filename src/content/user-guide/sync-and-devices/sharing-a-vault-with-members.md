---
title: "Sharing a vault with members"
category: "sync-and-devices"
updated: 2026-10-18
summary: "Invite other people into one shared vault. Each member joins with their own identity, sets a password for their own device and picks the name the others see; your master password and recovery phrase never leave your control. Covers roles, inviting and accepting, names in the member list, and what removal does and does not do."
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

1. Open **Settings → Sync**. At the top, under **Identity**, choose **Unlock** and enter your recovery phrase if the identity is locked. Once unlocked on a device, the vault remembers the identity there (sealed with the vault's own key), so a later unlock of that vault installs it automatically and you are not asked for the phrase again. **Lock member identity**, in the **Vault members** panel below, stands it down until you unlock it again.
2. Share your own **identity code**, shown in the **Vault members** panel, with the person you are inviting. It contains only public information, never your phrase.
3. Ask them for their identity code and paste it into the invite field. Nothing leaves your device yet.
4. Choose **Invite member**. On a vault that is not shared yet, Myne first states that sharing it is permanent and asks you to confirm; then your device seals the invite and posts it to the relay, and the recipient is told when an invite is waiting. There is no fingerprint to compare before sending.
5. Once the invite is sent, the panel shows the invited member's fingerprint, which you can read to them to confirm the invite went to the right person.
6. The **Invitations you sent** list shows each invitation as accepted or not accepted yet. A member moves from "not accepted yet" to "accepted" once that person takes the invite.

## Accept an invite

1. Open Myne. At zero vaults, an identity-only home shows the invites addressed to you, each named by the vault's account hash.
2. Open the invite. Myne asks for the owner's identity code, so paste the code they shared with you. It is checked against the invite when you accept, and a code that does not match is refused. There is no out-of-band fingerprint comparison in this flow, and no owner name to confirm.
3. Enter your own recovery phrase. This is your phrase, not the vault owner's.
4. Choose a password for this vault **on this device**. It is separate from the owner's password and from your recovery phrase: it opens this shared vault here, and your phrase stays the portable way back in. Myne checks it against its minimum strength as you type, and on the desktop the field labels how strong it is, from **Too weak** to **Strong**.
5. Choose a display name. This is what the other members see beside your fingerprint in the member list. Myne asks for it before the accepted vault reaches the editor, and skips the question when the vault's list already holds a verified name for you, as it does if you were invited to a vault you are already named in.

The shared vault then unlocks as a member. You keep your own credentials, and you are never shown an owner-only control.

## Your name in the member list

Every row of the **Vault members** panel (Settings → Sync) follows one rule: the name when that member has one, the short fingerprint when they do not, and the role badge either way. A row with no name is still identified, just less usefully, which is why the name step is part of accepting.

A name is **per vault**, not per person. The same person can be called one thing in your vault and something else in another they belong to, and nothing about it follows them between vaults. Your own name syncs to the other members, so they see it without you telling them.

You can change your name later from your own row, or clear it and go back to the fingerprint. A name is a label rather than a credential. It is signed by the person it names, which stops another member claiming your row, and the list marks a name it could not verify rather than showing it as that member's name. It still proves nothing about who a person is beyond the key they hold, so compare fingerprints out of band when identity matters.

## After acceptance

Every member of a shared vault can read and write the vault's notes and attachments, because they hold the vault's content key. Roles are administrative, not cryptographic: there is no read-only viewer role, and a member can change anything the owner can.

When you and another member have the same note open at the same time, you see each other's cursors, selections and names as you type. See [Live collaboration](/user-guide/sync-and-devices/live-collaboration/) for what is shown and what it does and does not prove.

The password you chose when you accepted is stored on this device only, and it is not the owner's password. On a later start the Unlock screen says the vault is shared with you and asks for the password you set here. Your recovery phrase still opens the vault anywhere, and on a new device the password has to be set again.

To change that password, replace it with a PIN or a device biometric, or remove it and go back to the phrase, use **Settings → Privacy → Shared vault unlock**. If you accepted an invite before that step existed, the vault asks for your recovery phrase every time until you set one, and the row says so. The stored copy also carries your identity, so a leaked shared-vault password would open your identity in your other vaults too; leave it off if a stolen device is part of your threat model.

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
- **Authorship is attributable, not preventable.** Each sync push is signed, so a change can be traced to the person who pushed it. The note's [version history](/user-guide/safety-and-recovery/note-snapshots/) also labels each revision with the device that made it, and [live presence](/user-guide/sync-and-devices/live-collaboration/) shows the person while the note is open. None of that is a block on what a member can do, and none of it is a signature: the revision label is a data-model fact a member can set, so it shows you who edited a revision, it does not prove it.
- **AI provider settings are shared, writable, and each member's consent is their own.** A shared vault's preferences sync, so the AI provider, the provider key and the chosen model are part of the shared vault settings. Every member of the vault can read them **and change them**: there is no owner of the provider key and no per-member copy of it, so the key that sends your notes is whichever one the shared settings currently hold, and another member can replace it. Whether to send to that provider at all is a per-device consent, and each member grants it on their own device, but consent is not authorship: consenting on one device does not pin the key that device will use. Treat a shared vault's provider credential as visible to everyone in the vault and changeable by everyone in it. The practical consequence is that a provider key another member pasted badly, with a stray line break from a copy out of a terminal, leaves every member who has consented to send unable to send, until it is replaced. Myne does not repair a key on your behalf and cannot show you the stored one, so the fix is for a member to paste a fresh one from the provider's own page, and the other members see the effect of that paste the way they see any other shared setting.
- **A removed member's private AI profile is scheduled for deletion after a retention period**, an operator policy rather than a cryptographic guarantee; anything they already copied is not recalled.
- **The identity list and the membership graph.** Your sync server knows only the pseudonymous account-to-vault mapping, the accepted exposure described in [How sync works](/user-guide/sync-and-devices/how-sync-works/); it reads no names, no fingerprints, and no note content.
- **Sharing is not on the web client.** Myne in a browser does not offer member sharing, because it depends on the recovery phrase as a credential, which does not belong in a served page.
