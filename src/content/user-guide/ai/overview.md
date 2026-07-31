---
title: "On-device AI (Beta)"
category: "ai"
updated: 2026-07-31
summary: "An overview of Myne's experimental on-device AI: what it is, the runtime beta opt-in that keeps it off until you turn it on, the honest privacy posture (local, no network, in-process not sandboxed), and a map of the rest of this section."
tags: ["ai", "privacy"]
---

Myne includes an experimental set of AI features that run on your own device: asking questions across your notes, summarizing a note, suggesting tags, transcribing a voice note (speech-to-text), and inline writing help. They are off until you turn them on, and they are labelled Beta because they are new and the models are small. This page explains what the feature is and points you at the rest of the section.

## What on-device AI means here

The AI features run a model that lives on your computer. You supply the model file yourself, and inference happens locally. Myne has no network path for this: it does not download models and it does not send your notes, questions, or generated text to any server. The trade-off is capability. A model small enough to run on a laptop is far less capable than a large cloud model, so answers can be wrong. The features are built to make that easy to check rather than to hide it.

## The beta opt-in

AI ships in the standard build but stays off until you enable it. The **AI (Beta)** panel sits in a **Developer** group in Settings, and that group appears only once you turn on **Developer mode** in the **About** panel — so you enable Developer mode first, then open the panel. Nothing about AI runs, indexes, or reads your notes until you turn on **Enable local AI** and choose a model file. See [Turning on AI](/user-guide/ai/turning-on-ai/) for the walkthrough.

## The honest privacy posture

Two things are true at the same time, and both matter:

- Inference is local and sends nothing. There is no network egress path, so your notes are never transmitted.
- The model runs inside the Myne app process, which holds your decrypted notes and keys. It is not sandboxed from them. A model file you download is untrusted input, and Myne does not vouch for it.

That second point is the boundary of the guarantee. It is covered plainly in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/), and it does not exceed what the rest of Myne already tells you in the [privacy model](/user-guide/settings-and-privacy/privacy-model/).

## What's in this section

- **[Turning on AI](/user-guide/ai/turning-on-ai/)** covers the beta opt-in, choosing model files, what "ready" means, and excluding folders.
- **[Ask your notes](/user-guide/ai/ask-your-notes/)** covers the AI Chat tab, grounded answers, and citations back to your notes.
- **[Summarize a note](/user-guide/ai/summarize-a-note/)** covers summarizing the current note or a selection.
- **[Suggest tags](/user-guide/ai/suggest-tags/)** covers AI tag suggestions.
- **[Writing assistant](/user-guide/ai/writing-assistant/)** covers inline completions and the AI slash commands.
- **[Transcribing a voice note](/user-guide/attachments-and-import/voice-notes/#transcribing-a-voice-note)** covers turning a recorded or imported audio clip into searchable, insertable text on your device.
- **[AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/)** is the honesty deep-dive: on-device, no egress, in-process not sandboxed, the encrypted embedding index, and what AI does not do.

## Limits

On-device AI does not add a network feature to Myne, and it does not change where your notes are stored or how they are encrypted. It does add a model runtime that runs in the same process as your decrypted notes and is not isolated from them; a malicious or buggy model file is a local supply-chain risk you accept by choosing one. Like the rest of Myne, none of this protects against malware already running on your device, which can read app memory regardless. The full mapping is in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).
