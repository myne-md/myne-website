---
title: "Settings & privacy"
category: "settings-and-privacy"
updated: 2026-07-31
summary: "An overview of Myne's settings panels and the privacy model behind them: account, privacy controls, sync, editor and files behaviour, appearance and language, hotkeys, storage, the on-device AI beta, and what Myne deliberately does not do."
tags: ["settings", "privacy"]
---

Settings is where you adjust how Myne works, and this section also explains the privacy model the whole app is built on. This page is the tour; the rest of the section goes deeper.

## Opening settings

With a vault open, open Settings from the gear in the bottom bar or with `⌘,`. It opens over the editor. The left rail lists its panels, in order:

- **Account** holds the Argon2id key-derivation readout, your vault's label and icon, connected browser extensions, the Change password action, and, under Danger zone, Delete vault. See [Account](/user-guide/settings-and-privacy/account/).
- **Privacy** holds screen-capture protection, auto-lock, quick unlock, and the continue where you left off sync toggle. See [Auto-lock and screen-capture protection](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/) and [Quick unlock](/user-guide/settings-and-privacy/quick-unlock/).
- **Sync** connects a sync server, adds and manages the devices on your account, and resolves sync conflicts. See the [Sync and devices](/user-guide/sync-and-devices/overview/) section.
- **Editor** holds note-authoring behaviour: the default [view mode](/user-guide/editor-and-writing/view-modes/) a note opens in, typography presets (text size, line spacing, content width, font family), the [line-number gutter](/user-guide/editor-and-writing/editor-display/) toggle, the [focus-mode](/user-guide/editor-and-writing/focus-mode/) behaviours (typewriter scroll and dimming inactive lines), [spell check](/user-guide/editor-and-writing/spell-check/) with its language picker, and [daily-notes](/user-guide/notes-and-organization/daily-notes/) configuration (folder, date format, template).
- **Files** sets which file opens when the app starts and where new notes are created. See [Files](/user-guide/settings-and-privacy/files/).
- **Hotkeys** lists every bindable command, lets you search them, and lets you add or remove a shortcut per command, restore defaults, or restore everything; conflicts are flagged as warnings and never block. See [Customizing keyboard shortcuts](/user-guide/settings-and-privacy/custom-hotkeys/).
- **Appearance** holds the interface [language](/user-guide/settings-and-privacy/language/) selector, the light / dark / AMOLED / system theme, per-note timestamp visibility, and custom themes. See [Appearance](/user-guide/settings-and-privacy/appearance/).
- **Storage** covers backing up, restoring, and importing, plus automatic backups — a device-local recurring encrypted backup with an enable toggle, a cadence (every unlock, daily, or weekly), a target folder, how many to keep, and a last-run status line. The manual flows live in [Back up your vault](/user-guide/safety-and-recovery/back-up-your-vault/), [Restore from a backup](/user-guide/safety-and-recovery/restore-from-a-backup/), and [Import from Obsidian](/user-guide/attachments-and-import/import-from-obsidian/).
- **About** holds version information and a changelog.

Below these, a **Labs** section groups experimental features:

- **AI** (marked Beta) holds the on-device AI features. AI is off until you opt in, runs locally, and makes no network request for your notes.

A custom theme can replace the light / dark / AMOLED / system choice; for the full file format, see the [Custom theme reference](/user-guide/settings-and-privacy/custom-theme-reference/).

## Closing settings

Close settings with `Esc`, by clicking outside it, or with its close button. There is one exception: while a password change is being processed, settings won't close until the operation finishes. See [Change your password](/user-guide/settings-and-privacy/change-your-password/).

## What's in this section

- **[How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/)** covers the privacy model, in plain language and in detail.
- **[Account](/user-guide/settings-and-privacy/account/)** covers the Account panel and your account number.
- **[Appearance](/user-guide/settings-and-privacy/appearance/)** covers themes and display.
- **[Language](/user-guide/settings-and-privacy/language/)** covers the interface language selector.
- **[Files](/user-guide/settings-and-privacy/files/)** covers the startup file and default new-note location.
- **[Auto-lock and screen-capture protection](/user-guide/settings-and-privacy/auto-lock-and-screen-capture/)** covers the two privacy controls.
- **[Change your password](/user-guide/settings-and-privacy/change-your-password/)** covers rotating your master password.
- **[Delete a vault](/user-guide/settings-and-privacy/delete-a-vault/)** covers removing a vault for good.
- **[What Myne doesn't do](/user-guide/settings-and-privacy/what-myne-doesnt-do/)** covers the deliberate non-features.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
