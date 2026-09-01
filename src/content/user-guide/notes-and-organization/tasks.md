---
title: "Tasks"
category: "notes-and-organization"
updated: 2026-08-25
summary: "How tasks work in Myne: checkbox lines that carry due, reminder, priority, and repeat chips you set from controls rather than typing, whole-note tasks, a Tasks panel and an embedded task-list block, and local reminders — all kept as plain markdown inside your notes."
tags: ["notes", "editor", "markdown", "import"]
---

A task in Myne is a line, or a whole note, that you have marked as a unit of work — there is no separate task database. A checkbox line is a task; a note can be declared one; and the metadata that says when a task is due, whether it repeats, and how urgent it is lives in the line itself, as plain markdown. Until you turn on sync or name a remote AI provider, Myne runs entirely on your device; nothing leaves it.

## Line-tasks and their fields

A **line-task** is a checkbox list item: `- [ ]` for an open item and `- [x]` for a done one. The checkbox is clickable in Live preview and in Source, and toggling it marks the task done in place. In **Reading** view, and in the reading pane beside the editor, the checkbox is shown but does nothing: those surfaces never change the note, so the box is drawn dimmed and does not take focus rather than looking live and quietly discarding the tick. Markdown checkboxes are also covered in [Markdown basics](/user-guide/markdown/markdown-basics/).

Move the caret into the checkbox, or select across it, and the checkbox turns back into the `- [ ]` it is written as, the way every other piece of markdown in Myne shows its source when you are inside it. It becomes a checkbox again as soon as you move away. Selecting a whole task row is worth knowing about for the same reason: the row is selected as source, so what you copy is `- [x] the task`, which pastes into any other markdown editor as the task it was.

A line-task can carry four inline fields — a due date, a reminder, a priority, and a repeat rule — which render as small chips at the end of the line while you write. Click a chip to open its editor:

- **Due date** opens a native date control, with an optional time beside it. Leave the time empty for a date-only task; fill it in for a task due at a particular hour.
- **Reminder** opens the same date-and-time control. This is the field the reminder scheduler reads.
- **Priority** opens a menu of five levels: highest, high, medium, low, lowest.
- **Repeat** opens the recurrence control described below.

Editing any one field rewrites every field on that line into Myne's own form, in a single step you can undo as one action. A value Myne cannot read — an impossible date like `2026-02-31`, for example — is left exactly as you wrote it and shown as raw text with a quiet hint, rather than being corrected.

### Leaving a task list

Press Enter at the end of a task and Myne opens the next one for you. Press it again on that empty task and the checkbox goes away, leaving a plain line directly underneath, which is how you get out of a list without deleting anything by hand. There is no third press to wait through and no blank line left behind.

### Adding a field

You never have to type the field syntax by hand. Put the caret on a task line and a **+** appears at the end of it; click it for a menu of the four fields. It is a caret affordance, so it steps out of the way while you have text selected on that line. The `/due`, `/remind`, `/repeat`, and `/priority` slash commands open the same editors directly. If the caret is on an ordinary line rather than a task, Myne turns it into `- [ ] ` first, because asking for a due date implies a task. Choosing a field the line already carries opens it for editing rather than adding a second one.

### The repeat control

A repeat rule is always **chosen from a control, never typed**. The control's first field picks one of four rule families:

- **Every…**: every day, week, month, or year, or every _N_ of them, with the number and the unit set in the two fields beside it.
- **Weekly on…**: every Monday, or any set of weekdays.
- **Monthly on a day…**: a specific day (1 to 31) or the last day.
- **Monthly on a weekday…**: the first, second, third, fourth, or last weekday of every month.

A separate checkbox, **Repeat from the date it's completed**, anchors the next occurrence to the day you complete the task rather than to its due date: the difference between watering the plants every three days counted from when you last did it, and a bill due on a fixed calendar day. A rule saved that way reads back in the note as "when done".

The vocabulary is closed on purpose: these families are the whole set, and there is no free-text rule box. The rule is stored in canonical English inside your note and displayed in your app language, so a note stays readable on a device set to another language. A rule advances only when you complete the task; a missed occurrence stays overdue and visible until you act on it. Completing a recurring task generates its next occurrence, and undoing that completion in the same step removes it again.

To move a recurring task on without marking it done, open the line's **+** menu and choose **Skip this occurrence**. The rule advances to its next date and the task stays open. That row is offered only when the line's rule can actually advance, so an action that would silently do nothing is never on the menu.

## Note-tasks

A whole note can be a task, not just a line inside one. A note-task is an ordinary note whose frontmatter carries `kind: task`; when you complete it, Myne records the completion time in a managed `done:` field. Its body is plain markdown like any other note.

Notes you have declared as tasks can show a small **task marker** in the sidebar and on their tab. The marker is a display preference — turn it on or off under **Settings → Appearance → Show task marker**.

## The Tasks panel

The **Tasks** panel gathers your tasks into one list, so you do not have to open each note to see them. Open it with **Show tasks** from the command palette (or ⌘⇧T / Ctrl Shift T); it opens as a pane you can place beside a note.

- **Filters.** **Overdue** is anything dated before today, **Today** is today only, **Upcoming** is the next seven days starting tomorrow, and **All** is everything, including tasks with no date. Overdue tasks are not folded into Today, so a daily list stays a daily list; the Overdue count is where the backlog stays visible. A task is filed under its due date, or under its reminder when it has no due date. Which day counts as today follows your **Time zone** setting under **Settings → Editor** when you set one, and this device otherwise.
- **Scope.** Narrow the list to a folder or a tag with the **Narrow by** control, or leave it at **All folders** for the whole vault.

The right panel also has a **Tasks** tab, scoped to the note you are reading rather than to the whole vault.

A task list is a view over your notes, not a place your tasks are stored. The one change you can make from it is ticking or unticking a task's checkbox; that write goes back to the note that owns the task. You cannot edit a task's text or fields from the list — open its note for that.

## The task-list query block

You can drop a live task list into any note. Use the editor's slash menu and choose **Task list**, which opens a small builder, or write a fenced code block whose language is `tasks`. The block renders in place as a list of the tasks that match your query, and it updates as your notes change.

The builder writes the query for you from a set of choices — completion state, a due-date window, a folder or tag, a priority, and a sort order — and shows a live preview of the text it produces. The query language is a **closed set of clauses** in English; the builder is there so you read the keywords rather than memorize them. If a clause cannot be read it is dropped and reported inside the block, and a query whose clauses are all unreadable shows nothing rather than matching your whole vault.

## Reminders

A task line can carry a reminder. Set one from the **Reminder** chip, from the task line's **+** menu, or with the `/remind` slash command; it takes a date and an optional time, the same way the due date does.

Myne's reminders are **local**: while the app is open and your vault unlocked, a due reminder appears as a toast in the app. There is no server that pushes reminders to your devices, and a reminder does not fire while Myne is closed.

The toast says a reminder is due and nothing more. It never quotes the task, its note, or its title. That is deliberate: a reminder can surface over a shared screen, so the notice stays content-free, and the task surfaces are where you go to see which one it was.

Reminders are on to begin with. Turn them off under **Settings → Editor → Task reminders**; existing reminders stay written in your notes and simply stop being announced.

## Importing tasks

Myne reads three task dialects and writes one. When you import a vault, tasks written in Obsidian's emoji form (the 📅, 🔁, and priority markers) and in Dataview-style inline fields (`[due:: …]`) are recognized, so your existing tasks light up without rework. Myne emits a single bracketed form of its own. State the consequence plainly before you rely on it: the first time you **edit** an imported task in Myne, its whole line is rewritten to that form, and it drops out of Obsidian's Tasks view. A task you never edit is left byte-for-byte as it was. See [Import your notes](/user-guide/attachments-and-import/import-your-notes/) for the wider mapping.

## Finding tasks

Because a task is just note content, everything in [Search](/user-guide/find-and-connect/search/) reaches it. Search also understands a `task:` operator that narrows a query to notes that contain tasks.

## Limits

Reminders are device-local and are not synced or pushed. They are delivered in the app while it is open and your vault is unlocked; nothing about a reminder is handed to an operating system or a server, and none fire while Myne is closed. When you turn on sync, a task's due date, priority, repeat rule, and completion travel with the note as ordinary content — but reminder delivery stays local to each device regardless.

The recurrence vocabulary is closed. If a repeat rule already in a note (from an import, or hand-written) is not one Myne recognizes, it is preserved exactly as written and shown as unrecognized — it is not offered as a control and the task will not repeat. Myne never guesses a rule it cannot read, precisely so a task cannot silently stop repeating without showing it.

A repeat rule also needs something to repeat from. A rule on a line that carries neither a due date nor a reminder parses fine and still cannot advance, so it is shown as unread too, with a hint that says to add a date rather than to fix the rule. Myne does not invent an anchor, because a rule counted from a moving "today" would reappear every day without ever advancing.

Task lists and query blocks are read-only projections over your notes. The only change any of them can make is ticking or unticking a checkbox; they cannot edit text, add or remove a field, or move a note.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Show tasks | ⌘⇧T | Ctrl Shift T |
| Toggle task list | ⌘⇧M | Ctrl Shift M |
| Select to the start of the task text | ⌘⇧← | Home Shift |
| Select the whole row, checkbox included | ⌘⇧← twice | Home Shift twice |
| Delete back to the start of the task text | ⌘⌫ | Ctrl Backspace |
