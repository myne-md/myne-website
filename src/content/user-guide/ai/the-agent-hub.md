---
title: "The agent hub"
category: "ai"
updated: 2026-10-11
summary: "Every conversation you have had with the AI, in one place you can open as a tab. Search it, open one beside the note it was about, and watch a run without losing the note you were writing."
tags: ["ai", "notes"]
---

The AI panel in the right sidebar holds one conversation at a time. The agent hub is the other end of that: a tab listing every conversation in your vault, which you can search and open beside the note it was about — and beside the list itself, so reading one does not cost you the others.

## Prerequisites

- Developer mode on: see [Developer mode](/user-guide/settings-and-privacy/developer-mode/).
- AI enabled, with a text model selected or a provider named: see [Turning on AI](/user-guide/ai/turning-on-ai/).

## Opening it

There are three ways in, and they all open the same tab. Opening it a second time brings you back to the one that is already open rather than making another.

1. From the command palette, **Agent: open on vault** lands on the list.
2. From the command palette, **Agent: open on note** lands on the conversation for the note you have open, creating one if there is none.
3. From the AI panel's header, the expand control does the same as **open on note**.

You can also put it on the left ribbon. It is not there by default — add it from **Settings → Appearance → Left ribbon**, and it reopens the tab on whichever conversation it was last showing.

## The list

Conversations are listed newest first. Each row is one card, and the whole card is the button: pressing anywhere on it opens that conversation.

- **An icon on each card says what it is about**: a note, a folder, or nothing in particular, which means the whole vault. The same fact is on the card's chip when it is anchored to a note.
- **Point at a card** and it shows the first words you typed in that conversation, on one line. Two conversations with similar titles are otherwise hard to tell apart.
- **The controls for a card are behind a menu** on the card's right, which appears when you point at it or reach it with the keyboard. That keeps the list reading as titles rather than as buttons.
- **The card for the conversation you have open is shaded**, so the list and the reading pane cannot disagree about which one you are in.
- **A conversation with a run in flight carries a small spinner** beside its title. The run belongs to the conversation rather than to the pane you started it from, so it keeps working while you read something else, and the spinner is how the list says where.
- **Search** narrows the list by title as you type.

Renaming and deleting work here exactly as they do everywhere else, including what a delete does on your other devices — see [Chat history](/user-guide/ai/ai-chat-history/).

## Working on a note

Opening a row, or using **Agent: open on note**, switches the tab to a single conversation with a link back to the note it is anchored to. The tab sits in your workspace like any other, so you can split it beside that note and keep writing while a run works.

## The run's footprint

Each run leaves one line in the conversation at the point where it happened: what it did, how long it took, and a control to open the numbers behind it. Nothing is pinned to the bottom of the panel, so the line scrolls away with the messages around it and scrolling back through a conversation finds every run's own record.

Open the line and it shows three figures: how many requests the run made, how many notes it read, and roughly how many characters of your notes were sent to the provider, or **nothing left this device** when it stayed here. Those are the same figures the review screen reports, and they are the disclosure for a run that used a remote provider. If the run wrote something to your AI memory, that appears there too, as one chip per entry written.

A run that stopped, failed or was cancelled says so on its own line, with the reason.

## Moving a note

A run can propose that a note move to another folder. It is a request like any other: it appears on the review screen, one row per move, showing the note and the folder it is in now beside the folder it would land in. Nothing moves until you approve that row.

Two things are refused rather than proposed away. A note in a folder you excluded from AI cannot be moved out of it, and no note can be moved into one: a folder you excluded is a boundary a run does not cross, and the refusal appears above the run's own summary so you read what did not happen before you read what did.


## Limits

- **The anchor is a label, not a permission.** A conversation being about a note does not give the AI access to it. What the AI may read and change is the scope you approve for each run, described in [Let the AI change your notes](/user-guide/ai/agent-runs/).
- **The hub is behind Developer mode on purpose.** The agent is the only part of Myne that writes to your notes without you typing the change, and the controls that bound it are new. See [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).
- **Conversations are vault content.** They are encrypted on your device, they sync to your other devices if sync is on, and they are included in backups — the same as your notes. Their titles are not visible to the sync server.
- **Deleting a conversation deletes only the conversation.** Any change a run already applied to a note stays applied. To undo a run's changes, use the revert offer on the run itself or a note's version history.
