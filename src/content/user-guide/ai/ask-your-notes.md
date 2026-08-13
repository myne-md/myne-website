---
title: "Ask your notes"
category: "ai"
updated: 2026-08-13
summary: "Use the AI Chat tab to ask questions in plain language across your vault. Myne finds relevant passages on this device, composes an answer, streams it token by token, and shows citations back to the notes it drew from so you can verify."
tags: ["ai", "search"]
---

With AI on, the AI Chat tab lets you ask questions in plain language and get an answer grounded in your own notes. Myne finds the passages most relevant to your question on this device, composes an answer from them, streams it as it is generated, and shows you which notes it used so you can check the source.

## Prerequisites

- AI enabled, with a search model selected and something set up to answer — a text model file, a local runtime, or a provider. See [Turning on AI](/user-guide/ai/turning-on-ai/) and [Where your AI runs](/user-guide/ai/where-your-ai-runs/).
- An unlocked vault whose notes have been indexed (the AI Chat tab header reads **Ready**, or the name of the provider you named).

## Opening the chat

The AI Chat tab lives in the right sidebar alongside Backlinks, Unlinked mentions, and Outline. Select it from the right panel's tab strip, or run **Open AI Chat** from the command palette (in the **AI** category). If you have the right panel hidden, the palette command is the quickest way in.

The header shows a status: **No provider**, **Not answering**, **Unavailable**, **Preparing…**, or **Ready** — replaced by the provider's name when you have named one. Below it, when the tab is ready, Myne shows a one-line reminder that answers may be wrong and that you should check the notes it cites. Each answer additionally carries a line naming where it came from — this device, a program on this computer, or the provider by name — so the reminder about accuracy and the fact about where the request went are never the same sentence.

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

## When the chat cannot answer

The tab tells you which of three things is wrong, because each has a different fix.

- **No provider** — nothing is set up to answer, so chat, summaries, rewriting and semantic search have nothing to run on. Settings → Developer → AI is where you set one up.
- **Not answering** — what you set up is not responding: a runtime that is not running, or a provider that is unreachable. Check it, then send again.
- **Unavailable** — this build of Myne was compiled without local AI, so nothing here can run. No setting changes that.

When a provider refuses a single request, Myne repeats the reason it gave: a key it rejected, credit you are out of, a request it did not answer in time. A refused request is not sent again on its own.

## Limits

Where asking runs depends on what you have named. With no provider set up it runs entirely on your device and nothing — question, retrieved passages, or answer — leaves your machine. If you have named a remote provider, asking is one of the surfaces that can use it: the question and the passages it retrieves are sent there, after the consent step that says so. Retrieval itself is always on this device, because the semantic index is refused a provider outright ([Where your AI runs](/user-guide/ai/where-your-ai-runs/)). The answer is only as good as the model behind it and the passages it retrieves, so it can be wrong or incomplete — the visible citations are there so you can check it. Notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders) are never retrieved or used to ground an answer.

Because the model reads the text of your own notes, note content that came from an untrusted source (for example a note synced from another device or imported from elsewhere) can steer the wording of an answer. With no provider named this is a text-quality and jailbreak concern rather than a way to get data out of Myne: there is nowhere for the text to be sent, the model has no tools and makes no requests of its own, and the chat never writes to a note without your action. With a remote provider named, the defence that stops a note's own text from posing as an instruction is weaker, because the far side does the tokenizing and Myne cannot control it there; what a note's text cannot change is where the request already goes. The model runs in-process and is not sandboxed from your decrypted notes; the full boundary is in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).
