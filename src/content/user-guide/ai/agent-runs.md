---
title: "Let the AI change your notes"
category: "ai"
updated: 2026-10-22
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

The AI remembers the conversation. Ask something, then say "add that to the
note" and it knows what you meant: recent messages travel with your next one, so
a run can follow on from the answer before it. What travels is what you can see
in the panel, your messages and its replies, and nothing else. Notes it read
during an earlier run do not come along.

Only the recent part travels, not the whole conversation, and an older message
that was too long arrives shortened and marked as shortened. If you are asking
about something far back in a long conversation, say it again rather than
pointing at it. **New chat** clears this: the next run starts with no memory of
what came before.

Notes at the top level of your vault are not offered as a folder. With no note open and no folder attached there is nothing for a run to work on, so **Send** stays greyed out and nothing on screen says why.

The run appears in the same conversation as your questions. When it stops, its turn stays there with a summary of what it proposed and three figures about the run itself: how many requests it made, how many notes it read, and roughly how many characters of your notes were sent to the provider. The turn also carries a diff icon that opens exactly what the run proposed, read-only, so you can look back at it once the card has gone.

A run stops for one of five reasons, and its turn says which: it finished, you stopped it, it is waiting for you to widen its scope, it made too many steps, or it stopped making progress. That last one means the model stopped producing changes Myne could use, three replies in a row that proposed nothing new. It is a statement about the model rather than about your notes, and the fix is a different model rather than a different request. Anything it had already proposed before that point still goes to the review card.

When a run ends having proposed nothing, its turn says which kind of nothing it was. A run that finished, or that you stopped, reads **The agent proposed no changes.**, because both describe something real: it looked and decided there was nothing to do. A run that ran out of steps or stopped making progress reads **The agent stopped without an answer. Try asking again, or rephrase it.** instead, because that run never did its work and your note is not the fault. When the agent answered your question, neither line appears; the answer stands on its own.

A run that never started says so on the same turn. If the provider would not take the request, it reads **The provider would not accept this request, so the run stopped. Nothing was written. This is a fault in what Myne sent, not in your notes or your setup.** Every other failure to start reads **The agent could not start.**

## Giving the run a file to read

Some requests are about a document rather than about a note: a contract you were
sent, a report, a transcript. The composer takes files, and a run reads their
text the same way it reads a note. It reads them; it cannot change them.

1. Press **+** in the composer. The list is your attachment library, and it
   shows what the library shows.
2. Pick up to **four** files and confirm. Each one appears as a chip under the
   box, with its name, and a file you picked by mistake comes off with its own
   remove control.
3. Send the message. The run reads each file's text when it starts, not while you
   are still typing.

You can also paste a file into the box, which is the faster route when the
document is already on your clipboard.

Two things about the text rather than the file. Each document is read up to
**20,000 characters**; past that the run sees the beginning and the text says so
in as many words, so it cannot answer as though it had read the end. And the
text of a file counts towards the run's "characters sent" figure exactly like
note text does, because that is what it is.

**The file itself never leaves your device.** Myne sends the text it extracted,
not the bytes.

**A file you paste into a conversation is not added to your library.** It is
stored, encrypted and synced like any other attachment, and it stays with that
conversation: it does not appear in the attachment library, in the `+` list, or
in the cleanup review. If you want it in the library, import it there.

A file you pick from the library stays in the library. Picking it for a message
does not move it.

If a document cannot be read, the message is kept and the composer names the
file that failed rather than sending a run that would answer about a file it
never received.

### A conversation belongs to its note

Opening a different note starts a fresh conversation, because the conversation
was about the note you were in. Switching back does not bring the old one back;
use the history list to reach it. If you want one conversation to follow you
across notes (two notes side by side, one thread through both), press **Keep
this conversation** and it stays wherever you go.

A half-typed message goes with the conversation it was written for, so switching
notes clears the box. Send it first if you want to keep it.

## Approving changes

The composer carries a choice for what happens when a run finishes, under the label **When the run finishes**: **Review first**, or **Apply automatically**. Review first is the default and is what the rest of this section describes.

On a computer, when it finishes, the agent's reply carries a review card with everything it proposes, grouped by note. The card appears in the conversation you started the run from, under the message it belongs to, so there is nowhere to go to read it and nothing to click to make it appear. On a phone the same decision opens as its own screen, covered under [Reviewing on a phone](#reviewing-on-a-phone).

Each change is one line under its note's name, saying what the change does: a replacement with the line count, an addition to the end, or a move. Open that line's chevron to read the change itself: a diff, with removals struck through and additions highlighted, or a move's current and destination folders.

1. **Reject** any change you do not want. Rejecting one leaves the rest alone.
2. **Approve** the rest in one action, or approve a single change on its own.
3. **Reject all** refuses every change in the card and closes it. Nothing is written.

Nothing reaches your notes before this step. The card has two ways out, and both are decisions: approve the rest, or **Reject all**, which writes nothing.

**The card closes itself when there is nothing left to decide.** Once you have approved, if nothing was refused and no row is still waiting on you, the card goes and the conversation is yours again. It stays open otherwise, and each reason is one you need to see: a change that could not be placed, a row you have neither approved nor rejected, a note the run created, or an apply that failed outright. A review still on screen after you approved is telling you something rather than waiting for a click.

What you see after it closes is the run's own turn in the conversation, carrying a **revert** control: the whole run can be undone as one action from there, and a confirmation step shows before anything is reverted.

### Applying automatically

In **Apply automatically** nothing is held back for your approval: what the AI proposed is written as soon as the run ends, and the run's turn tells you what changed. Three things still hold, and they are what make this a different amount of trust rather than none.

- It can only touch notes **inside the scope you gave the run**. That is unchanged, and a request to reach outside it still asks you.
- **Deletions still need your own act.** An edit that would trash, delete, archive, turn into a template or mark as conflicted is refused in this mode and reported to you, exactly as it is refused inside a bulk approval. Myne checks this against the note as it would actually be, not against what the AI says it is doing.
- **The mode lasts for the session.** Locking your vault or switching to another one puts it back to Review first, so a choice you made for one vault never carries into the next.

Every change still takes a snapshot before it is written, and the run's turn carries a **revert** control, so an automatic change you did not want is one action away from being reverted.

One thing this mode does not do: it does not read your notes any differently, and it does not send more of them anywhere. It changes when a proposal is written, not what the AI is allowed to see.

The review card does not open when the apply succeeds. Nothing is held for your approval, so there is nothing to review; what tells you what happened is the run's own turn in the conversation and the **revert** control on it.

If the automatic apply fails outright, nothing is written and the composer says so: **The changes could not be applied automatically. Nothing was written; open the review to apply them yourself.** The proposal survives, so the review card opens with everything the run proposed still on it: a failed automatic apply costs you the convenience rather than the proposal.

## Changing settings

Some requests are about your settings rather than your notes. "Change my weekly notes folder to Journals/Weekly" is one of those: the AI proposes the change, and the review card shows the setting as it is now and what it would become.

A setting change is always its own decision. The **Approve** action that applies several note changes at once never carries one, and **Apply automatically** never writes one either, because a setting is not inside the folder you gave the run. Approve it on its own, or reject it and change it yourself in Settings. "Remove my weekly notes folder setting" is a request of its own too, and the review card shows it as a removal rather than as an empty value.

These are the settings the AI can change:

- The folder, the template and the date format for daily, weekly and monthly notes.
- Where new notes are created.
- The formats Myne uses to show dates and times.

And these are the ones it declines, with the reason it gives:

- **The settings that bound what AI and the CLI may reach.** The folder exclusions, screen-capture protection, auto-lock, Terminal access with its own folder exclusions and rate limit, the AI switch, and provider consent. A change here would move the limit the AI itself runs under, so the AI tells you to change it yourself.
- **The settings that belong to one device.** The theme, the editor text size and **Show edit times** are kept per device and do not sync. A change would land on this machine and leave your other devices showing the old value, with nothing on screen saying why, so the AI declines these as well.

A setting change is not offered at all in a note's own detached window, and the AI says so if you ask there. That window runs the same copy of Myne as the main window, so it can show you your notes, but the app does not offer it a setting change to make. Ask in the main window instead.

Undoing a run puts a changed setting back, and the report counts the settings it restored separately from the notes.

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

There is no limit on how many times it can ask, or on how large the scope can become. The running total is shown while the run works and on the review card, and that number is the thing to watch. If it is climbing past what you expected, stop the run.

## Adding to a note

Not every change replaces something. When you ask the AI to add material rather
than rewrite it, it appends to the end of the note, and the review card shows
the new text as an addition with nothing removed.

This is the only way it can write into a note that is **empty**. A change that
replaces text needs some existing text to attach itself to, and an empty note has
none, so before this the AI would tell you the note was empty rather than fill
it. Now it fills it.

Two things it will not do while adding:

- **It cannot put text above the note's properties.** Anything it adds goes into
  the body, underneath them. If the note has no properties and no text at all, and
  what the AI wants to add would read as a properties block, Myne refuses that
  change rather than writing something you did not intend.
- **It cannot move the note to another folder.** No change the AI proposes may
  alter which folder a note is in, and one that would is refused with **Could not
  be applied: that change would move the note to another folder.** That holds for
  every change, not only additions, and it holds whether you approve one change or
  all of them. Folders are how you keep notes away from the AI, so the AI does not
  get to choose them.

## New notes

The AI can also propose new notes. Those appear on the review card as their own group, with the title, the folder and the whole body, and you can reject any of them the same way you reject a change. Only the ones you keep are created.

Read the body rather than skimming the title. A new note is the one thing a run does that the undo cannot reverse for you.

## Deleting a note

The AI has no delete. When it wants a note gone it proposes taking it out of your note list, and that change is never included in "approve all": it always needs its own click, and the row tells you which kind of removal it is.

That covers five things, not just Trash: moving a note to **Trash**, deleting it **on every device**, moving it to **Archive**, turning it into a **template**, or marking it a **conflict copy**. They are not equally easy to undo, which is why the row names the one it means. A note in Trash or Archive is still somewhere you can find it; a note deleted on every device is not.

The reason all five need their own click is the same: at the diff level, each of them is written the same way an ordinary edit is, so none of them looks different from "fix a typo" until you read what it does. It should not be possible to approve one without noticing.

## Undoing a run

Approving takes a snapshot of every note the run is about to **change**, so those changes can be undone as one action. If Myne cannot take those snapshots, it refuses to write at all rather than making a change you could not reverse.

The review card carries its own **Undo** once something has been applied, and the run's turn carries a **revert** control as well, so the offer outlives the card: whether you closed the card or it closed itself, the turn stays in the conversation with the revert control on it. Using either asks you to confirm first, and the confirmation states the limit in the same breath as the remedy: the offer lasts until you lock the vault or close the app, and after that the same snapshots are still there, in each note's own **Snapshots** history, one note at a time.

The offer is tied to the run, not to a screen. If the run's turn is not in the conversation on screen, which after **New chat** or after switching to another conversation it is not, the revert control appears in the panel's own controls instead, so a run that wrote your notes is still one action from being undone.

Notes the run **created** are not part of that undo, and Myne says so when you use it. A new note has no earlier version to go back to, so removing one means moving it to Trash yourself.

On a phone the same one-tap undo is there, and it ends sooner: locking the vault, switching vault or the phone reclaiming the app all take it, and backgrounding the app is enough. The confirmation names only the first two of those, and points at the durable path: "This one-tap undo lasts until you lock the vault or close the app. After that, restore notes one at a time from a note's version history." Backgrounding is not closing, and switching vault is not in the sentence at all, so on a phone the terminator you are most likely to hit is the one the sentence does not mention. Treat the offer as lasting only while the app is in front of you.

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
- **New chat does the same thing, on purpose.** Starting a new conversation stops a run that is working and discards a proposal that was waiting for you, for the same reason: the proposal belongs to the conversation you are clearing. Nothing was written, and the offer to undo an earlier run that *did* write is kept: with the turn cleared, the revert control appears in the panel's own controls.
- **On a remote provider, the notes leave your device.** A run opens by sending the title and identifier of every note in its scope, before it has read any of them, and when the scope is exactly one note it sends that note's text as well. Every further note the run reads goes too, and so does the recent part of your conversation with the panel, since that is what lets a follow-up refer to the answer before it. Myne cannot see or control what that provider keeps. There is no limit on how many requests one run makes, so the cost is yours and it is not capped; when the run stops, its turn reports how many requests it made, how many notes it read, and roughly how many characters of your notes were sent. A run that stayed on this device says **nothing left this device** in the same place.
- **Your excluded folders stay excluded, and they stay excluded during the run.** Notes in a folder you have excluded from AI are removed from the scope, and the card tells you how many were removed. Excluding a folder while a run is working takes effect at once: from that moment its notes stop being listed, searched and read, and on a remote provider stop being sent. A change that can no longer be applied says so on the review card rather than being written: **Could not be applied: that note's folder is now excluded from AI.** A refused change is not marked applied, so you can approve it again once the cause is gone.
- **On a phone, a run ends when the app does.** Locking the vault, switching vault and putting the app in the background all cancel the run and clear the proposal. The first two match the computer; the third does not, and it is the one that will bite: on a phone, taking a call or checking a message is how most long runs will end. Myne tells you the run was cancelled rather than leaving a screen that looks like it is still working, and nothing was written.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Send the message and start a run | Enter | Enter |
| Start a new line instead of sending | Shift+Enter | Shift+Enter |

Both keys belong to the composer itself and are not listed in **Settings → Hotkeys**, so they cannot be rebound. There is no second mode: the same key sends a question and a change request alike.
