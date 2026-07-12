---
title: "Suggest tags"
category: "ai"
updated: 2026-07-11
summary: "Ask the on-device model for topical tag suggestions for the current note. Suggestions appear as chips in the AI Chat tab, prefer tags you already use, and are only added when you click one."
tags: ["ai", "tags"]
---

With AI on, Myne can suggest topical [tags](/user-guide/find-and-connect/tags/) for the note you are working on, using the on-device text model. Suggestions are shown as chips you can accept one at a time; nothing is applied until you click.

## Prerequisites

- AI enabled with a text model selected — see [Turning on AI](/user-guide/ai/turning-on-ai/).
- A note open in the editor.

## Getting suggestions

1. Open the note you want tags for.
2. Run **Suggest tags** from the command palette (in the **AI** category).

Myne reads the note body, asks the model for a short list of topical tags, and shows the ranked results as chips in the AI Chat tab. When you already have tags in your vault, the model is asked to prefer reusing them where they fit, so suggestions lean toward your existing vocabulary rather than inventing near-duplicates. The number of suggestions is capped, and unusually long candidates are dropped, so a single pass cannot flood the note with tags.

## Accepting a suggestion

Each chip is an explicit accept. Click a chip to add that tag to the note; leave the others alone. Suggestions are never applied on their own — a pass that you do not act on changes nothing.

## Limits

Tag suggestion runs on your device: the note text and the suggested tags never leave your machine, because Myne has no network path for AI. Suggestions come from a small local model and can be off-topic or miss the obvious; they are a starting point, not a verdict. A note in an [excluded folder](/user-guide/ai/turning-on-ai/#excluding-folders) is never read for tag suggestions. No tag is added without your click. The model runs in-process and is not isolated from your decrypted notes; see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for the full boundary.
