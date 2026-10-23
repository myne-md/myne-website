---
title: "Create your identity"
category: "getting-started"
updated: 2026-10-22
summary: "What a Myne identity is, why creating one needs no server, how its 24-word phrase recovers every vault you own, how the ceremony works, and what registering the identity with a sync server adds."
tags: ["recovery", "security", "sync"]
---

An **identity** is your person in Myne: the thing other people invite to a vault, and the thing that can own several vaults. It is separate from any vault. A vault is a folder of encrypted notes with its own password; an identity is who you are, and one identity covers every vault you create. Creating one is the first thing a fresh Myne offers, and it happens entirely on your device.

![An identity is one person across every vault they own or join; each vault keeps its own password.](./create-your-identity.svg)

## Creating an identity needs no server

There is no email, no sign-up form and no server address on this screen. Myne derives your identity's keys from the 24 words it is about to show you, seals them on this device, and stops there. Nothing is transmitted while you create it, and you can create one with no network at all.

That leaves the account in a state Myne calls **reserved**: the identity exists here, with no server account behind it yet. It is a complete, usable identity. You can create vaults, write notes and stay offline for as long as you like.

**Registering** is a separate action you take when you want it, from your identity home. It sends the minimum a server needs to recognise the account, and it asks for your 24 words as proof that the identity is yours. A registration that cannot reach the server leaves the identity reserved and says so; it never removes it. What registration adds is reachability: another person can address an invitation to your identity, and your own second device can find your vaults. **Settings → Sync → Connection** is where an identity is added, recovered or unlocked on a device, not where it is registered.

## The identity phrase

Before the identity exists, Myne shows you a 24-word **identity phrase**. It is the account's only recovery credential, and it is also how you prove the identity is yours when you register it or accept an invitation.

It is not a password. Myne never asks you to type it to unlock anything day to day: your vaults keep their own passwords for that. It is the phrase you reach for when a password is gone, when you bring a new device in, and when someone invites you.

The phrase is shown once. Myne hides it until you reveal it and hides it again if you switch away from the window. Before the step will close, it asks you to type four of the words back, naming each by its position in the phrase. A wrong word says which position it is, and the final **Done** stays disabled until all four match, so the step cannot be dismissed early. The point is to confirm the words left the screen into your hands: the phrase is never shown again, and an identity whose phrase was never saved cannot be recovered.

## What the phrase opens

For a vault you create from now on, the identity phrase is also the vault's recovery credential. Myne wraps that vault's key to your identity when it creates the vault, so the 24 words open the vault on a new device without a second phrase to keep. This is why a vault created after your identity has no recovery phrase of its own, and no account number either: the identity is both.

A vault you created before this existed keeps its own recovery phrase and its own account number, and opening it still works exactly as it did. Moving such a vault onto your identity is an explicit upgrade, covered in [Upgrade your vault format](/user-guide/safety-and-recovery/upgrade-your-vault-format/). Until you run it, keep that vault's phrase as well as your identity's.

## After you create your identity

Myne lands you on your **identity home**. It shows your identity code, the public string you hand someone so they can invite you, and it lists any invitations addressed to you. From here you can:

- **Create a vault** bound to this identity.
- **Accept an invitation** to someone else's vault. You paste their identity code, enter your own identity phrase, and choose a password for this device. There is no fingerprint to compare out of band: the owner's code you were given is checked against the invite when you accept, and a code that does not match is refused.
- **Register this identity**, once you have a sync server to register it with. The state line above the button says which of three states the identity is in: on this device only, registered and waiting for approval, or registered and signed in.
- **Forget this identity on this device** if you are moving to another one. The warning says what that does and does not remove: the identity leaves this device, while the server account and any vault it owns or joined are untouched. Recovering it elsewhere needs the same 24 words.

A shared vault you join is unlocked with your **identity phrase**, never with a vault phrase you were never given.

## In a browser

A browser can hold an identity, but only while the page is open. It keeps no copy of the sealed keypair and no device token on disk, because anything stored for an origin is readable by any script on that origin and a phrase-derived key file sitting there would be an offline target. So a reload asks for the 24 words again, and the phrase step says so.

A browser's first screen is its account entry, because a browser usually opens an account that already exists. The secondary link below the account-number field, **I do not have an account yet. Create one**, opens this same ceremony, and the vault follows it. An identity can also be added later from **Settings → Sync → Connection**.

The difference from the desktop is what happens to it: the browser holds the identity for the session only, so a page reload asks for the 24 words again. That is why the phrase step on this client says so, and why the words are worth keeping somewhere the browser is not. [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/) covers the rest.

## Limits

The identity phrase is the account. Anyone who has it can register as you, accept invitations addressed to you, and open every vault you own, on any device, for as long as those vaults exist. It cannot be rotated and there is no way to revoke it, so treat it like the key to everything the account holds rather than like a password you might change one day. Myne keeps no copy: losing it means losing the identity and the recovery path into every vault bound to it, while each vault's password still opens that vault on a device that already has it.

A browser page can be imitated in a way an installed app cannot, and a fake page asking for your 24 words is the one attack this model cannot stop. Read the address before you type them, and never type them into a page you reached from a link in a message. [Recovery phrase scams](/user-guide/safety-and-recovery/recovery-phrase-scams/) covers what to watch for.
