---
title: "Let an AI tool read your vault"
category: "ai"
updated: 2026-10-29
summary: "External access lets a program you configure reach your vault except for the folders you leave out, through the myne-mcp helper that ships inside Myne. It is off until you turn it on, reads only in this build, approved device by device, and what the connected tool does with what it reads is outside Myne."
tags: ["ai", "privacy", "security"]
---

External access opens your unlocked vault to one program you configure yourself, usually an AI client that speaks the Model Context Protocol. Myne ships the half that talks to that client (`myne-mcp`) inside its own bundle, and the half that decides what may be read stays in the app, behind the same door the `myne` terminal client uses. It is off by default, it grants reads only in this build, every approval is stored on the device you made it on, and Myne cannot see what the connected tool does with what it reads.

This is the surface to reach for when you want an assistant you already run to look things up in Myne, rather than asking Myne's own chat to do it. If you want Myne's chat instead, see [Turning on AI](/user-guide/ai/turning-on-ai/).

## Prerequisites

- The desktop app on a computer. External access is absent on the web client and on a phone, and an absent control is not the same as a disabled one: those clients have no sidecar to run.
- **Developer mode** on: Settings → **About** → **Developer mode**. The whole AI panel, External access included, lives in the **Developer** group in Settings and that group stays hidden until you turn the mode on. See [Developer mode](/user-guide/settings-and-privacy/developer-mode/).
- The client you want to connect, installed and able to start a program as its MCP server. Myne does not install or configure that program.
- An unlocked vault. The connection list can be read while the vault is locked, but nothing on the other side of it answers until you unlock.

## Turning it on and approving a connection

1. Open **Settings → AI**, choose the **Limits** topic, and find the **External access** section. While it is off, the line under the switch reads **Off. No AI tool can reach this vault through `myne-mcp`.**
2. Turn the switch on. This is the door itself, and it is the **same switch** as Settings → CLI → **Terminal access**: one door with two ways in, `myne` for you and `myne-mcp` for a program you configure. Turning either one off closes both.
3. Press **Approve a connection** and give it a **Connection name**. The name is what the grant is keyed on, so it has to be the name your client sends, not a title you will remember. The form refuses an empty name and refuses `unnamed-client`, because that is what a client with no name of its own arrives as, and approving it would approve every unconfigured client on the machine.
4. Choose which folders it may read. The form counts what the choice covers as you make it: **Shares 3 notes in 2 folders.** Everything is shared unless you **Leave out** a folder, and leaving one out also leaves out everything inside it. Folders you have already left out of Myne's own AI, or of the terminal client, are left out here too and are shown as such, so this list starts from the exclusions you have already made rather than from nothing. This is the one place in the app where the whole vault is on the table, so read the count before you press **Approve**.
5. Press **Approve**. What you approved is the list of folders it may **not** read, so a folder you create afterwards is readable without asking you again. If that is not what you want for a new folder, add it to the connection's list of folders left out; the connection row says how many are left out and lets you change them.

   The same form has an optional **May write in** list, and it is the stricter half of the decision. It offers only folders that stay readable, an entry must match a folder exactly, and an empty list means the connection may write **nowhere**, which is where it starts. A folder you create later is not writable until you name it here, and unlike the read side nothing is covered by default.
6. Put the connection into your client's MCP configuration. The section's **Setup snippet** shows what to paste: the command is `myne-mcp`, which is already on your `PATH` because the app installed it there, and the connection name in it must match the name you approved. Myne writes that snippet; the client reads it.
7. Ask the client to use it. Its first call is answered by the running app, so the vault has to be unlocked and the app has to be open.

The section then lists the connection, what it may read, and when it last used the grant: **Approved 27 October 2026. Last used 2 minutes ago.** A connection you no longer want is removed with **Revoke**, which takes effect on its next call rather than at the next restart, and leaves the other connections alone.

## What a connection can do

Two halves, and the second is much narrower than the first. **Reading** covers the folders you did not leave out and nothing else. **Writing** covers only the folders you named on the approval form, matches them exactly, and cannot reach a folder it may not read. A connection that was approved without a write folder can look and cannot change anything.

**It reads with four verbs**: search the folders it was granted, read one note from them in full, list those folders with how many notes each holds, and report whether the vault is open. **It writes with four more**: create a note in a named folder, append text to the end of an existing note, replace an exact passage in one, and move a note between folders. Nothing reaches outside the vault: no file system, no attachments, no network fetch, no shell, no clipboard, and no verb that deletes or renames anything, because an operation whose result you cannot see is not something a named grant can authorise. That is a property of the shipped list of verbs rather than a setting, so a later build cannot add one without you reading about it.

### What a write actually does

Every write is checked by the app, not by the client. Before a single byte changes, the app re-reads the target note from disk, re-checks the grant against the vault as it is at that moment, and takes a restore point, which is the same snapshot history your own edits enter: undo is yours, and it is in the place you already look. **If the restore point cannot be taken, the write does not happen.** A note whose editor tab is open is refused rather than merged, so a change arriving while you are typing cannot disappear into a merge you cannot see. An edit names an exact passage, and a passage that has moved since the client read it is refused rather than applied to the wrong text.

**A create has no restore point, and that is arithmetic rather than an omission**: before it runs there is no note to snapshot and no id to snapshot it under. Undoing one means deleting the note, and no verb here deletes, so only you can remove what a connection created.

### When a write lands outside the grant

Nothing is written and nothing is silently dropped. The attempt becomes a **review card** on this screen naming the connection, the folder, the verb and the client's own sentence. **Allow** extends that one grant by exactly that one folder, never past what the connection may read; **Dismiss** drops the row and changes no grant, and the client is not told, so its next attempt asks you again rather than being quietly narrowed. A card is a proposal: nothing has been applied while it exists, and accepting re-reads the grant as it is at that moment, so a card left in a synced backup cannot re-apply a decision you have since changed.

What it can read is the whole vault **minus** a set of folder paths you left out. An entry takes its whole subtree, so leaving out `private` also leaves out `private/2026`, while a folder named `privatestuff` is a different folder and stays readable. The vault root is a folder like any other: leaving it out stops notes filed at the top level from being read and leaves every named folder alone.

The scope is resolved in the app from the approval it stored, by name, on every call, together with the folders you had already left out of Myne's own AI and of the terminal client. A client cannot widen its own scope, name a folder it was not granted, or claim another connection's name to borrow its scope. An approval has no expiry: it stands until you revoke it.

### When the door will not answer

Four states are told apart, because each one has a different fix, and each arrives as a refusal the client can show you rather than as a failure it can only report as broken:

- The vault is **locked**: unlock it, and the next call works.
- The door is **off**: either the External access switch or Terminal access is off, and both close it.
- The app is **not running**: start Myne, and open the vault.
- The approval **needs re-approving**. An approval made by an earlier build named the folders that *were* readable rather than the folders left out, and Myne will not guess which of the two a stored approval meant, so it refuses rather than answering under the wrong reading. The connection row says so and offers **Re-approve**, which rewrites the approval under the current wording; check what it will cover before pressing it.

Asking a client what tools it has keeps working in all four states, because that answer comes from the helper rather than from the app. A refused call still counts against the same rate limit the terminal client is held to, so a client that retries in a loop is throttled rather than free to probe.

## Limits

- **The connection name is a label, not a password.** Any program running as you on this machine can present any name it likes, and Myne cannot tell one program from another under your account. The approval decides what is shared with whom; it is not a check that the program asking is the one you meant.
- **Approvals are per device.** They are stored on the device you made them on. A second computer or a phone starts with none and has to be asked again, so approving on this machine shares nothing with your other machines.
- **What the connected tool does with what it reads is outside Myne.** That program runs on your machine, ships separately, has its own network access, and is not covered by Myne's no-egress guarantee, which binds the app's own window and nothing else. Once text is handed over, where it goes is the other program's decision. This is stated on the section itself and again at the moment you approve, because that is the moment the decision is made.
- **A new folder is readable by default.** An approval covers your vault except for the folders you left out, so a folder you create afterwards is already covered, and a folder you create as a *sibling* of one you left out is not protected by it. That is the trade this model makes, and it is why the connection row states the count of folders left out rather than a count of folders shared. Revoking is the only way to take a grant back, and it takes it back for that name only.
- **A write grant is not a per-write prompt.** You are not asked to approve each change. What you approved is the folder list and the door, and the compensating controls are the restore point every write to an existing note takes, the refusal path for a note you have open, and the review card for anything outside the list. If you want to be asked each time, name no write folder and let the requests arrive as cards.
- **A connected tool can act, and it reads what it writes.** It can create, append, edit and move inside the write folders, so a note it wrote is content it also saw, and text it copied from anywhere is now in your vault. Deleting a note it created is your act, since no verb here deletes.
- **Developer mode is not a security boundary.** It hides and reveals settings. Turning it off does not turn External access off, and anything you left on behind it keeps running. Switch the feature off from its own control first.

For the wider picture of what AI in Myne may and may not see, including the models that run on your device and what a remote provider receives, see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).
