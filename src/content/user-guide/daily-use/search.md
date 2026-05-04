---
title: "Search across your vault"
category: "daily-use"
updated: 2026-05-04
summary: "Search runs locally against the decrypted index built when the vault unlocks. The index lives in memory, not on disk; closing the vault wipes it."
tags: ["search", "vault"]
---

Search opens with `Ctrl/Cmd-K`. It matches against note titles and bodies in
the currently-open vault. Results stream as you type.

## How the index works

Each unlock decrypts notes once and builds an in-memory inverted index.
Subsequent searches are fast because the work happened at unlock time. The
index never touches disk in plaintext form.

### What about closed vaults

If a vault is locked, search cannot reach inside it. There is no global
"search all my vaults" mode that would require holding multiple keys at
once.

## Phase 2 — coming later

Fuzzy matching, regex patterns, and tag-scoped search are on the Phase 2
list. The current iteration is exact substring matching only — fast and
predictable.
