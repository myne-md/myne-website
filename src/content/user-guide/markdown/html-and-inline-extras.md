---
title: "HTML and inline extras"
category: "markdown"
updated: 2026-08-13
summary: "The inline extras Myne supports beyond standard markdown (selected inline HTML, highlights, tags, and inline comments) and how each one renders."
tags: ["markdown", "tags"]
---

Beyond the core syntax, Myne adds a few inline extras: highlights, subscript and superscript, emoji, a small set of inline HTML tags, inline tags, and inline comments. This article covers each.

## Highlights, subscript, superscript

- `==highlight==` renders as a highlighted span in the default yellow.
- `~text~` renders as subscript, `^text^` as superscript (single run, no spaces, as in `H~2~O`, `x^2^`).

Highlights come in thirteen colors. The default yellow is what `==highlight==` produces. For the other twelve — green, blue, pink, purple, orange, red, teal, cyan, lime, brown, grey, and indigo — write a `<mark>` with one of the highlight classes: `<mark class="hl-green">…</mark>`, and likewise `hl-blue`, `hl-pink`, `hl-purple`, `hl-orange`, `hl-red`, `hl-teal`, `hl-cyan`, `hl-lime`, `hl-brown`, `hl-grey`, and `hl-indigo` (the default yellow is `hl-yellow`). The toolbar's highlight control does the same thing: a plain click gives the default yellow, byte-identical to `==…==`, and the caret opens the thirteen-color row. With the cursor already inside a highlight the control shows that highlight's colour, and the row recolours it, swaps it to or from yellow, or removes it with **Remove highlight**.

The highlight classes are a closed set: `hl-yellow`, `hl-green`, `hl-blue`, `hl-pink`, `hl-purple`, `hl-orange`, `hl-red`, `hl-teal`, `hl-cyan`, `hl-lime`, `hl-brown`, `hl-grey`, `hl-indigo`. A `class` survives only when it is exactly one of these tokens on a `<mark>`. Any other class — a different name, more than one token, or `class` on another tag — is stripped from the rendered output. Stripping a class never changes the bytes saved in your note; only what is drawn changes.

Putting the cursor in a colored highlight shows it as `==text==`, the same as a yellow one, rather than as the `<mark>` tag. That is only what is drawn — your file still holds the `<mark class="hl-…">` you wrote.

## Emoji

Type a shortcode like `:tada:` and a recognized name renders as the emoji glyph. Common shortcodes work; a name Myne doesn't know stays as literal text. The `:` autocomplete inserts the emoji glyph directly, so what gets saved is the emoji character itself, not the `:shortcode:`.

## A small set of inline HTML

Myne renders a deliberately tiny set of HTML tags written directly in your note. The allowed tags are:

`<p>`, `<kbd>`, `<mark>`, `<sub>`, `<sup>`, `<abbr>`, `<details>`, and `<summary>`.

The only attributes kept are `title` (used by `<abbr>`, as in `<abbr title="HyperText Markup Language">HTML</abbr>`) and a single highlight-class `class` on `<mark>` (the closed `hl-*` set described above). Anything outside this set, such as `<script>`, `<iframe>`, `<img>`, styles, any other class, event handlers, or links, is **not** rendered; it is shown as plain text, and no attribute survives that could load a remote resource. This is a strict allowlist, not a general HTML engine: it lets you reach for a few tags, nothing more.

A couple of details:

- Markdown inside an HTML tag is not processed; the content is treated as HTML, not markdown.
- A `<details>` block's open/closed state is remembered only for the current session; it isn't saved into the note.

## Tags

An inline tag is a `#` followed by a label, written in your text: `#project`, `#reading/2026`. A tag starts a `#` only at the beginning of a line or after a space (so `color#fff` is not a tag), and it must contain at least one non-digit character, so `#1984` is treated as ordinary text (it's usually a number), while `#y1984` is a tag. Tags can be nested with slashes (`#area/topic`).

A tag you write in the body renders as a `#tag` chip you can click: clicking the chip opens the tag browser filtered to that tag. As you type a `#tag`, autocomplete suggests tags you already use, so you reuse an existing label instead of spawning a near-duplicate. To edit a chip, move the cursor into it (it reveals the raw text) or delete and retype. What tags do, how they are indexed and where they surface, is covered in [Tags](/user-guide/find-and-connect/tags/). (A note about the asymmetry: a frontmatter `tags:` entry may be purely numeric, because listing it there is an explicit choice; an inline `#1984` is not.)

## Inline comments

Wrap text in `%%…%%` to mark it as a comment: `%%note to self%%`. A comment is part of your note's text — it stays in the saved file — but it is omitted from the rendered output and from projections like the document word count.

A comment can also span lines: a line that starts with `%%` opens one, and it runs until the next `%%`, which may sit on a line of its own. Termination is required in both forms — a `%%` with no closer is not a comment, so it is left as ordinary text and nothing is hidden by accident. Comments are covered in full in [Comments](/user-guide/editor-and-writing/comments/).

## Limits

Everything here is render-only; your saved file holds exactly what you typed — including the highlight classes, the `#tag` text, and the contents of any `%%…%%` comment. The HTML tag allowlist is fixed and cannot be extended, and the highlight-class set is closed.
