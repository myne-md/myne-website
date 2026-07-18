---
title: "Custom theme reference"
category: "settings-and-privacy"
updated: 2026-07-18
summary: "The complete reference for writing a custom theme: the JSON file format, every required color key, which value formats are accepted, what gets rejected and why, and how you import, export, and store them."
tags: ["settings"]
---

A **custom theme** is a small JSON file of color values you import into Myne. Myne validates it, and if it is well formed it appears in Settings → Appearance → Custom themes, ready to apply. Once imported, the palette is stored as encrypted content inside your vault — protected at rest, included in a [vault backup](/user-guide/safety-and-recovery/back-up-your-vault/), and, with [sync](/user-guide/sync-and-devices/) on, carried to your other devices. This page is the full reference; for a quick walkthrough see [Appearance](/user-guide/settings-and-privacy/appearance/).

A custom theme is validated locally before it is used. Validation is not a sandbox and does not make a theme file from an untrusted source safe to trust — it is a strict check that the values are plain colors and nothing else (see [What gets rejected](#what-gets-rejected) below).

## The file

A theme is a single `.json` file: a flat object whose keys are CSS color variables and whose values are colors.

```json
{
  "--paper": "#fbfbfa",
  "--ink-1": "#1a1a17",
  "--accent": "#2c4a7a"
}
```

It is **one flat palette**, not a light/dark pair. When you apply a custom theme it *replaces* the built-in Light / Dark / System choice — the custom palette is what you see until you switch back to a built-in theme.

The file name (without `.json`) is the theme's name in the picker. Names may use letters, digits, `-`, and `_` only — no spaces, dots, or slashes.

## Importing and exporting

Themes live inside your vault, not as loose files on disk. In **Settings → Appearance → Custom themes**, use **Import theme** to pick a `.json` file — Myne validates it and, if it is well formed, adds it to the list. To get a copy back out — to share it or edit it in an external editor — use **Export** on a theme and Myne writes it as plain `.json`. That export is your own local action, so the palette leaves the encrypted vault only because you asked; the server never sees it.

The easiest way to start is to export an existing theme, edit the values, and import it back under a new name.

## Required keys

A theme must define this core set of color variables. Supplying these is enough — the rest of the interface re-derives its colors from them.

| Key | Role |
| --- | --- |
| `--paper`, `--paper-2`, `--paper-3` | Page background, recessed surfaces, hover surfaces |
| `--ink-0`, `--ink-1`, `--ink-2`, `--ink-3` | Display, primary, secondary, tertiary text |
| `--line-1`, `--line-2`, `--line-3` | Hairline borders, stronger borders, disabled controls |
| `--accent`, `--accent-hover`, `--accent-press`, `--accent-soft`, `--accent-on` | Accent color and its hover / pressed / soft-background / on-accent-text variants |
| `--danger`, `--danger-soft`, `--warning`, `--warning-soft`, `--success`, `--success-soft` | State colors and their soft backgrounds |

If any required key is missing, the theme is rejected and the picker tells you which key to add.

## Optional keys

You may also set the editor's syntax-highlighting, color-label, and highlight colors (`--syntax-*`, `--label-*`, `--highlight-*`). These are optional. If you leave them out, they fall back to the built-in **light** values — so if you are making a **dark** theme, set them too, or your code highlighting and labels will look wrong against a dark background.

## Accepted values

A value is accepted only if it is one of these plain color (or length) formats:

- **Hex** — `#fff`, `#ffff`, `#a1b2c3`, `#a1b2c3d4` (3, 4, 6, or 8 digits)
- **`rgb()` / `rgba()`** — e.g. `rgb(44, 74, 122)`, `rgba(0, 0, 0, 0.5)`
- **`hsl()` / `hsla()`** — e.g. `hsl(210, 50%, 40%)`
- **Named colors** — e.g. `transparent`, `currentColor`, `red`
- **Number with unit** — e.g. `0`, `12px`, `0.5rem`, `100%`

If a value is not one of these, the theme is rejected and the picker names the key whose value was invalid (with the line number when it can).

## What gets rejected

Anything that is not a plain color is rejected — this is the point of the check. In particular these are never allowed in a value:

- `url(...)`
- `expression(...)`
- `@import`
- `javascript:`
- CSS comments or escape tricks (`/* */`, `\` escapes), or anything appended after a valid value (e.g. a trailing `;`)

This is an **allowlist**: Myne accepts the known color formats above and refuses everything else, rather than trying to blocklist bad patterns one by one. Custom themes apply real CSS values to the app, so this check is what keeps a theme file from carrying anything beyond color. It is a guard, not a guarantee — treat a theme from someone else the same way you would treat any file from that source.

## When a theme is rejected

If an import fails the check, Myne rejects it and tells you why — a missing key, an invalid value (and the key it belongs to), a bad name, or a JSON syntax error with its line. The theme is not added; fix the values and import it again. Validation runs entirely on your device.
