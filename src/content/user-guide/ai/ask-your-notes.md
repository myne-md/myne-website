---
title: "Ask your notes"
category: "ai"
updated: 2026-08-24
summary: "The AI Chat tab has one composer, and every message you send starts an agent run. The run works on the notes in the scope you set, can search the rest of your vault from this device, and writes its answer into the transcript."
tags: ["ai", "search"]
---

With AI on, the AI Chat tab lets you ask questions in plain language. There is one composer and one thing it does: every message starts an agent run, whether you asked a question or asked for a change. The run searches your notes on this device, reads what it is allowed to read, and writes its answer into the transcript.

## Prerequisites

- AI enabled, with something set up to answer: a text model file, a local model runtime, or a provider. See [Turning on AI](/user-guide/ai/turning-on-ai/) and [Where your AI runs](/user-guide/ai/where-your-ai-runs/).
- Something for the run to work on: a note open, or a folder attached under **Working on**.
- A search model on this device, if you want the run to look beyond the notes you gave it. Naming a provider does not cover this: the search model is separate, and it runs here.

## Opening the chat

The AI Chat tab lives in the right sidebar alongside Backlinks, Unlinked mentions, and Outline. Select it from the right panel's tab strip, or run **Open AI Chat** from the command palette (in the **AI** category). If you have the right panel hidden, the palette command is the quickest way in.

The header shows a status: **No provider**, **Not answering**, **Unavailable**, **No search model**, **Preparing…**, or **Ready**, replaced by the provider's name when a provider is the thing answering. Below it, when the tab is ready, Myne shows a one-line reminder that answers may be wrong and that you should check the notes it cites. That chip is the only place the tab names where a request goes. Individual answers in the transcript carry no such label, so read the chip before you send rather than the turn afterwards.

## Asking a question

1. Check what the run may touch. The line above the box reads **Working on** followed by **This note**, or the name of a folder. Press **Change** to pick a different one.
2. Type your question in the box marked **Ask the AI to change these notes**. The same box takes questions and change requests; there is no mode to choose.
3. Press Enter to send, or Shift+Enter to start a new line.
4. Your turn appears in the transcript with the scope it was sent under, followed by the assistant's turn.
5. The answer arrives whole rather than a word at a time, so a long question is a wait with nothing on screen changing. While the run works, its status, the number of notes it can currently change and a **Stop** button sit just above the composer. Stopping ends the run; there is no partial answer to keep.
6. Underneath the answer the run reports three figures: how many requests it made, how many notes it read, and roughly how many characters of your notes were sent to the provider, or **nothing left this device** when the run stayed here.

With no note open and no folder attached, there is nothing for a run to work on, so **Send** stays greyed out and nothing on screen says why. Open a note, or press **Change** and pick a folder. Notes at the top level of your vault are not offered as a folder: the list holds the folders your notes are actually in.

A run that proposes changes opens a review screen when it stops. A run that only answered you does not: the answer stays in the transcript. See [Let the AI change your notes](/user-guide/ai/agent-runs/).

Each message is its own run. Earlier turns stay on screen so you can read back what you asked, but they are not sent to the model, so a follow-up like "shorter" has nothing to shorten. Say the whole thing again in each message.

**New chat** in the tab header clears the transcript and stops a run that is still working. If a run had finished and its changes were waiting on the review screen, that proposal goes with the conversation and nothing is written, the same outcome as locking your vault mid-run. What it does not clear is the offer to undo the last run that *did* write, because that run already changed your notes.

## Checking an answer

Myne shows no citation chips. Nothing in the transcript names the notes an answer was drawn from, and there is nothing to click through to. The reminder under the tab header asks you to check the notes it cites; the checking is yours to do by hand.

What you have to work with is the scope you set, which is the whole of what the run was allowed to read, and the run's own count of how many notes it read. Read an answer as a claim about your notes rather than as a report from them, and open the notes yourself before you act on it. The models are small, and a wrong answer looks exactly like a right one.

## Where the transcript lives

Conversations persist as vault content: the full turn list is sealed into the vault when a turn settles, listed in Chat history, synced to your other devices, and included in backups. Locking the vault still locks everything; history adds no second way in and no second copy outside the vault. See [Chat history](/user-guide/ai/ai-chat-history/) for continuing, renaming, and deleting conversations.

## When the chat cannot answer

The tab tells you which of five things is wrong, because each has a different fix.

- **No provider**: nothing is set up to answer, so chat, summaries, rewriting and semantic search have nothing to run on. Settings → Developer → AI is where you set one up.
- **Not answering**: what you set up is not responding, either a runtime that is not running or a provider that is unreachable. Check it, then send again.
- **Unavailable**: this build of Myne was compiled without local AI, so nothing here can run. No setting changes that.
- **No search model**: something can answer, but nothing on this device can search your notes. You can still send: the composer works and a run still starts against the notes you gave it. What stops working is the run's ability to look beyond that scope, because searching your vault needs a search model here and a provider is refused it outright (see [Limits](#limits) below). Summaries and rewriting are unaffected. The empty tab explains this in the app's own words, which still speak of asking and editing as separate things; they are one composer now. Choose a search model in Settings → Developer → AI.
- **Preparing…**: a search model is chosen and your notes are still being indexed. Nothing to fix; the status clears itself. A large vault takes longer the first time, and after that only what changed is re-indexed.

When a provider refuses a single request, Myne repeats the reason it gave: a key it rejected, credit you are out of, a request it did not answer in time. A refused request is not sent again on its own.

## Limits

Where a run works depends on what you have named. With no provider set up it runs entirely on your device and nothing, neither your question nor the notes it reads nor the answer, leaves your machine. If you have named a remote provider, a run is one of the surfaces that can use it: the notes it reads are sent there, after the consent step that says so, and a run opens by sending the title and identifier of every note in its scope before it has read any of them. Searching your vault is always on this device, because the semantic index is refused a provider outright ([Where your AI runs](/user-guide/ai/where-your-ai-runs/)). The answer is only as good as the model behind it and the notes it read, so it can be wrong or incomplete, and nothing in the transcript names those notes for you. Notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders) are never read, searched or used to ground an answer.

Because the model reads the text of your own notes, note content that came from an untrusted source (for example a note synced from another device or imported from elsewhere) can steer the wording of an answer. With no provider named this is a text-quality and jailbreak concern rather than a way to get data out of Myne: there is nowhere for the text to be sent, and a run never writes to a note without your action. Because every message is a run, the model has tools here: it can read notes inside the scope you approved and propose changes to them, so the same steering can reach what it proposes, and the protection is that you approve every change before anything is written (see [Let the AI change your notes](/user-guide/ai/agent-runs/)). With a remote provider named, the defence that stops a note's own text from posing as an instruction is weaker, because the far side does the tokenizing and Myne cannot control it there; what a note's text cannot change is where the request already goes. The model runs in-process and is not sandboxed from your decrypted notes; the full boundary is in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Send the message and start a run | Enter | Enter |
| Start a new line instead of sending | Shift+Enter | Shift+Enter |

Both keys belong to the composer itself and are not listed in **Settings → Hotkeys**, so they cannot be rebound. There is no second mode: the same key sends a question and a change request alike.
