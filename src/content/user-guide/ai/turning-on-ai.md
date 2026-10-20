---
title: "Turning on AI"
category: "ai"
updated: 2026-10-18
summary: "Enable the AI beta opt-in in Settings, give Myne something to run (model files you downloaded yourself, a runtime on this computer, or a provider you name), understand what 'ready' means, and exclude folders you never want AI to read or index. On a phone there is no on-device option and the approval is per device."
tags: ["ai", "settings"]
---

AI is off until you turn it on and give Myne something to run. This page walks through enabling the beta opt-in, choosing model files, what "ready" means, and how to keep chosen folders out of AI entirely.

## Prerequisites

- An unlocked vault.
- Something for Myne to run: a model file you downloaded yourself, a model runtime already running on this computer, or a remote provider you name. Myne fetches a model only when you ask, from its own origin. See [Choosing model files](#choosing-model-files) below and [Where your AI runs](/user-guide/ai/where-your-ai-runs/).

## Enabling AI, on a computer

These steps are the computer's. **A phone has no Developer mode and no Developer group**, and reaches AI from Settings directly; skip to [Enabling AI on a phone](#enabling-ai-on-a-phone) below.

1. Open Settings from the gear in the bottom bar or with `⌘,`.
2. Open the **About** panel and turn on **Developer mode**. The AI features live in a **Developer** group that stays hidden until you do this.
3. In the panel rail, open **AI** under the **Developer** group that now appears. The panel is organised into four topics: **General** (the master switch and what answers), **Models** (the tag switch, which file each role uses, and a table of the models Myne can fetch), **Limits** (the folders AI must leave alone, and how much of a conversation each request carries), and **Advanced** (the meeting-summary prompt, the voice preferences, and what the assistant remembers).
4. Turn on **Enable AI features**. The helper text says what the toggle does and does not settle: it runs a model you provide, whether your notes leave this device depends on the provider you name below, and the feature is experimental and off by default.

Above the switch, a card carries one sentence that never changes (Myne never sends your notes anywhere you have not named, and it downloads a model only when you ask, from Myne's own origin, which keeps no IP logs and no analytics) followed by a headline stating the configuration you are actually in: a model on your device, a program on your computer, or a provider you named. Under those, a line reads **Answering now:** with a name, or **Nothing is set up to answer yet.** The **How does this work?** disclosure expands the honest detail, including the part Myne does not protect against. That copy is worth reading once; it is the same boundary described in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).

## Enabling AI on a phone

The steps above are the computer's. A phone has no Developer group and no model
files to choose, because no model on a phone answers questions or reads your
notes for AI. (Transcription and image text do run on the phone, on models that ship
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

The **Models** tab opens with a **Tagging** section holding a second switch, **Suggest tags automatically**, off by default. Tag suggestion runs on a small model on your device. You can fetch Myne's copy of that model from **Verified downloadable models** further down the same tab, or point the tag model's row under **Outsourced models** at a file you got yourself; the panel's own sentence is where the switch says it is off because no tag model is installed yet. Installing one (either way) turns the switch on by itself, without a restart. See [Suggest tags](/user-guide/ai/suggest-tags/).

## Downloading a model from Myne

One model role can be fetched for you, from Myne's own origin (`downloads.myne.md`). On the **Models** tab, **Verified downloadable models** lists it, with whether it is **Installed** or **Not installed**; hover the model's name (it is underlined with dots) to see its size. The row has one action: **Download**, or **Remove** once the model is on your device, and a folder button that shows where the file is.

- **Tag model** (about 337 MB) for automatic tag suggestions.

Each download is a single explicit action, and nothing is fetched unless you click. A download shows how far along it is and can be cancelled. The bytes are checked against a fingerprint built into the app before the model is registered, so a download that was tampered with or truncated is rejected rather than used. The request carries no note content: it reveals your IP address to Myne's own origin and nothing else, and that origin keeps no IP logs and no analytics. If you would rather fetch nothing, Developer mode also lets you point Myne at a model file you got yourself with **Choose file…**; a file from elsewhere is not checked by Myne, so only use one you trust.

## Choosing model files

Under **Outsourced models** on the same **Models** tab, Myne lists the model roles you can point at a file you got yourself: the text, speech-to-text and tag models. Each row is one job, one file, and a **Choose file…** button; the text model is a role you must bring a file for, while the tag model also has a copy Myne can fetch.

- **Text model: chat, summaries, writing.** Used for chat answers, summaries and writing help. The recommended starting point is Qwen2.5-1.5B-Instruct (GGUF). This role needs the `.gguf` file plus `tokenizer.json` in the same folder.
- **Speech-to-text model (transcription).** Optional. Myne already ships a speech-to-text model, so this picker is only for replacing it with one of your own. The recommended starting point is whisper-base (multilingual), and the role loads that GGUF file and needs `config.json` and `tokenizer.json` in the same folder. Speech-to-text has its own switch in Settings → Transcription, is on by default, and is not part of the AI beta. See [Transcribing a voice note](/user-guide/attachments-and-import/voice-notes/#transcribing-a-voice-note).
- **Tag model: automatic tag suggestions.** Optional. This is the same model **Verified downloadable models** fetches, and assigning a file in its row under **Outsourced models** is the other way to install it: a tag model you built or downloaded elsewhere goes in this row and the **Suggest tags automatically** switch turns on by itself. Until a tag model is installed the switch says so and stays off. See [Suggest tags](/user-guide/ai/suggest-tags/).

Each role shows a recommended-model name as a link. Clicking it opens the page in your own browser as an operating-system handoff; Myne does not fetch anything. Download the files there, then:

1. Next to a role, click **Choose file…**.
2. Pick the file in the picker (a `.gguf` for the text, speech-to-text and tag roles).

The chosen path is stored on your device only and the file is never copied into your vault. The path must be outside your vault folder; if you pick a file inside the vault tree, Myne refuses it and tells you it must be outside your vault.

Model files are one of three ways to give Myne something to run. Both of the others are chosen under **Choose provider** on the **General** tab: with **On this device** selected you can point Myne at a model runtime already running on this computer, under **Local model runtime**, or you can pick a remote provider from the same dropdown. Both are covered in [Where your AI runs](/user-guide/ai/where-your-ai-runs/), including what leaves your device in each case.

## What "ready" means

Enabling the toggle is not enough on its own. AI is ready only once something is set up to answer: a text model file, a local runtime, or a provider. The AI Chat tab's header names the state you are actually in, and the name is the fix:

- **No provider**: AI is on and nothing is set up to answer at all. This is the only state where that label is the truth. Choose a model file or name a provider in this panel.
- **No model**: something is named but there is nothing to run: no local file for the text role, or a provider with no model chosen from its list.
- **No API key**: a provider is named and this device holds no key for it.
- **Consent needed**: this device has not accepted the approval to send, so no request is sent. Nothing is sent until you accept it.
- **Not answering**: what you set up is not responding: a runtime that is not running, a provider that is unreachable, or a request that was not answered in time.
- **Key rejected**, **Out of credit**, **Refused**, **Not allowed**, **Not working**: a request went out and the answer was not usable. The key is not accepted at the provider, the account there is out of credit, the request was refused by policy, this device's own controls bar that request class, or a fault Myne could not classify. The panel repeats the reason the provider gave.
- **Unavailable**: this build of Myne was compiled without local AI, so nothing here can run.
- **Ready**, or the provider's name: set up and working. With a provider named, the header shows its name instead of "Ready", so you can see at a glance where your questions are going.

With AI off there is no header to read: the AI Chat tab is not shown at all.

## Excluding folders

On a computer, the **Excluded folders** box sits under **What AI can read** on the **Limits** tab. It lets you name folders that AI must never read or index. Enter one folder path per line. A note is excluded when its folder is one you listed or is nested inside one, so excluding `Private/` also excludes everything under it. The match ignores case, so a folder stays excluded regardless of how you capitalized the path.

Exclusion is enforced on every AI path, and every AI surface checks it before the model is ever called. A note in an excluded folder is never read, never summarized, never used to ground a chat answer, and never offered tag suggestions or writing help.

The list is editable on a phone too, in **Settings → AI** under **Excluded folders**, so the folder you keep out of AI is a control you can change on the device you use most rather than one you inherit. It is the same list on every device: an exclusion you add on a phone reaches your computer, and the same list is what the refusal path honours there.

**Excluding a folder travels to your other devices, and un-excluding one does not travel at all.** The exclusion list only ever grows when devices sync: a folder you exclude here shows up as excluded everywhere, which is what stops a second device from indexing something the first was told to leave alone. The same rule makes a removal hard to keep. On a vault that syncs, taking a folder off the list is undone by the next sync round, because the other side still carries the entry and the two lists are combined rather than compared. Doing it on every device does not help either: whichever device syncs first brings the entry back. So treat an exclusion as permanent for as long as the vault syncs, and if you need one undone, say so on the issue tracker rather than working around it. On a vault that has never been synced, a removal simply holds. The CLI exclusion list works the same way, for the same reason.

Myne can remember a large but limited number of folders across all of its folder lists together. If you reach that limit it says so when you add one, and deleting a folder you no longer need makes room.

## What the assistant remembers

Agent runs can remember things about you between runs: facts they learned while working, such as how you like answers written. This memory is off the same switch as everything else on this page. A vault that never turned AI on carries no memory at all.

You do not approve each thing it remembers. Instead, everything it writes is visible and editable, in two places. The **memory button** in the AI Chat tab header opens the live list beside the conversation. **Settings → AI** holds the full panel (on a computer, on the **Advanced** tab, with the list under **Memory** as **What the assistant remembers** and the voice preferences under **Preferences**): the same list with edit and delete, a **Clear all memory** button that removes every entry after a confirm, and a voice-preferences editor, one instruction per line, for standing rules about tone, length, or language. A run that wrote something says so on its own turn with a one-line marker, so the write is never silent.

Three properties are worth knowing. First, at most one entry per run: a run cannot fill your memory in one go. The roster holds at most 100 entries; when it is full, new entries are refused until you edit or delete one. Second, memory only learns from notes AI was allowed to read. The run that learns is the same run whose reading the exclusion box above constrains, so anything remembered came from notes AI could see. There is no second exclusion check at the moment of remembering; the boundary is the reading, not the writing. Third, memory entries and voice preferences are vault content like notes: encrypted at rest, synced to your other devices, and included in backups.

## Limits

On a phone, "turning on AI" means turning on sending. There is no on-device
model to fall back to, so with the switch on and a provider named, the text of
the notes involved in each request leaves the device. Turning the switch off, or
setting the provider back to none, stops that; the second also removes the key
and this phone's approval.

Turning on AI adds a model runtime to the Myne process. That process holds your decrypted notes and keys, and the model is not isolated from them; a model file you download is untrusted input that Myne does not vouch for. Turning the toggle on does not by itself send anything anywhere: that depends on what you name, and [Where your AI runs](/user-guide/ai/where-your-ai-runs/) is where that choice is made and explained. Excluding a folder keeps its notes out of AI reading, but it is a Myne-level control rather than an operating-system boundary, and it does not protect the folder against malware already running on your device, which can read app memory regardless. The encrypted search index Myne builds for finding your notes is a rebuildable local cache; it is never uploaded. Full detail is in [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
