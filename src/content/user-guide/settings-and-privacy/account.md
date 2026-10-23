---
title: "Account"
category: "settings-and-privacy"
updated: 2026-10-23
summary: "The Account panel names the account that groups the vaults on this device, lists those vaults with their state and grouping actions, shows your identity's account number, and holds the browser-extension pairing controls. This page also explains the two kinds of account number and which one your vault has."
tags: ["settings", "devices", "security"]
---

The **Account** panel is the account-level surface: it names the account this device groups vaults under, lists the vaults in that group, and holds the browser-extension pairing controls. It sits first in the settings rail. It shows your identity's account number when this device holds an identity, and it never shows a vault's own number, which this page explains below.

![The Account settings panel showing the account name, the vaults grouped under it, and the browser-extension pairing controls.](./account.png)

## Prerequisites

- A vault open. Settings is only available once a vault is unlocked.

Open Settings from the gear in the bottom bar or with `⌘,`, then choose **Account** in the left rail. It is the first panel and the one selected by default.

On a phone, the vault-scoped controls live in a **Vault** category of their own rather than in Account: the vault's name and icon, **Change password**, and quick unlock. Account keeps the **Delete vault…** action, so the irreversible erase stays separate from the controls you open this panel to change. The names are the same on both, so **Vault** and **Account** mean the same two groups whichever device you are on.

## What's in the panel

- **Account name**: the name you gave the set of vaults this device treats as one identity, with an inline rename beside it. It is a per-device organisational choice kept in the device-local record, so it never syncs — renaming the account here does not rename it on another device, and each device can group its vaults under a different account name.
- **Vaults**: the vaults currently grouped under this account on this device, with a count. Each row shows the vault's icon and name, a second line for its state (this vault, when it was last opened, whether it is on your sync server or device only, or that this device could not read it), and a menu that moves it. The menu offers **Move to new account**, and **Move to account…** for every other account on this device. Moving the only vault out of an account deletes that account and the name you gave it, so Myne asks before it does.
- **Account number**: your identity's number, with a **Copy** button. It is derived from your identity phrase, so it needs no saving and cannot be lost; see the section below. On a device with no identity the row says so instead of showing a value.
- **Open Sync**: a button to the Sync panel, where devices, the members of a shared vault and your person identity live. Before this button existed the panel only said where to go.
- **Browser clipper**: a switch that registers the native-messaging host the Myne browser extension talks to. It is on by default; turning it off removes the host, so no extension can reach this app until you turn it back on. See [Browser clipper](/user-guide/attachments-and-import/browser-clipper/).
- **Connected extensions**: the browser extensions currently paired with this vault, with a per-row Revoke. A revoked extension has to pair again before it can send clips.

The account name and the vault's own name are two different things, and the split is deliberate: the **account** is the device-local grouping of vaults, while the **vault** is the sealed container itself, whose label and icon live in the [Vault panel](/user-guide/settings-and-privacy/vault/). A vault keeps its label wherever it goes; an account name describes this device's own arrangement of them.

In a browser the panel is shorter: browser extensions do not pair with a browser tab, so the clipper switch and the extension list are absent there, and the account name and vault list are what remain.

## Your account number

There are two kinds of account number in Myne, and which one you have depends on the vault.

- **A person account number** belongs to your identity and covers every vault it owns. Myne **derives it from your identity phrase** rather than generating it, so it cannot be lost: the phrase reproduces it on any device. That is also why you are not asked to write it down. It is shown in the Account panel with a Copy button, and it names the account for support and for a self-host operator; it is not a credential, and knowing it grants no access.
- **A vault account number** belongs to a single vault, and you have one if that vault was created before identities existed or created in a browser. It is a `MY-` prefixed string of Crockford base32 groups, generated when the vault was created and shown once at that moment. It is what a joining device uses to fetch that vault's encrypted key file, so it is worth keeping private, and Myne does not display it again.

For a vault that came from your identity, **you do not need a number to add a device**: the join code names the account and your 24 words prove it. So the number you may have written down at vault creation is not part of how that vault is recovered or shared any more. See [Add a device](/user-guide/sync-and-devices/add-a-device/).

## Limits

Your account name is local to this device and carries no security meaning: it is a label you chose, not an identifier anything authenticates against, and losing it costs nothing.

Neither kind of account number is an encryption key, and neither authenticates a request on its own: access is a signed-in session, not a password you type, and Myne stores only a hash of the number server-side. For a **vault** number the honest caveat remains that anyone holding it can ask the server for that vault's encrypted key file and start guessing the vault's password offline, so keep it private. For a **person** number there is nothing to keep: it is derived from the phrase, it is not a secret, and knowing it opens nothing.

The phrase is the credential in both models. Keep it safe, and see [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/) for where the guarantees start and stop.
