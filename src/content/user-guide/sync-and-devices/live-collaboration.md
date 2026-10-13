---
title: "Live collaboration"
category: "sync-and-devices"
updated: 2026-10-13
summary: "See the other people editing a note at the same time: their cursor, their selection and their name, live, while the note is open. Covers the remote cursor, the Who's here tab, name labels and click to jump, what a name beside a participant means, and the fact that presence is ephemeral while the saved note stays the source of truth."
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

## What a name means

A name beside a participant is a label Myne works out on your own device, from what this vault knows about the device a frame came from, rather than a name taken on trust from the frame itself. Where Myne can tie that device to a member of this vault, the label is that member's name. Where it cannot, it falls back to the device's own name, and to a short code when the device has no name either.

That name is a label rather than a proof of authorship. A device is labelled with the member it is recorded as belonging to, and that record is signed by that member, so another member cannot record your name against a device of their own. It still does not tell you who typed a given change: the label resolves a device to a name, and it does not vouch that the person was at the keyboard. Nothing a peer signs about itself is part of this release either, so the name is a well-founded hint about who is here, not evidence about who wrote what.

## Limits

- **Presence is ephemeral.** Cursors, selections and the Who's here list exist only while the note is open and a connection is live. Nothing about them is stored, synced or backed up, and they cannot be recovered later.
- **A colour is not a security identity.** The colour is a stable, device-chosen recognition aid. It is not cryptographic and it proves nothing about who a person is; do not read access or trust into a colour.
- **A name label is a label, not a proof.** The name is resolved from Myne's own record of what a device is, not from a signature over the edit. It names the member the device is recorded as belonging to, and it does not prove who typed a given change. It reaches the people already editing the note and no one else. Treat it as a well-founded hint about who is here, not as evidence about who wrote what.
- **Live collaboration needs sync and the note open.** It works between enrolled devices of a vault, and only while someone has the note open. Editing the same note from two places without a live connection still converges, but through the ordinary sync path rather than in real time.
- **What the server sees.** The room the edits travel through is addressed by an opaque, per-note identifier the server cannot reverse to a note, and the frames are sealed so the server reads no note text, no cursor and no name. What it can observe is that a vault has active editing, and roughly when, which is part of the sync exposure described in [How sync works](/user-guide/sync-and-devices/how-sync-works/).
- **Not on the web client yet.** Presence is delivered to the installed desktop and mobile clients. The browser client edits the same notes and syncs them, but does not yet show live cursors.
