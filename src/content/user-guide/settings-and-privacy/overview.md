---
title: "Settings & privacy"
category: "settings-and-privacy"
updated: 2026-10-18
summary: "An overview of Myne's settings panels and the privacy model behind them: the account and vault panels, privacy controls, sync, editor and files behaviour, transcription, appearance and language, hotkeys, storage, the AI beta and where its work runs, Tor routing, the CLI, and what Myne deliberately does not do."
tags: ["settings", "privacy"]
---

Settings is where you adjust how Myne works, and this section also explains the privacy model the whole app is built on. This page is the tour; the rest of the section goes deeper.

## Opening settings

With a vault open, open Settings from the gear in the bottom bar or with `⌘,`. It opens over the editor. The left rail lists its panels, in order:

- **Account** names the account this device groups its vaults under, lists those vaults, and pairs connected browser extensions with the clipper. See [Account](/user-guide/settings-and-privacy/account/).
- **Vault** holds this vault's own label and icon, the Change password action, and, under Danger zone, Delete vault. See [Vault](/user-guide/settings-and-privacy/vault/).
- **Privacy** holds screen-capture protection, whether vault names appear on the lock screen, auto-lock, and quick unlock, in that order. See [Auto-lock and screen-capture protection](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/), [Quick unlock](/user-guide/settings-and-privacy/quick-unlock/), and [Vault names on the lock screen](/user-guide/settings-and-privacy/vault-names-on-the-lock-screen/).
- **Sync** connects a sync server, adds and manages the devices on your account, resolves sync conflicts, and holds the vault-format upgrade. See the [Sync and devices](/user-guide/sync-and-devices/overview/) section.
- **Editor** holds note-authoring behaviour: the default [view mode](/user-guide/editor-and-writing/view-modes/) a note opens in, typography presets (text size, line spacing, content width, font family), the [line-number gutter](/user-guide/editor-and-writing/editor-display/) toggle, [how dates, times and the time zone are printed](/user-guide/settings-and-privacy/dates-and-times/) across the app, the [focus-mode](/user-guide/editor-and-writing/focus-mode/) behaviours (typewriter scroll and dimming inactive lines), the [selection toolbar's](/user-guide/editor-and-writing/selection-toolbar/) buttons and their order, [spell check](/user-guide/editor-and-writing/spell-check/) with its language picker, [periodic-notes](/user-guide/notes-and-organization/periodic-notes/) configuration (a folder, title format and template for each of daily, weekly and monthly), task reminders, and the Archive and Views feature toggles. With Developer mode on it also holds **Vim keyboard mode**.
- **Files** sets which file opens when the app starts, where new notes are created, whether a note can act as its folder's index, whether imported images are compressed, and whether text is read out of image and scanned-PDF attachments for search. See [Files](/user-guide/settings-and-privacy/files/).
- **Transcription** turns speech-to-text on or off. It runs on this device with a model that ships inside Myne, and turning it off hides the Transcribe action everywhere. See [Voice notes](/user-guide/attachments-and-import/voice-notes/).
- **Hotkeys** lists every bindable command, lets you search them, and lets you add or remove a shortcut per command, restore defaults, or restore everything; conflicts are flagged as warnings and never block. See [Customizing keyboard shortcuts](/user-guide/settings-and-privacy/custom-hotkeys/).
- **Appearance** holds the interface [language](/user-guide/settings-and-privacy/language/) selector, the light / dark / AMOLED / system theme, a custom accent color, per-note timestamp visibility, the task-marker toggle, a pointer to the graph's own appearance controls, and custom themes. See [Appearance](/user-guide/settings-and-privacy/appearance/).
- **Storage** shows where your vault folder lives, with a button to open it, and covers backing up, restoring, and importing, plus automatic backups — a device-local recurring encrypted backup with an enable toggle, a cadence (every unlock, daily, or weekly), a target folder, how many to keep, and a last-run status line. It also holds Export vault as Markdown, which writes a plain, unencrypted copy. Import brings notes in from a Myne backup, Obsidian, Notion, Evernote, HTML files or a CSV. The manual flows live in [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/), [Restore from a backup](/user-guide/safety-and-recovery/restore-from-a-backup/), and [Import your notes](/user-guide/attachments-and-import/import-your-notes/).
- **About** holds the version, the build channel (Stable or Development build) and the commit this copy was built from, a link to Myne's public threat model, a link to the published privacy policy (which opens in your browser), the licence, and the **Developer mode** toggle. In a browser the Build row describes the bundle the server sent you rather than an installer, and prints that bundle's hash under the commit.

Panels with more than one concern add a second level of navigation: a strip of topic tabs across the top of the panel's content, level with the **Search settings…** row, so a long panel is not one scroll. **Editor** splits into Text & display, Editing, Writing, Tasks, Periodic notes and Features; **Privacy** into Access and Locking; **Vault** into Vault and Danger zone; **Appearance** into Display, Note list and Interface; **Sync** into Connection, Devices and members, and Conflicts; and **AI** into General, Models, Limits and Advanced. A panel with a single concern — Storage, Files, Transcription, Hotkeys, About, Network — shows no strip. Left and Right move between a panel's topics; Up and Down still cycle the panels in the rail.

Below these sits a **Developer** section, which appears only once you have turned on Developer mode in the About panel. It groups the settings where you leave the path Myne vouches for:

- **AI** holds Myne's experimental AI features, switched on with its **Enable AI features** toggle. AI is off until you opt in, and nothing is sent anywhere until you name a provider. With no provider named, the model runs on your device. You can also name a model runtime on your own machine, or a remote service — the panel says which one is answering, and asks before anything leaves. See [Where your AI runs](/user-guide/ai/where-your-ai-runs/).
- **Network** holds the option to route Myne's sync traffic through Tor. It is off by default, and it changes where your connection comes from — not what the server can see. See [Routing sync through Tor](/user-guide/settings-and-privacy/route-sync-through-tor/).
- **CLI** holds terminal access, which opens your unlocked vault to the `myne` command on this machine, together with the folders the terminal never sees and its rate limit. See [The myne CLI](/user-guide/command-line/the-myne-cli/).

On a computer, a panel that covers several concerns shows a row of tabs across the top of its content, level with the settings search box, one tab per concern: **Vault** (Vault, Danger zone), **Privacy** (Access, Locking), **Sync** (Connection, Devices and members, Conflicts), **Editor** (Text & display, Editing, Writing, Tasks, Periodic notes, Features), **Appearance** (Display, Note list, Interface) and **AI** (General, Models, Limits, Advanced). The other panels are short enough to need none. Myne remembers which tab you had open in each panel for as long as it stays open. Where a path in this guide runs through one of those panels, it names the tab, as in **Settings → Editor → Editing**.

On a phone, Settings is a full-screen sheet rather than a left rail, and the categories use the same names in the same order, so **Privacy** means the same group of things on both of your devices. Two groups differ because a phone's surface does. The vault-scoped controls (the vault's name, its icon, Change password, and quick unlock) sit in a **Vault** category of its own, and the export and attachment controls sit in **Data**. A few desktop panels have no phone counterpart at all, so their settings stay on your computer: **Files**, **Hotkeys**, **Storage**, **Network**, **Terminal access** (its own **CLI** panel in the Developer section on a computer) and **Transcription** (whose only phone control is a single switch inside Privacy).

A custom theme can replace the light / dark / AMOLED / system choice; for the full file format, see the [Custom theme reference](/user-guide/settings-and-privacy/custom-theme-reference/).

## Finding a setting

A **Search settings…** box sits at the top of the left rail; press `/` anywhere in Settings to jump into it. Type part of a label and the list narrows to matching settings, grouped by the panel they live in. Choosing a result opens that panel, on the tab the setting is on, and briefly highlights the row, so you can see which control you landed on. Pressing `Esc` clears the search first; press it again to close Settings.

Search reads its own list of settings rather than the panels themselves, so it is not quite the whole rail. Two rows behave differently today: **Developer mode** in About and **Show task marker** in Appearance have no search entry, so they will not appear however you spell them. A setting hidden behind Developer mode does not appear until Developer mode is on.

## Developer mode

Some settings stay hidden until you ask for them, in **About → Developer mode**. Turning it on reveals the **AI**, **Network** and **CLI** panels, and **Vim keyboard mode** under Editor. Turning it back off only hides them again — anything you switched on stays on, and you switch it off from its own control. See [Developer mode](/user-guide/settings-and-privacy/developer-mode/).

## Closing settings

Close settings with `Esc`, by clicking outside it, or with its close button. There is one exception: while a password change is being processed, settings won't close until the operation finishes. See [Change your password](/user-guide/settings-and-privacy/change-your-password/).

## What's in this section

- **[How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/)** covers the privacy model, in plain language and in detail.
- **[Account](/user-guide/settings-and-privacy/account/)** covers the Account panel, the account grouping, and your account number.
- **[Vault](/user-guide/settings-and-privacy/vault/)** covers the Vault panel: its label and icon, change password, and deletion.
- **[Appearance](/user-guide/settings-and-privacy/appearance/)** covers themes and display.
- **[Language](/user-guide/settings-and-privacy/language/)** covers the interface language selector.
- **[Files](/user-guide/settings-and-privacy/files/)** covers the startup file and default new-note location.
- **[Auto-lock and screen-capture protection](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/)** covers the two privacy controls.
- **[Quick unlock](/user-guide/settings-and-privacy/quick-unlock/)** covers re-entering after auto-lock with a PIN or Touch ID.
- **[Vault names on the lock screen](/user-guide/settings-and-privacy/vault-names-on-the-lock-screen/)** covers what the vault picker shows before you unlock, and the setting that keeps names off it.
- **[Change your password](/user-guide/settings-and-privacy/change-your-password/)** covers rotating your master password.
- **[Customizing keyboard shortcuts](/user-guide/settings-and-privacy/custom-hotkeys/)** covers the Hotkeys panel.
- **[Developer mode](/user-guide/settings-and-privacy/developer-mode/)** covers the switch that reveals the advanced settings.
- **[Routing sync through Tor](/user-guide/settings-and-privacy/route-sync-through-tor/)** covers the Network panel.
- **[Delete a vault](/user-guide/settings-and-privacy/delete-a-vault/)** covers removing a vault for good.
- **[What Myne doesn't do](/user-guide/settings-and-privacy/what-myne-doesnt-do/)** covers the deliberate non-features.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
