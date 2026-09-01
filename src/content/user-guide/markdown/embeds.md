---
title: "Embeds"
category: "markdown"
updated: 2026-08-29
summary: "What an ![[target]] embed does, and why it depends on the target: a note embed is a labelled chip with no transclusion, a drawing is drawn in place and editable, and an attachment becomes an inline image, a PDF reader, or an audio or video player."
tags: ["markdown", "links", "attachments"]
---

An embed is a wikilink written with a leading `!`: `![[target]]`. What appears in the note depends on what the target is — a note, a drawing, or an attachment each render differently, and only some of them draw the target itself.

## Embedding a note

`![[Some note]]` renders as a chip reading "Embed: Some note".

Myne does not pull the other note's text into this one; there is no transclusion. An embed of a note is a pointer, not a copy: the note you are reading stays the note you wrote, and the text of the other note lives in one place only. The `![[…]]` you typed is what stays in your file.

## Embedding a drawing

If the target is a [drawing](/user-guide/notes-and-organization/drawings/), the embed is drawn rather than labelled: the note shows the drawing as a thumbnail, at the size the canvas will open at. Click the thumbnail, or the **Edit** button in its header, and the canvas opens in place, so you can draw without leaving the note you were writing. **Done** collapses it back to the thumbnail.

Whether an embed is open or collapsed is interface state. It is never written into the note, so it does not travel to your other devices, and [reading view](/user-guide/editor-and-writing/view-modes/) always shows the thumbnail rather than a live canvas.

Backspacing at the edge of the embed removes the whole reference in one step and leaves the drawing note itself where it is. Removing the embed unlinks the drawing; it does not delete it.

## Embedding an attachment

`![[att:<id>|name]]` is the form Myne writes for you when you attach a file or import one — it is not a syntax you type. How it renders depends on what the file is:

- An **image** shows inline; click it for a full-size view.
- A **PDF** shows as a scrollable reader you can page through in place.
- **Audio** shows as a player with a play control and a time readout.
- **Video** shows as a player, for MP4 and WebM. A video the system cannot decode falls back to a file card instead.
- A **plain-text, code, CSV, Word or spreadsheet file** shows a read-only preview of its contents.
- Anything else shows as a **file card**: the file's icon, name, type and size, with an export action.

Images and PDFs also carry a size, an alignment and an alt text you choose. You set those from the embed's own `⋯` menu, and an image on a line of its own can also be sized by dragging its right edge or its bottom-right corner. Both are described in [Attachments](/user-guide/attachments-and-import/attachments/). You do not type them. Myne records the choice on the embed:

```
![[att:<id>|photo.png|w=300|align=center|alt=The harbour at dusk]]
```

The alt text is the **accessible name**: it replaces the filename wherever the embed is drawn, on the desktop app, on a phone, and in an HTML or PDF export. Leaving it deliberately empty is a choice of its own, and it means the image is decorative, so a screen reader skips it rather than reading a filename aloud. `w` is a width in pixels (1 to 8192), or a percentage of the text column (1% to 100%). `h` is a height in pixels. Only two things write one: dragging an image's bottom-right corner, which sets width and height together, and an embed brought in from Obsidian's `300x200` form, whose height Myne preserves. The `⋯` menu's sizes never write one, so a picture keeps its proportions unless you drag the corner yourself. `align` is `left`, `center` or `right`. `alt` comes last and runs to the end, so it can contain any punctuation except `]`, which breaks the embed. Myne refuses a `]` in the alt-text box for the same reason, and it matters most here, because a file you hand-edit outside Myne has nothing checking it: an embed carrying a `]` still looks right in the editor while the parts of Myne that track which notes use an attachment stop seeing it, and the attachment then looks unused.

A value Myne cannot read is left in the file and reported rather than silently corrected. A key it recognises with a value it cannot use (`w=9000`, past the ceiling) shows a warning beside the `⋯` and a `Could not read:` line at the bottom of the menu, quoting the text verbatim so you can fix it. A key it does not recognise at all is passed over in silence, on purpose: that is what a newer version of Myne writing something this one has not learned looks like, and warning about it would put a notice on every image somebody styled on a newer build. Neither is ever rewritten or deleted.

This is here so you know what you are looking at if you ever read your `.md` files outside Myne, not because you need to write it.

Adding files, the size limit, and what happens to an image on the way in are covered in [Attachments](/user-guide/attachments-and-import/attachments/).

## When an embed cannot resolve

A target that is missing is not an error, and nothing in your file is rewritten. A note embed with no matching note stays a chip. An attachment that has been deleted shows a marker in its place, so you can see that something used to be there rather than finding a gap.

A plain markdown image pointing at a web address, `![alt](https://example.com/image.png)`, is a different thing and is never fetched: Myne draws a placeholder carrying the alt text, with the address on hover, and makes no network request. See [Markdown basics](/user-guide/markdown/markdown-basics/).

## Limits

Embeds resolve within the current vault only; there are no cross-vault embeds. Whatever is drawn in its place, the `![[…]]` text saved in your file is exactly what you typed — rendering is a view, never a rewrite. A note embed is a label rather than a copy, so the embedded note's text is not part of the note embedding it. Nothing an embed renders is fetched from the network: a drawing, an image, a PDF, an audio or video file all come from inside your vault.
