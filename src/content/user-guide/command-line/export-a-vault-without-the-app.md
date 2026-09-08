---
title: "Export a vault without the app"
category: "command-line"
updated: 2026-09-07
summary: "The myne-decrypt command exports a vault to plain Markdown without the app installed, using your master password or recovery phrase. This article covers downloading it, running it, what it writes, and the one thing it cannot open."
tags: ["backup", "recovery", "privacy", "notes"]
---

The `myne-decrypt` command reads a vault folder (or a `.myne-backup` file) and writes the notes and their attachments out as plain Markdown, without the app installed. It is the tool for the moment you want to walk away with your files and no longer have Myne running.

## Prerequisites

- A vault folder on disk, or a `.myne-backup` file made by the app.
- Your master password, or your recovery phrase.
- macOS, Linux, or Windows. The command ships as a separate download for each.

## Downloading the command

`myne-decrypt` is published beside the app on the downloads page, signed the same way the app's release hashes are. Download the file for your operating system and verify its hash against the published list before running it.

The source of this tool is not yet public, so the binary cannot be independently verified. It exports your vault to plain Markdown without the app installed; it does not claim to work without us.

## Running it

Open a terminal and run:

```
myne-decrypt <vault-or-backup> <out-dir>
```

`<vault-or-backup>` is the path to your vault folder or your `.myne-backup` file. `<out-dir>` is where the plain Markdown tree is written; it must not already exist.

The command asks for your master password with the prompt hidden as you type. To unlock with your recovery phrase instead, add `--recovery`. For scripting, pipe the password or phrase on standard input; there is no `--password` flag and no environment variable, so the credential never lands in your shell history or a process listing.

## What it writes

The command writes one `.md` file per note, in the same folder structure the app shows, with attachments in an `attachments/` folder beside them and links rewritten to point at the exported files. Notes you deleted but did not purge are not exported, and note snapshots are not exported.

When it finishes it prints the directory it wrote to. Read that line: it names where your plaintext now lives.

## Limits

The command decrypts your vault, so the exported folder is plaintext on disk. If you point `<out-dir>` at a folder that syncs to a cloud service, the command warns you and asks you to confirm with `--yes` before it proceeds.

Two things the command cannot open, because they are sealed under a key held only by the device that made them: a non-empty `captures/` folder (notes dictated from a watch while the vault was locked) and a non-empty `pending-shares/` folder (files shared into the app while it was locked). If either is present, the command says so. Recover those from inside the app on the device that made them.

The command exports the notes and attachments the vault holds. It does not export your custom themes, your personal dictionary, or your saved views.
