---
title: "Create your identity"
category: "getting-started"
updated: 2026-10-30
summary: "What a Myne identity is, why creating one needs no server, what its 24-word phrase recovers and what it does not open, how the ceremony works, and what registering the identity with a sync server adds."
tags: ["recovery", "security", "sync"]
---

An **identity** is your person in Myne: the thing other people invite to a vault, and the thing that can own several vaults. It is separate from any vault. A vault is a folder of encrypted notes with its own password; an identity is who you are, and one identity covers every vault you create. Creating one is the first thing a fresh Myne offers, and it happens entirely on your device.

![An identity is one person across every vault they own or join; each vault keeps its own password.](./create-your-identity.svg)

## Creating an identity needs no server

There is no email, no sign-up form and no server address on this screen. Myne derives your identity's keys from the 24 words it is about to show you, seals them on this device, and stops there. Nothing is transmitted while you create it, and you can create one with no network at all.

That leaves the account in a state Myne calls **reserved**: the identity exists here, with no server account behind it yet. It is a complete, usable identity. You can create vaults, write notes and stay offline for as long as you like.

**Registering** is a separate action you take when you want it, from your identity home or, once you hold a vault, from **Settings → Sync**. It sends the minimum a server needs to recognise the account, and it asks for your 24 words as proof that the identity is yours. A registration that cannot reach the server leaves the identity reserved and says so; it never removes it. What registration adds is reachability: another person can address an invitation to your identity, and your own second device can find your vaults. **Settings → Sync** is where an identity is added, recovered or unlocked on a device, and its **Identity** block is also where you can register an identity on a device that already holds a vault. If the device has no sync server yet, the register form asks for the address.

## The identity phrase

Before the identity exists, Myne shows you a 24-word **identity phrase**. It is the account's only recovery credential, and it is also how you prove the identity is yours when you register it or accept an invitation.

It is not a password, and it is not a way into your notes. Myne never asks you to type it to unlock a vault: your vaults keep their own passwords for that, and a vault created under your identity has no phrase of its own either. It is the phrase you reach for when you bring a new device in, when you register the identity, when you accept an invitation, and when you need to unlock the identity itself on a device that already holds it.

The phrase is shown once. Myne hides it until you reveal it and hides it again if you switch away from the window. Before the step will close, it asks you to type four of the words back, naming each by its position in the phrase. A wrong word says which position it is, and the final **Done** stays disabled until all four match, so the step cannot be dismissed early. The point is to confirm the words left the screen into your hands: the phrase is never shown again, and an identity whose phrase was never saved cannot be recovered.

## What the phrase opens

It opens your **identity**, and nothing else. The identity is the keypair, the account number, and the list of vaults that account owns, which is what makes a new device able to find your vaults and be admitted to them. It does not open a vault, and it never did on a vault created today: the vault's key is wrapped under that vault's password, once.

That is a deliberate split, and it is worth knowing both halves:

- **The password opens the content.** A vault created under your identity has no recovery phrase of its own and no account number of its own; the identity is the account, the password is the door.
- **The phrase proves who you are.** It is typed once per device, when that device needs to become yours.

A vault you created before 2026-10-30 may still carry a recovery phrase of its own, and such a vault also has its own account number. Opening it works exactly as it did. [Upgrade your vault format](/user-guide/safety-and-recovery/upgrade-your-vault-format/) covers what changes if you run the upgrade: the phrase stops working and the vault opens with its password alone.

## After you create your identity

Myne lands you on your **identity home**. It shows your identity code, the public string you hand someone so they can invite you, and it lists any invitations addressed to you. From here you can:

- **Create a vault** bound to this identity.
- **Accept an invitation** to someone else's vault. You paste their identity code, enter your own identity phrase, and choose a password for this device. There is no fingerprint to compare out of band: the owner's code you were given is checked against the invite when you accept, and a code that does not match is refused.
- **Register this identity**, once you have a sync server to register it with. The state line above the button says which of three states the identity is in: on this device only, registered and waiting for approval, or registered and signed in. The same form is available from **Settings → Sync** once you have a vault.
- **Forget this identity on this device** if you are moving to another one. The warning says what that does and does not remove: the identity leaves this device, while the server account and any vault it owns or joined are untouched. Recovering it elsewhere needs the same 24 words.

A shared vault you join is unlocked with **the password you choose for it on that device**, not with your identity phrase. The identity phrase is what makes you the same member to everyone else; the password is what opens the notes. If you lose that password, a fresh invite from the owner is the way back.

## In a browser

A browser can hold an identity, but only while the page is open. It keeps no copy of the sealed keypair and no device token on disk, because anything stored for an origin is readable by any script on that origin and a phrase-derived key file sitting there would be an offline target. So a reload asks for the 24 words again, and the phrase step says so.

A browser's first screen is its account entry, because a browser usually opens an account that already exists. The secondary link below the account-number field, **I do not have an account yet. Create one**, opens this same ceremony, and the vault follows it. An identity can also be added later from **Settings → Sync → Connection**.

The difference from the desktop is what happens to it: the browser holds the identity for the session only, so a page reload asks for the 24 words again. That is why the phrase step on this client says so, and why the words are worth keeping somewhere the browser is not. [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/) covers the rest.

## Limits

The identity phrase is the account. Anyone who has it can register as you, accept invitations addressed to you, and be treated as you on any device that has no other copy of your identity. It cannot be rotated and there is no way to revoke it, so treat it like the key to who you are rather than like a password you might change one day.

What it does **not** do is open a vault. Losing the phrase costs you the identity: the account number, the vault list, and the ability to bring a new device in. It does not cost you the notes on a device that already has the vault, because those open with the vault's own password. Myne keeps no copy of either, so a forgotten password with no backup is a lost vault and a lost phrase is a lost identity, and they are two different accidents.

A browser page can be imitated in a way an installed app cannot, and a fake page asking for your 24 words is the one attack this model cannot stop. Read the address before you type them, and never type them into a page you reached from a link in a message. [Recovery phrase scams](/user-guide/safety-and-recovery/recovery-phrase-scams/) covers what to watch for.
