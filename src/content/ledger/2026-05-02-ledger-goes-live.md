---
title: "Ledger goes live"
date: 2026-05-02
type: milestone
author: furkan
summary: "We are starting a public ledger of the project's threat-model, protocol, and spec decisions. The bar is high — only changes that affect what Myne guarantees, not weekly progress. Subscribe via RSS; we will post when there is something worth saying."
tags: [meta, ledger]
---

This is the first entry in the Myne ledger. It exists so that there is one
public-facing surface, in plain English, where you can see *what changed in
Myne and why* — at a higher resolution than the project's internal decision
log, but with the same append-only discipline.

## What it is

A hand-authored record of three kinds of change:

- **`shipped`** — a protocol, threat-model, or spec change has landed and the
  consequences are now in code or in `docs/`.
- **`thinking`** — a decision rationale we want to make public before it gets
  buried by the next month of work.
- **`milestone`** — a project moment that does not fit either of the above
  but is worth marking in public.

## What it isn't

It is not a blog. It is not a roadmap. It is not a release notes page (those
will live at `/releases` when the auto-updater manifest ships). It is not a
status feed.

## The editorial bar

Only changes to:

- the threat model (`docs/threat-model.md`)
- the protocol (`docs/spec/protocol.md`, `docs/spec/account-number.md`)
- the spec layer (`docs/glossary.md` and the internal decision log)
- public-facing behavior (recovery flow, account-number rendering, sync
  semantics)

If a change does not move one of those, it does not go here.

## Cadence

There is no cadence promise. We post when we post. To follow without
checking the page, [subscribe to the RSS feed](/ledger/rss.xml).
