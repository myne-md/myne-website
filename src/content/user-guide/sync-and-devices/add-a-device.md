---
title: "Add a device"
category: "sync-and-devices"
updated: 2026-10-31
summary: "Connect another device to your account and approve it. Covers bringing your identity to a new device with one join code and the 24 words, joining a vault that still carries its own number, the beta terms, QR pairing, the verification code, and a member's own second device."
tags: ["devices", "sync", "recovery"]
---

Adding a device connects it to your account so it syncs the same notes. If your vault came from your identity, the way in is one **join code** plus your **24 identity words**, and neither one touches your vault's password. The new device then sees every vault the identity owns, and each vault still asks for its own password when you open it. The older path, for a vault that still has its own account number, signs in with that number and either a password or that vault's recovery phrase. Either way both devices compare a short code to confirm they are on the same account. This page covers all of it, and the one a member of a shared vault takes for their own second device.

Nothing here types a vault's password on the other device, and nothing here hands a vault key across: what travels is your identity, and the vaults follow it.

![The Add a device form in Sync settings, where you sign a new device in to your account.](./add-a-device.png)

## Prerequisites

- Sync already turned on for the account (see [Turn on sync](/user-guide/sync-and-devices/turn-on-sync/)).
- For an identity-owned vault: a device that already holds the identity, unlocked, so it can show a join code, and the identity's 24 words to type on the new one. No account number is involved.
- For a vault with its own account number (created before identities existed, or before 2026-10-30): that number, and either the vault's password or its own 24-word recovery phrase. A vault created today has neither an account number of its own nor a phrase, so this path is not the one you want for it.
- The sync server URL, unless the join code carries it.
- Accepting the beta terms on the device you are adding.

## Accept the beta terms

Before a device syncs for the first time, Myne holds the join behind the sync consent. From the welcome screen the dialog opens straight away; from **Settings → Sync** the enrolment form is replaced by a **Review what sync means** button that opens the same dialog. It is headed **Before you turn on sync** and states four things: what this is (sync stores your notes on a server you choose, and they leave the device encrypted, so the server holds ciphertext and no key and neither it nor Myne can read them); what happens if you lose your secrets (if you lose your vault password, your notes cannot be recovered, by you or by us, because there is no reset; the clause also names the recovery phrase, which is the second secret on a vault that still carries one, and a vault created today carries none); what happens if that server goes away (your notes live on your devices, so you lose sync rather than your notes until you point it at another server); and what the server's operator can see (they can refuse to serve you, keep a copy of something you deleted until their retention window passes, and see that an account synced, when, and roughly how much, none of which lets them read a note). The dialog carries all four clauses itself; there is no separate terms page behind a link, and the privacy policy stays one link away in **Settings → About**.

Choose **I understand, turn on sync** to continue, or **Cancel** to leave it for now. Every device is asked separately. The acceptance is recorded on the device in front of you and is never carried across by sync, because what it records is that the person holding that device read the text. If the terms are rewritten, the gate appears again.

## On the new device

### Bringing your identity to a new device

This is the path for a vault that came from your identity, and it works for every vault that identity owns.

1. On a device that already has the identity, open **Settings → Sync → Devices and members**, and choose the **+** next to **Devices**. If the vault came from your identity, the dialog is **Add a device to your identity** and it needs no input from you: the code names your account and your server. If it asks for an account number instead, this vault still has its own and you are on the other path below.
2. On the new device, choose **Add this device to an account**, then **I have a join code**, and paste or scan the code. On a phone you can scan it directly.
3. Type your **24 words** when asked. The code named the identity; the words prove it is yours. Myne says what happens next: this device will ask for each vault's own password when you open one.
4. The new device lands on **Waiting for approval**. Keep that screen open.
5. On the first device, find the new device under **Devices**, now awaiting approval, and choose **Approve**. Compare the short code both screens show, then confirm on each.
6. The new device finishes on its own: it lists every vault the identity owns, and each one opens with its own master password. No vault key crosses in the clear, and no password is shared between devices.

If the new device restarts before the approval arrives, it asks for the phrase once more; that is the same session-only rule that applies after a reload in a browser. Nothing else has to be redone.


### Joining with an account number

There are two starting points, depending on whether the device already has the vault:

- **A fresh device with no vault.** On the welcome screen, choose **Add this device to an account**. Enter the sync server URL and your account number, then sign in with either your **password** or your **recovery phrase** (a 24-cell grid; you can paste all 24 words at once to distribute them). **Name this device** comes filled in with a suggestion based on the kind of machine you are on. Edit it or leave it; it is the name your other devices show in their device list, and you can rename it later. Myne fetches your encrypted vault from the server and connects the device. The password path then waits for a device that already has access to approve it. The recovery phrase is the door for when there is no such device left: it adds this device without approval and then asks you to set a new password, because the phrase is the key you use when you may not know the old one. **That phrase belongs to the vault**, and a vault created today has none, so on such a vault this form offers the password only.
- **A device that already has the vault.** Open **Settings → Sync**. If the device is not yet a member of the account, an **Add a device** section appears. Enter your account number, then sign in with either your **password** or your **recovery phrase** (a 24-cell grid, and you can paste all 24 words at once to distribute them). This form carries the same **Name this device** field, with the same suggestion and the same note that you can change it later.

As you type your account number, Myne formats it for you (grouping and the `MY-` prefix), so you can type or paste it in whatever form you have it.

When you submit, the device connects and, for the password path, shows that it is **waiting for approval**. Keep that window open. The first device on an account, and any device added with the recovery phrase, self-approve and skip the wait.

In a browser, reloading during the wait is safe: for a vault with its own account number the page asks for your master password and returns you to the same wait, and for an identity it asks for the 24 words again. It does not start the enrolment over, and nobody has to approve the browser twice.

## Pair with a QR code

Instead of typing anything on the new device, a device that is already signed in can show a QR code the new device scans. There are three kinds, and each names the right thing and carries no secret:

- **Add a device to your identity** needs no input: the code names your account and server, and the new device is asked for the 24 words.
- **Add a device with a QR** is the account-number kind. It fills in the sync server address and the vault's account number, and the new device signs in with that vault's password. A vault created today has no account number of its own, so this kind is not the one you want for it; the identity kind above is.
- **Add your own device** is a member's, for a shared vault: it names the vault, and the new device is asked for the 24 words.

In every case the code carries no password and no recovery phrase, and the new device still goes through approval.

On a device that already has access:

1. Open **Settings → Sync → Devices and members**, then choose the **+** next to **Devices** to open **Add a device with a QR**.
2. For the account-number kind, paste your account number into the **Account number** field: Myne does not store that number, so you supply it from your own saved copy. The identity kind has no field at all.
3. Choose **Make QR**. A QR code appears, labelled **Scan with the mobile app**. The code carries the Myne mark in its centre, so the person scanning can see at a glance that it is a Myne code and not some other QR on the screen.
4. On the new device, open the Myne app and scan the code. The sync server address and account number are filled in for you; enter that device's password to continue.

On a phone the confirm step shows the server and the account number. The new device checks the server's certificate against the public certificate authorities on its own first connection, the same check every connection gets; no fingerprint is carried by the code or compared.

The code is short-lived and refreshes while the dialog is open, so a photograph of it cannot be scanned later: the new device has to read it off this screen while both are in front of you.

That freshness bound is on the join, not on the account number inside the picture. The number does not expire, and on its own it is enough to ask the sync server for your account's encrypted key file and start guessing your master password offline. So treat the code the way you treat the account number itself: do not photograph it, and do not leave it up on a shared screen.

Once the new device signs in, it shows as awaiting approval, and the rest of the flow is the same as the manual path: approve it from a device that already has access, then compare the verification code.

## Approve it from an existing device

On a device that already has access:

1. Open **Settings → Sync → Devices and members** and find the new device under **Devices**, listed as awaiting approval.
2. Choose **Approve**.
3. Myne then shows a **verification code** for the new device. This is the out-of-band check: compare it against the code shown on the new device.
4. If the codes match, choose **They match**. If they do not, choose **They don't match**. That does not remove the device on the spot: it opens the same confirmation every removal on this panel goes through, headed "Remove this device from sync?" and restating what removal does and does not do. Confirm there to remove it. A mismatch can mean the server tried to seat a device you did not add, so do not leave one unresolved.

You do not have to do the comparison in the moment. Every device in the list other than the one you are using carries a **Compare code** action that brings the same verification screen back, so a comparison you postponed is still available later. If the code is not ready yet — the new device has not finished its first exchange with the server — the screen says so and fills in as soon as it is.

If the device that would approve this one is gone, you are not stuck on the wait. On a vault that still carries its own recovery phrase, the waiting screen offers **Use my recovery phrase**: confirm with the phrase there and this device completes the same join without approval from anyone else, keeping the password you typed a moment earlier. A vault created today has no phrase to offer, so that link is not there and the approval has to come from a device that already has access. Use it when the approval is not coming; the phrase is full access to the account, so treat that prompt the way you treat the phrase itself.

While a verification screen is open, Myne holds this device's pushes so the value both screens read stands still. If it moves anyway, because another device pushed or because the screen was left open too long, the screen says so rather than swapping the code under you: "The code changed while you were looking. Compare both screens again. If it keeps changing, stop and do not continue." The same line appears on both ends of the compare. Looking until two screens happen to agree is not a comparison, so start again from the code each screen shows now.

## Confirm on the new device

A device you joined from the welcome screen shows the same **verification code** once it is approved and finishes its first sync. Compare it with the code on the approving device:

- **They match, continue** finishes joining, and the device starts syncing.
- **They don't match, remove this device** disconnects this device from the account, so it stops trusting the synced data, and undoes the join. If the disconnect itself fails, the screen stays open and says so: the device is still enrolled with that server and should be treated as untrusted until you remove it from **Settings → Sync** on a device that already has access. No notes are deleted either way.

## Add a second device to a shared vault

If you have already joined someone else's vault as a member, you bring a second device into it yourself. The flow is yours alone: it needs no owner action and no fresh invitation, because the membership is already in your name and the vault is already addressed to you. Your recovery phrase is what the new device needs from you, and it is the same phrase you use on any device you join.

What that phrase does here is worth stating precisely, because it changed. It recovers **your identity** and fetches the sealed package the owner addressed to you, which is what carries your copy of the vault's keys. It does **not** open the vault, and it no longer can: a shared vault opens on a device with a credential that device holds, and you set that credential at the end of this flow. A device whose credential is gone, cleared, or was never set cannot be opened with the phrase, and needs a fresh invite from the owner instead.

A device that is already in the vault can also hand the target over with an **Add your own device** code: open **Settings → Sync**, and choose the **+** beside **Devices**. The code carries your sync server's address and the vault's id, never your recovery phrase or your password. It is short-lived and refreshes while the dialog is open, so it has to be scanned off the screen while both devices are in front of you. Scan it with Myne on the new device to fill in the server and go straight to that vault instead of finding it among your invitations. On a device that has no identity yet, Myne asks for your recovery phrase first, exactly as the steps below do.

On the new device:

1. Enter your recovery phrase. That recovers your identity, and it is the only secret this flow asks for.
2. Myne finds the shared vaults that are already addressed to you. You are not asked to paste the owner's identity code again: your first device saved it for you when it joined, because the server is not allowed to hand it out.
3. Choose the vault, and type your recovery phrase again when Myne asks for it. The phrase is what your own copy of the vault's keys is sealed to, so it is asked here as well as at the start. Myne then fetches your place in the vault from the server and checks the result against the owner it recorded before it installs anything. A device that cannot confirm the owner is the one you expect refuses rather than proceeding; a vault whose key material cannot be reached right now answers a plain "not reachable" you can retry, not a lockout.
4. Set a password for this device. It is the same kind of device-local password the first join asks for: it opens this shared vault here, it is not the owner's password, and it is what this device uses from now on. On the desktop, the field labels how strong the password is, from **Too weak** to **Strong**, as you type. You can change it later under **Settings → Privacy → Shared vault unlock**, and you can put a PIN or a biometric in front of it there too.

There is no display-name step, and none is needed. The name you chose for that vault is already yours and travels with your membership, so the second device shows it from the moment it opens, the same as the first. The second device is not a second-class copy: it opens the same vault, the same notes and the same membership, and the revisions you make from it are attributed to you the same way your first device's are.

A shared vault is one way in per device, and the way in is the one you set on that device. Losing it is not a lost vault: ask the owner for a fresh invite, or for this device to be admitted again, and the notes, the other members and your access stay exactly as they were. What a fresh invite gives you is a new device password, not a new identity.

## When the server refuses

Adding a device from **Settings → Sync** names the reason an enrolment was refused whenever naming it points at a remedy:

- **This device is already waiting for approval** — it is already in the queue; approve it from a device that has access rather than adding it again.
- **This account has reached its device limit** — free a slot first, see [Managing devices](/user-guide/sync-and-devices/managing-devices/).
- **This account is frozen** — no new device can be added until the freeze is lifted. The notes on this device are unaffected.
- **The sync server's identity didn't match what this device expected** — do not enter your credentials again until you know why. This is a mistyped address, or something sitting between this device and your server.
- **This device does not have enough memory to open that vault** — the vault's encryption settings need more memory than the app can use here. Open it on a desktop computer instead.

A wrong account number, a wrong password and a wrong recovery phrase all produce the same message on purpose, on a vault that has a phrase to get wrong. Telling them apart would tell whoever is holding the device which of the three they got right. The welcome-screen path is less specific: apart from a certificate check that can refuse the join outright, it reports one message covering the server URL, the account number, the password and reachability together.

## Limits

The verification code is what protects a newly added device: a fresh device has no prior history to check against, so on its first sync it cannot detect a rolled-back or forked history on its own. Comparing the code out of band, reading it off both screens, is the step that closes that gap, which is why a mismatch leads to removing the device rather than continuing, through the ordinary removal confirmation, so the destructive step is one you answer for. A mismatch is the one signal that the server or the history may be wrong, so Myne never closes that screen unless the device was really disconnected. Adding a device with your recovery phrase self-approves and so skips the pending gate; that is a deliberate, accepted trade-off, and it is why the phrase is the one credential worth more than the device it is typed on. Approving a device grants it ongoing sync access to your account's notes; if you later remove it, that revokes access going forward but does not reach back into what the device already holds (see [Managing devices](/user-guide/sync-and-devices/managing-devices/)). On an identity-owned account the approval and the removal are per device for the whole account, not per vault: a device you add sees every vault the identity owns, and one removal stops all of them. What it sees is the list, not the contents: every one of those vaults still asks for its own password, which is why adding a device never means handing a vault key across. A QR code changes how the new device receives the sync server address and the account number, not what has to be verified afterwards. The code carries no password or recovery phrase, so the worst a tampered or swapped code can do is point the new device at the wrong account or server, which your password cannot unlock; a bad code fails the join rather than granting access. The reverse direction is not bounded the same way: the freshness window stops a photograph of your own code being used to join later, but the account number inside that photograph never expires. The new device still signs in with its own password, still waits for approval, and still compares the verification code. Scanning the code is done in the Myne app; today that scanner is the iOS app.
