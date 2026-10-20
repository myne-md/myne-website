---
title: "Custom theme reference"
category: "settings-and-privacy"
updated: 2026-08-24
summary: "The complete reference for writing a custom theme: the JSON file format, every required color key, the ornament, tint and measure tokens a theme may also set, which value formats are accepted, what gets rejected and why, and how you import, export, and store them."
tags: ["settings"]
---

A **custom theme** is a small JSON file of color values you import into Myne. Myne validates it, and if it is well formed it appears in Settings → Appearance → Custom themes, ready to apply. Once imported, the palette is stored as encrypted content inside your vault — protected at rest, included in a [vault backup](/user-guide/safety-and-recovery/back-up-your-vault/), and, with [sync](/user-guide/sync-and-devices/) on, carried to your other devices. This page is the full reference; for a quick walkthrough see [Appearance](/user-guide/settings-and-privacy/appearance/).

A custom theme is validated locally before it is used. Validation is not a sandbox and does not make a theme file from an untrusted source safe to trust — it is a strict check that the values are plain colors and nothing else (see [What gets rejected](#what-gets-rejected) below).

## The file

A theme is a single `.json` file: a flat object whose keys are CSS variables and whose values are plain values. Colors are the core of it, and a theme may also set the ornament, tint and measure tokens described below.

```json
{
  "--paper": "#fbfbfa",
  "--ink-1": "#1a1a17",
  "--accent": "#2c4a7a"
}
```

It is **one flat palette**, not a light/dark pair. When you apply a custom theme it *replaces* the built-in Light / Dark / System choice — the custom palette is what you see until you switch back to a built-in theme.

The file name, minus the `.json`, becomes the theme's name in the picker. Spaces, punctuation and mixed case are all fine: the name is a label stored inside your vault rather than a file on disk, so there is nothing for it to collide with. Importing a file whose name matches a theme you already have replaces that theme, so give an edited copy a new file name if you want to keep both.

## Importing and exporting

Themes live inside your vault, not as loose files on disk. In **Settings → Appearance → Custom themes**, use **Import theme…** to pick a `.json` file — Myne validates it and, if it is well formed, adds it to the list. To get a copy back out — to share it or edit it in an external editor — use **Export** on a theme and Myne writes it as plain `.json`. That export is your own local action, so the palette leaves the encrypted vault only because you asked; the server never sees it.

The easiest way to start is to export an existing theme, edit the values, and import it back under a new name.

Importing, exporting and deleting a theme are things you do on a computer. On a phone the Custom themes block lists the themes your vault holds, and applying one is all it offers: "Custom themes are installed on your computer. Yours arrive here on their own after a sync."

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

You may also set the editor's syntax-highlighting, color-label, and highlight colors (`--syntax-*`, `--label-*`, `--highlight-*`). These are optional. If you leave them out, they fall back to Myne's built-in values **for the appearance your theme declares**: a dark theme inherits the dark code highlighting, label colors and highlight washes, a light one inherits the light set. Myne decides which by measuring your theme's own background, so a dark theme no longer needs to set them to stay readable.

## Ornaments

Beyond color, a theme can pick how three kinds of surface are decorated. The key is the role followed by the primitive — `--box-frame`, `--surface-texture` — and the value is one bare word.

| Role | What it covers | Primitives it accepts |
| --- | --- | --- |
| `surface` | Pages and panels | frame, shadow, texture, ruled, edge, fold, perforation |
| `box` | Callouts, cards, code blocks, quotes | all of the above, plus ribbon |
| `chrome` | Tabs, buttons, bars | frame, shadow, texture |

| Primitive | Values |
| --- | --- |
| `frame` | none, hairline, thick, double, inset |
| `shadow` | none, soft, hard, offset |
| `texture` | none, paper, grain, scanline, grid |
| `ruled` | none, lines, grid, dotted |
| `edge` | plain, torn, serrated, cut |
| `fold` | none, folded, dogear |
| `ribbon` | none, corner, band, label |
| `perforation` | none, left, top, both |

A combination outside the first table — `--chrome-fold`, say — is stored and drawn as nothing. A value Myne does not recognise is dropped and the primitive renders plain, so a theme written for a newer version of Myne still loads on an older one instead of failing to import.

## Tint

`--tint` sets a color washed over the interface and `--tint-strength` how strongly, from `0` to `1`. There is one pair for the whole app rather than one per role. Myne caps how strong the wash can get, so text stays readable.

## Measure

A theme may also set the spacing scale (`--space-0` … `--space-9`), corner radii (`--radius-1` … `--radius-3`, `--radius-pill`), the type scale (`--text-xs` … `--text-4xl`), font weights (`--weight-regular` … `--weight-bold`) and letter-spacing (`--tracking-tight` … `--tracking-caps`). Myne clamps each against its own default, so an extreme value cannot leave you with an unusable window.

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

If an import fails the check, Myne rejects it and tells you why: a missing key, an invalid value (and the key it belongs to), a key reserved for Myne's own use, or a JSON syntax error with its line. The theme is not added; fix the values and import it again. Validation runs entirely on your device.

Two further checks run at import.

**Contrast.** A palette can be perfectly well formed and still unreadable, so Myne measures five pairs and refuses the file if any of them is too close: display text and primary text on the page background, and primary text on a recessed surface, each need at least 4.5:1; secondary text and the accent on the page each need at least 3:1. The message names the pair and the ratio it measured. The tertiary ink (`--ink-3`) is deliberately not checked — it is the hint color and is meant to be quiet. This checks colors, not the finished picture: a texture or ruled ground behind text can still bury it while every pair passes.

**Reserved names.** Keys beginning `--_` belong to Myne's own ornament layer and are refused. Rename the key; nothing you can legitimately set needs that prefix.

Both checks run when you import. A theme that arrives from another device through sync is still listed and can still be deleted, so a palette that fails a floor never leaves you with an empty picker.
