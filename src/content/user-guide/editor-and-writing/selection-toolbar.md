---
title: "Selection toolbar"
category: "editor-and-writing"
updated: 2026-11-01
summary: "Select text and a small toolbar appears above it with a block-type control, bold, italic, strikethrough, inline code, highlight, and link. The highlight button also edits a highlight you are already inside, and Settings → Editor lets you reorder and hide the buttons."
tags: ["editor", "markdown", "settings"]
---

Select some text in the editor and a small toolbar appears above it. It carries a block-type control and the everyday inline marks — bold, italic, strikethrough, inline code, highlight, and link — so you can apply them with the mouse instead of typing the syntax. The highlight button does double duty: with the cursor already inside a highlight, it edits that highlight rather than making a new one. Which buttons show, and in what order, is yours to set in Settings.

## The default buttons

Left to right, an un-customized toolbar shows:

- **The block type** — a control labelled with the current block (**Paragraph**, or **H1** through **H6**) and a caret. Open it to switch the line between Paragraph and any of the six heading levels.
- **B** — bold, which wraps the selection in `**…**`.
- **I** — italic, `*…*`.
- **S** — strikethrough, `~~…~~`.
- **<>** — inline code, `` `…` ``.
- **H** — highlight, covered below.
- **↗** — link. It replaces the toolbar with a **Paste link URL** field and an **Apply** button, so the selected text becomes the link's label.

A further button sits at the end of the row: **Export selection as image**, which renders the selected text to a PNG. The desktop app opens your operating system's save dialog for it; in the browser the file arrives as an ordinary download. It is a fixed control rather than one of the customizable ones, so it cannot be reordered or hidden.

The same export is in the command palette as **Export selection as image…**, under **Editor**, and both routes run the same code. With nothing selected, either one reports **Select some text first, then export it as an image.** A finished export reports **Selection saved as an image.**, and a failure reports **Could not export the selection as an image.** Dismissing the save dialog reports nothing, because nothing happened.

Every button writes the same Markdown you would type by hand. The toolbar is a shortcut to the syntax, not a different format, and everything it does is an ordinary edit you can undo.

The toolbar only appears where you can edit. In [Reading view](/user-guide/editor-and-writing/view-modes/) the editor is read-only, so selecting text there raises nothing.

## Highlighting

The highlight button carries thirteen colours. A plain click applies the default yellow, which is the plain `==text==` form; the caret opens the colour row for the other twelve, which are stored as a colour mark instead. The [markdown reference](/user-guide/markdown/html-and-inline-extras/) lists the colours and the exact syntax each one writes.

Put your cursor inside a highlight you already made and the button reflects that highlight's colour. From there you can recolour it, swap it between yellow and a colour, or clear it with **Remove highlight** — without reselecting the text by hand. Detection is single-line: a selection that spans lines, or that only partly overlaps a highlight, falls back to making a new one.

In the editor a coloured highlight always reads back as `==text==` when your cursor reaches it, never as the markup it is stored as. That is a display choice; the bytes in the note are unchanged.

## Choosing which buttons show

Open **Settings → Editor**, under **Editing**, and find **Toolbar buttons** — "Choose which formatting buttons appear on the selection toolbar, and their order." Drag a row to reorder it, move it with Alt+↑ / Alt+↓, or switch a row off to hide that button. The vocabulary is fixed: you can reorder and hide the buttons Myne offers, and you cannot add one that is not on the list.

Every entry on that list is a working button: bullet list, numbered list, checklist, quote and wikilink all draw on the toolbar and apply to your selection. Five of them start switched off, so a toolbar you have never customized looks the way it always has; switch one on and it appears on your next selection. A button you switch off is not drawn, and a button you move changes position on the bar.

Myne keeps at least one button visible. Switching off the last one on the list is refused, and the row says why, because a toolbar with nothing on it is indistinguishable from a toolbar that failed to load.

Your layout is saved in the vault's encrypted preferences. The toolbar is redrawn each time you select something, so a change takes effect on your next selection.

## Limits

The toolbar changes the note's text. Everything it does is an ordinary edit, undone with the usual undo, and nothing it writes is a Myne-only format — the marks it inserts are the same Markdown you could have typed.

Which buttons you show, and their order, is a display preference stored in the vault's encrypted preferences. It carries no security claim: a tampered or replayed value can at worst show or hide a formatting button. How the note itself is protected is covered in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Bold | ⌘B | Ctrl B |
| Italic | ⌘I | Ctrl I |
| Inline code | ⌘E | Ctrl E |
| Cycle heading level | ⇧⌘H | Ctrl Shift H |

All four are defaults you can change in **Settings → Hotkeys**, where they are listed under **Editor formatting** — see [Customizing keyboard shortcuts](/user-guide/settings-and-privacy/custom-hotkeys/). Strikethrough, highlight, and the link overlay have no default chord; reach them from the toolbar.
