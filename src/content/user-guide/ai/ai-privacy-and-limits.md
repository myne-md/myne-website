---
title: "AI privacy and limits"
category: "ai"
updated: 2026-07-31
summary: "The honest boundary of Myne's on-device AI: local inference with no network egress, a model runtime that runs in-process and is not sandboxed from your notes, the encrypted rebuildable embedding index at rest, where models come from, and what AI does not do."
tags: ["ai", "privacy", "security"]
---

This page states plainly what Myne's on-device AI protects and what it does not. It does not exceed the guarantees in Myne's threat model, and it is the reference the other AI articles point back to. If you read one AI page closely, make it this one.

## Runs on your device, sends nothing

AI inference is local. When you enable AI and choose model files, the model runs on your own computer, and Myne has no network path to send anything out. Your questions, the passages retrieved from your notes, summaries, tag suggestions, and generated writing all stay on the device. This is a structural property, not a promise about behaviour: the app carries no network client for AI, and the on-device build is checked to contain no model-download or networked component. "Local" here means no data leaves — it does not mean the model is weak or offline-only in some lesser sense; it means there is nowhere for your content to go.

## In-process, not sandboxed

This is the part that bounds the guarantee. In this version the model runs inside the main Myne process — the same process that holds your decrypted notes and encryption keys. It is not isolated from them.

Two consequences follow, and Myne states both rather than hiding them:

- A model file you download is untrusted input. Myne does not vouch for it. A malicious or buggy model, or a flaw in the inference code, could read memory that includes decrypted note content and keys. This is why AI is off by default, sits behind Developer mode and a Beta surface, and asks you to bring your own model deliberately.
- Because it runs in-process, the correct claim today is "runs locally, sends nothing" — not "sandboxed from your keys". A future version plans to move inference into a separate, network-denied process that never receives your keys; until that ships, Myne does not claim that isolation, and neither does this guide.

Transcribing a voice note works the same way: the recording is decrypted in memory and handed to the same in-process model, so the audio joins your decrypted notes inside the same trust boundary. As everywhere in Myne's AI, nothing leaves the device — there is no cloud transcription service — but the runtime is not sandboxed from your keys.

As with the rest of Myne, none of this protects against malware already running on your device. Such software can read app memory whether or not AI is on; enabling AI does not create that exposure, but it does add a model runtime inside the same trust boundary.

## The embedding index at rest

So that [asking your notes](/user-guide/ai/ask-your-notes/) can find relevant passages, Myne builds a semantic index of your notes when you unlock with AI on. Like the ordinary search index, this embedding index is:

- Encrypted at rest under your vault key, using the same encryption as the rest of your vault.
- A rebuildable cache. It can be regenerated from your notes at any time, so losing it costs only re-indexing time.
- Never synced to any server and never included in a backup.

It is held in memory while the vault is unlocked and wiped when the vault locks, on manual lock, auto-lock, or vault delete. The only new signal the encrypted index adds at rest is a coarse sense of how much content has been embedded — the same size-shaped metadata that already applies to your other encrypted blobs. One honest nuance: a dense embedding is a more complete reconstruction of note content than a keyword index, so anyone who could already read your decrypted notes (through device RAM access or key compromise) could also learn more from the index — but it grants no capability an attacker in that position does not already have against the notes themselves.

Assembled prompts, ghost-text previews, and chat transcripts are never persisted at all; they live only in memory and are dropped on lock.

## Where models come from

Myne never downloads a model, because downloading would mean a network request. The AI settings panel links to recommended starting points that open in your own browser as an operating-system handoff; you download the files there and point Myne at them. The model file is referenced from a location on your device outside your vault and is never copied into the vault. Because you choose the file, its provenance and trustworthiness are yours to judge — see [In-process, not sandboxed](#in-process-not-sandboxed) above for why that judgement matters.

## What AI does not do

- It does not use the cloud, an account, or the network in any way.
- It does not learn from, train on, or upload your notes.
- It does not read notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders), at index time or query time.
- It does not change a note without an explicit action from you (inserting a summary, accepting a completion, running a command, clicking a tag).
- It does not guarantee correct answers or accurate transcripts. The models are small; outputs can be wrong, which is why chat answers cite the notes they used so you can verify, and why a voice-note transcript is a best-effort reading you can check against the original recording.

## Limits

Enabling AI adds an in-process model runtime inside Myne's existing trust boundary; it does not weaken your vault's encryption, add a network feature, or change where notes are stored, but it is not isolated from your decrypted notes and keys, and a model file you supply is untrusted input you accept responsibility for. The no-egress guarantee means content cannot be exfiltrated even if a note's own text tries to steer the model, but it does not make a bad model safe to run in-process. And, as everywhere in Myne, none of this defends against malware already present on your device. For how this maps to Myne's broader model, see the [privacy model](/user-guide/settings-and-privacy/privacy-model/) and [what Myne doesn't do](/user-guide/settings-and-privacy/what-myne-doesnt-do/).
