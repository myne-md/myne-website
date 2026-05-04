---
title: "Why we do not offer email recovery"
category: "settings-privacy"
updated: 2026-05-04
summary: "An email reset link would be useful and we are not adding it. Doing so would mean the server holds something that can recover your vault — which would invalidate the zero-knowledge claim. The recovery phrase is the deliberate substitute."
tags: ["privacy", "recovery", "anti-feature"]
---

People ask us for an email reset link. We will not add one. This page
explains why, plainly.

## What email recovery would require

For us to send you a "reset your password" email, the server has to hold
something that can re-derive your encryption key. Either a backup of the
key, or a copy of the password hash that we re-derive from. Either way,
something the server controls can decrypt your notes.

### Why that breaks the contract

The whole point of Myne's design is that the server cannot read your notes.
If we add anything that lets us reset your password remotely, the server
suddenly *can* read your notes (or could be coerced into doing so by anyone
with access to it — including us). The privacy floor would drop to "trust
the operator", which is not the floor we want to ship.

## What we use instead

The 24-word recovery phrase. It lives only with you. We do not have a copy.
The server does not have a copy. If you lose both the password and the
phrase, the vault is unrecoverable, and that is the design — not a bug we
will eventually fix.

> Myne's threat model and decisions log are public. The "no email recovery"
> commitment is normative, not aspirational.
