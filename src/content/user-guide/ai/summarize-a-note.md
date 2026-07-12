---
title: "Summarize a note"
category: "ai"
updated: 2026-07-11
summary: "Ask the on-device model for a short summary of the current note or a selection. The summary appears in the AI Chat tab, and you can insert it into the note as a plain-markdown Summary block only when you choose to."
tags: ["ai", "notes"]
---

With AI on, Myne can summarize the note you are reading, or just a selection of it, using the on-device text model. The summary is shown to you first; it is added to the note only if you explicitly insert it.

## Prerequisites

- AI enabled with a text model selected — see [Turning on AI](/user-guide/ai/turning-on-ai/).
- A note open in the editor.

## Summarizing

1. Open the note you want to summarize.
2. To summarize part of it instead of the whole note, select that text. A non-empty selection is summarized in preference to the whole note; with nothing selected, the whole note is used.
3. Run **Summarize note** from the command palette (in the **AI** category).

The summary is produced by the model and appears in the AI Chat tab, which shows a working state while the model runs. Very long input is trimmed to fit the model's context; when that happens Myne tells you it summarized the first part of the note rather than silently cutting it.

## Inserting the summary

The summary is not added to your note automatically. When it is ready in the AI Chat tab, an **Insert into note** action appears beneath it. Choosing it appends a `## Summary` block to the end of the note, as ordinary Markdown — the same text you could have typed by hand, with no special format. It saves through the normal note-save path, so it participates in autosave, snapshots, and undo like any other edit.

If you do not insert it, nothing is written; the summary stays in the tab until it is replaced or the vault locks.

## Limits

Summarizing runs on your device: the note text and the generated summary never leave your machine, because Myne has no network path for AI. The summary comes from a small local model and can miss or distort points, so treat it as a draft to check against the note, not a substitute for reading it. A note in an [excluded folder](/user-guide/ai/turning-on-ai/#excluding-folders) is never summarized. Nothing is added to a note without your explicit Insert action. The model runs in-process and is not isolated from your decrypted notes; see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for the full boundary.
