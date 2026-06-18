---
title: "Change your password"
category: "settings-and-privacy"
updated: 2026-06-18
summary: "How to change your master password, what the change does and does not re-encrypt, and how it affects backups you made with the old password."
tags: ["security", "settings"]
---

You can change your master password from **Settings → Account**. This article covers how to do it, what it actually changes, and the one honest caveat about your old backups.

## Changing it

Open Settings → Account and choose Change password. Enter your current password, then a new one. The new password must meet the same floor as at creation (at least 12 characters and a strength the meter accepts). Confirm, and Myne re-wraps your vault under the new password.

While the change is processing, Myne works for a second or two and the settings window won't dismiss; `Esc`, clicking away, and the close button are held until it finishes, so the operation can't be interrupted halfway. If you need to back out, the **Lock** control in the bottom bar still works: locking the vault is the clean way to cancel a change in progress.

If the current password you entered is wrong, you get a single message that doesn't reveal whether it was the password or a damaged vault file, the same deliberate non-distinguishing wording the Unlock screen uses.

## What changes, and what doesn't

Changing your password rotates **only the password's wrap** of the vault key. It does **not** re-encrypt your notes, change the vault's internal key, alter your recovery phrase, or change your account number; all of those keep working exactly as before. The change is fast because that is all it touches.

One thing it does clear: if you had set up [quick unlock](/user-guide/settings-and-privacy/quick-unlock/) on this device, the password change wipes that stored credential. Quick unlock stores a separate device-local credential unlocked by your PIN or Touch ID; changing your master password deliberately wipes it, so you re-enroll your PIN or Touch ID from Settings → Privacy afterward.

## The caveat about old backups

Changing your password does **not** lock anyone out of backups you already made. An old password opens old backups. The recovery phrase opens every backup of the vault, forever. So if you are changing your password because you fear it was exposed, treat every pre-change backup as still openable by the old password, and make a fresh backup afterward. The full picture is in [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/).

## Limits

A password change protects your *live* vault going forward; it cannot reach back into copies you have already exported. Pair a password change with a new backup, and retire the old ones if the reason for the change was a possible compromise.
