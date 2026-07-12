---
title: "Writing assistant"
category: "ai"
updated: 2026-07-11
summary: "Inline writing help from the on-device model: a dimmed ghost-text completion you accept with Tab, plus slash commands to continue writing or suggest a title, and a palette command to rewrite a selection. Every insertion is plain Markdown you trigger."
tags: ["ai", "editor"]
---

With AI on, Myne offers inline writing help from the on-device text model while you type: a suggested continuation shown next to your cursor, and commands to continue, retitle, or rewrite. Nothing is written into the note until you accept it, and everything it inserts is ordinary Markdown.

## Prerequisites

- AI enabled with a text model selected — see [Turning on AI](/user-guide/ai/turning-on-ai/).
- A note open in the editor (the writing surface is inert in reading view and in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders)).

## Ghost-text completions

When you pause with the cursor at the end of what you have written, Myne asks the model for a short continuation and shows it inline as dimmed, italic text just after the cursor. It is a preview only — it is not in the document yet.

- Press `Tab` to accept it. The text is inserted as plain Markdown in a single undo step.
- Press `Esc`, or just keep typing, to dismiss it.

The suggestion only appears at a resting cursor with no selection, and a stale suggestion (you moved the cursor or the note changed while it was being generated) is dropped rather than inserted in the wrong place. When the cursor is showing a suggestion, `Tab` accepts it; otherwise `Tab` indents as usual.

## Slash commands

Type `/` in the editor to open the [slash menu](/user-guide/editor-and-writing/slash-commands/). With AI on, it includes two AI commands:

- **Continue writing (AI)** — inserts a continuation from the cursor, like accepting a ghost completion but on demand.
- **Suggest title (AI)** — asks the model for a concise title and writes it to the note's `title:` field, exactly as if you had edited the title yourself.

Both insert plain Markdown as a single undo step. If the note changes while the model is working, the result is dropped rather than applied to stale content.

## Rewrite a selection

To rewrite text you have already written, select it and run **Rewrite selection** from the command palette (in the **AI** category). The model rewrites the selected span in place, keeping its meaning, language, and Markdown formatting. Rewrite is a palette command rather than a slash command because typing a slash trigger would leave nothing selected to rewrite.

## Limits

Writing help runs on your device: the surrounding text sent as context and the generated text never leave your machine, because Myne has no network path for AI. Output comes from a small local model and can be wrong, bland, or off-key — read it before you keep it. Nothing is written to a note without an explicit action (accepting a ghost, running a command). A note in an excluded folder gets no writing help at all. The model runs in-process and is not isolated from your decrypted notes; see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for the full boundary.

## Shortcuts

| Action | Key |
|---|---|
| Accept the inline completion | Tab |
| Dismiss the inline completion | Esc |
