---
title: "Let an AI tool read your vault"
category: "ai"
updated: 2026-10-27
summary: "External access lets a program you configure reach a set of folders you approve, through the myne-mcp helper that ships inside Myne. It is off until you turn it on, read-only in this build, approved device by device, and what the connected tool does with what it reads is outside Myne."
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
4. Choose which folders it may read. The form counts what the choice covers as you make it: **Shares 3 notes in 2 folders.** Everything is shared unless you **Leave out** a folder, and leaving one out also leaves out everything inside it. This is the one place in the app where the whole vault is on the table, so read the count before you press **Approve**.
5. Press **Approve**. The set is frozen at that moment: a folder you create afterwards starts outside it, and External access later says how many there are and offers a one-action **Add**.
6. Put the connection into your client's MCP configuration. The section's **Setup snippet** shows what to paste: the command is `myne-mcp`, which is already on your `PATH` because the app installed it there, and the connection name in it must match the name you approved. Myne writes that snippet; the client reads it.
7. Ask the client to use it. Its first call is answered by the running app, so the vault has to be unlocked and the app has to be open.

The section then lists the connection, what it may read, and when it last used the grant: **Approved 27 October 2026. Last used 2 minutes ago.** A connection you no longer want is removed with **Revoke**, which takes effect on its next call rather than at the next restart, and leaves the other connections alone.

## What a connection can do

Reads, and only reads, in this build. The connection list says so in as many words: **May write nothing. This build grants reads only.**

The verbs a client sees are four: search the folders it was granted, read one note from them in full, list those folders with how many notes each holds, and report whether the vault is open. Nothing reaches outside the vault: no file system, no attachments, no network fetch, no shell, no clipboard. That is a property of the shipped list of verbs rather than a setting, so a later build cannot add one without you reading about it.

What it can read is a **set of folder paths**, frozen when you approved, compared exactly rather than by prefix: a folder inside a granted one is not automatically granted, and the vault root is a folder like any other, granted only if you approved it. A note you later file into a granted folder is inside the grant; a folder you created after the approval is not, until you add it.

The scope is resolved in the app from the approval it stored, by name, on every call. A client cannot widen its own scope, name a folder it was not granted, or claim another connection's name to borrow its scope.

### When the door will not answer

Three states are told apart, because each one has a different fix, and each arrives as a refusal the client can show you rather than as a failure it can only report as broken:

- The vault is **locked**: unlock it, and the next call works.
- The door is **off**: either the External access switch or Terminal access is off, and both close it.
- The app is **not running**: start Myne, and open the vault.

Asking a client what tools it has keeps working in all three states, because that answer comes from the helper rather than from the app. A refused call still counts against the same rate limit the terminal client is held to, so a client that retries in a loop is throttled rather than free to probe.

## Limits

- **The connection name is a label, not a password.** Any program running as you on this machine can present any name it likes, and Myne cannot tell one program from another under your account. The approval decides what is shared with whom; it is not a check that the program asking is the one you meant.
- **Approvals are per device.** They are stored on the device you made them on. A second computer or a phone starts with none and has to be asked again, so approving on this machine shares nothing with your other machines.
- **What the connected tool does with what it reads is outside Myne.** That program runs on your machine, ships separately, has its own network access, and is not covered by Myne's no-egress guarantee, which binds the app's own window and nothing else. Once text is handed over, where it goes is the other program's decision. This is stated on the section itself and again at the moment you approve, because that is the moment the decision is made.
- **Nothing is inherited, and nothing is retroactive.** An approval covers the folders you chose at that moment and no others. Revoking is the only way to take a grant back, and it takes it back for that name only.
- **Reads only.** Myne cannot be changed through this surface in this build, so a connected tool cannot corrupt a note, move one, or write one. That also means it cannot do anything for you: it can look, not act.
- **Developer mode is not a security boundary.** It hides and reveals settings. Turning it off does not turn External access off, and anything you left on behind it keeps running. Switch the feature off from its own control first.

For the wider picture of what AI in Myne may and may not see, including the models that run on your device and what a remote provider receives, see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/).
