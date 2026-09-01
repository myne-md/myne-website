---
title: "If you forget your password"
category: "safety-and-recovery"
updated: 2026-08-24
summary: "What you can and cannot do if you forget your master password, how the 24-word recovery phrase lets you set a new one, what to check before you type it into a browser, and what happens if both are lost."
tags: ["recovery", "security"]
---

If you forget your master password, your recovery phrase is the way back in. This article covers using it, and what happens if you have lost both.

## If you've lost both, the data is gone

If you have lost **both** your password and your recovery phrase, the vault cannot be opened, by anyone, ever. There is no backdoor, no reset email, and no support request that recovers it. Myne never holds a copy of your keys, which is exactly the property that keeps your notes private. This is the one unrecoverable situation; everything else on this page is recoverable. The rest of the safety section assumes you still have at least one of the two.

## Unlocking with your recovery phrase

On the Unlock screen, below the password box, is a link: **Forgot your password? Unlock with recovery phrase**. Choose it and:

1. Pick the vault, if you have more than one. (You can jump to it by account number, but that is optional.)
2. Enter your 24 recovery words. Each word is checked as you go, so a mistyped or misremembered word is caught immediately.
3. **Set a new password.** This step is required: unlocking with the phrase always ends by giving the vault a fresh password, so you have a password again next time.

That's it. You're back in, with a new password and the same recovery phrase as before.

If you have turned it on, the Unlock screen also offers a faster way back after the vault auto-locks: a short PIN, or macOS Touch ID, instead of the full password. It is opt-in from Settings → Privacy and does not replace the password — with a PIN, your master password is still required after the app restarts (a configured Touch ID credential can be used on a cold start). See [Quick unlock with a PIN or Touch ID](/user-guide/settings-and-privacy/quick-unlock/) for what it does and does not cover. Quick unlock is a convenience, not a recovery path: if you have forgotten the password, use the recovery phrase as above.

Setting a new password through recovery also turns quick unlock off on this device. The PIN or Touch ID credential you had is deleted as part of the reset, without a prompt, so that anyone who knew the old PIN loses access along with the old password. Set it up again from **Settings → Privacy** when you want it back.

## Recovering in a browser

You can do the same thing at `app.example.com`. The **Forgot your password? Unlock with recovery phrase** link is on the browser's unlock screen too, it leads to the same 24-word grid, and it ends the same way, with a required new password. Two things are worth knowing before you type those words into a web page.

Myne asks for your recovery phrase in a browser in exactly one place: a recovery you started yourself, after forgetting your password. It never asks for the phrase to sign you in, and it never asks for it to add a device: adding a device in a browser takes your account number and master password, and nothing else. So a page asking for your 24 words in any other situation is not Myne. Check the address before you type them, and if the page reached you as a link in a message or an email, do not type them at all. Anyone who has your phrase and your account number can open your vault from anywhere and keep opening it: the phrase does not change when you change your password, and there is no way to revoke it.

A browser extension you have granted access to the site can read what is on the page, including the words as you type them. No Myne setting changes that, and the page cannot detect it. If you are not certain about every extension in that browser profile, recover in the desktop or mobile app, or use a clean profile for this step. Neither problem applies to the desktop and mobile apps: an app on your machine cannot be impersonated by a web address.

## What actually happens to your keys

It helps to know what that new-password step does and doesn't do. Your vault is protected by a single random key that lives inside it. Two independent wraps of that key exist: one locked by your password, one locked by your recovery phrase. Unlocking with the phrase opens the phrase's wrap; setting a new password **rewrites only the password's wrap**. The vault's internal key never changes, your notes are not re-encrypted, and your recovery phrase keeps working unchanged. The phrase is not your password and does not derive it. It's a second, independent key to the same vault.

Two things fall outside that account, and both belong to the vault format upgrade. [Upgrading the vault format](/user-guide/safety-and-recovery/upgrade-your-vault-format/) does replace the vault's internal key and re-encrypt every note — that is the one operation that changes it. And while an upgrade is still unfinished, the pre-upgrade copy staged on this device stays readable with the old password, so changing your password does not lock that copy away until you finish the upgrade.

## On a new computer

The recovery phrase unlocks a vault, but it does not conjure one out of nothing. On a fresh machine with no vault yet, the phrase alone restores nothing: it unlocks a vault, it does not fetch one. You first need the vault's files on that machine — by restoring a backup (see [Restore from a backup](/user-guide/safety-and-recovery/restore-from-a-backup/)), or, if you have turned on sync, by adding the machine as a device so it pulls your encrypted notes down (see [Add a device](/user-guide/sync-and-devices/add-a-device/)); then the phrase, or your password, unlocks them.

## Starting over

If both are truly lost, the only path forward is to start fresh. The Unlock screen has a last-resort link, **Lost both password and recovery phrase? Delete vault and start over**, which lets you delete the unopenable vault (you type DELETE to confirm) and create a new one. It recovers nothing; it only clears the way for a new vault.

## Limits

The recovery phrase recovers a forgotten **password**; it does not recover lost **vault files**. Keep the phrase and a recent [backup](/user-guide/safety-and-recovery/back-up-your-vault/) in separate, safe places. Together they cover both ways you could lose access.
