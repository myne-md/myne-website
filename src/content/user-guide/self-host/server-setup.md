---
title: "Self-host: server setup"
category: "self-host"
updated: 2026-05-04
summary: "Self-hosting will be available in Phase 2. The protocol is fixed; the server is in design. This article will fill in once the server is ready to ship."
tags: ["self-host", "phase-2", "server"]
---

Self-hosting will be available in Phase 2. The protocol is fixed; the server
is in design.

## What this page will cover

System requirements, container image, configuration knobs, TLS setup,
backups, and the operator's view of the trust boundary. None of that is
final yet.

### Why the delay

Building a server image before the client is in users' hands invites
backwards-incompatible churn. Phase 1 client first, hosted server second,
self-host package third. That order minimizes the cost of design changes.

## Where to follow along

The ledger publishes shipped milestones; the decisions log captures
trade-offs. Both are public on myne.md.
