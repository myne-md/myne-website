---
title: "Ask your notes"
category: "ai"
updated: 2026-07-11
summary: "Use the AI Chat tab to ask questions in plain language across your vault. Myne finds relevant passages on-device, composes an answer, streams it token by token, and shows citations back to the notes it drew from so you can verify."
tags: ["ai", "search"]
---

With AI on, the AI Chat tab lets you ask questions in plain language and get an answer grounded in your own notes. Myne finds the passages most relevant to your question on-device, composes an answer from them, streams it as it is generated, and shows you which notes it used so you can check the source.

## Prerequisites

- AI enabled with a text model and a search model selected — see [Turning on AI](/user-guide/ai/turning-on-ai/).
- An unlocked vault whose notes have been indexed (the AI Chat tab header reads **Ready**).

## Opening the chat

The AI Chat tab lives in the right sidebar alongside Backlinks, Unlinked mentions, and Outline. Select it from the right panel's tab strip, or run **Open AI Chat** from the command palette (in the **AI** category). If you have the right panel hidden, the palette command is the quickest way in.

The header shows a status: Off, No model, Preparing, or Ready. Below it, when AI is ready, Myne shows a one-line reminder that answers come from a small model running on your device and may be wrong, so you should check the notes it cites. That line is deliberate; it is the honest counterweight to a small local model.

## Asking a question

1. Type your question into the composer at the bottom of the tab.
2. Send it. Your turn appears in the transcript, followed by the assistant's answer.
3. The answer streams in token by token. While it is generating, the send button becomes a **Stop** control you can use to cut a long or off-track answer short; the partial text you stopped at stays in the transcript.

The chat is conversational: earlier turns are carried as context for follow-up questions, so you can refine ("only from last week's notes", "shorter") without restating everything.

## Citations

Under a grounded answer, Myne shows citation chips for the notes it drew from, under a **Sources** heading. Each chip is labelled with the note's title where available. Click a chip to open that source note so you can read the passage in context and confirm the answer against it. Citations are how you verify a small model's output; treat them as the point, not a decoration.

If nothing in your vault could ground the question, the assistant says so rather than inventing an answer.

## Where the transcript lives

The conversation is held in memory only. It is never written to disk, and it is dropped when the vault locks — on manual lock, auto-lock, or vault delete. There is no saved chat history in this version.

## Limits

Where asking runs depends on what you have named. With no provider set up it runs entirely on your device and nothing — question, retrieved passages, or answer — leaves your machine. If you have named a remote provider, asking is one of the surfaces that can use it: the question and the passages it retrieves are sent there, after the consent step that says so. Retrieval itself is always local, because the search index never leaves the device. The answer is only as good as a small local model and the passages it retrieves, so it can be wrong or incomplete — the visible citations are there so you can check it. Notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders) are never retrieved or used to ground an answer.

Because the model reads the text of your own notes, note content that came from an untrusted source (for example a note synced from another device or imported from elsewhere) can steer the wording of an answer. This is a text-quality and jailbreak concern, not a data-leak one: there is no network path to exfiltrate anything, and the chat never writes to a note on its own. The model runs in-process and is not sandboxed from your decrypted notes; the full boundary is in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).
