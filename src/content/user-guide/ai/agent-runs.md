---
title: "Let the AI change your notes"
category: "ai"
updated: 2026-08-30
summary: "Ask the AI to make changes across a set of notes you choose. In the default mode it proposes every change as a diff and nothing is written until you approve it, one note at a time or all at once."
tags: ["ai", "notes"]
---

The AI can do more than answer questions about your notes: it can propose changes to them. You pick which notes it may touch, it works through them, and then it shows you every change it wants to make as a diff. Nothing is written to your vault until you approve it.

## Prerequisites

- AI enabled, with a text model selected or a provider named: see [Turning on AI](/user-guide/ai/turning-on-ai/).
- A model that can hold the edit format. Not every model can; if yours cannot, Myne says so instead of offering a feature that would fail. See [When the model cannot do it](#when-the-model-cannot-do-it).

## Starting a run

1. Open the **AI Chat** tab. There is one composer and one mode: every message you send starts a run, whether you asked a question or asked for a change.
2. Decide what the AI may touch. The line above the box reads **Working on** followed by **This note**, or the name of a folder. Press **Change** to open the list, which offers **This note** plus every folder your notes are in; picking one closes the list again.
3. With a folder attached, check the count beside it. Myne shows how many notes that folder holds, and, when the exclusion clamp removed any, how many are excluded from AI and stay out. If the count could not be worked out, Myne says that instead of showing nothing.
4. Type what you want changed in the box marked **Ask the AI to change these notes** and send it. Enter sends; Shift+Enter starts a new line.
5. The AI reads the notes it needs and works. Its progress, the number of notes it can currently change, and a **Stop** button sit just above the composer for as long as it runs.

Notes at the top level of your vault are not offered as a folder. With no note open and no folder attached there is nothing for a run to work on, so **Send** stays greyed out and nothing on screen says why.

The run appears in the same conversation as your questions. When it stops, its turn stays there with what it proposed and three figures about the run itself: how many requests it made, how many notes it read, and roughly how many characters of your notes were sent to the provider. You can look back at all of it once the review screen has gone.

A run stops for one of five reasons, and its turn says which: it finished, you stopped it, it is waiting for you to widen its scope, it made too many steps, or it stopped making progress. That last one means the model stopped producing changes Myne could use, three replies in a row that proposed nothing new. It is a statement about the model rather than about your notes, and the fix is a different model rather than a different request. Anything it had already proposed before that point still goes to the review screen.

When a run ends having proposed nothing, its turn says which kind of nothing it was. A run that finished, or that you stopped, reads **The agent proposed no changes.**, because both describe something real: it looked and decided there was nothing to do. A run that ran out of steps or stopped making progress reads **The agent stopped without an answer. Try asking again, or rephrase it.** instead, because that run never did its work and your note is not the fault. When the agent answered your question, neither line appears; the answer stands on its own.

A run that never started says so on the same turn. If the provider would not take the request, it reads **The provider would not accept this request, so the run stopped. Nothing was written. This is a fault in what Myne sent, not in your notes or your setup.** Every other failure to start reads **The agent could not start.**

## Approving changes

The composer carries a choice for what happens when a run finishes, under the label **When the run finishes**: **Review first**, or **Apply automatically**. Review first is the default and is what the rest of this section describes.

When it finishes, a review screen opens with everything it proposes, grouped by note.

1. Read each diff. Removed text is struck through; added text is highlighted.
2. **Reject** any change you do not want. Rejecting one leaves the rest alone.
3. **Approve** the rest in one action, or approve a single change on its own.

Nothing reaches your notes before this step. If you close the review without approving, nothing was written.

**The review closes itself when there is nothing left to decide.** Once you have approved, if nothing was refused and no row is still waiting on you, the screen goes and you are back in your editor. It stays open otherwise, and each reason is one you need to see: a change that could not be placed, a row you have neither approved nor rejected, a note the run created, or an apply that failed outright. A review still on screen after you approved is telling you something rather than waiting for a click.

What you see after it closes is the undo offer at the top of the AI panel, which names how many notes the run changed.

### Applying automatically

In **Apply automatically** nothing is held back for your approval: what the AI proposed is written as soon as the run ends, and the run's turn tells you what changed. Three things still hold, and they are what make this a different amount of trust rather than none.

- It can only touch notes **inside the scope you gave the run**. That is unchanged, and a request to reach outside it still asks you.
- **Deletions still need your own act.** An edit that would trash, delete, archive, turn into a template or mark as conflicted is refused in this mode and reported to you, exactly as it is refused inside a bulk approval. Myne checks this against the note as it would actually be, not against what the AI says it is doing.
- **The mode lasts for the session.** Locking your vault or switching to another one puts it back to Review first, so a choice you made for one vault never carries into the next.

Every change still takes a snapshot before it is written, and the undo offer sits in the composer after the run, so an automatic change you did not want is one action away from being reverted.

One thing this mode does not do: it does not read your notes any differently, and it does not send more of them anywhere. It changes when a proposal is written, not what the AI is allowed to see.

The review screen does not open when the apply succeeds. Nothing is held for your approval, so there is nothing to review; what tells you what happened is the run's own turn in the conversation and the undo offer above the composer.

If the automatic apply fails outright, nothing is written and the composer says so: **The changes could not be applied automatically. Nothing was written; open the review to apply them yourself.** The proposal survives, so the review screen opens with everything the run proposed still on it: a failed automatic apply costs you the convenience rather than the proposal.

## Reviewing on a phone

The review screen is the same decision in a shape that fits a phone. It opens on
a **list of the notes that would change**, each with how many changes and how
many lines, and one note's diff is a tap away rather than all of them stacked.
That is deliberate: several unified diffs do not read at phone width, and a diff
you cannot read turns approving into a formality.

Everything the decision rests on is unchanged. The number of notes the run can
touch is in the header the whole time. A change that would take a note out of
your note list is not part of the one Apply and needs its own act, saying which
removal it is. A change the app could not place is shown with the reason rather
than quietly dropped.

**The back gesture does not throw the proposal away.** Android's back button and
the iOS edge-swipe close an open diff and return you to the list; at the top of
the list they do nothing. Closing a review you have not applied is a decision,
so it takes the button that says so.

## Widening what it can touch

If the AI needs a note outside what you gave it, it asks. That request is a separate approval, and it tells you four things: that it would be able to **read and change** those notes, how many notes that is, what your run would cover in total afterwards, and (if you have named a remote provider) that those notes leave your device.

Two things are worth knowing about that screen.

The set is fixed when you approve it. If you allow a folder and a note is added to that folder a minute later, that new note is not included; you approved the notes that were there.

There is no limit on how many times it can ask, or on how large the scope can become. The running total is shown while the run works and on the review screen, and that number is the thing to watch. If it is climbing past what you expected, stop the run.

## New notes

The AI can also propose new notes. Those appear on the review screen as their own group, with the title, the folder and the whole body, and you can reject any of them the same way you reject a change. Only the ones you keep are created.

Read the body rather than skimming the title. A new note is the one thing a run does that the undo cannot reverse for you.

## Deleting a note

The AI has no delete. When it wants a note gone it proposes taking it out of your note list, and that change is never included in "approve all": it always needs its own click, and the row tells you which kind of removal it is.

That covers five things, not just Trash: moving a note to **Trash**, deleting it **on every device**, moving it to **Archive**, turning it into a **template**, or marking it a **conflict copy**. They are not equally easy to undo, which is why the row names the one it means. A note in Trash or Archive is still somewhere you can find it; a note deleted on every device is not.

The reason all five need their own click is the same: at the diff level, each of them is written the same way an ordinary edit is, so none of them looks different from "fix a typo" until you read what it does. It should not be possible to approve one without noticing.

## Undoing a run

Approving takes a snapshot of every note the run is about to **change**, so those changes can be undone as one action. If Myne cannot take those snapshots, it refuses to write at all rather than making a change you could not reverse.

The Undo button is on the review screen, and it stays available once that screen has gone, whether you closed it or it closed itself: it moves to the top of the AI panel, so the review going away is not the same as accepting what happened. The offer lasts until you run the agent again or lock your vault, whichever comes first. After that the same snapshots are still there, in each note's own **Snapshots** history, one note at a time.

Notes the run **created** are not part of that undo, and Myne says so when you use it. A new note has no earlier version to go back to, so removing one means moving it to Trash yourself.

On a phone the same one-tap undo is there, and it ends sooner: locking the vault, switching vault or the phone reclaiming the app all take it, and backgrounding the app is enough. **The strip names two of those four**, and points at the durable path: "This one-tap undo lasts until you lock the vault or close the app. After that, restore notes one at a time from a note's version history." Backgrounding is not closing, and switching vault is not in the sentence at all, so on a phone the terminator you are most likely to hit is the one the strip does not mention. Treat the offer as lasting only while the app is in front of you.

The reason it is not simply made to last is worth one sentence. That record names the notes a run changed, and keeping it across a restart would mean writing it to storage; the run's own proposal is text copied out of your notes, and Myne's design is that none of it is written down. The per-note snapshots, which are encrypted like everything else in your vault, are the version that persists.

## When the model cannot do it

To change a note, the model has to copy the existing text exactly and say what replaces it. Small models often get that slightly wrong, and a change that does not match exactly is discarded rather than guessed at.

Myne checks this the first time you press **Send** in a session, not when you pick a model. While it checks, the button reads **Checking the model…** and then names the attempt it is on. Opening the tab costs nothing; the first send pays for the check, because on a remote provider the check is real requests to that provider. The answer is kept for the rest of the session and dropped when you lock the vault or switch to another one.

Two different answers come back, and they are not the same problem.

If the model was measured and fell short, a block above the composer reads **This model cannot make precise edits reliably, so the agent is unavailable. Choose a larger model or a provider.** followed by how many of the checks it passed and how many are needed. While the pass mark is still unmeasured across models, Myne says that too, rather than presenting it as settled.

If the check could not be completed at all, the sentence does not blame your model: **The edit check could not be completed, so the agent is unavailable for now. Check that your model or provider is reachable, then try again.**

In both cases **Send** stays blocked and what you typed is kept, so changing model and sending again costs you nothing.

## Limits

- **The AI is not always right.** It suggests; you decide. Read the diffs.
- **A note's own text can steer it.** The AI reads your notes, and a note that came from somewhere you do not control (synced from another device, or imported) can contain text that reads like an instruction. That is why the scope is yours to set, why widening it needs your approval, and why nothing is written without your say-so. Those approvals are the protection; they only work if you read them.
- **Approving is the protection, and it is a human one.** Myne does not limit how large a run can get. It shows you the number and asks you each time.
- **Nothing survives locking your vault.** If the vault locks while a run is working, or while its changes are waiting for you, the run is cancelled and the proposal is gone. Nothing was written. Myne gives you no warning about this before a long run, so check your auto-lock setting yourself first: a run over a folder can take minutes, and an idle lock in the middle of one throws the work away.
- **New chat does the same thing, on purpose.** Starting a new conversation stops a run that is working and discards a proposal that was waiting for you, for the same reason: the proposal belongs to the conversation you are clearing. Nothing was written, and the offer to undo an earlier run that *did* write is kept.
- **On a remote provider, the notes leave your device.** A run opens by sending the title and identifier of every note in its scope, before it has read any of them, and when the scope is exactly one note it sends that note's text as well. Every further note the run reads goes too. Myne cannot see or control what that provider keeps. There is no limit on how many requests one run makes, so the cost is yours and it is not capped; when the run stops, its turn reports how many requests it made, how many notes it read, and roughly how many characters of your notes were sent. A run that stayed on this device says **nothing left this device** in the same place.
- **Your excluded folders stay excluded, and they stay excluded during the run.** Notes in a folder you have excluded from AI are removed from the scope, and the approval screen tells you how many were removed. Excluding a folder while a run is working takes effect at once: from that moment its notes stop being listed, searched and read, and on a remote provider stop being sent. A change that can no longer be applied says so on the review screen rather than being written: **Could not be applied: that note's folder is now excluded from AI.** A refused change is not marked applied, so you can approve it again once the cause is gone.
- **On a phone, a run ends when the app does.** Locking the vault, switching vault and putting the app in the background all cancel the run and clear the proposal. The first two match the computer; the third does not, and it is the one that will bite: on a phone, taking a call or checking a message is how most long runs will end. Myne tells you the run was cancelled rather than leaving a screen that looks like it is still working, and nothing was written.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Send the message and start a run | Enter | Enter |
| Start a new line instead of sending | Shift+Enter | Shift+Enter |

Both keys belong to the composer itself and are not listed in **Settings → Hotkeys**, so they cannot be rebound. There is no second mode: the same key sends a question and a change request alike.
