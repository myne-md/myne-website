---
title: "Turning on AI"
category: "ai"
updated: 2026-08-30
summary: "Enable the AI beta opt-in in Settings, give Myne something to run (model files you downloaded yourself, a runtime on this computer, or a provider you name), understand what 'ready' means, and exclude folders you never want AI to read or index. On a phone there is no on-device option and the approval is per device."
tags: ["ai", "settings"]
---

AI is off until you turn it on and give Myne something to run. This page walks through enabling the beta opt-in, choosing model files, what "ready" means, and how to keep chosen folders out of AI entirely.

## Prerequisites

- An unlocked vault.
- Something for Myne to run: a model file you downloaded yourself, a model runtime already running on this computer, or a remote provider you name. Myne never downloads a model. See [Choosing model files](#choosing-model-files) below and [Where your AI runs](/user-guide/ai/where-your-ai-runs/).

## Enabling local AI, on a computer

These steps are the computer's. **A phone has no Developer mode and no Developer group**, and reaches AI from Settings directly; skip to [Enabling AI on a phone](#enabling-ai-on-a-phone) below.

1. Open Settings from the gear in the bottom bar or with `⌘,`.
2. Open the **About** panel and turn on **Developer mode**. The AI features live in a **Developer** group that stays hidden until you do this.
3. In the panel rail, open **AI** under the **Developer** group that now appears.
4. Turn on **Enable local AI**. The helper text says what the toggle does and does not settle: it runs a model you provide, whether your notes leave this device depends on the provider you name below, and the feature is experimental and off by default.

Below the toggle, one sentence never changes (Myne never sends your notes anywhere you have not named, and never downloads a model) followed by a headline stating the configuration you are actually in: a model on your device, a program on your computer, or a provider you named. Under those, a line reads **Answering now:** with a name, or **Nothing is set up to answer yet.** The **How does this work?** disclosure expands the honest detail, including the part Myne does not protect against. That copy is worth reading once; it is the same boundary described in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).

## Enabling AI on a phone

The steps above are the computer's. A phone has no Developer group and no model
files to choose, because no model on a phone answers questions or indexes your
notes. (Transcription and image text do run on the phone, on models that ship
with Myne; they are not part of this switch.)

1. Open Settings and tap **AI**. It is a top-level entry, not nested under
   another category.
2. Turn on **Use AI on this phone**. The helper says what that commits you to:
   "Off by default. No AI model on this phone answers questions or reads your
   notes for AI, so every request goes to a service you name below, and your
   notes leave this device when it does. Transcription and image text still run
   here, on models that ship with Myne."
3. Choose a provider. Choosing one for the first time on this phone opens the
   consent screen described in
   [Where your AI runs](/user-guide/ai/where-your-ai-runs/), and nothing is
   stored or sent until you accept it there.
4. Paste the provider's API key, then load the model list and pick a model.
   Myne ships no default model and will not choose one for you.

**A phone you add to an account that already has AI set up is not finished
being set up.** The provider, the model and the key travel with your vault; the
approval does not. That phone shows the provider as chosen and a row reading
**Approve sending on this phone** above the key field. Until you open that and
accept, the phone sends nothing, and asking anything says exactly that rather
than failing vaguely.

The reason is worth one sentence: agreeing on your laptop is a statement about
your laptop. A phone is a different device, in a different pocket, on a different
network, and the screen that says what leaves it should be read on it.

## Suggesting tags automatically

Under the toggle sits a second switch, **Suggest tags automatically**, off by default. It has no model file to choose: tag suggestion runs on a model that ships inside Myne. If your build ships without that model, the switch is off and cannot be turned on, and Myne says so: it never downloads one. See [Suggest tags](/user-guide/ai/suggest-tags/).

## Choosing model files

Myne lists three model roles under **Models** in the same panel. You bring the first two; the third is an override.

- **Text model: chat, summaries, writing.** Used for chat answers, summaries and writing help. The recommended starting point is Qwen2.5-1.5B-Instruct (GGUF). This role needs the `.gguf` file plus `tokenizer.json` in the same folder.
- **Search model: semantic search & Q&A.** Used to index your notes so questions can find the right passages. The recommended starting point is all-MiniLM-L6-v2. This role needs `model.safetensors`, `config.json`, and `tokenizer.json` in one folder.
- **Speech-to-text model (transcription).** Optional. Myne already ships a speech-to-text model, so this picker is only for replacing it with one of your own. The recommended starting point is whisper-base (multilingual), and the role loads GGUF files. Speech-to-text has its own switch in Settings → Transcription, is on by default, and is not part of the AI beta. See [Transcribing a voice note](/user-guide/attachments-and-import/voice-notes/#transcribing-a-voice-note).

Each role shows a recommended-model name as a link. Clicking it opens the page in your own browser as an operating-system handoff; Myne does not fetch anything. Download the files there, then:

1. Next to a role, click **Choose file…**.
2. Pick the file in the picker (the `.gguf` for the text model, the `.safetensors` for the search model).

The chosen path is stored on your device only and the file is never copied into your vault. The path must be outside your vault folder; if you pick a file inside the vault tree, Myne refuses it and tells you it must be outside your vault.

Model files are one of three ways to give Myne something to run. You can instead point Myne at a model runtime already running on this computer, under **Local model runtime**, or name a remote provider under **Remote provider**. Both are covered in [Where your AI runs](/user-guide/ai/where-your-ai-runs/), including what leaves your device in each case.

## What "ready" means

Enabling the toggle is not enough on its own. AI is ready only once something is set up to answer: a text model file, a local runtime, or a provider. The AI Chat tab's header shows which state you are in:

- **No provider**: AI is on, but nothing is set up to answer. Choose a model file or name a provider in Settings.
- **Not answering**: what you set up is not responding. Check that it is running, then try again.
- **Unavailable**: this build of Myne was compiled without local AI, so nothing here can run.
- **No search model**: something can answer, but no model on this device can search your notes. You can still send a message and a run still starts against the notes you gave it; what stops working is the run's ability to look beyond that scope. Choose a search model in Settings → Developer → AI.
- **Preparing…**: indexing your notes for the first time in this session (see below).
- **Ready**, or the provider's name: set up and working. With a provider named, the header shows its name instead of "Ready", so you can see at a glance where your questions are going.

With AI off there is no header to read: the AI Chat tab is not shown at all.

When you unlock the vault with AI on, Myne builds a search index of your notes on this device so that [Ask your notes](/user-guide/ai/ask-your-notes/) can find relevant passages. That index is encrypted at rest and reused across sessions, so after the first build it only reconciles what changed. It is never synced and never backed up, and it is never built by a provider.

## Excluding folders

The **Excluded folders** box lets you name folders that AI must never read or index. Enter one folder path per line. A note is excluded when its folder is one you listed or is nested inside one, so excluding `Private/` also excludes everything under it. The match ignores case, so a folder stays excluded regardless of how you capitalized the path.

Exclusion is enforced both when notes are indexed and when they are queried, and every AI surface checks it before the model is ever called. A note in an excluded folder is never embedded, never summarized, never used to ground a chat answer, and never offered tag suggestions or writing help.

**Excluding a folder travels to your other devices, and un-excluding one does not travel at all.** The exclusion list only ever grows when devices sync: a folder you exclude here shows up as excluded everywhere, which is what stops a second device from indexing something the first was told to leave alone. The same rule makes a removal hard to keep. On a vault that syncs, taking a folder off the list is undone by the next sync round, because the other side still carries the entry and the two lists are combined rather than compared. Doing it on every device does not help either: whichever device syncs first brings the entry back. So treat an exclusion as permanent for as long as the vault syncs, and if you need one undone, say so on the issue tracker rather than working around it. On a vault that has never been synced, a removal simply holds. The CLI exclusion list works the same way, for the same reason.

Myne can remember a large but limited number of folders across all of its folder lists together. If you reach that limit it says so when you add one, and deleting a folder you no longer need makes room.

## Limits

On a phone, "turning on AI" means turning on sending. There is no on-device
model to fall back to, so with the switch on and a provider named, the text of
the notes involved in each request leaves the device. Turning the switch off, or
setting the provider back to none, stops that; the second also removes the key
and this phone's approval.

Turning on AI adds a model runtime to the Myne process. That process holds your decrypted notes and keys, and the model is not isolated from them; a model file you download is untrusted input that Myne does not vouch for. Turning the toggle on does not by itself send anything anywhere: that depends on what you name, and [Where your AI runs](/user-guide/ai/where-your-ai-runs/) is where that choice is made and explained. Excluding a folder keeps its notes out of AI reading and indexing, but it is a Myne-level control rather than an operating-system boundary, and it does not protect the folder against malware already running on your device, which can read app memory regardless. The encrypted index Myne builds for search is a rebuildable local cache; it is never uploaded. Full detail is in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
