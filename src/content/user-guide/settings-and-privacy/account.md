---
title: "Account"
category: "settings-and-privacy"
updated: 2026-08-24
summary: "The Account panel lets you rename the vault, manage connected browser extensions, change your master password, and delete the vault. It also explains your account number, the identity you use to add another device."
tags: ["settings", "devices", "security"]
---

The Account panel is the home for account-level controls: your vault's name and icon, the browser extensions paired with this vault, the change-password action, and the danger zone for deleting the vault. This page also explains your account number, which is not shown here but is the identity you use to add another device.

## Prerequisites

- A vault open. Settings is only available once a vault is unlocked.

Open Settings from the gear in the bottom bar or with `⌘,`, then choose **Account** in the left rail. It is the first panel and the one selected by default.

## What's in the panel

- **Change password**: rotate your master password while keeping the same vault. See [Change your password](/user-guide/settings-and-privacy/change-your-password/).
- **Vault label and icon**: a name and glyph for this vault, shown in the in-app vault switcher and on the startup vault picker before you unlock. Both are stored encrypted inside the vault. See [Working with multiple vaults](/user-guide/safety-and-recovery/multiple-vaults/).
- **Browser clipper**: a switch that registers the native-messaging host the Myne browser extension talks to. It is on by default; turning it off removes the host, so no extension can reach this app until you turn it back on. See [Browser clipper](/user-guide/attachments-and-import/browser-clipper/).
- **Connected extensions**: the browser extensions currently paired with this vault, with a per-row Revoke. A revoked extension has to pair again before it can send clips.
- **Danger zone**: the **Delete vault…** action, covered below.

In a browser the panel is shorter, and its last section makes a different promise. The browser client keeps your vault as a synced copy rather than as the only copy, so that section is headed **This browser** and its button reads **Sign out and erase this browser's copy…**. It removes Myne's copy from that browser and nothing else: your account and everything already synced stay on the server, and signing in again brings them back. Browser extensions do not pair with a browser tab either, so the clipper switch and the extension list are absent there. The permanent, unrecoverable delete described below is the desktop and mobile action.

The vault label is also kept in a sealed device-local copy, so the locked vault picker can show this vault's name after a restart. Renaming updates that copy only on the device you rename from, and Myne says so under the field while the change is pending. Until you unlock the vault on your other devices, their lock screens keep showing whatever they stored last: an earlier name, or a placeholder if they never stored one. Clearing the label works the same way, so emptying the field here does not reach the copy sitting on another device's lock screen. See [Vault names on the lock screen](/user-guide/settings-and-privacy/vault-names-on-the-lock-screen/).

The panel does not show the key-derivation settings your password runs through. Myne stretches your master password with Argon2id (256 MiB of memory, three passes, two lanes) before it becomes your vault key, and that figure is shown when you create a vault. The model behind it is in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).

## Your account number

Your account number is your account's primary identifier, generated when you created the vault in place of an email address. It is a `MY-` prefixed string of Crockford base32 groups.

It matters in two places:

- **Adding a device.** To add another device to the same account, you enter your account number together with your master password or your 24-word recovery phrase. See the [Sync and devices](/user-guide/sync-and-devices/overview/) section.
- **Self-hosting.** It is the value a self-host operator would use to identify your account on their server.

Myne shows your account number once, during vault creation, and prompts you to save it. It is not re-displayed in this panel, so keep the copy you saved when you set up the vault. See [Create your vault](/user-guide/getting-started/create-your-vault/).

## Delete this vault

Deleting a vault is permanent and cannot be undone, and your recovery phrase will not bring it back. The full walkthrough, including exactly what is erased, is in [Delete a vault](/user-guide/settings-and-privacy/delete-a-vault/).

## Limits

Your account number identifies your account and, for hosted sync, is the bearer credential the server checks; the server stores only a hash of it, never the number itself. It is not an encryption key: on its own it does not unlock or decrypt your vault — adding a device also requires your master password or your 24-word recovery phrase, and unlocking always requires one of those. Because the number carries secret entropy, treat it like your recovery phrase and keep it private. Anyone who has it can reach your account on a sync server, but they still cannot read your notes without your password or phrase. For the full model, see [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).
