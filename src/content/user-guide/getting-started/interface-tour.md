---
title: "A tour of the interface"
category: "getting-started"
updated: 2026-06-11
summary: "A guided tour of the main Myne window: the sidebar with your note list, the editor pane, the command palette, and the status bar along the bottom."
tags: ["basics", "editor", "sidebar"]
---

Once your vault is open, Myne is a single window with a few fixed regions. This tour names each one so the rest of the guide can refer to them without re-explaining. From left to right and top to bottom:

## The left sidebar

The left sidebar holds two things:

- **The vault-switcher chip** at the top shows which vault is open. If you keep more than one vault, this is where you switch between them; see [Multiple vaults](/user-guide/safety-and-recovery/multiple-vaults/).
- **The note tree** below it lists your notes and folders. Select a note to open it; this is where you create, rename, move, and organize notes.

## The tab strip and editor

The center is where you read and write. Notes open in **tabs** along the top, and you can **split the pane** to put two notes side by side. The **editor** itself fills the rest of the space: plain markdown, with autosave handling persistence (see [Your first note](/user-guide/getting-started/your-first-note/)).

## The right sidebar

The right sidebar surfaces the connections to the note you are reading:

- **Backlinks**: other notes that link to this one.
- **Unlinked mentions**: notes that name this one without linking to it.

How these work, and the rest of Myne's linking and search tools, are covered in [Find & connect](/user-guide/find-and-connect/).

## The bottom bar

The status bar along the bottom carries small, persistent controls and readouts:

- **Local-only · not synced**: the honest state of your notes. Myne today runs entirely on your device; nothing leaves it.
- **Save status**: shows "Saving…" while a save is in flight, so you can see autosave working.
- **Graph**: opens the graph view of your notes and their links (also `⌘⇧G`).
- **Settings**: the gear opens settings (also `⌘,`).
- **Lock vault**: locks the vault immediately and returns to the Unlock screen.
- **Word count** for the current note.

## The command palette

Press `⌘K` (or its alias `⌘P`) to open the **command palette**, a searchable list of actions like locking the vault, opening settings, showing the graph, importing an Obsidian vault, and managing templates. It is the fastest way to reach anything that isn't a click away.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open command palette | ⌘K (alias ⌘P) | Ctrl K (alias Ctrl P) |
| New note | ⌘N | Ctrl N |
| New note in the focused pane | ⌘T | Ctrl T |
| Open settings | ⌘, | Ctrl , |
| Show graph view | ⌘⇧G | Ctrl Shift G |
| Next / previous tab | Ctrl Tab / Ctrl Shift Tab | Ctrl Tab / Ctrl Shift Tab |
| Split focused pane right / down | ⌘\ / ⌘⇧\ | Ctrl \ / Ctrl Shift \ |
