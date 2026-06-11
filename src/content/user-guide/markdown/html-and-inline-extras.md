---
title: "HTML and inline extras"
category: "markdown"
updated: 2026-06-11
summary: "The inline extras Myne supports beyond standard markdown (selected inline HTML, highlights, and tag syntax) and how each one renders."
tags: ["markdown", "tags"]
---

Beyond the core syntax, Myne adds a few inline extras: highlights, subscript and superscript, emoji, a small set of inline HTML tags, and inline tags. This article covers each.

## Highlights, subscript, superscript

- `==highlight==` renders as a highlighted span.
- `~text~` renders as subscript, `^text^` as superscript (single run, no spaces, as in `H~2~O`, `x^2^`).

## Emoji

Type a shortcode like `:tada:` and a recognized name renders as the emoji glyph. Common shortcodes work; a name Myne doesn't know stays as literal text. The `:` autocomplete inserts the emoji glyph directly, so what gets saved is the emoji character itself, not the `:shortcode:`.

## A small set of inline HTML

Myne renders a deliberately tiny set of HTML tags written directly in your note. The allowed tags are:

`<p>`, `<kbd>`, `<mark>`, `<sub>`, `<sup>`, `<abbr>`, `<details>`, and `<summary>`.

The only attribute kept is `title` (used by `<abbr>`, as in `<abbr title="HyperText Markup Language">HTML</abbr>`). Anything outside this set, such as `<script>`, `<iframe>`, `<img>`, styles, classes, event handlers, or links, is **not** rendered; it is shown as plain text, and no attribute survives that could load a remote resource. This is a strict allowlist, not a general HTML engine: it lets you reach for a few tags, nothing more.

A couple of details:

- Markdown inside an HTML tag is not processed; the content is treated as HTML, not markdown.
- A `<details>` block's open/closed state is remembered only for the current session; it isn't saved into the note.

## Tags

An inline tag is a `#` followed by a label, written in your text: `#project`, `#reading/2026`. A tag starts a `#` only at the beginning of a line or after a space (so `color#fff` is not a tag), and it must contain at least one non-digit character, so `#1984` is treated as ordinary text (it's usually a number), while `#y1984` is a tag. Tags can be nested with slashes (`#area/topic`).

Tags written in the body are plain text by design; there is no click surface on them in the editor. What tags do, how they are indexed and where they surface, is covered in [Tags](/user-guide/find-and-connect/tags/). (A note about the asymmetry: a frontmatter `tags:` entry may be purely numeric, because listing it there is an explicit choice; an inline `#1984` is not.)

## Limits

Everything here is render-only; your saved file holds exactly what you typed. The HTML allowlist is fixed and cannot be extended.
