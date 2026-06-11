---
title: "Tables"
category: "markdown"
updated: 2026-06-11
summary: "How to write markdown tables in Myne, align columns, and what the rendered table looks like in the reading view."
tags: ["markdown"]
---

Myne renders standard pipe tables. You write them as plain text with `|` separators, and Myne draws them as a table when your cursor is elsewhere.

## Writing a table

A table is rows of cells separated by pipes, with a divider row of dashes under the header:

```
| Item    | Qty |
|---------|-----|
| Apples  | 6   |
| Oranges | 2   |
```

The cells do not need to line up in the source; Myne renders them aligned regardless. Put your cursor in the table to edit the raw markdown; move it away to see the rendered table.

## Column alignment

Mark alignment in the divider row with colons:

- `:---` left-aligns the column.
- `---:` right-aligns it.
- `:---:` centers it.

```
| Left | Center | Right |
|:-----|:------:|------:|
| a    | b      | c     |
```

## Limits

There is no "insert table" command; you type the pipes and the divider row yourself (the example above is a good starting point to copy). Tables are standard markdown, so they travel to any other markdown editor unchanged.
