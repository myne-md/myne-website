---
title: "Let the AI change your notes"
category: "ai"
updated: 2026-08-16
summary: "Ask the AI to make changes across a set of notes you choose. It proposes every change as a diff and nothing is written until you approve it, one note at a time or all at once."
tags: ["ai", "notes"]
---

The AI can do more than answer questions about your notes: it can propose changes to them. You pick which notes it may touch, it works through them, and then it shows you every change it wants to make as a diff. Nothing is written to your vault until you approve it.

## Prerequisites

- AI enabled, with a text model selected or a provider named: see [Turning on AI](/user-guide/ai/turning-on-ai/).
- A model that can hold the edit format. Not every model can; if yours cannot, Myne says so instead of offering a feature that would fail. See [When the model cannot do it](#when-the-model-cannot-do-it).

## Starting a run

1. Open the **AI Chat** tab.
2. Decide what the AI may touch. By default that is the note you have open. If the work spans a folder, choose it from the **Working on** list before you send: you will see how many notes that is.
3. Type what you want changed and send it.
4. The AI reads the notes it needs and works. You can stop it at any time.

## Approving changes

When it finishes, a review screen opens with everything it proposes, grouped by note.

1. Read each diff. Removed text is struck through; added text is highlighted.
2. **Reject** any change you do not want. Rejecting one leaves the rest alone.
3. **Approve** the rest in one action, or approve a single change on its own.

Nothing reaches your notes before this step. If you close the review without approving, nothing was written.

## Widening what it can touch

If the AI needs a note outside what you gave it, it asks. That request is a separate approval, and it tells you four things: that it would be able to **read and change** those notes, how many notes that is, what your run would cover in total afterwards, and (if you have named a remote provider) that those notes leave your device.

Two things are worth knowing about that screen.

The set is fixed when you approve it. If you allow a folder and a note is added to that folder a minute later, that new note is not included; you approved the notes that were there.

There is no limit on how many times it can ask, or on how large the scope can become. The running total is shown while the run works and on the review screen, and that number is the thing to watch. If it is climbing past what you expected, stop the run.

## New notes

The AI can also propose new notes. Those appear on the review screen as their own group, with the title, the folder and the whole body, and you can reject any of them the same way you reject a change. Only the ones you keep are created.

Read the body rather than skimming the title. A new note is the one thing a run does that the undo cannot reverse for you.

## Deleting a note

The AI has no delete. When it wants a note gone it proposes moving it to Trash, which is reversible, and that change is never included in "approve all": it always needs its own click. That is deliberate: at the diff level moving a note to Trash looks like any other edit, and it should not be possible to approve one without noticing.

## Undoing a run

Approving takes a restore point covering every note the run **changed**, so those changes can be undone as one action. If that restore point cannot be taken, Myne refuses to write at all rather than making a change you could not reverse.

The Undo button is on the review screen, and it stays available after you close that screen: it moves to the top of the AI panel, so closing the review is not the same as accepting what happened. The offer lasts until you run the agent again or lock your vault, whichever comes first. After that, each note's own history is still there under **Snapshots**, one note at a time.

Notes the run **created** are not part of that undo, and Myne says so when you use it. A new note has no earlier version to go back to, so removing one means moving it to Trash yourself.

## When the model cannot do it

To change a note, the model has to copy the existing text exactly and say what replaces it. Small models often get that slightly wrong, and a change that does not match exactly is discarded rather than guessed at.

Myne checks this once, when you pick a model, and shows the feature as unavailable if the model cannot manage it. That is a limit of the model, not a fault in your vault. A larger model, or a provider, will do it.

## Limits

- **The AI is not always right.** It suggests; you decide. Read the diffs.
- **A note's own text can steer it.** The AI reads your notes, and a note that came from somewhere you do not control (synced from another device, or imported) can contain text that reads like an instruction. That is why the scope is yours to set, why widening it needs your approval, and why nothing is written without your say-so. Those approvals are the protection; they only work if you read them.
- **Approving is the protection, and it is a human one.** Myne does not limit how large a run can get. It shows you the number and asks you each time.
- **Nothing survives locking your vault.** If the vault locks while a run is working, or while its changes are waiting for you, the run is cancelled and the proposal is gone. Nothing was written. If your auto-lock time is short, Myne warns you before starting a long run.
- **On a remote provider, the notes leave your device.** Every note the run reads is sent to the provider you named. Myne cannot see or control what that provider keeps. There is no limit on how many requests one run makes, so the cost is yours and it is not capped; the run tells you afterwards how much it did.
- **Your excluded folders stay excluded.** Notes in a folder you have excluded from AI are removed from the scope, and the approval screen tells you how many were removed.
- This is on the desktop app only for now.
