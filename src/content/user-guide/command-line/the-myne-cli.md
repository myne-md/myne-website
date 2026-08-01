---
title: "The myne CLI"
category: "command-line"
updated: 2026-08-01
summary: "The myne command reads, searches, and creates notes from a terminal by talking to the running, unlocked app over a local socket. This article covers turning on command-line access, the six commands, the stable --json output, and what each refusal means."
tags: ["notes", "search", "settings", "privacy"]
---

The `myne` command reads, searches, and creates notes from a terminal by talking to the running, unlocked app over a local socket on your device. This article covers turning on command-line access, the commands it offers, the stable `--json` output for scripts, and what each refusal means.

## Prerequisites

- The Myne app open and unlocked. The command line drives the running app; it cannot open a locked vault.
- Command-line access turned on (below). It is off until you enable it.

## Turning on command-line access

Command-line access is off by default. Turn it on in Settings → Privacy; until you do, every command refuses with `CLI access is off`. See [Privacy model](/user-guide/settings-and-privacy/privacy-model/) for what the setting exposes and why it is opt-in.

Run `myne --help` at any time to see the commands:

<div class="ug-cast" data-cast="/casts/cli-help.cast" data-title="myne --help" aria-label="Terminal session: running myne --help lists the available commands"></div>

## The commands

| Command | What it does |
|---|---|
| `myne list` | Print every live note's id, one per line |
| `myne show <id>` | Print one note's Markdown to standard output |
| `myne search <query>` | Full-text search over live notes |
| `myne new [--folder <path>]` | Create a note from standard input |
| `myne daily` | Print today's daily note, creating it if needed |
| `myne daily:append <text>` | Append a line to today's daily note |

Note ids are long, stable identifiers, so `list` and `search` are meant to be piped rather than read by eye — for example `myne list` into another command, or `myne search` to find the id you then pass to `myne show`.

## Searching

`myne search` prints one `id`-and-title line per match. It also prints a fixed advisory reminding you that excluded folders are left out — the advisory is identical on every search, so it can never be read as a count of what was hidden.

<div class="ug-cast" data-cast="/casts/cli-search.cast" data-title="myne search" aria-label="Terminal session: myne search prints matching note ids and titles"></div>

An excluded note's id looks exactly like an unknown one, and an excluded search hit is simply absent. Writing into an excluded folder with `new --folder` is refused rather than silently redirected.

## Output for scripts

Add the global `--json` flag before any command for a stable, single-line envelope instead of the human text — `{"ok":true,"notes":[…]}` for `list`, `{"ok":true,"body":"…"}` for `show`, and `{"ok":false,"error":{"kind":"…","message":"…"}}` on failure. The shape is a promise to scripts and does not change with the wire protocol underneath.

## When a command is refused

Every command checks its preconditions before doing anything and fails with a specific message and exit code — it never prompts. Running a command while the vault is locked, for instance, refuses at once:

<div class="ug-cast" data-cast="/casts/cli-locked.cast" data-title="myne list (locked)" aria-label="Terminal session: myne list is refused because the vault is locked"></div>

| Exit code | Meaning |
|---|---|
| 0 | Success |
| 2 | Usage error (unknown command or wrong arguments) |
| 3 | Myne is not running |
| 4 | The vault is locked |
| 5 | Command-line access is off |
| 6 | No matching note |
| 7 | The folder is excluded from command-line access |
| 8 | Too many requests in a short time |

## Limits

The command line is not a second way into your vault. It reaches your notes only by asking the running, unlocked app over a device-local socket; it never opens the vault, holds a key, or reads anything from disk itself. It cannot unlock a locked vault and cannot run while the app is closed, so closing or locking Myne closes this door too. Trashed notes and templates are absent from `list`, `search`, and `show`, matching the app's own lists, and folders you exclude from command-line access stay invisible to it.
