---
title: "Graph view"
category: "find-and-connect"
updated: 2026-08-24
summary: "How the graph view shows your notes and the links between them, the filters that focus it, the color groups that tint nodes by tag or folder, the settings panel that tunes the layout, and where the arrangement you leave behind is saved."
tags: ["links", "search", "tags"]
---

The graph view draws your vault as a map: each note is a dot, and each link between notes is a line. It is a way to see structure: clusters, hubs, and the notes nothing points to.

![The graph view open as its own tab, with the All, Isolated and Tag filter chips above the canvas and the graph settings gear in its top-right corner.](./graph-view.png)

The graph opens as its own workspace tab, a peer alongside your note tabs and [saved-view](/user-guide/editor-and-writing/saved-views/) tabs. There is exactly one graph tab — opening the graph again reveals the existing one rather than stacking up duplicates. It stays open as a tab while you navigate elsewhere, and is part of your saved workspace, so it comes back when you reopen the vault or switch [named workspaces](/user-guide/notes-and-organization/named-workspaces/).

## Opening the graph

Open it from the **Graph** button in the bottom bar, from the command palette (**Show graph view…**), or with `⌘⇧G`. Any of these opens or reveals the single graph tab.

## What's on it

- **Nodes are notes.** Folders, tags, and attachments are not nodes; only notes are.
- **Edges are resolved links.** A line is drawn for each resolved wikilink, pointing from the note that links to the note it links to. An unresolved link (to a note that doesn't exist yet) draws no edge.

## Focusing the view

Filter chips narrow what's shown:

- **All**: the whole vault.
- **Isolated**: only notes that neither link out to anything nor are named by another note, so you can find what's disconnected and wire it in.
- **Around this note**: just the neighborhood of the note you have open, out to one or two hops (toggle the depth between 1 and 2). This chip appears once you have a note selected.
- **Tag**: a dropdown that narrows the graph to notes carrying a tag, counting nested tags under their parent. It appears once the vault has at least one tag.

A large vault is drawn in full — there is no note limit on the graph. What keeps it usable is that the layout runs off the main thread and the renderer draws only what is on screen, with labels appearing once you zoom in far enough to read them.

## Moving around

How a click behaves depends on the mode. In most modes, clicking a node opens that note in a new tab, so the graph tab stays put and you can keep coming back to it. In "Around this note", clicking a node instead re-centers the view on it; double-clicking a node opens that note in a new tab. You can drag nodes to tidy the layout; the layout then settles and stays put, and does not re-jumble on its own. The arrangement is saved, so reopening the graph — including after a restart — brings back the picture you left rather than laying it out afresh. When you've changed your vault and want the graph to catch up, use **Refresh** to rebuild it.

## Coloring notes by rule

By default every node is drawn in the same neutral color. Color groups let you tint nodes by rule, so clusters are separable at a glance — work notes in one color, reading notes in another.

Open the **Graph settings** panel from the gear button in the graph's top-right corner, then find the **Color groups** section. Each rule pairs a filter with a color:

- **Add rule** creates one; name it and pick a color from the fixed palette (Olive, Fern, Teal, Denim, Indigo, Violet, Orchid, Rose). The palette is theme-aware, so the colors stay legible in light, dark, and AMOLED themes and follow a custom theme's overrides.
- **Edit filter…** opens the same filter builder that [saved views](/user-guide/editor-and-writing/saved-views/) use. For now a rule matches on **tag** or **folder**; a [tag](/user-guide/find-and-connect/tags/) condition counts nested tags under their parent, the way the graph's tag filter does.
- A note takes the color of the **first rule it matches**, read from the top down. Drag a rule by its handle to reorder it: order is precedence, so a rule higher in the list wins a note that more than one rule matches.
- The switch on each rule turns it off without deleting it, so you can check the graph without that grouping. A note that matches no enabled rule keeps the neutral color.

Color groups apply the same way in every view — the whole vault, a tag filter, and **Around this note**. Changing a rule recolors the graph in place; it does not re-run the layout, so you keep the arrangement you were looking at.

Color-group rules are stored as encrypted content in your vault, alongside your other preferences. Until you turn on sync or name a remote AI provider, Myne runs entirely on your device; nothing leaves it. With sync on, your rules travel to your other devices with the rest of your vault, and the server sees only that a preferences blob changed — never the rule names or the tags and folders they reference.

## Tuning the layout and appearance

The same **Graph settings** panel holds controls for how the graph is drawn. It floats over the canvas instead of splitting the pane, so opening it never re-arranges the graph beneath it, and every control previews as you change it.

- **Show direction arrows** draws an arrowhead on each edge, pointing from the note that links out to the note it links to, so you can read which way a link runs rather than only that one exists. Arrows appear once you zoom in far enough to read them.
- **Appearance** groups **Label fade** (how far you zoom before labels appear), **Node size** (the base dot size), **Size by connections** (how much a note's dot grows with the number of links it has, so hubs stand out), and **Line thickness** (edge width).
- **Forces** groups **Center pull**, **Repel**, **Link strength**, and **Link distance** — the force-layout constants, for loosening a cramped graph or drawing a scattered one together.
- **Reset to defaults** returns every appearance and force control to its starting value.

These settings stay on this device. They are not part of what syncs, so a phone-appropriate layout never overwrites your desktop one. They are written when you close the vault or quit normally; a change made and then lost to a force-quit may not be kept.

## Private by design

The shape of the graph — which notes exist and which links join them — is derived in memory from your notes each time it is built; there is no second copy of your links on disk. What is saved is the arrangement: where the layout settled, and where you dragged nodes, goes into an encrypted file inside your vault, so reopening the graph brings back the picture you left. That file stays on this device, is not synced and is not part of a backup, and Myne rebuilds it from your notes if it is missing. (The search index is a separate stored, encrypted cache; see [Search](/user-guide/find-and-connect/search/).)

## Limits

The graph draws **resolved** wikilinks only, but **Isolated** counts links as you wrote them. A note whose only links point at notes that don't exist yet therefore draws no lines in **All** and is still not listed under **Isolated** — it has links, they just don't land anywhere. Use it to find notes you never wired in, not to find broken links.

Folders, tags and attachments are not nodes either, so a set of notes grouped only by folder or tag looks unconnected here even though the sidebar groups them.

The saved arrangement is a convenience, not a stored document. Losing it costs a fresh layout and none of your content — the notes and their links are the source of truth, and the positions are rebuilt from them.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Show graph view | ⌘⇧G | Ctrl Shift G |
