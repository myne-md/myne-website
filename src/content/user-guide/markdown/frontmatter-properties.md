---
title: "Frontmatter and properties"
category: "markdown"
updated: 2026-06-18
summary: "How YAML frontmatter at the top of a note defines properties, which properties Myne recognizes, and how they affect the note."
tags: ["markdown", "notes"]
---

Frontmatter is an optional block of properties at the very top of a note, written in YAML. Myne uses a few fields of its own and leaves everything else to you. This article covers the rules and the fields Myne manages.

![The Properties panel at the top of a note, showing its title and frontmatter fields.](./frontmatter-properties.png)

## The frontmatter block

If a note has frontmatter, it must be the very first thing in the file: a line of exactly `---`, then valid YAML, then a closing line of exactly `---`.

```
---
title: Weekly review
tags: [planning, review]
---

The note body starts here.
```

When a note has frontmatter, the editor renders it as a **Properties** widget at the top of the note: each recognized key sits beside a text input holding its value, and a **+ Add property** button adds a new one. Editing an input and pressing Enter or moving focus away writes the change straight back into the note's frontmatter. Values with structure a single line cannot hold — multi-line text, nested objects, sequences — stay as raw YAML rather than appearing as inputs.

## Fields Myne manages

Myne writes six fields of its own. You rarely touch them directly; actions in the app keep them current:

| Field | What it records | Written by |
|---|---|---|
| `updated` | the last time you edited the note | autosave, on every save |
| `title` | the note's title | the rename action (and the importer, for imported files) |
| `folder` | the folder the note lives in; **absent means the vault root** | creating or moving the note |
| `trashed` | present means the note is in the Trash | the trash and restore actions |
| `template` | `true` means the note is a template | the template actions |
| `archived` | present means the note is in the Archive; its value records when you archived it | the archive and restore-from-archive actions; see [Archive](/user-guide/notes-and-organization/archive/) |

Three of these are **value-strict**, which protects you from accidents: `trashed` and `archived` only count when their value is a real timestamp, and `template` only counts when it is exactly `true`. So your own `template: maybe` or `trashed: someday` won't quietly hide a note. A note is at most one of archived or trashed: archiving a note clears any `trashed`, and trashing an archived note clears its `archived`. Neither archiving nor restoring from the Archive touches `updated`, since moving a note in or out of the Archive is not a content edit. The `folder` value is **virtual**: it is recorded inside the encrypted note, not as a real directory on disk, which is why your folder structure travels with the note even to another editor.

## Your own fields are kept

Myne **never strips frontmatter it doesn't recognize**. Any fields you add (`tags`, `aliases`, your own bookkeeping) are preserved exactly, on every save. Editing a note, renaming it, or moving it touches only the relevant managed field and leaves everything else byte-for-byte intact.

A note on tags: a frontmatter `tags:` list is a different surface from the inline `#tags` you write in the body. Both feed the same places; see [Tags](/user-guide/find-and-connect/tags/).

## Limits

Select-all in the editor selects the note's body section and leaves the frontmatter alone, so you don't overwrite it by accident. A find-and-replace match that falls inside the frontmatter is counted in the `k/N` total but is not highlighted on screen, because frontmatter renders as the Properties widget rather than as raw text and there is nothing in the note body to paint the match on; see [Find and replace](/user-guide/editor-and-writing/find-and-replace/). If you want a template's structure to include frontmatter, build it into the template; see [Templates](/user-guide/notes-and-organization/templates/).
