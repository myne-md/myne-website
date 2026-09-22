---
title: "Accessibility"
category: "settings-and-privacy"
updated: 2026-09-21
summary: "How to work in Myne with a keyboard and a screen reader: the three keyboard regions and the F6 key that moves between them, the skip link, how lists and tab strips behave, and an honest account of what a screen reader is and is not told about a note."
tags: ["settings", "editor"]
---

Myne is built to the WCAG 2.2 AA bar, and the parts of that bar a tool can measure are checked on every change. This article covers the keyboard model you will actually use, and then says plainly what a screen reader does and does not get, because some of it is a real limitation rather than something you have configured wrongly.

## The window is three regions

Keyboard focus moves between three parts of the window: the **notes sidebar**, the **editor**, and the **right panel**.

**F6** cycles through them in that order and wraps around. A region that is not on screen is skipped, so a collapsed sidebar or a tab with no right panel does not swallow a press.

Three further commands go straight to one region each: **Focus notes sidebar**, **Focus editor**, and **Focus right panel**. They ship with no shortcut, and you can give them one in [the Hotkeys panel](/user-guide/settings-and-privacy/custom-hotkeys/) if you would rather have three direct keys than one cycle.

This matters most inside a note. **Tab** indents in the editor and keeps doing so, which means Tab alone cannot get you back out. F6 is the way out.

## Skip to content

The first time you press **Tab** after the window opens, a **Skip to content** link appears. Activating it puts the cursor straight into the note you have open, past the sidebar and the tab strip.

## Moving inside a region

Each region is a single stop in the Tab order, so a vault with hundreds of notes costs one Tab press rather than hundreds. Once you are inside, the arrow keys do the work:

- In the **note list** and the **folder tree**, the up and down arrows move the selection, and the left and right arrows collapse and expand a folder. Enter opens the selected note. The selection is announced as it moves.
- In a **tab strip**, the left and right arrows move focus between tabs, and **Enter** or **Space** switches to the tab you have moved to. Moving focus does not switch tabs on its own, so arrowing across a row of open notes does not open each one on the way past.
- In the **command palette** and the other pickers, the arrows move the highlighted row and the highlight is announced.

Reordering usually has a keyboard path where it has a drag: **Alt** with the up or down arrow moves a colour group or a favourite one slot at a time. Tabs move through their right-click menu, with **Move left** and **Move right**.

## Pointer targets and motion

Controls are at least 24 by 24 pixels for pointer input. Where a control draws something smaller on purpose, such as a colour swatch, the visible dot stays its designed size and the area you can hit around it is enlarged instead.

If your system asks for reduced motion, Myne follows it, and no state is ever shown by motion alone.

## What a screen reader is told, and what it is not

These are measured facts rather than a list of things to fix. They are re-checked each release.

- **The editor body is a named text box, and that is all it is.** It announces with the note's title. What it does not carry is structure: headings inside a note are styled text inside one text box, not a heading tree you can jump between. Use the outline in the right panel to move by heading.
- **Rendered maths announces its LaTeX source** rather than a spoken reading of the formula. A more readable form exists in the wider web platform and was rejected here for a security reason, because it would have required weakening a check that keeps imported note content from carrying an executable link.
- **A rendered diagram announces as a single image**, named by its kind, for example "Diagram: flowchart". There is no description of what the diagram contains.
- **Folding a section is announced; ordinary typing is not.** Caret movement, selection and typing are handled by the system's own text handling, so what you hear differs between macOS, Windows and Linux.
- **The close x on a tab is a mouse control** and is deliberately not a keyboard stop. Close the focused tab with Delete or Backspace, close the active tab with ⌘W / Ctrl W, or use Close tab in the tab's right-click menu.

## Limits

The automated checks cover what a tool can judge: roles, names, relationships, contrast and target size. They cannot tell you what a screen reader says, and no automated test in Myne runs one. A person checks that by hand against a written checklist before a release.

That checking is not evenly spread. Desktop Linux and the browser client are the two surfaces with automated coverage; macOS, Windows, iOS and Android have none, and are verified by hand only. Treat the screen-reader behaviour described above as measured on the platforms it was measured on, and tell us if yours differs.

Myne has not been audited by an external accessibility assessor.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Cycle focus between regions | F6 | F6 |
| Focus notes sidebar | none by default | none by default |
| Focus editor | none by default | none by default |
| Focus right panel | none by default | none by default |
| Close the focused tab | Delete or Backspace | Delete or Backspace |
| Close the active tab | ⌘W | Ctrl W |
| Move a colour group or favourite | ⌥↑ / ⌥↓ | Alt ↑ / Alt ↓ |
