---
title: "Managing devices"
category: "sync-and-devices"
updated: 2026-10-16
summary: "View the devices on your account, rename one, and remove one. Covers the device list, the Vault members panel and what each shows, what removal really does (it revokes sync access, never a remote wipe), how removing a device differs from removing a member, resetting sync locally, and the recovered notes kept when a deletion arrives by sync."
tags: ["devices", "sync", "security"]
---

**Settings → Sync** carries two lists that are easy to confuse, and this page keeps them apart. The **Devices** section lists the machines connected to your account: approve a pending one, rename one, remove one you no longer want syncing. The **Vault members** panel lists the people in a shared vault. Removing a device and removing a member sound alike and are not; before either, it is worth being precise about what removal does and does not do, and the honest answer is narrower than "kick it off."

![The Devices section of Sync settings, which lists the devices on your account.](./managing-devices.png)

## The device list

Under **Settings → Sync → Devices and members**, in the **Devices** section, you see:

- **Your devices**: the approved devices on the account. The one you are using is marked **This device**. Each shows an editable name, which it was given when it was added; a device enrolled before names existed falls back to a short name derived from its identifier. The **Rename** action on a row turns the name into an editable field in place: Enter saves it, Esc cancels. A device's name is also what labels its revisions in a note's [version history](/user-guide/safety-and-recovery/note-snapshots/), where a device you have not named shows a short code instead.
- **Awaiting approval**: devices that have connected with a password and are waiting for an existing device to approve them. Approving one starts the verification-code compare described in [Add a device](/user-guide/sync-and-devices/add-a-device/).

This list is the server's own roster of enrolled devices, so it counts installations rather than people: two of your own computers are two rows, and your computer and your phone are two more. It holds no name, no note content and no key material, and the server cannot read what any device carries.

## The Members list

The **Vault members** section of the same panel answers a different question: who is in this vault. It lists one row per person, not per device, and on a vault nobody has been invited to yet it says so instead of showing an empty list.

- A row shows the member's name when Myne has one whose signature it can check. A member who has no name, or whose name record did not check out, shows the short fingerprint instead.
- A name record that exists without a signature behind it is marked **Name not verified** rather than shown as that member's name. A name is a label, not a credential, and this is where that shows.
- Each row carries a role: **Owner** for the person who created the vault, **Member** for everyone else. Your own row shows **You**.
- The owner is the one who sees the controls that invite someone or remove a member. A member sees the list and their own row.

This list lives inside the encrypted vault, so your sync server relays it but cannot read it. One person is one row here, whatever number of devices they use, which is the difference from the device list above.

## Removing a device is not removing a member

The two lists have their own removal, and they do different things.

Removing a device from **Devices** retires that installation: the server stops syncing to it. The person who uses it stays a member, and their other devices are unaffected. Nothing the retired device already did is rewritten. If the same person signs in again later, that is a new device row; the retired one does not come back.

Removing a member from **Vault members** is the larger act, and only the owner can do it. It ends their membership: the vault's keys rotate so they receive no future changes, and the record that tied their devices to them is tombstoned, so the work they do afterwards is no longer attributed to them. It does not reach into what is already on their device, and it does not delete the notes they wrote. [Sharing a vault with members](/user-guide/sync-and-devices/sharing-a-vault-with-members/) covers what the owner sees when they remove a member.

Neither removal is a remote wipe, and neither reaches back into a copy a device already holds.

## Removing a device

Removing a device revokes its sync access: the server stops syncing to it. That is the whole of what removal does. It is **not** a remote wipe, and it does **not** lock a device that already has your vault and password — that device keeps whatever it already synced. Remove a device you no longer use to stop it receiving further updates, but do not treat removal as a way to reach into a lost or stolen device.

To remove a device, find it under **Your devices** and choose the **Remove** action on its row. Myne asks to confirm first — "Remove this device from sync?" — and restates what removal does before you commit: it revokes that device's sync access, so the server stops syncing to it, and it does not lock a device that already has your vault and password. Choose **Remove** to confirm, or **Cancel**. The device you are using shows no remove action against itself.

## When a device was removed elsewhere

If this device was removed from your account on another device, its sync will start being refused, and the Devices panel says so and offers **Reset and re-add this device**. Resetting clears this device's stale sync credentials so you can add it again from scratch.

## Recovered notes

When a note you deleted on another device is removed here to match, Myne keeps this device's encrypted copy under **Settings → Sync → Conflicts**, in **Recovered notes**, instead of discarding it, so a deletion that reached you by sync is not the last word. Each entry offers **Preview** to read it, **Restore** to bring it back as a new note, and **Delete** to remove it for good.

Deleting a recovered note is permanent. It is the only copy kept on this device, it does not go to Trash, and it cannot be undone — Myne says so in the confirmation before you commit.

## Resetting sync on this device

If sync is refused for a reason retrying cannot fix (a rejected credential, a frozen account, an account at its device limit, or a device stuck waiting for an approval that is not coming), the panel offers **Reset sync on this device**. A device waiting on an approval has no other way out: while the enrolment looks live, the **Add a device** form stays hidden, so resetting is what returns it to a state where it can be added again. This clears the device's local sync token and its sync baseline so it can be re-added. It never touches your notes and makes no changes on the server: it only resets this device's local sync state.

When sync fails for a reason a reset cannot fix, the panel names it in plain words rather than an error code. The line reads "Couldn't reach sync (the server didn't answer)." or "Couldn't reach sync (the account is frozen).", with a plain-language phrase for each reason the backend can tell apart, and a neutral one for anything it cannot.

One of those reasons is a certificate that did not pass the check. The panel reads "Couldn't verify the sync server's HTTPS connection", and the remedy is about the server: check the address and that its certificate is valid. There is no fingerprint to paste and no re-trust step. [Server certificates](/user-guide/sync-and-devices/server-certificates/) covers what the check does and does not prove. For a server that did not answer at all, the panel says the more cautious thing: the server may have moved, and re-entering the server URL under **Sync server** is how you point the device at a new address.

## Limits

Removing a device is an availability control, not a cryptographic one. Because Myne's keys have no forward secrecy, revoking a device's sync token cannot cryptographically claw back the notes it already holds, and there is no remote wipe — a removed or compromised device retains whatever it synced before removal. If a device is lost and you are worried about its contents, rely on its own device lock and your vault's [auto-lock](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/), and change your password if you believe your credentials are exposed. The at-rest strength of your vault does not depend on the sync token: the token authorises a device to sync, it does not wrap or unlock your notes.
