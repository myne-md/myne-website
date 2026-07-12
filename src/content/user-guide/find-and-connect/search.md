---
title: "Search"
category: "find-and-connect"
updated: 2026-07-11
summary: "How to search across every note in your vault from the command palette, what the results show, how attachment text is folded into search where available, and how search stays private to your device."
tags: ["search", "attachments"]
---

Search lives in the command palette. Press `⌘K` (or its alias `⌘P`) to open it: it shows commands first, and as you type it searches the full text of every note in your vault.

![The command palette open with a search term entered and matching note results listed.](./search.png)

## What it searches and how it ranks

Search covers each note's title and body, and ranks results by relevance (using BM25). A few specifics worth knowing:

- **All your terms must match**: typing two words finds notes containing both.
- **The last word matches as a prefix**, so results narrow as you type `rus` → `rust`.
- **Title matches rank higher** than body-only matches.
- Results are capped at the top matches, so the list stays focused.
- Search understands word stems in **English, Turkish, and German**: searching "running" also finds "run". Other languages match on the exact words.

Results update live as your notes change, because the index keeps up with your edits.

## Attachment text

Where Myne can read text out of a file you have attached, that text is folded into the owning note's searchable content. A note can then turn up in search on words that appear inside its attachment, not only its own prose, and it surfaces the same way a body match does.

Text extraction happens entirely on your device — no file is ever sent anywhere to be read. It covers the text layer of PDFs, Word `.docx` files, and plain-text files such as `.txt`, `.md`, and `.csv`. Scanned PDFs and images have no text layer, so nothing is extracted from them; there is no image text recognition yet. The extracted text is stored encrypted at rest, under the same protection as the rest of your vault, and is removed when you permanently delete the attachment.

## What a result shows, and what it doesn't

Each result shows the note's **title**. If a note matched only in its body, it carries a small **↳ matched in body** hint so you know why it's there. A match inside an attachment's text surfaces the note through the same body-side path.

What you never see is a snippet of the note's text. That is deliberate: results never decrypt your notes just to preview them. The search index holds what it needs to rank matches, not readable copies of your content, so a result list can't leak a line you'd rather keep closed.

Notes in the Trash and notes marked as templates are hidden from the sidebar and never appear in search results. Search also returns nothing while the vault is locked; there is no index to read until you unlock.

## Private by design

The search index — including any extracted attachment text — is encrypted like your notes; if it's ever missing, Myne rebuilds it, which costs one slower unlock and nothing more. How that fits the wider model is covered in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).

This is the in-app search; the search box on this website is separate and only searches these guide pages.

## Limits

Search reads the vault's own encrypted index and only what has been indexed. Attachment text is included only where a text layer exists — scanned PDFs and images are not read, and there is no cloud extraction or optical character recognition. Results never carry a decrypted snippet of your content, and search is empty while the vault is locked.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open the command palette / search | ⌘K (alias ⌘P) | Ctrl K (alias Ctrl P) |
