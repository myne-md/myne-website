---
title: "Markdown basics"
category: "markdown"
updated: 2026-06-18
summary: "The core markdown syntax Myne renders: headings, emphasis, lists, links, blockquotes, and horizontal rules, with examples of how each one looks in the editor."
tags: ["markdown", "editor"]
---

This article covers the everyday markdown you will use most. Myne renders it live: as your cursor leaves a line, the markers fade and the formatting shows; move the cursor back onto the line and the raw markdown returns so you can edit it. Nothing is rewritten, and what you see is a view of the bytes you typed.

![A note showing rendered Markdown basics: a heading, bold and italic text, and a bulleted list.](./markdown-basics.png)

## Headings

Write headings with `#` markers, from `# Heading 1` through `###### Heading 6`. New headings always use this `#` form. (If you import notes that underline a heading with `===` or `---`, Myne reads and renders them, but it never converts your file to that form.)

You can cycle a line through heading levels with a shortcut (see Shortcuts below).

## Emphasis and inline code

- `*italic*` for *italic*, `**bold**` for **bold**.
- `` `code` `` for inline `code`.
- `==highlight==` for a highlighted span (the default yellow); a 5-color palette adds green, blue, pink, and purple, which are stored as `<mark class="hl-*">` — see [HTML and inline extras](/user-guide/markdown/html-and-inline-extras/). `~sub~` and `^sup^` for subscript and superscript.

Bold, italic, and inline code have toolbar buttons and keyboard shortcuts.

## Lists

- **Bullet lists** start a line with `- `.
- **Numbered lists** start with `1. `.
- **Task lists** use `- [ ]` for an open item and `- [x]` for a done one; the checkbox is clickable.

Lists nest by indenting.

## Links, quotes, and rules

- **Links**: `[text](https://example.com)`.
- **Block quotes**: prefix lines with `> `.
- **Horizontal rule**: a line of `---`.
- **Line breaks and escapes**: end a line with a backslash for a hard break, and put a backslash before a character (like `\*`) to keep it literal.

## Definition lists

Myne renders a tight definition list: a term on one line, immediately followed by `: definition` lines with no blank line between them:

```
Term
: The definition.
: A second definition of the same term.
```

## Images

An image is `![alt text](path)`. Myne **never fetches a remote image**: an image pointing at a web URL is not downloaded, by design, because loading it would reach out to a server and leak that you opened the note. Attachments you add to the vault are covered in [Attachments](/user-guide/attachments-and-import/attachments/).

## Find in note

To find text inside the note you are reading, open the find bar (see Shortcuts). It does a literal, in-note search with a case-sensitivity toggle and no regular expressions. A replace row lets you replace the current match or rewrite every occurrence in one undoable step — see [Find and replace in a note](/user-guide/editor-and-writing/find-and-replace/). The search runs in memory only; it is not written to disk.

Find looks inside the note you're reading; to search across every note in your vault, use [Search](/user-guide/find-and-connect/search/).

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Bold | ⌘B | Ctrl B |
| Italic | ⌘I | Ctrl I |
| Inline code | ⌘E | Ctrl E |
| Cycle heading level | ⌘⇧H | Ctrl Shift H |
| Toggle bullet list | ⌘⇧8 | Ctrl Shift 8 |
| Toggle numbered list | ⌘⇧7 | Ctrl Shift 7 |
| Toggle task list | ⌘⇧M | Ctrl Shift M |
| Find in note | ⌘F | Ctrl F |
| Select section | ⌘A | Ctrl A |
