---
title: "Developer mode"
category: "settings-and-privacy"
updated: 2026-10-15
summary: "Developer mode reveals the settings Myne keeps out of the way by default: the AI, Network and CLI panels, and Vim keyboard mode in the Editor panel. It is set per vault and per device, takes effect immediately, and turning it back off only hides those settings again."
tags: ["settings", "security", "privacy"]
---

Developer mode reveals the settings Myne keeps out of the way by default: the ones where you leave the path Myne vouches for, and the power-user tools most people never need. It is a switch in the About panel, it is set per vault on the device you set it on, and turning it back off hides those settings again without turning any of them off.

## Prerequisites

- A vault open. Settings is only available once a vault is unlocked.

## Turning it on

Open Settings from the gear in the bottom bar or with `⌘,`, choose **About** in the left rail, and switch on **Developer mode**. It takes effect immediately — there is no restart and no confirmation step.

The setting is per device: switching it on here does not switch it on anywhere else, and each vault on this device decides separately. It is kept with the rest of this vault's preferences, in the encrypted preferences file, which travels to the server like the rest of your vault and stays unreadable there. What "per device" means is that your choice here is the one that wins on this device, not that the value never leaves it: a [backup](/user-guide/safety-and-recovery/back-up-your-vault/) carries it along, and a brand-new device that has never had an opinion starts from whatever the vault last held.

## What it reveals

Turning it on adds a **Developer** section at the bottom of the settings rail, holding three panels:

- **AI** — Myne's experimental AI features. AI is off until you opt in, and nothing is sent anywhere until you name a provider. See [Where your AI runs](/user-guide/ai/where-your-ai-runs/).
- **Network** — the option to send Myne's sync traffic through Tor. See [Routing sync through Tor](/user-guide/settings-and-privacy/route-sync-through-tor/).
- **CLI** — terminal access, the door that lets the `myne` command on this machine read and change an unlocked vault, plus the folders it never sees and its rate limit. See [The myne command-line client](/user-guide/command-line/the-myne-cli/).

It also reveals one setting that stays in the panel where its topic lives, rather than moving into the Developer section:

- **Vim keyboard mode**, in the **Editor** panel. See [Vim mode](/user-guide/editor-and-writing/vim-mode/).

Look for a Vim setting in Editor, then, and for a terminal setting in CLI. The CLI surface used to sit inside Privacy; it is a panel of its own now because it is a whole client rather than one switch, and Privacy keeps the controls about what somebody looking at this machine can see.

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
