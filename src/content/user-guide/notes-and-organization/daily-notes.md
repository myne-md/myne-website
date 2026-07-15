---
title: "Daily notes"
category: "notes-and-organization"
updated: 2026-06-11
summary: "How daily notes give you one note per calendar day, how to open today's note, and how to pair daily notes with a template."
tags: ["notes", "templates"]
---

A daily note is one note per day: a journal, a log, a scratchpad that resets each morning. Myne's daily notes are deliberately plain. A single command opens today's note, creating it the first time and reopening it after.

![Today's dated note, opened from the command palette and filed in the Daily folder.](./daily-notes.png)

## Opening today's note

Open the command palette and run **Open today's note**. The first time you run it on a given day, Myne creates that day's note; every time after, it reopens the same one. It is idempotent: you cannot end up with two notes for the same day by running it twice.

Daily notes live in their own folder with a date-based title, both of which you can set in Settings. Earlier days are reached by browsing that folder; there is no calendar and no date picker, by design. The command always means **today**.

## Pairing with a template

If you keep a template for your daily layout, set it as your daily-note template in Settings, and each new day's note starts from it, date placeholders and all (see [Templates](/user-guide/notes-and-organization/templates/) for the placeholder set).

## Limits

A daily note is matched by its title. If you rename today's note, **Open today's note** no longer recognizes it and will create a fresh one for the day. Keep the title if you want the command to keep finding it.
