---
title: "Self-host: the protocol"
category: "self-host"
updated: 2026-05-04
summary: "Self-hosting will be available in Phase 2. The protocol is fixed; the server is in design. This article will fill in once the server is ready to ship."
tags: ["self-host", "phase-2", "protocol"]
---

Self-hosting will be available in Phase 2. The protocol is fixed; the server
is in design.

## What you can read today

The full protocol specification is public on the main repo under
`docs/spec/protocol.md`. It describes the client side completely; the server
side is the inverse of the same primitives.

### What is different about self-host

Nothing at the protocol level. The trust boundary, the cryptographic
identifiers, the on-disk format — all identical. Self-hosting changes the
operator, not the contract.

## Where to follow along

The decisions log tracks every server-side decision as it lands. Phase 2
will ship a self-host guide here when the server image is ready.
