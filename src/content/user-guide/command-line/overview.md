---
title: "Command line"
category: "command-line"
updated: 2026-08-01
summary: "The myne command-line client lets you read, search, and add notes from a terminal. It talks to the Myne app you already have open and unlocked over a local socket on your device, and never opens the vault, holds a key, or asks for a password itself."
tags: ["notes", "settings"]
---

The `myne` command-line client lets you read, search, and add notes from a terminal. It talks to the Myne app you already have open and unlocked over a local socket on your device, and never opens the vault, holds a key, or asks for a password itself.

## When you might use it

The command line is for scripting and quick terminal work — piping a note into another tool, appending a captured thought to today's daily note, or searching without leaving the shell. It is an optional power-user surface; everything it does is also available in the app.

## What it needs

Because it drives the running app rather than the vault, the app must already be open, unlocked, and have command-line access turned on. When any of those is not true, the command refuses with a clear message and never prompts for anything. See [The myne CLI](/user-guide/command-line/the-myne-cli/) for the full command set and how to turn it on.

## Limits

The command line reaches your notes only through the running, unlocked app over a device-local socket — it is not a second way into the vault. It cannot open a locked vault, and it cannot run when the app is closed. Folders you have excluded from command-line access stay invisible to it, exactly as they do in the app.
