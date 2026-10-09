---
title: "Where your AI runs"
category: "ai"
updated: 2026-10-03
summary: "Myne never sends your notes anywhere you have not named, and it downloads a model only when you ask, from Myne's own origin. This page covers the three things you can name (a model file here, a runtime here, or a remote provider), what each means for where your notes go, and the consent screen and API key a provider adds."
tags: ["ai", "privacy", "security", "settings"]
---

Myne never sends your notes anywhere you have not named, and it downloads a model only when you ask, from Myne's own origin, which keeps no IP logs and no analytics. Out of the box you have named nothing. This page covers the three things you can name (a model file on this computer, a model runtime on this computer, or a remote provider) and what each one means for where the text of your notes goes.

## Prerequisites

- An unlocked vault.
- AI turned on in Settings → Developer → AI. See [Turning on AI](/user-guide/ai/turning-on-ai/).

## The three states

One sentence never changes, whatever you have named: **Myne never sends your notes anywhere you have not named, and it downloads a model only when you ask, from Myne's own origin, which keeps no IP logs and no analytics.** Underneath it, the AI panel shows a second sentence that describes the state you are actually in.

- **A model file on this computer.** The panel reads *"This model runs entirely on your device."* The model is a file here and no network connection is involved. This is the state you are in until you name something else.
- **A model runtime on this computer.** The panel reads *"This runs on a program on your computer. Your notes stay on this device."* Your notes go to a separate program on the same machine. They do not leave the device, but that program is not part of Myne, and Myne cannot see what it does with them.
- **A remote provider.** The panel reads *"Your notes are sent to …, which Myne does not run."* The text of the notes involved in each request leaves this device, to a company Myne does not operate.

Two readouts tell you which one is live. In the AI panel, a line reads **Answering now:** followed by the name, or **Nothing is set up to answer yet.** In the AI Chat tab, the status chip in the tab header carries the same fact: it shows the provider's name whenever a provider is answering, and **Ready** when the answer is coming from this computer, whether from a model file or from a runtime here.

Individual answers in the transcript carry no such label. Read the chip before you send rather than the turn afterwards, and remember that the chip describes the setting as it is now, not the setting an older answer was produced under.

## Pointing Myne at a runtime on this computer

Under **Local model runtime** you can point Myne at a model runtime you already run on this machine, instead of picking model files. The panel says so directly: "If you already run a model runtime on this computer, point Myne at it instead of picking model files. Leave this empty to use the files above."

1. Enter the runtime's address. The field ships empty; the address shown in grey is a hint, not a stored value.
2. Enter the model name in **Model to use there**. There is no default, and Myne will not choose one for you: "Until you name one, the address above is saved but unused."

The address must name this computer. If you enter one that does not, Myne refuses it and says why: "This address must be on this computer: localhost, 127.0.0.1 or ::1. To use a provider that runs somewhere else, name it under Provider instead." The check is on the address you typed, not on where a name happens to point today.

Myne states the honest bound on the runtime itself: it "is a separate program with its own network behaviour, and Myne does not control it. Your notes are sent to it while it runs on this computer." The link the panel offers to that runtime's own site opens in your browser as an operating-system handoff: Myne fetches nothing.

## Naming a remote provider

Under **Remote provider** you can name a service to send requests to instead. The choices are **None**, Ollama Cloud and OpenRouter, a closed list rather than a free-form address, because a destination you type is one the consent screen cannot name. **None** is the default and means no service is contacted at all.

Choosing a provider for the first time shows a consent screen before anything is stored or sent. It is headed "Before Myne sends anything to …" and answers seven questions in labelled sections:

- **What leaves your device**: "The text of the notes involved in each request leaves your device: the note you are working in, and any note used to answer you. An agent run also sends the titles and identifiers of every note in the scope you approved, before it has read any of them."
- **When it leaves**: "Only when you ask for something: chat, summarize, rewrite, edit selection, or an agent run. Nothing is sent as you type, and nothing is sent in the background."
- **Who receives it**: the provider, named, "which Myne does not run."
- **What Myne cannot check**: "Myne cannot see or control what … keeps, how long it keeps it, or whether it passes your request to someone else."
- **How to undo this**: "You can remove the key at any time, which stops Myne sending anything. Revoking the key itself is done at the provider, and it applies to the key rather than to this device."
- **Which devices this covers**: "This choice covers this device only. Your key does travel to your other devices, but each one asks before it sends anything."
- **How it travels**: "The connection is direct by default: the provider sees this device's IP address, and your network can see which provider you use. If you turn on Tor routing on desktop, this request goes through the same Tor proxy as sync, so the provider sees the exit node rather than this device. Mobile has no Tor routing yet, so it always connects directly."

The accepting button names the provider rather than saying "OK". Cancelling leaves the state you were in.

After you accept, two more controls appear.

- **API key.** Paste the key the provider issued you. Myne never shows a stored key back. The field reads "A key is stored. Myne never shows it back to you. Paste a new one to replace it." Until a key is stored, nothing can be sent. **Remove this key** clears it. A key that contains a line break or a control character is refused, and the reason is worth knowing because the usual cause is a paste rather than a typing mistake: text copied out of a terminal, a shell history file or a chat window often carries a trailing newline, and a key carrying one cannot be used. Myne reports it the same way it reports no key at all, so if a key you just pasted stops working, paste it again from the provider's own page rather than adding or removing spaces. That refusal is on the sending side: a key in that state never becomes a request, so nothing carrying it reaches the provider. It is refused, not repaired, and the stored copy is not corrected for you.
- **Model.** Myne ships no default model, so nothing is chosen for you. **Load models** asks the provider what it publishes and fills the list; that request carries no note text. The panel says why the list is fetched rather than pinned: "The list comes from the provider, so it stays current and you are never billed for a model you did not choose."

## What never goes to a remote provider

Some AI work is refused a remote provider in the code rather than by a setting, so it stays on your device even while a provider is named:

- **Inline ghost-text completions.** They appear because you typed, not because you asked.
- **Automatic tag suggestions.** Same reason, and they run on a model on this device, either fetched on demand from Myne's own origin or side-loaded by you. If no tag model is installed, Myne offers the download in Settings → AI before the switch can turn on.
- **The semantic index behind [asking your notes](/user-guide/ai/ask-your-notes/).** It runs on your device or not at all, so the notes behind an answer are always found here, even when the answer itself is written elsewhere.
- **Speech-to-text.** [Transcribing a voice note](/user-guide/attachments-and-import/voice-notes/#transcribing-a-voice-note) uses a model that ships with Myne, and no provider you name takes audio.

If one of those is somehow asked to go to a provider, Myne refuses in the same words: "This kind of request never goes to a provider: it runs on this device or not at all." What a remote provider serves is the work you asked for: chat, summarize, rewrite, edit selection, [summarize a meeting](/user-guide/ai/meeting-summaries/), or [an agent run](/user-guide/ai/agent-runs/). A meeting summary is a bounded series of requests rather than one: the transcript is read in parts, so a long meeting sends several.

## On a phone

There is no on-device option on a phone. No model there answers a question, summarizes or suggests a tag, so the three
states above collapse to one: either you have named a remote provider, or AI
does nothing. Every request goes to the service you name, and the text of the
notes involved leaves the device when it does.

The settings panel is **Settings → AI**, a top-level entry rather than something
nested under Developer, and the switch that turns it on says the same thing:
"Off by default. No AI model on this phone answers questions or reads your
notes for AI, so every request goes to a service you name below, and your notes
leave this device when it does. Transcription and image text still run here, on
models that ship with Myne."

**Approving on a laptop does not approve on a phone.** A phone you add to an
account that already has AI set up arrives holding the provider, the model and
the key, and holding no approval. The AI panel shows the provider as chosen and,
above the key, a row reading **Approve sending on this phone**. Until you open
that and accept, the phone sends nothing, and asking anything says so rather
than failing vaguely: "You have not agreed to send notes to this provider from
this device."

## Turning it off

Removing the API key stops Myne sending anything. Setting **Remote provider** back to **None** removes the key and this device's recorded approval with it, which leaves the state you were in before you turned it on. The key is vault content, so removing it reaches your other devices; the approval was only ever on this one. Clearing the **Local model runtime** address returns answering to a model file on this computer.

Revoking the key itself is done at the provider, and it applies to the key rather than to this device.

## Limits

**This page describes a build that refuses a malformed provider key, and older builds do not.** The
refusal and the shared-writable key both arrive with myne-md/myne#753. On a build before that, a
key carrying a stray line break is passed to the provider instead of refused, which is the
behaviour the refusal was added to stop. Nothing here describes a planned change.

The provider you chose, the key you pasted and the model you picked are part of your vault, so they travel with it. **The consent does not.** A device you add to the account later inherits the provider, the key and the model, and shows you the consent screen before it sends anything, because agreeing on one device is not agreeing on another. That is worth knowing in both directions: a new device is set up in one tap rather than four, and it still cannot send until somebody at that device has read what leaves it.

Removing the key propagates the way the other three do, which is what makes it reach your other devices. Whether AI is on at all stays a per-device setting, as does a local runtime address, because that names a program on one machine.

The connection to a provider is direct by default. On desktop, turning on Tor routing sends both your sync traffic and your provider requests through Tor, so the provider sees the exit node rather than this device; when the Tor proxy is not ready the request is refused rather than sent directly. Mobile has no Tor routing yet, so its provider requests always go direct.

Myne can say what it sends and to whom. It cannot say what the far side keeps, how long it keeps it, or whether it passes your request onward, and it does not claim to. A runtime on your own computer keeps your notes on the device, but it is software Myne neither ships nor audits, and its listener generally accepts connections from any program running on that computer, which makes it a poor choice on a shared machine. Notes in [excluded folders](/user-guide/ai/turning-on-ai/#excluding-folders) are kept out of every one of these paths. None of this changes the fact that the model Myne runs in-process is not sandboxed from your decrypted notes and keys. See [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for that boundary.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
