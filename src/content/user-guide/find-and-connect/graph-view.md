---
title: "Graph view"
category: "find-and-connect"
updated: 2026-06-18
summary: "How the graph view shows your notes and the links between them, the filters that focus the view, and how to use it to move around your vault."
tags: ["links", "search"]
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

## Private by design

The graph is computed in memory from your links while the vault is open; it is not written to disk as its own file. (This is separate from the search index, which is a stored, encrypted cache; see [Search](/user-guide/find-and-connect/search/).)

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Show graph view | ⌘⇧G | Ctrl Shift G |
