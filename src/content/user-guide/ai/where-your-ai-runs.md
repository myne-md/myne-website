---
title: "Where your AI runs"
category: "ai"
updated: 2026-08-13
summary: "Myne never sends your notes anywhere you have not named, and never downloads a model. This page covers the three things you can name — a model file on this computer, a model runtime on this computer, or a remote provider — what each one means for where your notes go, and the consent screen, API key and model list a remote provider adds."
tags: ["ai", "privacy", "security", "settings"]
---

Myne never sends your notes anywhere you have not named, and never downloads a model. Out of the box you have named nothing. This page covers the three things you can name — a model file on this computer, a model runtime on this computer, or a remote provider — and what each one means for where the text of your notes goes.

## Prerequisites

- An unlocked vault.
- AI turned on in Settings → Developer → AI. See [Turning on AI](/user-guide/ai/turning-on-ai/).

## The three states

One sentence never changes, whatever you have named: **Myne never sends your notes anywhere you have not named, and never downloads a model.** Underneath it, the AI panel shows a second sentence that describes the state you are actually in.

- **A model file on this computer.** The panel reads *"This model runs entirely on your device."* The model is a file here and no network connection is involved. This is the state you are in until you name something else.
- **A model runtime on this computer.** The panel reads *"This runs on a program on your computer. Your notes stay on this device."* Your notes go to a separate program on the same machine. They do not leave the device — but that program is not part of Myne, and Myne cannot see what it does with them.
- **A remote provider.** The panel reads *"Your notes are sent to …, which Myne does not run."* The text of the notes involved in each request leaves this device, to a company Myne does not operate.

Two readouts tell you which one is live. In the AI panel, a line reads **Answering now:** followed by the name, or **Nothing is set up to answer yet.** In the AI Chat tab, every answer carries a line naming where it came from — **Answered on this device**, **Answered by …, on this computer**, or **Answered by … — your notes were sent there**. That line appears on local answers too, so its presence is a statement of fact rather than a warning.

## Pointing Myne at a runtime on this computer

Under **Local model runtime** you can point Myne at a model runtime you already run on this machine, instead of picking model files. The panel says so directly: "If you already run a model runtime on this computer, point Myne at it instead of picking model files. Leave this empty to use the files above."

1. Enter the runtime's address. The field ships empty; the address shown in grey is a hint, not a stored value.
2. Enter the model name in **Model to use there**. There is no default, and Myne will not choose one for you — "Until you name one, the address above is saved but unused."

The address must name this computer. If you enter one that does not, Myne refuses it and says why: "This address must be on this computer — localhost, 127.0.0.1 or ::1. To use a provider that runs somewhere else, name it under Provider instead." The check is on the address you typed, not on where a name happens to point today.

Myne states the honest bound on the runtime itself: it "is a separate program with its own network behaviour, and Myne does not control it. Your notes are sent to it while it runs on this computer." The link the panel offers to that runtime's own site opens in your browser as an operating-system handoff — Myne fetches nothing.

## Naming a remote provider

Under **Remote provider** you can name a service to send requests to instead. The choices are **None**, Ollama Cloud and OpenRouter — a closed list, not a free-form address, because a destination you type is one the consent screen cannot name. **None** is the default and means no service is contacted at all.

Choosing a provider for the first time shows a consent screen before anything is stored or sent. It is headed "Before Myne sends anything to …" and answers six questions in labelled sections:

- **What leaves your device** — "The text of the notes involved in each request leaves your device — the note you are working in, and any note used to answer you."
- **When it leaves** — "Only when you ask for something: chat, summarize, rewrite, edit selection. Nothing is sent as you type, and nothing is sent in the background."
- **Who receives it** — the provider, named, "which Myne does not run."
- **What Myne cannot check** — "Myne cannot see or control what … keeps, how long it keeps it, or whether it passes your request to someone else."
- **How to undo this** — "You can remove the key at any time, which stops Myne sending anything. Revoking the key itself is done at the provider, and it applies to the key rather than to this device."
- **Which devices this covers** — "This choice is part of your vault, so any device you add later inherits it and will not ask again."

The accepting button names the provider rather than saying "OK". Cancelling leaves the state you were in.

After you accept, two more controls appear.

- **API key.** Paste the key the provider issued you. Myne never shows a stored key back — the field reads "A key is stored. Myne never shows it back to you — paste a new one to replace it." Until a key is stored, nothing can be sent. **Remove this key** clears it.
- **Model.** Myne ships no default model, so nothing is chosen for you. **Load models** asks the provider what it publishes and fills the list; that request carries no note text. The panel says why the list is fetched rather than pinned: "The list comes from the provider, so it stays current and you are never billed for a model you did not choose."

## What never goes to a remote provider

Some AI work is refused a remote provider in the code rather than by a setting, so it stays on your device even while a provider is named:

- **Inline ghost-text completions.** They appear because you typed, not because you asked.
- **Automatic tag suggestions.** Same reason, and they run on a model that ships inside Myne.
- **The semantic index behind [asking your notes](/user-guide/ai/ask-your-notes/).** It runs on your device or not at all, so the passages behind an answer are always found here — even when the answer itself is written elsewhere.
- **Speech-to-text.** [Transcribing a voice note](/user-guide/attachments-and-import/voice-notes/#transcribing-a-voice-note) uses a model that ships with Myne, and no provider you name takes audio.

If one of those is somehow asked to go to a provider, Myne refuses in the same words: "This kind of request never goes to a provider — it runs on this device or not at all." What a remote provider serves is the work you asked for: chat, summarize, rewrite, edit selection.

## Turning it off

Removing the API key stops Myne sending anything. Setting **Remote provider** back to **None** removes the key and the recorded consent with it, which leaves the state you were in before you turned it on. Clearing the **Local model runtime** address returns answering to a model file on this computer.

Revoking the key itself is done at the provider, and it applies to the key rather than to this device.

## Limits

The provider you chose, the consent you gave for it, the key you pasted and the model you picked are part of your vault, so they travel with it. A device you add to the account later inherits all four and starts sending on the same terms without showing the consent screen again — one person agreeing once for their own account is the intent, and the cost is that the agreement is not re-asked per device. Removing the key propagates the same way, which is what makes it reach your other devices. Whether AI is on at all stays a per-device setting, as does a local runtime address, because that names a program on one machine.

Myne can say what it sends and to whom. It cannot say what the far side keeps, how long it keeps it, or whether it passes your request onward — and it does not claim to. A runtime on your own computer keeps your notes on the device, but it is software Myne neither ships nor audits, and its listener generally accepts connections from any program running on that computer, which makes it a poor choice on a shared machine. Notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders) are kept out of every one of these paths. None of this changes the fact that the model Myne runs in-process is not sandboxed from your decrypted notes and keys — see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for that boundary.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
