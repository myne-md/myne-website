---
title: "Vim mode"
category: "editor-and-writing"
updated: 2026-08-13
summary: "Vim mode is an optional modal-editing keymap for the note editor: normal, insert, and visual modes with the usual motions and operators. It is off by default and sits behind Developer mode — turn that on in Settings → About, then turn on Vim keyboard mode in Settings → Editor, after which notes open in Source view."
tags: ["editor", "settings"]
---

Myne's editor can run an optional vim keymap. When it is on, the editor uses vim's modal editing — normal, insert, and visual modes, with the usual motions and operators — in place of the standard keybindings. It is powered by the third-party `@replit/codemirror-vim` engine, it is off by default, and the control that turns it on is kept behind Developer mode. It changes how the keyboard drives the editor, and nothing about how your notes are stored.

## Turning vim mode on

Vim mode sits behind Developer mode, so there are two steps.

1. Open **Settings → About** and turn on **Developer mode**. It is a device-local switch that reveals the advanced settings Myne keeps out of the way by default. Until it is on, Settings → Editor shows no vim row at all.
2. Open **Settings → Editor**. Under **Editing**, turn on **Vim keyboard mode**. The helper text reads: "Use vim keys in the editor: normal, insert and visual modes, with the usual motions and operators. Off by default. Notes open in source view while this is on."

The change applies to the note you are editing right away, with no restart. The vim engine loads the first time you switch the toggle on and not before; on the desktop app it ships inside the bundle, so nothing is fetched over the network to enable it.

Turning Developer mode back off hides the control but does not turn vim mode off — an active keymap keeps interpreting your keystrokes. To stop using vim keys, turn the **Vim keyboard mode** toggle off first, then turn Developer mode off.

## What vim mode changes

- The editor becomes modal: normal, insert, visual, and replace modes, with vim's usual motions, operators, counts, and registers.
- The bottom bar shows the current mode — Normal, Insert, Visual, or Replace — so you can see which mode you are in.
- Notes open in Source view while vim mode is on, because live preview hides the markdown characters that vim's motions move over. This is a default only: if you have set a [default view mode](/user-guide/editor-and-writing/view-modes/), that setting still wins.
- The `:` command line supports a fixed set of commands. `:w`, `:wq`, and `:x` flush the note's pending save; `:q` closes the note tab; `:s` and `:%s` substitute text. Commands that would define or persist behaviour — `:set`, `:map` and its `:nmap` / `:imap` / `:vmap` siblings, `:source`, and `:e` — are declined with a message rather than run. Vim mode is a keymap, not a configuration file. A `:s` or `:%s` whose pattern uses vim-only regex syntax is declined too, and nothing in the note is changed — Myne would rather say it cannot do it than rewrite something other than what you asked for.

## On Windows and Linux

On macOS, vim's `Ctrl-` chords do not collide with Myne's own shortcuts, so the full grammar is available. On Windows and Linux, Myne's shortcuts use `Ctrl` and take priority, so the vim chords that would collide with them are unavailable in the editor: `Ctrl-a`, `Ctrl-b`, `Ctrl-d`, `Ctrl-e`, `Ctrl-f`, `Ctrl-i`, `Ctrl-p`, `Ctrl-t`, `Ctrl-v`, `Ctrl-w`, and `Ctrl-x`. `Ctrl-[` still works as Escape, and visual-block moves to `Alt-v`. The settings toggle states this while vim mode is on.

## Limits

Vim mode is an editor keymap only. It changes how the keyboard drives the editor, and nothing about how your notes are stored or encrypted. Developer mode, which reveals the toggle, is a way of keeping advanced settings out of the way rather than a protection: hiding a control does not stop what you already switched on.

Your on/off choice lives inside the vault's encrypted preferences, is not written in plaintext, and does not leave your device. Until you turn on sync or name a remote AI provider, Myne runs entirely on your device; nothing leaves it.
