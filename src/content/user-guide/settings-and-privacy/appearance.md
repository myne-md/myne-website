---
title: "Appearance"
category: "settings-and-privacy"
updated: 2026-08-13
summary: "How to switch between the light, dark, AMOLED and system themes, set a custom accent color, import and export custom themes, install a theme from the Themes page, and how the app's appearance behaves while the vault is locked."
tags: ["settings"]
---

The Appearance panel controls how Myne looks. The main choice is the theme.

## Theme

Choose **Light**, **Dark**, **AMOLED** (a true-black variant for OLED screens) or **System**, which follows your operating system's light/dark setting. Each option is shown as a small preview of the app painted in that theme's own colors, so you can compare them without switching. Your choice is saved inside the vault's encrypted preferences. It stays on your device and is never sent anywhere or stored in any cloud.

One small privacy detail: while a vault is **locked**, Myne hasn't decrypted your preferences yet, so the app follows your operating system's appearance until you unlock. Your saved theme applies once the vault is open.

### Accent color

Below the theme picker, **Accent color** sets the highlight color used across the app. Click the swatch to pick one of the presets or type a hex value; **Reset to theme default** puts the theme's own accent back.

This one is stored on this device rather than in the vault, so it does not follow you to another computer, and it is applied only while a vault is unlocked — the lock screen keeps the built-in accent.

### Custom themes

A **Custom theme** lets you use your own color palette instead of the built-in Light or Dark. Open **Settings → Appearance → Custom themes**:

- **Import theme…** picks a `.json` theme file and adds it to the list after checking it.
- **Browse themes** opens Myne's themes page in your browser.
- Each theme shows a small color preview. **Apply** switches to it, **Export** writes a copy back out as plain `.json`, and **Delete** removes it after a confirm step.
- If a theme is rejected, the list shows why — a missing color, an invalid value and its line, a reserved key name, or a pair of colors too close together to read — so you can fix the file.

Themes are stored as encrypted content inside your vault, not as loose files on disk, so there is no themes folder to open. The easiest way to start is to export an existing theme, edit the values, and import it back under a new name.

A custom theme replaces the Light / Dark / AMOLED / System choice while it is active, and it is checked on your device before use (nothing is uploaded). For the full file format — every color key, the ornament and measure tokens, and which value formats are allowed — see the [Custom theme reference](/user-guide/settings-and-privacy/custom-theme-reference/).

### Installing a theme from the Themes page

You don't have to download and import by hand. On the [Themes page](/themes/), **Open in Myne** hands the theme straight to the app: Myne opens (or comes to the front if it's already running) and shows you the theme's name, who it says made it, where it came from, and a preview of its colors. Nothing is added until you choose **Apply theme** — **Cancel** leaves your themes exactly as they were.

A few things worth knowing:

- The theme travels **inside the link**. Myne doesn't fetch the theme from anywhere — the colors are in the link itself — so the Themes page never learns which theme you picked, and there is no download counter.
- **Download .json** goes to GitHub, where the theme files live. That's an ordinary download from a third party, so unlike the link hand-off it isn't private to you.
- If your vault is locked, Myne holds the request and asks you once you've unlocked. Close the app without unlocking and the request is simply forgotten.
- If you already have a theme with the same name, Myne asks whether to replace it or keep both.
- The theme is checked by the same validator as a hand-imported file. A damaged or malformed link is refused with a visible message, and nothing is written.
- **Open in Myne** is a desktop hand-off. On a phone or tablet, use **Download .json** and import the file.

## What moved out of Appearance

Appearance now holds purely-visual controls. Note-authoring settings that used to live here have moved to the new **Editor** panel:

- **Daily notes** setup — the folder they go in and the date format for their titles — is now under **Settings → Editor**. What daily notes are and how to open today's note is covered in [Daily notes](/user-guide/notes-and-organization/daily-notes/).
- **Spell check** — the toggle and language picker — is also under **Settings → Editor**, described in [Spell check](/user-guide/editor-and-writing/spell-check/).

The Editor panel is also where the editor's typography presets live — text size, line spacing, content width, and the editor font. Those are covered in [Editor display](/user-guide/editor-and-writing/editor-display/).

## The rest of the panel

Three smaller controls sit alongside the theme:

- **Show task marker** marks notes you have declared as tasks, in the sidebar and on their tab.
- The per-note timestamp toggle decides whether a note's edit time is shown.
- **Graph appearance** is a pointer, not a control: node colors, labels, sizing and layout forces are set inside the graph itself, from the gear in its corner. **Open graph** takes you there. Those are kept per device, so a change does not follow you to another machine.

## Limits

Appearance settings change presentation only, and never affect what is encrypted or what is stored. Most of them live in the encrypted vault, not in any external account. Two do not: the accent color and the graph's own appearance settings are kept on this device, so they do not travel with your vault.
