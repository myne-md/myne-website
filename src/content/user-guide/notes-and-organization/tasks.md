---
title: "Tasks"
category: "notes-and-organization"
updated: 2026-07-31
summary: "How tasks work in Myne: checkbox lines that carry due, priority, and repeat chips you set from controls, whole-note tasks, a Tasks panel and an embedded task-list block, and local reminders — all kept as plain markdown inside your notes."
tags: ["notes", "editor", "markdown", "import"]
---

A task in Myne is a line, or a whole note, that you have marked as a unit of work — there is no separate task database. A checkbox line is a task; a note can be declared one; and the metadata that says when a task is due, whether it repeats, and how urgent it is lives in the line itself, as plain markdown. Until you turn on sync, Myne runs entirely on your device; nothing leaves it.

## Line-tasks and their fields

A **line-task** is a checkbox list item: `- [ ]` for an open item and `- [x]` for a done one. The checkbox is clickable, and toggling it marks the task done in place. Markdown checkboxes are also covered in [Markdown basics](/user-guide/markdown/markdown-basics/).

A line-task can carry inline fields — a due date, a priority, and a repeat rule — which render as small chips at the end of the line while you write. Click a chip to open its editor:

- **Due date** opens your system's native date control.
- **Priority** opens a menu of five levels: highest, high, medium, low, lowest.
- **Repeat** opens the recurrence control described below.

Editing any one field rewrites every field on that line into Myne's own form, in a single step you can undo as one action. A value Myne cannot read — an impossible date like `2026-02-31`, for example — is left exactly as you wrote it and shown as raw text with a quiet hint, rather than being corrected.

### The repeat control

A repeat rule is always **chosen from a control, never typed**. The control offers four rule families:

- **Interval** — every day, week, month, or year, or every _N_ of them.
- **Weekday set** — every Monday, or any set of weekdays.
- **Day of the month** — a specific day (1 to 31) or the last day.
- **Ordinal in the month** — the first, second, third, fourth, or last weekday of every month.

A separate **when done** option anchors the next occurrence to the day you complete the task rather than to its due date — the difference between watering the plants every three days counted from when you last did it, and a bill due on a fixed calendar day.

The vocabulary is closed on purpose: these families are the whole set, and there is no free-text rule box. The rule is stored in canonical English inside your note and displayed in your app language, so a note stays readable on a device set to another language. A rule advances only when you complete the task; a missed occurrence stays overdue and visible until you act on it. Completing a recurring task generates its next occurrence, and undoing that completion in the same step removes it again.

## Note-tasks

A whole note can be a task, not just a line inside one. A note-task is an ordinary note whose frontmatter carries `kind: task`; when you complete it, Myne records the completion time in a managed `done:` field. Its body is plain markdown like any other note.

Notes you have declared as tasks can show a small **task marker** in the sidebar and on their tab. The marker is a display preference — turn it on or off under **Settings → Appearance → Show task marker**.

## The Tasks panel

The **Tasks** panel gathers your tasks into one list, so you do not have to open each note to see them. Open it with **Show tasks** from the command palette (or ⌘⇧T / Ctrl Shift T); it opens as a pane you can place beside a note.

- **Filters.** All, Overdue, Today, Upcoming.
- **Scope.** Narrow the list to a folder or a tag with the **Narrow by** control, or leave it at **All folders** for the whole vault.

The right panel also has a **Tasks in this note** tab, scoped to the note you are reading.

A task list is a view over your notes, not a place your tasks are stored. The one change you can make from it is ticking or unticking a task's checkbox; that write goes back to the note that owns the task. You cannot edit a task's text or fields from the list — open its note for that.

## The task-list query block

You can drop a live task list into any note. Use the editor's slash menu and choose **Task list**, which opens a small builder, or write a fenced code block whose language is `tasks`. The block renders in place as a list of the tasks that match your query, and it updates as your notes change.

The builder writes the query for you from a set of choices — completion state, a due-date window, a folder or tag, a priority, and a sort order — and shows a live preview of the text it produces. The query language is a **closed set of clauses** in English; the builder is there so you read the keywords rather than memorize them. If a clause cannot be read it is dropped and reported inside the block, and a query whose clauses are all unreadable shows nothing rather than matching your whole vault.

## Reminders

A task line can carry a reminder time. Myne's reminders are **local**: while the app is open and your vault unlocked, a due reminder appears as a toast in the app. There is no server that pushes reminders to your devices, and a reminder does not fire while Myne is closed.

## Importing tasks

Myne reads three task dialects and writes one. When you import a vault, tasks written in Obsidian's emoji form (the 📅, 🔁, and priority markers) and in Dataview-style inline fields (`[due:: …]`) are recognized, so your existing tasks light up without rework. Myne emits a single bracketed form of its own. State the consequence plainly before you rely on it: the first time you **edit** an imported task in Myne, its whole line is rewritten to that form, and it drops out of Obsidian's Tasks view. A task you never edit is left byte-for-byte as it was. See [Import from Obsidian](/user-guide/attachments-and-import/import-from-obsidian/) for the wider mapping.

## Finding tasks

Because a task is just note content, everything in [Search](/user-guide/find-and-connect/search/) reaches it. Search also understands a `task:` operator that narrows a query to notes that contain tasks.

## Limits

Reminders are device-local and are not synced or pushed. They are delivered in the app while it is open and your vault is unlocked; nothing about a reminder is handed to an operating system or a server, and none fire while Myne is closed. When you turn on sync, a task's due date, priority, repeat rule, and completion travel with the note as ordinary content — but reminder delivery stays local to each device regardless.

The recurrence vocabulary is closed. If a repeat rule already in a note (from an import, or hand-written) is not one Myne recognizes, it is preserved exactly as written and shown as unrecognized — it is not offered as a control and the task will not repeat. Myne never guesses a rule it cannot read, precisely so a task cannot silently stop repeating without showing it.

Task lists and query blocks are read-only projections over your notes. The only change any of them can make is ticking or unticking a checkbox; they cannot edit text, add or remove a field, or move a note.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Show tasks | ⌘⇧T | Ctrl Shift T |
| Toggle task list | ⌘⇧M | Ctrl Shift M |
