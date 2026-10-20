---
title: "Appearance"
category: "settings-and-privacy"
updated: 2026-10-16
summary: "How to switch between the light, dark, AMOLED and system themes, set a custom accent color, import and export custom themes, install a theme from the Themes page, and how the app's appearance behaves while the vault is locked."
tags: ["settings"]
---

The Appearance panel controls how Myne looks. The main choice is the theme.

![The Appearance settings panel with the theme options.](./appearance.png)

## Theme

Choose **Light**, **Dark**, **AMOLED** (a true-black variant for OLED screens) or **System**, which follows your operating system's light/dark setting. Each option is shown as a small preview of the app painted in that theme's own colors, so you can compare them without switching. Your choice is saved inside the vault's encrypted preferences, and it is settled per device: another computer signed in to the same vault keeps the theme you picked there, and your choice here never overwrites it. With sync on, the encrypted preferences file travels to the server like the rest of your vault, and what is inside it, this setting included, stays unreadable there.

One small privacy detail: while a vault is **locked**, Myne hasn't decrypted your preferences yet, so the app follows your operating system's appearance until you unlock. Your saved theme applies once the vault is open.

### Accent color

Below the theme picker, **Accent color** sets the highlight color used across the app. Click the swatch to pick one of the presets or type a hex value; **Reset to theme default** puts the theme's own accent back.

This one is stored on this device rather than in the vault, so it does not follow you to another computer, and it is applied only while a vault is unlocked — the lock screen keeps the built-in accent.

### Custom themes

A **Custom theme** lets you use your own color palette instead of the built-in Light or Dark. Open **Settings → Appearance → Display** and find **Custom themes**:

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
- **Download .json** comes from this site. The palette is served from the same origin as this page, so the download is one request to myne.md and nothing else; GitHub is only where the theme's source files are kept, and the download no longer sends you there.
- If your vault is locked, Myne holds the request and asks you once you've unlocked. Close the app without unlocking and the request is simply forgotten.
- If you already have a theme with the same name, Myne asks whether to replace it or keep both.
- The theme is checked by the same validator as a hand-imported file. A damaged or malformed link is refused with a visible message, and nothing is written.
- **Open in Myne** is a desktop hand-off. On a phone or tablet, use **Download .json** and import the file.

## What moved out of Appearance

Appearance now holds purely-visual controls. Note-authoring settings that used to live here have moved to the new **Editor** panel:

- **Periodic notes** setup, meaning the folder each period's notes go in, the format for their titles and their templates, is now under **Settings → Editor → Periodic notes**. What periodic notes are and how to open the current one is covered in [Periodic notes](/user-guide/notes-and-organization/periodic-notes/).
- **Spell check** (the toggle and language picker) is also under **Settings → Editor → Writing**, described in [Spell check](/user-guide/editor-and-writing/spell-check/).

The Editor panel is also where the editor's typography presets live — text size, line spacing, content width, and the editor font. Those are covered in [Editor display](/user-guide/editor-and-writing/editor-display/).

## The rest of the panel

Three smaller controls sit alongside the theme:

- **Show edit times** puts each note's last-edited time under its title in the sidebar.
- **Show task marker** marks notes you have declared as tasks, in the sidebar and on their tab.
- **Graph appearance** is a pointer, not a control: node colors, labels, sizing and layout forces are set inside the graph itself, from the gear in its corner. **Open graph** takes you there. Those are kept per device, so a change does not follow you to another machine.

## Limits

Appearance settings change presentation only, and never affect what is encrypted or what is stored. Most of them settle per device rather than per vault. The theme, the custom-theme selection and **Show edit times** live in the vault's encrypted preferences, but each device keeps its own answer for them, so changing one here does not reach your other machines. The accent color and the graph's own appearance controls are not in the vault at all; they are kept on this device. Two things do travel: **Show task marker** is a vault-level choice and follows you to your other devices, and the custom themes themselves are vault content, so a palette you import arrives on your other devices once sync has run, even though which one is active stays a per-device choice.

Because the theme and **Show edit times** are per-device, the AI declines to change them: a change made on the machine you asked from would not reach your other devices, so it points you here instead. See [Let the AI change your notes](/user-guide/ai/agent-runs/#changing-settings).
