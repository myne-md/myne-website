---
title: "AI privacy and limits"
category: "ai"
updated: 2026-08-30
summary: "The honest boundary of Myne's AI: nothing is sent until you name a provider, what leaves your device when you do, a model runtime that runs in-process and is not sandboxed from your notes, the encrypted embedding index at rest, what an agent run learns about notes it cannot read, and what AI does not do."
tags: ["ai", "privacy", "security"]
---

This page states plainly what Myne's AI protects and what it does not. It does not exceed the guarantees in Myne's threat model, and it is the reference the other AI articles point back to. If you read one AI page closely, make it this one.

## Where your notes go

Where AI work runs is a setting you control, and the default is that nothing leaves. Myne never sends your notes anywhere you have not named, and never downloads a model. With no provider named, the model is a file on this computer and no network connection is involved. If you name a model runtime on your own machine, your notes go to that program over a connection that stays on the device, but the program is not part of Myne, and Myne cannot see what it does with them. If you name a remote provider, the text of the notes involved in a request leaves this device, and Myne cannot see or control what that provider keeps, how long it keeps it, or whether it passes your request to someone else. Every provider setting starts unset, and while it is unset there is no path for anything to go out.

The three states, the consent screen shown before the first remote request, and what is refused a provider outright are covered in [Where your AI runs](/user-guide/ai/where-your-ai-runs/).

## What an agent run carries besides the notes

When you send a message to the AI panel, a run carries the recent part of your
conversation with it: your earlier messages and the AI's earlier replies. That is
what lets you ask something and then say "add that to the note" without repeating
yourself. It is the text you can see in the panel, and only that. Notes read
during an earlier run are not carried, and neither is anything the AI proposed
but you did not approve.

Two bounds on it are worth knowing, because they are the only ones there are.

It is limited by length rather than by how far back it goes: roughly three
thousand characters by default, oldest messages dropped first, and a single
message too long for that arrives shortened and marked as shortened so the AI
does not read a cut-off list as a complete one. If you turn that number up in
developer options, more of your conversation travels with every request, and on a
remote provider that is more of your text leaving the device. Myne caps how far
you can raise it.

It is **not** limited by the scope you set. If an earlier answer came from a run
over a whole folder, that answer still travels when your next run is scoped to a
single note. Narrowing the scope narrows what the AI can read and change; it does
not un-say what was already said in the conversation. Use **New chat** when you
want a genuinely fresh start.

On a remote provider, Myne also asks the provider to keep a copy of the fixed
instructions it sends at the start of every request, which is what makes a long
run cheaper. That is the same text every time and contains none of your notes,
but it is worth saying plainly: for that part, Myne is asking the provider to
retain something rather than merely accepting that it might. What the provider
actually does with anything it receives is outside what Myne can see or promise,
and that has not changed.

## In-process, not sandboxed

This is the part that bounds the guarantee. In this version the model runs inside the main Myne process, the same process that holds your decrypted notes and encryption keys. It is not isolated from them.

Two consequences follow, and Myne states both rather than hiding them:

- A model file you download is untrusted input. Myne does not vouch for it. A malicious or buggy model, or a flaw in the inference code, could read memory that includes decrypted note content and keys. This is why AI is off by default, sits behind Developer mode and a Beta surface on a computer, and asks you to bring your own model deliberately. The Developer-mode part is the computer's alone: a phone has no such group and reaches AI from Settings directly, which costs nothing here because this whole paragraph is about a model file running on your own machine and a phone runs none.
- Because it runs in-process, the correct claim for the model Myne runs itself is "runs locally, sends nothing" rather than "sandboxed from your keys". That claim is about the model inside Myne, not about the feature as a whole: naming a provider is what changes where your text goes, and it is covered in [Where your AI runs](/user-guide/ai/where-your-ai-runs/). A future version plans to move inference into a separate, network-denied process that never receives your keys; until that ships, Myne does not claim that isolation, and neither does this guide.

Transcribing a voice note works the same way: the recording is decrypted in memory and handed to the same in-process model, so the audio joins your decrypted notes inside the same trust boundary. Voice-to-text is on-device unconditionally: there is no cloud transcription service, and no remote provider you name takes audio. What the runtime is *not* is sandboxed from your keys.

As with the rest of Myne, none of this protects against malware already running on your device. Such software can read app memory whether or not AI is on; enabling AI does not create that exposure, but it does add a model runtime inside the same trust boundary.

## The embedding index at rest

So that [asking your notes](/user-guide/ai/ask-your-notes/) can find relevant passages, Myne builds a semantic index of your notes when you unlock with AI on. Like the ordinary search index, this embedding index is:

- Encrypted at rest under your vault key, using the same encryption as the rest of your vault.
- A rebuildable cache. It can be regenerated from your notes at any time, so losing it costs only re-indexing time.
- Never synced to any server and never included in a backup.

It is held in memory while the vault is unlocked and wiped when the vault locks, on manual lock, auto-lock, or vault delete. The only new signal the encrypted index adds at rest is a coarse sense of how much content has been embedded, the same size-shaped metadata that already applies to your other encrypted blobs. One honest nuance: a dense embedding is a more complete reconstruction of note content than a keyword index, so anyone who could already read your decrypted notes (through device RAM access or key compromise) could also learn more from the index, but it grants no capability an attacker in that position does not already have against the notes themselves.

The index records which model built it, so choosing a different search model rebuilds it rather than serving answers from vectors the new model cannot compare against. Building and querying that index is also the one piece of AI that never goes to a provider, on this computer or elsewhere: it runs on this device or not at all, which is why the passages behind an answer are always found here even when the answer itself is written somewhere else.

Assembled prompts, ghost-text previews, and chat transcripts are never persisted at all; they live only in memory and are dropped on lock.

## What a run discloses beyond the text you asked about

The text of the notes involved is the obvious half. Three other things reach a provider on an agent run, and none of them is note content:

- **The titles and identifiers of every note in the scope you approved**, before the model has read any of them. That is how it decides which to open, and it means approving a folder discloses that folder's shape, not only the notes the run ends up reading.
- **The folder names and match counts** of results outside the scope, described in the section below.
- **The shape of your asking**: how many round-trips a run took, and when. The run's own cost line reports the first two of those to you as they happen.

What does not reach a provider on any path: your vault's contents beyond the above, your account number, your recovery phrase, your password, and any note in an [excluded folder](/user-guide/ai/turning-on-ai/#excluding-folders).

## What the agent learns about notes it cannot read

An [agent run](/user-guide/ai/agent-runs/) can search your whole vault, not only the notes you put in its scope, and what comes back is split in two. A match inside the scope comes back as a note the model may then read, which it always could. A match outside it is reduced to a folder name and a number, never a title and never an identifier, so the model can tell you which folder to widen to, and reaching that note still goes through the approval you answer.

The widening is real and worth stating: the model learns the folder names of matches it cannot read, and how many of the ranked matches fell in each. Those numbers describe the matches the search ranked, not how many notes a folder holds.

Notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders) are not counted at all, not even as a number, because the exclusion hides that they exist. The search itself runs on this device and needs a search model here; a provider is refused it outright, the same as the index behind it.

## The setup travels; the agreement does not

Your provider choice, the API key you pasted and the model you picked are part of your vault, so they travel with it. **Your agreement to send does not.** A device you add to the account later inherits the setup and asks you to approve sending on that device before anything leaves it.

That split is the point rather than an inconvenience. Agreeing on your laptop is a statement about your laptop: a phone is a different device, in a different pocket, on a different network, and the screen that says what leaves it should be read on it. The cost is one extra screen per device you add. The thing it buys is that a device cannot begin sending your notes without somebody at that device having seen what it sends.

Removing the key propagates the way the setup does, which is what makes it reach your other devices. Whether AI is on at all stays a per-device setting, as does a local model runtime address, because that names a program on one machine.

## How a request travels

The connection to a provider is direct, and Myne says so on the consent screen: "The connection is direct. The provider sees this device's IP address, and your network can see which provider you use."

That is worth stating because Myne can route its **sync** traffic through Tor where you have turned that on, and it would be reasonable to assume the same applies here. It does not. Provider requests are not routed, so two things are visible that the text of your notes is not: your address to the provider, and, to anyone who can see your network, which provider you are using and roughly when.

The requests are TLS, and the certificate is checked against a bundle compiled into Myne rather than against your system's trust store, so the contents are not readable in transit by your network.

## Where models come from

Myne never downloads a model. Two of them ship inside Myne itself (the one that suggests tags and the one that turns speech into text), so they are part of the same build as the rest of the app, and there is nothing to fetch. Bundling a model is not downloading one: no path exists for Myne to fetch weights at runtime in either case. The models for chat, summaries, writing and semantic search you supply yourself. The AI settings panel links to recommended starting points that open in your own browser as an operating-system handoff; you download the files there and point Myne at them. A model file you pick is referenced from a location on your device outside your vault and is never copied into the vault. Because you chose it, its provenance and trustworthiness are yours to judge. See [In-process, not sandboxed](#in-process-not-sandboxed) above for why that judgement matters. A model that shipped with Myne narrows that particular question and nothing else: it still runs in the same process as your notes.

## What AI does not do

- It contacts no service until you name one. With no provider named there is no account, no key, and no network request.
- It never sends a surface you did not ask for to a remote provider. Inline ghost-text completions, automatic tag suggestions, the semantic index and speech-to-text are refused a remote provider in the code rather than by a setting, so nothing is sent as you type and nothing is sent in the background.
- It does not learn from, train on, or upload your notes.
- It does not read notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders), at index time or query time.
- It does not change a note without an explicit action from you (inserting a summary, accepting a completion, running a command, clicking a tag, or starting an agent run with **Apply automatically** on).
- It does not guarantee correct answers or accurate transcripts. The models are small and outputs can be wrong. Nothing in the AI Chat tab names the notes an answer was drawn from, so checking one means opening those notes yourself; what you have to work from is the scope you set and the run's own count of how many notes it read. A voice-note transcript is a best-effort reading you can check against the original recording.

## Limits

**On a phone, no on-device model answers you.** With AI on and a provider named, every chat, summary, tag suggestion and agent run goes out, and the text of the notes involved leaves the device. There is no phone equivalent of choosing a model file or a runtime on your own machine.

**The in-process paragraph below still applies to a phone, and for a reason worth stating plainly.** Two models DO run on your phone: the transcription model that turns a voice note into text, and the one that reads text out of images. Both ship inside Myne and both run inside the same app that holds your decrypted notes and keys, which is exactly the arrangement described below. So a phone is not outside that discussion, it is inside it with a smaller set of models. What is true is narrower: nothing on the phone generates an ANSWER or indexes your notes for AI, so those roles are the ones that always mean sending text to the service you named.

Enabling AI adds a model runtime inside Myne's existing trust boundary. It does not weaken your vault's encryption and does not change where your notes are stored, but it is not isolated from your decrypted notes and keys, and a model file you supply is untrusted input you accept responsibility for. Naming a provider adds a network path that did not exist before: a runtime on your own machine keeps the text on the device, a remote provider does not. Because the model reads the text of your own notes, a note that came from somewhere you do not control can steer the wording of an answer. With no provider named there is nowhere for that text to be sent, so the worst case is a misleading answer. With a remote provider named, the defence against a note's text posing as an instruction is weaker, because the far side does the tokenizing and Myne cannot control it there. The model never writes to a note without an explicit action from you, and in [agent runs](/user-guide/ai/agent-runs/) that action takes one of two forms: approving each change on the review screen, which is the default, or choosing **Apply automatically** before you start the run, which lets that one run write inside the scope you approved without a second act. A change that would take a note out of your note list is refused either way and still needs its own act, the mode lasts for that session only, and every change still takes a snapshot first. The AI still makes no requests of its own beyond the provider you named. And, as everywhere in Myne, none of this defends against malware already present on your device. For how this maps to Myne's broader model, see [Where your AI runs](/user-guide/ai/where-your-ai-runs/), the [privacy model](/user-guide/settings-and-privacy/privacy-model/) and [what Myne doesn't do](/user-guide/settings-and-privacy/what-myne-doesnt-do/).
