---
title: "Ask your notes"
category: "ai"
updated: 2026-08-21
summary: "Use the AI Chat tab to ask questions in plain language across your vault. Myne finds relevant passages on this device, composes an answer, streams it token by token, and shows citations back to the notes it drew from so you can verify."
tags: ["ai", "search"]
---

With AI on, the AI Chat tab lets you ask questions in plain language and get an answer grounded in your own notes. Myne finds the passages most relevant to your question on this device, composes an answer from them, streams it as it is generated, and shows you which notes it used so you can check the source.

## Prerequisites

- AI enabled, with a search model selected and something set up to answer — a text model file, a local runtime, or a provider. See [Turning on AI](/user-guide/ai/turning-on-ai/) and [Where your AI runs](/user-guide/ai/where-your-ai-runs/).
- An unlocked vault whose notes have been indexed (the AI Chat tab header reads **Ready**, or the name of the provider you named). Naming a provider does not cover this: the search model is separate, and it runs here.

## Opening the chat

The AI Chat tab lives in the right sidebar alongside Backlinks, Unlinked mentions, and Outline. Select it from the right panel's tab strip, or run **Open AI Chat** from the command palette (in the **AI** category). If you have the right panel hidden, the palette command is the quickest way in.

The header shows a status: **No provider**, **Not answering**, **Unavailable**, **No search model**, **Preparing…**, or **Ready** — replaced by the provider's name when you have named one and asking is ready to run. Below it, when the tab is ready, Myne shows a one-line reminder that answers may be wrong and that you should check the notes it cites. Each answer additionally carries a line naming where it came from — this device, a program on this computer, or the provider by name — so the reminder about accuracy and the fact about where the request went are never the same sentence.

## Asking a question

1. Check that the composer at the bottom of the tab is set to **Ask**. It opens there. The other setting is the composer's **Edit** mode, which sends your message to the agent instead of the chat: see [Let the AI change your notes](/user-guide/ai/agent-runs/). It is not the same thing as **edit selection**, the command that rewrites text you have highlighted in a note ([Where your AI runs](/user-guide/ai/where-your-ai-runs/) lists the two as separate surfaces).
2. Type your question. Enter sends it; Shift+Enter starts a new line.
3. Your turn appears in the transcript, followed by the assistant's answer.
4. The answer streams in token by token. While it is generating, the send button becomes a **Stop** control you can use to cut a long or off-track answer short; the partial text you stopped at stays in the transcript.

The chat is conversational: earlier turns are carried as context for follow-up questions, so you can refine ("only from last week's notes", "shorter") without restating everything. Only your questions and their answers are carried this way. If you have also run the agent from this tab, the task you gave it is not replayed as context for a question, because it was scoped to a set of notes the question knows nothing about.

**New chat** in the tab header clears the conversation and starts fresh. It also stops whatever is running: an answer still generating, or an agent run still working. If a run had finished and its changes were waiting on the review screen, that proposal goes with the conversation and nothing is written — the same outcome as locking your vault mid-run. What it does not clear is the offer to undo the last agent run that *did* write, because that run already changed your notes and starting a new conversation does not change them back.

## Citations

Under a grounded answer, Myne shows citation chips for the notes it drew from, under a **Sources** heading. Each chip is labelled with the note's title where available. Click a chip to open that source note so you can read the passage in context and confirm the answer against it. Citations are how you verify a small model's output; treat them as the point, not a decoration.

If nothing in your vault could ground the question, the assistant says so rather than inventing an answer.

## Where the transcript lives

The conversation is held in memory only. It is never written to disk, and it is dropped when the vault locks — on manual lock, auto-lock, or vault delete. There is no saved chat history in this version.

## When the chat cannot answer

The tab tells you which of five things is wrong, because each has a different fix.

- **No provider** — nothing is set up to answer, so chat, summaries, rewriting and semantic search have nothing to run on. Settings → Developer → AI is where you set one up.
- **Not answering** — what you set up is not responding: a runtime that is not running, or a provider that is unreachable. Check it, then send again.
- **Unavailable** — this build of Myne was compiled without local AI, so nothing here can run. No setting changes that.
- **No search model** — something can answer, but nothing can find the notes to answer *from*. Asking searches your notes on this device, and that search needs a search model here; a provider cannot do it for you, because the index is refused one outright (see [Limits](#limits) below). Choose a search model in Settings → Developer → AI. This is the one status where the rest of the AI still works: editing your notes with the AI, summaries and rewriting all run, because none of them searches.
- **Preparing…** — a search model is chosen and your notes are still being indexed. Nothing to fix; the status clears itself. A large vault takes longer the first time, and after that only what changed is re-indexed.

When a provider refuses a single request, Myne repeats the reason it gave: a key it rejected, credit you are out of, a request it did not answer in time. A refused request is not sent again on its own.

## Limits

Where asking runs depends on what you have named. With no provider set up it runs entirely on your device and nothing — question, retrieved passages, or answer — leaves your machine. If you have named a remote provider, asking is one of the surfaces that can use it: the question and the passages it retrieves are sent there, after the consent step that says so. Retrieval itself is always on this device, because the semantic index is refused a provider outright ([Where your AI runs](/user-guide/ai/where-your-ai-runs/)). The answer is only as good as the model behind it and the passages it retrieves, so it can be wrong or incomplete — the visible citations are there so you can check it. Notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders) are never retrieved or used to ground an answer.

Because the model reads the text of your own notes, note content that came from an untrusted source (for example a note synced from another device or imported from elsewhere) can steer the wording of an answer. With no provider named this is a text-quality and jailbreak concern rather than a way to get data out of Myne: there is nowhere for the text to be sent, and the chat never writes to a note without your action. The model does have tools where you use [agent runs](/user-guide/ai/agent-runs/) (it can read notes inside a scope you approved and propose changes to them) so there the same steering can reach what it proposes, and the protection is that you approve every change before anything is written. With a remote provider named, the defence that stops a note's own text from posing as an instruction is weaker, because the far side does the tokenizing and Myne cannot control it there; what a note's text cannot change is where the request already goes. The model runs in-process and is not sandboxed from your decrypted notes; the full boundary is in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Send the question (composer in **Ask**) | Enter | Enter |
| Start a new line instead of sending | Shift+Enter | Shift+Enter |

Both keys belong to the composer itself and are not listed in **Settings → Hotkeys**, so they cannot be rebound. The composer's mode decides where Enter sends: in **Edit** the same key starts an agent run instead ([Let the AI change your notes](/user-guide/ai/agent-runs/)).
