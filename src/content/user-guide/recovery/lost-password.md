---
title: "Lost your password"
category: "recovery"
updated: 2026-05-04
summary: "If you forget your password but still have the recovery phrase, you can derive a new key and re-open the vault. If you have lost both, the vault is unrecoverable — there is no email reset, ever."
tags: ["recovery", "password", "phrase"]
---

The recovery phrase is the only thing that brings a vault back when the
password is gone. Myne does not store the password, and the server (if you
sync to one) does not see it either.

## Use your recovery phrase

On the unlock screen, choose "I lost my password" and enter the 24 words in
order. Myne re-derives the key and opens the vault. You will be asked to set
a new password as part of the flow.

### Where you wrote it down

If the phrase is on paper somewhere safe, fetch it. If it is in a password
manager you trust, read it from there. Either way, the words have to come
from you — they are not stored anywhere we can reach.

> If you lose both the password and the phrase, the vault is unrecoverable.
> There is no email reset, ever.

This is a deliberate design choice. You can see the threat model and the
recovery article for the full reasoning. The same property that keeps your
notes private from us also means we cannot get them back for you.

## What if I lost the phrase too

- Try every password manager and note-taking app you've used in the last few
  years.
- Look for paper backups in deposit boxes, or with anyone you might have
  entrusted a copy.
- If you cannot find the phrase, create a fresh vault and start over —
  there is nothing else we can do.
