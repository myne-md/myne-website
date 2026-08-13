---
title: "Markdown"
category: "markdown"
updated: 2026-08-13
summary: "An overview of the markdown Myne supports (basics, tables, code blocks, footnotes and reference links, embeds, math, diagrams, callouts, inline extras, comments, tasks, and frontmatter) and where each is documented."
tags: ["markdown", "editor"]
---

Myne writes plain markdown, the same text files you could open in any editor, and renders it live as you type. The dialect is CommonMark plus the common GitHub-Flavored extensions, footnotes, wikilinks, and YAML frontmatter, with a few small Myne additions. This section documents each construct.

## The one promise behind all of it

Rendering never changes your file bytes. Myne shows headings as headings, callouts as callouts, and math as math, but what is saved on disk is exactly the markdown you typed. The styling is a view, not a rewrite. Move your notes to another editor and they read as ordinary markdown.

## What's in this section

- **[Markdown basics](/user-guide/markdown/markdown-basics/)**: headings, emphasis, lists, links, quotes, and finding text in a note.
- **[Tables](/user-guide/markdown/tables/)**: pipe tables with column alignment.
- **[Code blocks](/user-guide/markdown/code-blocks/)**: fenced code with syntax highlighting.
- **[Footnotes and reference links](/user-guide/markdown/footnotes-and-reference-links/)**: footnotes, reference-style links, and the full wikilink syntax.
- **[Embeds](/user-guide/markdown/embeds/)**: what `![[target]]` draws for a note, a drawing, and an attachment.
- **[Math](/user-guide/markdown/math/)**: inline and block LaTeX via KaTeX.
- **[Diagrams](/user-guide/markdown/diagrams/)**: Mermaid diagrams rendered to images.
- **[Callouts](/user-guide/markdown/callouts/)**: highlighted admonition blocks.
- **[HTML and inline extras](/user-guide/markdown/html-and-inline-extras/)**: a small set of inline HTML tags, the thirteen-color highlight palette, sub/superscript, emoji, and tags.
- **[Comments](/user-guide/editor-and-writing/comments/)**: notes-to-self written `%%text%%`, dimmed in the editor and dropped from HTML, PDF, plain-text export, and document statistics. They stay verbatim in the Markdown export, since that is your file byte-for-byte.
- **[Tasks](/user-guide/notes-and-organization/tasks/)**: checkbox lines that carry due, priority and repeat fields, and the ` ```tasks ` block that gathers matching tasks into a live list. Both stay plain markdown in your file.
- **[Frontmatter and properties](/user-guide/markdown/frontmatter-properties/)**: the YAML block at the top of a note.

## What Myne does not do

Myne's markdown is a fixed, curated dialect: there is no extension mechanism and no way to add your own syntax. A few things are deliberately out: there is no transclusion of one note's text into another (a note embed renders as a labeled chip), and there are no cross-vault links. Drawings are the one non-markdown note type: a drawing note holds a canvas rather than markdown, and a markdown note can embed one with `![[Drawing name]]`, which draws it in place — see [Embeds](/user-guide/markdown/embeds/). Template placeholders like `{{date}}` are a separate feature, documented in [Templates](/user-guide/notes-and-organization/templates/).
