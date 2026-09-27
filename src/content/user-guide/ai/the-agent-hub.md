---
title: "The agent hub"
category: "ai"
updated: 2026-09-27
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

Conversations are listed newest first. Each row shows its title, when it was last used, and — for a conversation that was about a particular note — a small **note** chip.

- **Open** a row to read it and continue it. The conversation appears beside the list, not instead of it, so you can keep scanning while you read.
- **Search** narrows the list by title as you type.

Renaming and deleting work here exactly as they do everywhere else, including what a delete does on your other devices — see [Chat history](/user-guide/ai/ai-chat-history/).

## Working on a note

Opening a row, or using **Agent: open on note**, switches the tab to a single conversation with a link back to the note it is anchored to. The tab sits in your workspace like any other, so you can split it beside that note and keep writing while a run works.


## Limits

- **The anchor is a label, not a permission.** A conversation being about a note does not give the AI access to it. What the AI may read and change is the scope you approve for each run, described in [Let the AI change your notes](/user-guide/ai/agent-runs/).
- **The hub is behind Developer mode on purpose.** The agent is the only part of Myne that writes to your notes without you typing the change, and the controls that bound it are new. See [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).
- **Conversations are vault content.** They are encrypted on your device, they sync to your other devices if sync is on, and they are included in backups — the same as your notes. Their titles are not visible to the sync server.
- **Deleting a conversation deletes only the conversation.** Any change a run already applied to a note stays applied. To undo a run's changes, use the revert offer on the run itself or a note's version history.
