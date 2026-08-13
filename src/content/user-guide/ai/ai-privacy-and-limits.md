---
title: "AI privacy and limits"
category: "ai"
updated: 2026-08-13
summary: "The honest boundary of Myne's AI: nothing is sent until you name a provider, what leaves your device when you do, a model runtime that runs in-process and is not sandboxed from your notes, the encrypted rebuildable embedding index at rest, where models come from, and what AI does not do."
tags: ["ai", "privacy", "security"]
---

This page states plainly what Myne's AI protects and what it does not. It does not exceed the guarantees in Myne's threat model, and it is the reference the other AI articles point back to. If you read one AI page closely, make it this one.

## Where your notes go

Where AI work runs is a setting you control, and the default is that nothing leaves. Myne never sends your notes anywhere you have not named, and never downloads a model. With no provider named, the model is a file on this computer and no network connection is involved. If you name a model runtime on your own machine, your notes go to that program over a connection that stays on the device — but the program is not part of Myne, and Myne cannot see what it does with them. If you name a remote provider, the text of the notes involved in a request leaves this device, and Myne cannot see or control what that provider keeps, how long it keeps it, or whether it passes your request to someone else. Every provider setting starts unset, and while it is unset there is no path for anything to go out.

The three states, the consent screen shown before the first remote request, and what is refused a provider outright are covered in [Where your AI runs](/user-guide/ai/where-your-ai-runs/).

## In-process, not sandboxed

This is the part that bounds the guarantee. In this version the model runs inside the main Myne process — the same process that holds your decrypted notes and encryption keys. It is not isolated from them.

Two consequences follow, and Myne states both rather than hiding them:

- A model file you download is untrusted input. Myne does not vouch for it. A malicious or buggy model, or a flaw in the inference code, could read memory that includes decrypted note content and keys. This is why AI is off by default, sits behind Developer mode and a Beta surface, and asks you to bring your own model deliberately.
- Because it runs in-process, the correct claim for the model Myne runs itself is "runs locally, sends nothing" — not "sandboxed from your keys". That claim is about the model inside Myne, not about the feature as a whole: naming a provider is what changes where your text goes, and it is covered in [Where your AI runs](/user-guide/ai/where-your-ai-runs/). A future version plans to move inference into a separate, network-denied process that never receives your keys; until that ships, Myne does not claim that isolation, and neither does this guide.

Transcribing a voice note works the same way: the recording is decrypted in memory and handed to the same in-process model, so the audio joins your decrypted notes inside the same trust boundary. Voice-to-text is on-device unconditionally: there is no cloud transcription service, and no remote provider you name takes audio. What the runtime is *not* is sandboxed from your keys.

As with the rest of Myne, none of this protects against malware already running on your device. Such software can read app memory whether or not AI is on; enabling AI does not create that exposure, but it does add a model runtime inside the same trust boundary.

## The embedding index at rest

So that [asking your notes](/user-guide/ai/ask-your-notes/) can find relevant passages, Myne builds a semantic index of your notes when you unlock with AI on. Like the ordinary search index, this embedding index is:

- Encrypted at rest under your vault key, using the same encryption as the rest of your vault.
- A rebuildable cache. It can be regenerated from your notes at any time, so losing it costs only re-indexing time.
- Never synced to any server and never included in a backup.

It is held in memory while the vault is unlocked and wiped when the vault locks, on manual lock, auto-lock, or vault delete. The only new signal the encrypted index adds at rest is a coarse sense of how much content has been embedded — the same size-shaped metadata that already applies to your other encrypted blobs. One honest nuance: a dense embedding is a more complete reconstruction of note content than a keyword index, so anyone who could already read your decrypted notes (through device RAM access or key compromise) could also learn more from the index — but it grants no capability an attacker in that position does not already have against the notes themselves.

The index records which model built it, so choosing a different search model rebuilds it rather than serving answers from vectors the new model cannot compare against. Building and querying that index is also the one piece of AI that never goes to a provider, on this computer or elsewhere: it runs on this device or not at all, which is why the passages behind an answer are always found here even when the answer itself is written somewhere else.

Assembled prompts, ghost-text previews, and chat transcripts are never persisted at all; they live only in memory and are dropped on lock.

## A provider is an account setting, not a device setting

Your provider choice, the consent you gave for it, the API key you pasted and the model you picked are part of your vault, so they travel with it. A device you add to the account later inherits all four and starts sending on the same terms without showing the consent screen again — one person agreeing once for their own account is the intent, and the cost is that the agreement is not re-asked per device. Removing the key propagates the same way, which is what makes it reach your other devices. Whether AI is on at all stays a per-device setting, as does a local model runtime address, because that names a program on one machine.

## Where models come from

Myne never downloads a model. Two of them ship inside Myne itself — the one that suggests tags and the one that turns speech into text — so they are part of the same build as the rest of the app, and there is nothing to fetch. Bundling a model is not downloading one: no path exists for Myne to fetch weights at runtime in either case. The models for chat, summaries, writing and semantic search you supply yourself. The AI settings panel links to recommended starting points that open in your own browser as an operating-system handoff; you download the files there and point Myne at them. A model file you pick is referenced from a location on your device outside your vault and is never copied into the vault. Because you chose it, its provenance and trustworthiness are yours to judge — see [In-process, not sandboxed](#in-process-not-sandboxed) above for why that judgement matters. A model that shipped with Myne narrows that particular question and nothing else: it still runs in the same process as your notes.

## What AI does not do

- It contacts no service until you name one. With no provider named there is no account, no key, and no network request.
- It never sends a surface you did not ask for to a remote provider. Inline ghost-text completions, automatic tag suggestions, the semantic index and speech-to-text are refused a remote provider in the code rather than by a setting, so nothing is sent as you type and nothing is sent in the background.
- It does not learn from, train on, or upload your notes.
- It does not read notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders), at index time or query time.
- It does not change a note without an explicit action from you (inserting a summary, accepting a completion, running a command, clicking a tag).
- It does not guarantee correct answers or accurate transcripts. The models are small; outputs can be wrong, which is why chat answers cite the notes they used so you can verify, and why a voice-note transcript is a best-effort reading you can check against the original recording.

## Limits

Enabling AI adds a model runtime inside Myne's existing trust boundary. It does not weaken your vault's encryption and does not change where your notes are stored, but it is not isolated from your decrypted notes and keys, and a model file you supply is untrusted input you accept responsibility for. Naming a provider adds a network path that did not exist before: a runtime on your own machine keeps the text on the device, a remote provider does not. Because the model reads the text of your own notes, a note that came from somewhere you do not control can steer the wording of an answer. With no provider named there is nowhere for that text to be sent, so the worst case is a misleading answer. With a remote provider named, the defence against a note's text posing as an instruction is weaker, because the far side does the tokenizing and Myne cannot control it there. The model has no ability to make requests of its own and never writes to a note without an explicit action from you. And, as everywhere in Myne, none of this defends against malware already present on your device. For how this maps to Myne's broader model, see [Where your AI runs](/user-guide/ai/where-your-ai-runs/), the [privacy model](/user-guide/settings-and-privacy/privacy-model/) and [what Myne doesn't do](/user-guide/settings-and-privacy/what-myne-doesnt-do/).
