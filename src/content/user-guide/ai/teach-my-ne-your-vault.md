---
title: "Teach Myne your vault"
category: "ai"
updated: 2026-10-22
summary: "How the one-time reviewed seed turns your vault's structure into a few memory entries: what it sends, what it never sends, how to review and edit every line, where the entries live, and how to remove them."
tags: ["ai", "memory", "privacy"]
---

Myne's assistant starts out knowing nothing about you. It learns one fact at a time, as you correct it, and a vault you have kept for a year still reaches it as a blank slate. **Teach Myne your vault** is the way to change that once: Myne reads the shape of your notes, proposes a few memory entries, and writes only the ones you accept.

You will find it in **Settings → AI → Memory**, and once as an offer in the chat panel the first time it applies to you.

## What it reads, and what it sends

The pass runs in two steps, and the first one sends no note text.

1. **The outline.** Myne sends the shape of your vault: note titles, folder paths, tag names and counts. It does not send note bodies, attachments, properties, tasks or headings, and it does not send note identifiers.
2. **Only what the model asks for.** From that outline the model may name up to ten folders it wants to read. Myne then reads those folders' notes, trims the batch to a fixed character budget, and sends that. If the model asks for nothing, no note text is sent at all.

The scope screen shows you the exact outline before anything leaves the device, behind **Show exactly what will be sent**, together with the note, folder and tag counts and an estimate of its size. It is the real payload rather than a summary of it.

**Excluded folders are removed by name as well as by content.** If you have excluded a folder from AI in the privacy settings, neither its notes nor the folder's own name appear in the outline, because a folder name can be the sensitive part. The screen says how many notes were left out for that reason.

## Local or remote

Where the model runs decides what leaves your computer, and the scope screen names it.

- **A model on this computer** (a model file Myne runs, or a runtime you already have running locally) means nothing leaves the device. The screen says so.
- **A remote provider** means the outline, and later any note text the model asks for, is sent to the provider you named. The screen names the provider and the size of the payload, and **Continue stays disabled until you tick the confirmation**. Myne's host refuses the run without it, so skipping the screen is not a way around the question.

The same rules that apply to every AI request apply here: nothing is sent until you have named a provider, and the folders you excluded from AI stay excluded.

## Review every line

The model returns between three and ten entries: things like the projects and areas you are working in, the people who recur, how you like answers written, and the way your folders are named. They appear as a list you can edit, and each one carries a checkbox and a character count against the 2,000-character limit.

- **Uncheck** anything you do not want remembered.
- **Edit** the wording until it says what you mean.
- **Save** writes only the checked entries.

Myne checks the whole batch before writing anything. An entry that is empty, over the limit, or that reads like an instruction to the assistant rather than a fact is refused, marked in the list, and the rest stay selectable. Nothing is written until the batch passes.

Entries are written as **your own** memory. The assistant cannot rewrite them later, which is what makes a correction stick.

## Where the entries live

After a pass, open **Settings → AI → Memory**. The entries appear under **From your vault**, separate from anything you or the assistant added before, with the date the seed was created and the number of entries. They are ordinary memory entries from then on: the assistant reads them at the start of every run, and you can edit or delete any one of them.

**Remove all** removes the whole group in one action and leaves everything else untouched.

## Rebuilding

If your vault has changed enough that the entries are out of date, the Memory row offers **Rebuild**. It asks first, naming the previous date and the number of entries it will replace, and it replaces only the rows the seed wrote: your own edits to those rows are replaced with the new batch, and memory you added yourself is never touched.

A rebuild never doubles your memory and never truncates the new list to fit. If there is not enough room under the 100-entry limit, Myne refuses and tells you how many slots remain, so you can remove a few entries and try again.

The row also carries a quiet **vault changed** note after a seed has aged: two weeks have passed and at least a quarter of your notes have changed since. It is information, not an action. Nothing re-runs on its own.

## On a phone

The Memory sheet shows the **From your vault** group read-only, with the date, so the memory you see on a phone is the memory the seed created. The pass itself, and rebuilding, are desktop-only: there is no trigger and no disabled button on a phone.

## What this is not

The seed does not read attachments or their extracted text. It does not write your personality or voice preferences. It does not run in the background, on a schedule, or when you create a vault, and it does not touch a vault you have not unlocked.

The entries it writes are distilled prose, which means they can be wrong or out of date. That is why every line is reviewed before it is saved, and why the assistant is told they are notes about you rather than instructions from you.
