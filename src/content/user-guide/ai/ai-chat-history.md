---
title: "Chat history"
category: "ai"
updated: 2026-09-05
summary: "Conversations with the AI persist across lock and sync to your other devices. Continue the last one, browse them all, rename them, or delete one everywhere."
tags: ["ai", "notes", "sync"]
---

With AI on, your conversations persist. Locking the vault no longer wipes the tab: unlocking brings back the conversation you left, on every client, and a conversation started on one device arrives on the others through sync.

## Prerequisites

- AI enabled. See [Turning on AI](/user-guide/ai/turning-on-ai/).
- An unlocked vault.

## Continuing a conversation

Open the AI Chat tab and you land where you left off: the tab continues your most recently updated conversation. Type and send to carry on in it. To start over instead, start a new chat (the **New chat** action in the history); your next message then opens a fresh conversation and the old one stays in the list untouched.

Each message is one assistant turn beside your own. On the phone the settled turns stay visible above the composer, so a conversation interrupted by a locked screen or a backgrounded app is still there when you come back.

## Browsing, opening, and renaming

Open **Chat history** (desktop and web) or the history sheet (phone) to see every conversation, newest first, each under the title taken from its first message. Opening one loads its turns; renaming one changes only its title. Renaming never touches the turns inside.

## Deleting a conversation everywhere

Deleting a conversation removes it from every device. The history marks it deleted and sync carries that deletion along, so a conversation deleted before a new device enrolls does not reappear there. This cannot be undone: there is no trash and no restore for a deleted conversation, so the delete step asks you to confirm before anything is removed.

## Excluded folders

The AI never reads notes in excluded folders, and that same list withholds whole conversations from starting: sending on a note inside one is refused before anything leaves the device, with a message naming the list and where to change it. An empty list means the AI can see everything, and it is the same list the command-line client honors. Change it under Settings, AI, Excluded folders. Text already saved in a conversation stays as it is and keeps seeding new runs; Myne does not rewrite history to match the current list.

## How history syncs

Conversations are ordinary vault content: encrypted on your devices, synced like notes, readable only with the vault open. A new device receives the conversation list and each conversation's turns on enrollment. Past proposals stay attached to their turns as read-only records of what was proposed; applying them again is not offered, because the notes they quote may have changed since.

## Limits

History is vault content, so anyone who can open the vault can read every conversation in it, including the model answers and any note text they quote. Locking the vault still locks everything; history adds no second way in and no second copy outside the vault. Delete-everywhere depends on sync reaching your devices: a device that never comes online keeps its copy until it does. A failed or refused send still leaves its turn (the question and the refusal) so the record shows what was asked. What the model itself may send, and where, is unchanged by any of this: see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).
