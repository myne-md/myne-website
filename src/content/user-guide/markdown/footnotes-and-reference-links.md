---
title: "Footnotes and reference links"
category: "markdown"
updated: 2026-06-11
summary: "How to use footnotes and reference-style links in your notes, how wikilink-style references appear, and how each renders in the reading view."
tags: ["markdown", "links"]
---

This article covers three ways of referring to things: footnotes, reference-style links, and wikilinks (the `[[Note]]` syntax Myne uses to connect notes inside a vault).

![A note showing a footnote reference with its rendered Footnotes list, plus a reference-style link.](./footnotes-and-reference-links.png)

## Footnotes

A footnote has two parts: a marker in your text and a definition elsewhere in the note.

```
Here is a claim.[^1]

[^1]: And here is the supporting note.
```

The marker `[^1]` renders as a small reference; clicking it jumps to the definition. The identifier can be any short label, not just a number (`[^source]` works). Definitions are usually grouped at the end of the note, but Myne finds them wherever they are. A definition can span multiple paragraphs, and a marker with no matching definition simply stays as plain text.

## Reference-style links

Instead of putting a URL inline, you can name it once and refer to it by label:

```
See the [project README][readme].

[readme]: https://example.com/readme
```

Myne renders the labelled usage as a link and hides the definition line. Labels are matched loosely: case and internal spacing don't have to match exactly. Reference **images** work the same way (`![alt][ref]`). These forms are recognized and rendered; Myne keeps your bytes as written.

## Wikilinks

Wikilinks are Myne's syntax for linking one note to another inside the same vault. You write a target inside double brackets, and the editor renders it as a single **chip**.

| You write | What it links to |
|---|---|
| `[[Note Title]]` | the note with that title |
| `[[Note Title\|Display]]` | the same note, but the chip shows "Display" |
| `[[Note Title#Heading]]` | a heading in that note (the chip shows "Note › Heading") |
| `[[Note Title^block-id]]` | a specific block (the chip shows the note; the block id is kept in the text) |
| `[[folder/path.md\|Display]]` | a note by its vault-relative path (Myne's own preferred form) |
| `![[Note Title]]` | an embed, shown as an "Embed: Note Title" chip |
| `![[att:<id>\|name]]` | an embedded attachment (see [Attachments](/user-guide/attachments-and-import/attachments/) for what these do) |

A chip is **atomic**: it behaves as one unit, so backspacing next to it removes the whole `[[…]]`, and selecting it selects the entire link. A wikilink never spans more than one line, and a `[[Note]]` written inside a code block stays as code, not a link.

### How a wikilink resolves

A title-only link like `[[Wednesday]]` resolves to the note titled "Wednesday" in the current vault; a path link resolves to that vault-relative path. Embeds are shown as a labeled chip: Myne does **not** pull the other note's content inline (there is no transclusion).

Today you type wikilinks by hand; the editor renders them as chips, and they power backlinks and the graph. What those connections surface is covered in [Find & connect](/user-guide/find-and-connect/).

## Limits

All of these are render-only: Myne shows footnotes, reference links, and wikilinks as formatted text, but what is saved is exactly the markdown you typed. Wikilinks resolve only within the current vault; there are no cross-vault links.
