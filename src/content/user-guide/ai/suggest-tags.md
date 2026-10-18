---
title: "Suggest tags"
category: "ai"
updated: 2026-10-18
summary: "Myne can suggest topical tags for the note you are writing. Suggestions appear as chips at the top of the note after you pause typing, prefer tags you already use, and are added to the note's frontmatter only when you click one."
tags: ["ai", "tags"]
---

With AI on and the tag switch turned on, Myne can suggest topical [tags](/user-guide/find-and-connect/tags/) for the note you are working on. Suggestions appear on their own as chips at the top of the note; nothing is applied until you click one.

## Prerequisites

- An unlocked vault, and a note open in the editor.
- AI enabled — see [Turning on AI](/user-guide/ai/turning-on-ai/).
- **Suggest tags automatically** turned on in Settings → Developer → AI.

Tag suggestion uses its own small model, separate from the text model you use for chat and writing. By default Myne fetches it once from its own origin; under **Models** you can also point the tag row at a file you already have, with Developer mode on.

## Turning it on

Open Settings → Developer → AI and turn on **Suggest tags automatically**. It is off by default, and it sits under **Enable AI features**, so it does nothing while AI is off.

If the tag model is not installed yet, the switch is off and the panel says so: no tag model is installed yet, download it once from Settings → Developer → AI, and the switch turns on by itself once it is installed.

## Getting suggestions

There is nothing to run. About a second and a half after you stop typing, Myne reads the note and shows ranked chips in a band between the note's frontmatter and its body. A note with no frontmatter shows the band above its first line.

Where you already have tags in your vault, the model is asked to prefer reusing them where they fit, so suggestions lean toward your existing vocabulary rather than inventing near-duplicates. The number of suggestions is capped and unusually long candidates are dropped, so one pass cannot flood a note with tags. Reading view shows no band: it is an editing affordance, and a chip there would offer a write the view cannot perform.

## Accepting a suggestion

Each chip is an explicit accept. Click a chip to add that tag to the note's `tags:` list in its frontmatter — the same bytes you would have typed by hand. A tag the note already carries, in frontmatter or as an inline `#tag`, is never offered again.

Dismiss the chips you do not want. A dismissal lasts for this note until you switch away, and is never written to disk. Suggestions are never applied on their own: a pass you do not act on changes nothing.

## Limits

Tag suggestion runs on your device: the note text and the suggested tags never leave your machine. That holds even when you have named a remote provider — tag suggestion fires on its own as you write, and a surface you did not ask for is refused a remote provider in the code rather than by a setting, for cost as much as for privacy ([Where your AI runs](/user-guide/ai/where-your-ai-runs/)). Suggestions come from a small model and can be off-topic or miss the obvious; they are a starting point, not a verdict. A note in an [excluded folder](/user-guide/ai/turning-on-ai/#excluding-folders) is never read for tag suggestions. No tag is added without your click. The suggestions and the cache behind them live in memory only and are never written to disk — only the tags you accept become part of the note. The model runs in-process and is not isolated from your decrypted notes; see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for the full boundary.
