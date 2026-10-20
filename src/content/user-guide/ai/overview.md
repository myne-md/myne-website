---
title: "AI (Beta)"
category: "ai"
updated: 2026-10-18
summary: "An overview of Myne's experimental AI: what it is, the runtime beta opt-in that keeps it off until you turn it on, the honest privacy posture (nothing is sent until you name a provider; the model Myne runs is in-process and not sandboxed), that it can propose changes for you to approve, and a map of the rest of this section."
tags: ["ai", "privacy"]
---

Myne includes an experimental set of AI features: asking questions across your notes, in the same composer that proposes changes to them, summarizing a note, suggesting tags, transcribing a voice note (speech-to-text), inline writing help, and proposing changes to your notes for you to review. They are off until you turn them on, and they are labelled experimental because they are new and the models are small. This page explains what the feature is and points you at the rest of the section.

## What Myne's AI is

Myne never sends your notes anywhere you have not named, and it downloads a model only when you ask, from Myne's own origin, which keeps no IP logs and no analytics. Out of the box you have named nothing, so the model that answers is a file already on your computer, either one you downloaded yourself for chat, summaries and writing, or one Myne fetched on your click for tag suggestion; the speech-to-text and image-text models ship inside Myne. You can instead name a model runtime you already run on the same machine, or a remote provider, and then the text of each request goes there. [Where your AI runs](/user-guide/ai/where-your-ai-runs/) covers all three.

The trade-off with a model small enough to run on a laptop is capability: answers can be wrong, and the features are built to make that easy to check rather than to hide it.

## The beta opt-in

AI ships in the standard build but stays off until you enable it. The **AI** panel sits in a **Developer** group in Settings, and that group appears only once you turn on **Developer mode** in the **About** panel, so you enable Developer mode first, then open the panel. Nothing about AI runs or reads your notes until you turn on **Enable AI features**. After that, each surface still needs its own footing: chat, summaries and writing help need a model file or a provider you have named, and tag suggestion needs its own switch, **Suggest tags automatically**, which is off by default and uses a model Myne downloads on demand from its own origin. See [Turning on AI](/user-guide/ai/turning-on-ai/) for the walkthrough.

**On a phone the arrangement above is different in two ways worth knowing before you look for it.** There is no Developer group and no Developer mode to turn on: **AI** is a top-level entry in Settings, where you would expect any other panel. And there is no on-device option for the AI panel, because no model on a phone answers questions, summarizes or suggests tags, so turning AI on there is a decision to send your notes to a service you name rather than a decision to spend the device's own processor. (Two models do run on the phone and are not part of that switch: the one that transcribes a voice note and the one that reads text out of an image. Both ship with Myne and both run inside the app, which is what [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) means when it says a model is not isolated from your notes.) The switch says so where you flip it.

## The honest privacy posture

Three things are true at the same time, and each one matters:

- Nothing is sent anywhere until you name a provider, and the default is none. Myne fetches a model only when you ask it to, from its own origin, and the fetch carries no note content.
- Where a request runs is the choice you made: a model file on this computer, a runtime program on this computer, or a remote provider. Myne states which one is in effect in the AI settings panel, and the AI Chat tab's header carries the provider's name whenever a provider is answering. Each answer in the transcript also carries its own line naming the backend that produced it, written when that answer was produced. The surfaces that fire without you asking never reach a remote provider at all.
- The model Myne runs itself runs inside the Myne app process, which holds your decrypted notes and keys. It is not sandboxed from them. A model file you download is untrusted input, and Myne does not vouch for it.

That third point is the boundary of the guarantee. It is covered plainly in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/), and it does not exceed what the rest of Myne already tells you in the [privacy model](/user-guide/settings-and-privacy/privacy-model/).

## What's in this section

- **[Turning on AI](/user-guide/ai/turning-on-ai/)** covers the beta opt-in, choosing model files, what "ready" means, and excluding folders.
- **[Where your AI runs](/user-guide/ai/where-your-ai-runs/)** covers the three things you can name (a model file here, a runtime here, or a remote provider) and what leaves your device in each case.
- **[Ask your notes](/user-guide/ai/ask-your-notes/)** covers the AI Chat tab: one composer, what a question costs now that every message starts an agent run, and how to check an answer when nothing names its sources.
- **[Summarize a note](/user-guide/ai/summarize-a-note/)** covers summarizing the current note or a selection.
- **[Suggest tags](/user-guide/ai/suggest-tags/)** covers the tag suggestions that appear at the top of a note as you write.
- **[Writing assistant](/user-guide/ai/writing-assistant/)** covers inline completions and the AI slash commands.
- **[Agent runs](/user-guide/ai/agent-runs/)** covers asking the AI to change notes: how you set what it may touch, the review card, under the reply, where you approve or reject each change, and what the undo does and does not cover.
- **[Transcribing a voice note](/user-guide/attachments-and-import/voice-notes/#transcribing-a-voice-note)** covers turning a recorded or imported audio clip into searchable, insertable text on your device.
- **[The agent hub](/user-guide/ai/the-agent-hub/)** covers the list of every conversation, what a run's own line in the transcript reports, and moving a note between folders.
- **[Chat history](/user-guide/ai/ai-chat-history/)** covers finding an older conversation and what deleting one does on your other devices.
- **[AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/)** is the honesty deep-dive: what is sent and to whom, the built-in model being in-process and not sandboxed, and what AI does not do.

## Limits

Myne's AI does not change where your notes are stored or how they are encrypted, and nothing is sent anywhere until you name a provider yourself: the default is none, and naming one is what opens that path. It does add a model runtime that runs in the same process as your decrypted notes and is not isolated from them; a malicious or buggy model file is a local supply-chain risk you accept by choosing one. Like the rest of Myne, none of this protects against malware already running on your device, which can read app memory regardless. The full mapping is in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/), and what each provider choice means is in [Where your AI runs](/user-guide/ai/where-your-ai-runs/).
