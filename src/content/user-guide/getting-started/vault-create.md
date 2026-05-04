---
title: "Create your first vault"
category: "getting-started"
updated: 2026-05-04
summary: "Set up a new Myne vault on your device. Choose a password, write down the recovery phrase, and start writing encrypted notes — no email, no account, no server can read them."
tags: ["vault", "onboarding", "recovery"]
---

A vault is a local file on your device that holds all your notes, encrypted at
rest. The first time you open Myne it asks you to create one. There is no
sign-up form, no email field, and no remote account: the vault belongs to your
device and the password you choose for it.

## Pick a password

Your password is the only thing that derives the encryption key for this
vault. We do not store it. The server, if you ever sync to one, never sees
it. If you forget the password, the only way back into your notes is the
recovery phrase shown on the next screen.

### What makes a good password

A passphrase of four or five unrelated words is easier to remember than a
short complicated password and harder for software to guess. Avoid reusing a
password from another service.

## Write down the recovery phrase

Myne shows you a 24-word recovery phrase right after you set the password.
Write it down on paper, store it somewhere you trust, and do not put it in
the same place as the device. The phrase is the only fallback if you forget
the password — there is no email reset, ever. We cannot help you recover a
vault, and that is by design.

You can read more about the recovery model in the *Recovery* section of this
guide.
