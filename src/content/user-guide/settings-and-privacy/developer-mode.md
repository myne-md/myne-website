---
title: "Developer mode"
category: "settings-and-privacy"
updated: 2026-08-24
summary: "Developer mode reveals the settings Myne keeps out of the way by default: the AI and Network panels, Vim keyboard mode in the Editor panel, and Terminal access in the Privacy panel. It is set per vault and per device, takes effect immediately, and turning it back off only hides those settings again."
tags: ["settings", "security", "privacy"]
---

Developer mode reveals the settings Myne keeps out of the way by default: the ones where you leave the path Myne vouches for, and the power-user tools most people never need. It is a switch in the About panel, it is set per vault on the device you set it on, and turning it back off hides those settings again without turning any of them off.

## Prerequisites

- A vault open. Settings is only available once a vault is unlocked.

## Turning it on

Open Settings from the gear in the bottom bar or with `⌘,`, choose **About** in the left rail, and switch on **Developer mode**. It takes effect immediately — there is no restart and no confirmation step.

The setting is not synced, so it does not travel to your other computers: each device decides for itself, and so does each vault on that device. It is kept with the rest of this vault's preferences, which means a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) of the vault carries it along; sync never does.

## What it reveals

Turning it on adds a **Developer** section at the bottom of the settings rail, holding two panels:

- **AI** — Myne's experimental AI features. AI is off until you opt in, and nothing is sent anywhere until you name a provider. See [Where your AI runs](/user-guide/ai/where-your-ai-runs/).
- **Network** — the option to send Myne's sync traffic through Tor. See [Routing sync through Tor](/user-guide/settings-and-privacy/route-sync-through-tor/).

It also reveals two settings that stay in the panels where their topic lives, rather than moving into the Developer section:

- **Vim keyboard mode**, in the **Editor** panel. See [Vim mode](/user-guide/editor-and-writing/vim-mode/).
- **Terminal access**, in the **Privacy** panel — the door that lets the `myne` command on this machine read and change an unlocked vault. See [The myne command-line client](/user-guide/command-line/the-myne-cli/).

Those two keep their homes on purpose, so looking for a Vim setting still lands you in Editor and looking for terminal access still lands you in Privacy.

## Turning it back off

Turning Developer mode off **hides** these settings. It does not turn any of them off. A terminal-access socket you enabled keeps serving, and a Vim keymap you enabled keeps running — the mode controls what Settings shows you, not what the app is doing.

So switch a feature off from its own control first, and then turn off Developer mode. If you turn the mode off while something behind it is still on, turn the mode back on to reach the control again.

## Limits

Developer mode is a way of keeping advanced settings out of the way. It is not a security boundary, and this guide will not describe it as one. It changes what the settings rail, the settings search and the command palette offer you; it does not stop anything you have already enabled from running, and it is no barrier at all against software already running on your device.

What sits behind it is what Myne does not vouch for on your behalf: a model runtime or a remote provider you supply, a terminal process outside Myne, and a relay network nobody here operates. Each of those has its own limits, stated in its own article.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
