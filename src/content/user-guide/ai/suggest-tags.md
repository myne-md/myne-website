---
title: "Suggest tags"
category: "ai"
updated: 2026-10-22
summary: "Myne can suggest topical tags for the note you are writing. Suggestions appear as chips at the top of the note after you pause typing, prefer tags from the note's own folder, and are added to the note's frontmatter when you click one, or on their own if you turn on automatic applying."
tags: ["ai", "tags"]
---

With AI on and the tag switch turned on, Myne can suggest topical [tags](/user-guide/find-and-connect/tags/) for the note you are working on. Suggestions appear on their own as chips at the top of the note. Nothing is applied until you click one, unless you turn on automatic applying below, which writes them for you once per note.

## Prerequisites

- An unlocked vault, and a note open in the editor.
- AI enabled — see [Turning on AI](/user-guide/ai/turning-on-ai/).
- **Suggest tags automatically** turned on in Settings → Developer → AI → Models.

Tag suggestion uses its own small model, separate from the text model you use for chat and writing. By default Myne fetches it once from its own origin; under **Models** you can also point the tag row at a file you already have, with Developer mode on.

## Turning it on

Open Settings → Developer → AI → Models and turn on **Suggest tags automatically**. It is off by default, and it sits under **Enable AI features**, so it does nothing while AI is off.

Directly under it sits **Apply suggested tags automatically**, also off by default. It is disabled until suggestions are on, because there is nothing to apply otherwise. What it does, and what it does not do, is in [Applying tags automatically](#applying-tags-automatically).

If the tag model is not installed yet, the switch is off and Myne tells you so in the panel. The model has a row of its own under **Outsourced models** on the **Models** tab, and Myne's copy is fetched from **Verified downloadable models** on the same tab; either way the switch turns on by itself once a model is there, without a restart.

## Getting suggestions

There is nothing to run. About a second and a half after you stop typing, Myne reads the note and shows ranked chips in a band between the note's frontmatter and its body. A note with no frontmatter shows the band above its first line.

The vocabulary the model is offered comes from the note's own folder, not from the whole vault, so a note in one project is suggested that project's tags rather than another project's. Where the folder has no tagged notes yet, no vocabulary is offered at all and the suggestions come from the note's text alone; a new folder starts its own vocabulary instead of inheriting the vault's. Existing tags still rank ahead of new ones, and a candidate that matches a tag you already use collapses onto its casing rather than appearing as a near-duplicate.

The band separates the two kinds. When a pass offers both, the chips are grouped under **In your vault** and **New**, so you can see which acceptance reuses a tag and which grows your vocabulary. When a pass offers only one kind, the band stays a single row with no heading. The number of suggestions is capped and unusually long candidates are dropped, so one pass cannot flood a note with tags. Reading view shows no band: it is an editing affordance, and a chip there would offer a write the view cannot perform.

## Accepting a suggestion

Each chip is an explicit accept. Click a chip to add that tag to the note's `tags:` list in its frontmatter — the same bytes you would have typed by hand. A tag the note already carries, in frontmatter or as an inline `#tag`, is never offered again.

Dismiss the chips you do not want. A dismissal lasts for this note until you switch away, and is never written to disk. With automatic applying off, a pass you do not act on changes nothing.

## Applying tags automatically

With **Apply suggested tags automatically** on, a pass writes its tags into the note's `tags:` list for you. Three limits keep it from being a note that rewrites itself:

- **Once per note per session.** A note gets one automatic write, then falls back to chips for the rest of the session. Without that rule a model that offers a slightly different tag each pass would keep adding them, and nothing would tell you.
- **Only notes you edited.** Opening a note to read it never rewrites it. The first pass after you actually type something is what can write.
- **Only when the write can land.** If the note's frontmatter is a shape Myne will not touch, nothing is written and the chips stay up, so you can see why.

After a write, a row appears above the note naming the tags that were added, with **Undo**. Undo removes exactly those tags from the frontmatter. It is recalculated against the note as it is now, so it still works if you keep typing afterwards; if you already removed one of the tags by hand, undo leaves the rest alone. A `#tag` written in the body of the note is never removed, because automatic applying only writes frontmatter and the prose is yours.

The switch is **per device**. Whether a vault wants suggestions is a property of the vault and follows you through sync; whether a particular device may edit notes without a click does not. Turning it on here does not turn it on for your phone or for another machine signed into the same vault.

## Limits

Tag suggestion runs on your device: the note text and the suggested tags never leave your machine. That holds even when you have named a remote provider — tag suggestion fires on its own as you write, and a surface you did not ask for is refused a remote provider in the code rather than by a setting, for cost as much as for privacy ([Where your AI runs](/user-guide/ai/where-your-ai-runs/)). Suggestions come from a small model and can be off-topic or miss the obvious; they are a starting point, not a verdict. A note in an [excluded folder](/user-guide/ai/turning-on-ai/#excluding-folders) is never read for tag suggestions. No tag is added without your click unless you turn on automatic applying, which writes at most once per note per session and always leaves the row that undoes it. The suggestions and the cache behind them live in memory only and are never written to disk — only the tags you accept, or the one automatic write you allow, become part of the note. The model runs in-process and is not isolated from your decrypted notes; see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for the full boundary.
