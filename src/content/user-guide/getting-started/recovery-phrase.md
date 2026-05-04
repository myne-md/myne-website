---
title: "Save your recovery phrase"
category: "getting-started"
updated: 2026-05-04
summary: "Your recovery phrase is the only fallback when you forget your password. Write it down by hand, store two copies, and treat it like a key to a safe deposit box — because that is exactly what it is."
tags: ["recovery", "phrase", "vault"]
---

Right after you create a vault, Myne shows you 24 words in a fixed order.
That is your recovery phrase. It is generated from a standard wordlist
(BIP-39) and fed into the same key-derivation function as your password.

## How to store it

Write the phrase down on paper. Avoid taking a screenshot or pasting it into
a notes app on the same device — if the device is lost or compromised, the
phrase goes with it.

### Two copies, two places

We recommend two copies — one in a password manager you trust, one on paper
somewhere safe. If a fire takes the paper, you still have the manager. If the
manager is breached, you still have the paper, and you can rotate to a new
vault.

## What you cannot do with it

The phrase is not a username. It is not a recovery email substitute that we
can verify on the server. We do not have it. The server does not have it.
There is no email reset. If you lose both the password and the phrase, the
vault is unrecoverable, and that is the design.
