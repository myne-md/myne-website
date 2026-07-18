---
title: "Saved views"
category: "editor-and-writing"
updated: 2026-06-18
summary: "Save a filtered, projected view of your notes in the Views sidebar section: build a condition filter, render matching notes as a card gallery, set a cover image, and import Obsidian Bases views. Views are read-only projections, not a database."
tags: ["notes", "search", "folders"]
---

A saved view is a filtered, projected slice of your notes that you can return to from the left sidebar. You build it from condition filters — tag, folder, or free-text search — and Myne renders the matching notes as a calm card gallery, with optional cover images and a few display choices. You can also import view definitions from an Obsidian Bases `.base` file. A view is a read-only projection over your notes, not a database: it never changes a note, and there is no formula language behind it.

![The saved-view builder, where conditions filter and group which notes a view shows.](./saved-views.png)

## The Views sidebar section

The left sidebar carries a collapsible **Views** section that sits between the Notes tree and the Attachments and Trash footer. It lists every saved view in display order. Clicking a view row opens that view as a workspace tab.

The section header has a chevron to collapse or expand the list and a **+** button (**New view**) to create a new one. When you have no views yet, the section reads **No views yet. Save the current note list as a view.**

Right-clicking a view row opens a menu:

- **Edit filter…** — reopen the filter builder for this view.
- **View settings…** — the cards display settings. This item appears for cards views only.
- **Rename** — edit the view's name in place.
- **Move up** / **Move down** — reorder the view within the list.
- **Delete view** — remove the view definition.

You can also reach the Views section from the **Views** button in the bottom bar, or with the **Browse views…** action in the command palette. Both expand the sidebar, scroll the section into view, and briefly highlight it so the click always lands somewhere visible.

## Building a view's filter

A view's filter is composed in a filter builder modal — opened from the **+** button for a new view, or **Edit filter…** for an existing one. It works like a Notion- or Airtable-style set of condition groups.

- Each **condition** is a **Tag**, a **Folder**, or a free-text **Search**, with an **is** / **is not** toggle.
- Each **group** combines its conditions with **all** (every condition must match) or **any** (at least one must match).
- When you have more than one group, a top-level **all** / **any** combines the groups. That is the one level of nesting the builder offers.

As you compose, a live **N notes** count previews how many notes currently match. Saving with no conditions creates an all-pages view — every note, in recency order.

If a condition points at a tag or folder that no longer exists, it shows a quiet **unresolved** badge. The stored value stays visible and removable; a missing target simply matches nothing. A filter that was made with a more advanced editor than the builder can represent opens read-only, with a **Replace filter** button so you can deliberately start a fresh filter rather than have Myne silently reinterpret the old one.

Under the hood, the query layer is type-aware and follows a few fixed rules. Folder conditions are subtree-inclusive, so a folder also matches its sub-folders. There is no file-metadata or modified-time source to query against — only your notes' tags, folders, text, and typed properties.

## The cards view

A cards view renders the matching notes as a calm card gallery — not a kanban board. Each card shows an optional cover image, the note's title, and any display-column values formatted by their type. Cards are grouped under section headings, each heading carrying a per-group count, and the gallery is virtualized so a large result stays smooth. A note with no value for the grouping property lands under a **No value** group; a note whose grouping property holds a list of values appears under each matching group.

Cards are read-only — they only open notes, they never edit them:

- **Single-click** opens the note in the focused tab.
- **⌘-click** or **Ctrl-click**, or a **middle-click**, opens it in a new tab.
- **Alt-click** opens it to the side.

Right-clicking a card offers exactly four non-destructive actions: **Open**, **Open in new tab**, **Reveal in folder**, and **Copy link**. When no notes match the filter, the gallery reads **No notes match this view**.

The other view types are not built yet. A view set to a table or list type shows **This view type arrives in a later update.** in place of its content.

## Covers and display settings

For a cards view, **View settings…** opens a modal with three controls:

- **Cover image property** — the frontmatter property whose value is an image, shown as each card's cover. Leave it empty for no cover.
- **Image aspect ratio** — **Default (16:9)**, **16:9 (wide)**, **3:2**, **4:3**, or **1:1 (square)**.
- **Card size** — a slider from 120 to 600 pixels (default 220), with a **Reset** button.

You can also set a cover on an individual note from its card. Hover the card and click **Set cover** (or **Change cover** if it already has one) to open the **Choose a cover image** modal. There you pick from a grid of images already in your vault, use **Upload** to add a new one, or drag and drop a file in. **Remove cover** clears the note's cover.

## Importing an Obsidian .base view

If you have view definitions in an Obsidian Bases `.base` file, the command palette has an **Import .base view…** action (under the Vault category) that reads a single `.base` YAML file and turns its views into Myne saved views. This is import-only — Myne does not export back to `.base`.

The import is deliberately lossy, and it tells you exactly what it left behind rather than guessing. A filter clause Myne's query layer cannot represent is dropped, and the rest of that view is kept. A view whose entire filter drops is skipped rather than silently widened to "all notes". Top-level formulas, summaries, and property-display blocks are dropped — Myne has no formula language to honor them. When it finishes, a summary toast reports the tally, for example **Imported 3 view(s) · 1 skipped · 2 filters dropped**.

You can also turn a tag selection into a view without the builder. In the Tag browser, the active tag selection plus its AND/OR mode becomes a saved view through **Save as view**: each selected tag becomes a tag condition. A blank name falls back to a label derived from the tags, or **Filtered view** when there is nothing to derive from. A view made this way defaults to the cards type.

## Limits

A saved view is a read-only projection. It never mutates a note and never writes to disk beyond its own definition. That definition lives inside the vault's encrypted preferences; a view's name and its filter are treated as sensitive, so Myne never logs the name or the query itself — only operation counts.

The query layer is a closed allow-list — tag, folder, search, and typed-property comparison, joined with and / or / not. There is no evaluatable expression, no arithmetic, and no code evaluation: Myne is not a database and has no formula language. This is why an unsupported `.base` clause is dropped rather than approximated, and why there is no modified-time query source.

When the vault is locked, a view has nothing to read, so it resolves to an empty result and its count shows 0 — never an error. How that fits the wider model is covered in [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/). Until you turn on sync, Myne runs entirely on your device; nothing leaves it.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open command palette (then **Browse views…** or **Import .base view…**) | ⌘K (alias ⌘P) | Ctrl K |
| Open a card's note in a new tab | ⌘-click / middle-click | Ctrl-click / middle-click |
| Open a card's note to the side | Alt-click | Alt-click |
