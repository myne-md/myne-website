---
title: "Graph view"
category: "find-and-connect"
updated: 2026-07-31
summary: "How the graph view shows your notes and the links between them, the filters that focus it, the color groups that tint nodes by tag or folder, and the settings panel that tunes the layout."
tags: ["links", "search", "tags"]
---

The graph view draws your vault as a map: each note is a dot, and each link between notes is a line. It is a way to see structure: clusters, hubs, and the notes nothing points to.

![The graph view showing the vault's notes as connected nodes.](./graph-view.png)

The graph opens as its own workspace tab, a peer alongside your note tabs and [saved-view](/user-guide/editor-and-writing/saved-views/) tabs. There is exactly one graph tab — opening the graph again reveals the existing one rather than stacking up duplicates. It stays open as a tab while you navigate elsewhere, and is part of your saved workspace, so it comes back when you reopen the vault or switch [named workspaces](/user-guide/notes-and-organization/named-workspaces/).

## Opening the graph

Open it from the **Graph** button in the bottom bar, from the command palette (**Show graph view**), or with `⌘⇧G`. Any of these opens or reveals the single graph tab.

## What's on it

- **Nodes are notes.** Folders, tags, and attachments are not nodes; only notes are.
- **Edges are resolved links.** A line is drawn for each resolved wikilink, pointing from the note that links to the note it links to. An unresolved link (to a note that doesn't exist yet) draws no edge.

## Focusing the view

Filter chips narrow what's shown:

- **All**: the whole vault.
- **Isolated**: only notes with no links in or out (sometimes called orphan notes), so you can find what's disconnected and wire it in.
- **Around this note**: just the neighborhood of the note you have open, out to one or two hops (toggle the depth between 1 and 2).
- **Tag**: a dropdown that narrows the graph to notes carrying a tag, counting nested tags under their parent.

In a very large vault, the graph keeps itself legible by showing guidance around the first couple of thousand notes rather than trying to draw everything at once.

## Moving around

How a click behaves depends on the mode. In most modes, clicking a node opens that note in a new tab, so the graph tab stays put and you can keep coming back to it. In "Around this note", clicking a node instead re-centers the view on it; double-clicking a node opens that note in a new tab. You can drag nodes to tidy the layout; the layout then settles and stays put, and does not re-jumble on its own. When you've changed your vault and want the graph to catch up, use **Refresh** to rebuild it.

## Coloring notes by rule

By default every node is drawn in the same neutral color. Color groups let you tint nodes by rule, so clusters are separable at a glance — work notes in one color, reading notes in another.

Open the **Graph settings** panel from the gear button in the graph's top-right corner, then find the **Color groups** section. Each rule pairs a filter with a color:

- **Add rule** creates one; name it and pick a color from the fixed palette (Olive, Fern, Teal, Denim, Indigo, Violet, Orchid, Rose). The palette is theme-aware, so the colors stay legible in light, dark, and AMOLED themes and follow a custom theme's overrides.
- **Edit filter…** opens the same filter builder that [saved views](/user-guide/editor-and-writing/saved-views/) use. For now a rule matches on **tag** or **folder**; a [tag](/user-guide/find-and-connect/tags/) condition counts nested tags under their parent, the way the graph's tag filter does.
- A note takes the color of the **first rule it matches**, read from the top down. Drag a rule by its handle to reorder it: order is precedence, so a rule higher in the list wins a note that more than one rule matches.
- The switch on each rule turns it off without deleting it, so you can check the graph without that grouping. A note that matches no enabled rule keeps the neutral color.

Color groups apply the same way in every view — the whole vault, a tag filter, and **Around this note**. Changing a rule recolors the graph in place; it does not re-run the layout, so you keep the arrangement you were looking at.

Color-group rules are stored as encrypted content in your vault, alongside your other preferences. Until you turn on sync, Myne runs entirely on your device; nothing leaves it. With sync on, your rules travel to your other devices with the rest of your vault, and the server sees only that a preferences blob changed — never the rule names or the tags and folders they reference.

## Tuning the layout and appearance

The same **Graph settings** panel holds controls for how the graph is drawn. It floats over the canvas instead of splitting the pane, so opening it never re-arranges the graph beneath it, and every control previews as you change it.

- **Show direction arrows** draws an arrowhead on each edge, pointing from the note that links out to the note it links to, so you can read which way a link runs rather than only that one exists. Arrows appear once you zoom in far enough to read them.
- **Appearance** groups **Label fade** (how far you zoom before labels appear), **Node size** (the base dot size), **Size by connections** (how much a note's dot grows with the number of links it has, so hubs stand out), and **Line thickness** (edge width).
- **Forces** groups **Center pull**, **Repel**, **Link strength**, and **Link distance** — the force-layout constants, for loosening a cramped graph or drawing a scattered one together.
- **Reset to defaults** returns every appearance and force control to its starting value.

These settings stay on this device. They are not part of what syncs, so a phone-appropriate layout never overwrites your desktop one. They are written when you close the vault or quit normally; a change made and then lost to a force-quit may not be kept.

## Private by design

The graph is computed in memory from your links while the vault is open; it is not written to disk as its own file. (This is separate from the search index, which is a stored, encrypted cache; see [Search](/user-guide/find-and-connect/search/).)

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Show graph view | ⌘⇧G | Ctrl Shift G |
