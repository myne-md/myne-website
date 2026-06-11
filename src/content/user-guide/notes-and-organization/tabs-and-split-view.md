---
title: "Tabs and split view"
category: "notes-and-organization"
updated: 2026-06-11
summary: "How to open notes in multiple tabs and arrange them side by side with split view, and how Myne remembers your open workspace between sessions."
tags: ["workspace", "editor"]
---

Myne lets you keep several notes open at once, in tabs and in side-by-side panes, and it remembers that layout between sessions. This article covers how tabs and splitting work and the one thing to know about how the layout is saved.

## Tabs

Selecting a note opens it in the **focused pane's active tab**; it reuses the tab you are in, rather than piling up new ones. When you want to keep the current note open alongside a new one, open the new note in a **new tab** instead. Tabs in a pane can be cycled with the keyboard (see Shortcuts below), and closing a tab leaves the others untouched.

## Split view

**Split** the focused pane to put two notes side by side: right, for columns, or down, for stacked panes. Each pane has its own tabs and its own focus, so you can read one note while editing another. You always have at least one pane; everything stays inside the single Myne window, and there are no pop-out windows.

## Your workspace is remembered

Myne saves your open tabs and split layout and restores them the next time you unlock the vault, so you pick up where you left off.

That layout is saved when you **close or lock Myne normally**. It is not written on every keystroke, so if Myne is interrupted by a hard crash or power loss, it may restore a slightly **older** layout than your very last arrangement. Your notes themselves are safe, since autosave handles their content (see [Notes and folders](/user-guide/notes-and-organization/notes-and-folders/)); only the arrangement of tabs and panes can lag.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| New note in the focused pane | ⌘T | Ctrl T |
| Next / previous tab in the pane | Ctrl Tab / Ctrl Shift Tab | Ctrl Tab / Ctrl Shift Tab |
| Close the active tab | ⌘W | Ctrl W |
| Split the focused pane right / down | ⌘\ / ⌘⇧\ | Ctrl \ / Ctrl Shift \ |
