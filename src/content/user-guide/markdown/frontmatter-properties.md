---
title: "Frontmatter and properties"
category: "markdown"
updated: 2026-06-11
summary: "How YAML frontmatter at the top of a note defines properties, which properties Myne recognizes, and how they affect the note."
tags: ["markdown", "notes"]
---

Frontmatter is an optional block of properties at the very top of a note, written in YAML. Myne uses a few fields of its own and leaves everything else to you. This article covers the rules and the fields Myne manages.

## The frontmatter block

If a note has frontmatter, it must be the very first thing in the file: a line of exactly `---`, then valid YAML, then a closing line of exactly `---`.

```
---
title: Weekly review
tags: [planning, review]
---

The note body starts here.
```

In this version, the frontmatter shows as a code block in the editor; an editable property grid is not part of v0.1. You edit frontmatter as text.

## Fields Myne manages

Myne writes five fields of its own. You rarely touch them directly; actions in the app keep them current:

| Field | What it records | Written by |
|---|---|---|
| `updated` | the last time you edited the note | autosave, on every save |
| `title` | the note's title | the rename action (and the importer, for imported files) |
| `folder` | the folder the note lives in; **absent means the vault root** | creating or moving the note |
| `trashed` | present means the note is in the Trash | the trash and restore actions |
| `template` | `true` means the note is a template | the template actions |

Two of these are **value-strict**, which protects you from accidents: `trashed` only counts when its value is a real timestamp, and `template` only counts when it is exactly `true`. So your own `template: maybe` or `trashed: someday` won't quietly hide a note. The `folder` value is **virtual**: it is recorded inside the encrypted note, not as a real directory on disk, which is why your folder structure travels with the note even to another editor.

## Your own fields are kept

Myne **never strips frontmatter it doesn't recognize**. Any fields you add (`tags`, `aliases`, your own bookkeeping) are preserved exactly, on every save. Editing a note, renaming it, or moving it touches only the relevant managed field and leaves everything else byte-for-byte intact.

A note on tags: a frontmatter `tags:` list is a different surface from the inline `#tags` you write in the body. Both feed the same places; see [Tags](/user-guide/find-and-connect/tags/).

## Limits

Frontmatter is plain text you edit directly. Select-all in the editor selects the note's body section and leaves the frontmatter block alone, so you don't overwrite it by accident. If you want a template's structure to include frontmatter, build it into the template; see [Templates](/user-guide/notes-and-organization/templates/).
