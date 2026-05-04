---
title: "Workflow tweaks"
category: "settings-privacy"
updated: 2026-05-04
summary: "Knobs that change ergonomics without touching the privacy floor — auto-lock timeout, default editor mode, vault file path, custom sync URL. None of these affect what the server can see."
tags: ["settings", "customization"]
---

Myne ships with sensible defaults; almost no one needs to change anything to
use it. The settings panel exists for the people who want to.

## Auto-lock timeout

By default the vault stays unlocked while the app is in focus, locks after
five minutes of system idle, and locks immediately when you quit the app.
You can shorten the idle timeout to one minute or extend it to thirty.

### Why there is no "never lock" option

Leaving a vault unlocked indefinitely is a footgun. If you really want it,
the OS keychain can hold the password for you — that is a clearer choice
than building it into Myne.

## Vault file location

The default location depends on your OS — `~/Documents/Myne/` on macOS, the
equivalent under `Documents` on Windows and Linux. You can move it; Myne
remembers the new path between sessions.

### Sync server URL

Defaults to the Myne hosted server. Change it to your own URL if you are
self-hosting. The protocol is the same; the trust model is the same. Read
the *Self-host* section once it is published.
