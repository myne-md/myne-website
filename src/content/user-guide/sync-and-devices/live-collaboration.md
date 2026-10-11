---
title: "Live collaboration"
category: "sync-and-devices"
updated: 2026-10-10
summary: "See the other people editing a note at the same time: their cursor, their selection and their name, live, while the note is open. Covers the remote cursor, the Who's here tab, name labels and click to jump, and the fact that presence is ephemeral while the saved note stays the source of truth."
tags: ["sync", "devices"]
---

When someone else is editing the same note as you, you see them: a cursor, a selection and a name, moving as they type. This works between the devices you own and, in a shared vault, between you and the people you share it with.

## What you see

- **A remote cursor.** A thin coloured bar where the other person's caret is, with their name in a small label beside it. The label is always there, so a colour is never the only thing telling you who is where.
- **A remote selection.** The text they have selected, highlighted in their colour.
- **The Who's here tab.** The right panel has a **Who's here** tab listing everyone editing the open note, one row each with their name and their colour. It is empty, and shows a short notice, when you are alone.

The colour is a recognition aid: a stable colour per person, chosen on your own device, so the same person keeps the same colour and you can tell two people apart at a glance. It is not an identity and it proves nothing.

## Jump to someone

Click a row in **Who's here** to move your view to that person's cursor. It jumps once and stays put: it does not lock your view to theirs, so you can keep reading or writing where you choose.

## When the note is saved

Presence is live and short-lived. Cursors and selections are sealed end to end and relayed through your sync server, which sees the frames pass but can never read them; they are never stored, and never written to your vault or a backup. What is saved is the note itself: the moment anyone stops typing, the note's saved content is what everyone sees, and it is the only thing that is kept. If a connection drops for a moment, the cursors fade after a short pause and come back when the connection does; the note's content is unaffected either way.

A name label is what the editing session reports about itself, shown to the people already in the note. Treat it as a helpful guess about who is there, not as a verified name.

## Limits

- **Presence is ephemeral.** Cursors, selections and the Who's here list exist only while the note is open and a connection is live. Nothing about them is stored, synced or backed up, and they cannot be recovered later.
- **A colour is not a security identity.** The colour is a stable, device-chosen recognition aid. It is not cryptographic and it proves nothing about who a person is; do not read access or trust into a colour.
- **A name label is reported, not verified.** The label is what the editing session says about itself. It is shown to the people already editing the note and to no one else, and it is not a signature or a proof of identity.
- **Live collaboration needs sync and the note open.** It works between enrolled devices of a vault, and only while someone has the note open. Editing the same note from two places without a live connection still converges, but through the ordinary sync path rather than in real time.
- **What the server sees.** The room the edits travel through is addressed by an opaque, per-note identifier the server cannot reverse to a note, and the frames are sealed so the server reads no note text, no cursor and no name. What it can observe is that a vault has active editing, and roughly when, which is part of the sync exposure described in [How sync works](/user-guide/sync-and-devices/how-sync-works/).
- **Not on the web client yet.** Presence is delivered to the installed desktop and mobile clients. The browser client edits the same notes and syncs them, but does not yet show live cursors.
