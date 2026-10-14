---
title: "Summarize a meeting"
category: "ai"
updated: 2026-10-07
summary: "After a meeting session writes its note, ask Myne's AI to add a summary, action items, decisions and open questions beneath the transcript. The transcript stays exactly as it is; the sections are added only when you choose."
tags: ["ai", "notes"]
---

A meeting session writes a note whose body is the raw machine transcript of the meeting, with the recorded audio above it. When you want more than the transcript, you can ask Myne's AI to read it and add a short set of sections beneath it. The transcript is never changed, and nothing is added until you review the result and insert it.

The meeting session itself is behind Developer mode; see [Turning on AI](/user-guide/ai/turning-on-ai/) and the Developer mode setting under Settings, About.

## Prerequisites

- AI enabled, with a text model selected or a provider named. See [Turning on AI](/user-guide/ai/turning-on-ai/).
- A meeting session that has finished and written its note.

## Adding the AI sections

1. After the meeting ends, a notice appears offering to summarize it. Choose **Summarize**. If you do nothing, the note stays as the transcript only, which is a complete result on its own.
2. In the dialog, choose which sections you want: a **summary**, **action items**, **decisions** and **open questions**. All are on by default.
3. Choose **Generate**. For a long meeting the transcript is read in parts and the parts are combined, so a full meeting is summarized rather than only its start. A progress line shows how far the pass has reached, and **Stop** cancels it; nothing is written if you stop.
4. When the result is ready it is shown for review. Choose **Insert into note** to add it, or **Discard** to leave the note untouched.

The sections are appended beneath the transcript as ordinary Markdown, under a line that says they are AI-generated. They are separate from the transcript's own machine-transcript notice: one says the speech-to-text may be wrong, the other that the summary may be wrong.

If no text model is installed, the dialog says so and offers a button that opens the AI settings, where you can get one.

## Regenerating

Running the pass again replaces the previous AI sections in place; it does not append a second copy and it never touches the transcript or anything you wrote below the sections. The transcript stays editable, and edits you make to the AI sections stay yours.

## Your own prompt

The pass uses a built-in instruction by default. In Settings, AI, a **Meeting summary prompt** field lets you replace that instruction with your own; leave it empty to use the default. It replaces the default output format, so if you set it you should ask for the sections you want yourself. The prompt is stored with your vault and reaches your other devices.

## Limits

Where the pass runs depends on what you have named. With no provider set up it runs on your device and the transcript never leaves your machine. If you have named a remote provider, the transcript is sent there after the consent step that says so ([Where your AI runs](/user-guide/ai/where-your-ai-runs/)). The transcript is what other people said in the meeting, so treat sending it off your device with the same care as any other note content. The summary comes from a small model and can miss or distort points, so treat the sections as a draft to check against the transcript, not a substitute for reading it. The transcript is one undifferentiated stream, so the pass cannot tell who said what: action items are produced without owners. A note in an [excluded folder](/user-guide/ai/turning-on-ai/#excluding-folders) is not offered the pass. The model Myne runs itself runs in-process and is not isolated from your decrypted notes; see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for the full boundary.
