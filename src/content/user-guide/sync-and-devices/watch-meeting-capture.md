---
title: "Record a meeting from your watch"
category: "sync-and-devices"
updated: 2026-10-03
summary: "Record a meeting from an Apple Watch paired to your iPhone. The watch shows a bright recording state with a live elapsed time while it captures the room, then sends the audio to the phone in chunks. The phone seals each chunk as it arrives even while the vault is locked, and the next unlock writes a meeting note with the audio and an on-device transcript."
tags: ["devices", "attachments", "privacy"]
---

You can record a meeting from an Apple Watch paired to your iPhone. Tap start on the watch and it shows a bright recording state with a live elapsed time while it captures the room; tap stop and it sends the audio to the phone in chunks. The phone seals each chunk as it arrives, even while the vault is locked, and the next time you unlock the phone Myne writes a meeting note with the audio and an on-device transcript and opens it.

## Prerequisites

- An Apple Watch paired to the iPhone that has your Myne vault.
- The Myne companion app installed on the watch.
- The vault unlocked on the iPhone at some point, so the note can be written. You do not need to unlock it before or during the recording.

## Recording from the watch

1. Open the Myne app on your watch and tap **Record**. The watch microphone records the room; the phone does not need to be out of a pocket, and this is not a phone recording.
2. The watch shows a bright recording state with a running elapsed-time clock, so you can see at a glance that it is capturing. Keep the screen on: recording is foreground only, and there is no background recording if the screen turns off or you leave the app.
3. Tap **Stop** when the meeting ends. The watch stops capturing and begins sending the audio to the paired iPhone in chunks.

## What happens on the phone

The watch sends each chunk of audio to the paired iPhone, and the phone seals every chunk as it arrives. The watch itself holds no vault key and runs no cryptography; sealing happens on the phone, which does have the vault. Because of that split, a locked phone does not lose a recording: the chunks are sealed on arrival and wait there.

The meeting note does not appear while the vault is locked. The next time you unlock the phone, Myne writes a meeting note containing the audio as an encrypted attachment and an on-device transcript of what was said, then opens the note for you. If you never unlock the phone, the recording stays sealed on it and the note is not written.

## Limits

Recording is foreground only. The watch screen stays on for the whole recording and the run ends if the screen turns off or you leave the app. There is no background recording, so the app must stay open on the watch for the whole meeting.

The watch holds no vault key and runs no cryptography, so nothing is sealed until a chunk reaches the paired phone. A recording is protected by the phone being there: if the watch is separated from its paired iPhone, the audio is not sealed into the vault.

The phone must be paired to the watch for a recording to be carried across, and it must be unlocked at some later point for the note to be written and opened. A recording made while the phone is locked is not lost — it is sealed on the phone and waits — but there is no note until you unlock.

The transcript is generated on your device by a small model, not sent anywhere, and it may contain errors. Treat it as a best-effort machine reading of the audio rather than a verbatim record, and check it against the audio when the wording matters. The original recording always stays attached, so you can listen back and correct it.

The note is an ordinary encrypted note with an ordinary encrypted audio attachment, so the standard attachment limits apply. See [Attachments](/user-guide/attachments-and-import/attachments/) for how they are stored and [Voice notes](/user-guide/attachments-and-import/voice-notes/) for the recorder and transcription boundary on your other devices.
