---
title: "Meeting notes"
category: "attachments-and-import"
updated: 2026-10-07
summary: "Record a meeting on your computer as a single session. It captures your microphone and, on macOS 14.2 and later, your computer's own audio, mixes them into one recording, transcribes it on your device, and writes a new note with the audio and the transcript."
tags: ["attachments", "notes", "privacy"]
---

You can record a meeting on your computer as a single session. It captures your microphone and, on macOS 14.2 and later, the sound your computer is playing, mixes them into one recording, transcribes it on your device, and writes the result into a new note. The feature sits behind **Developer mode** while its recording path is still being verified on real hardware.

## Recording a meeting

Start a session with the **Meeting session** command in the command palette. While it runs, a recording bar shows the elapsed time and a live input level, and a menubar indicator keeps the running state and a **Stop** control visible while you are working in another application.

Choose **Stop** to finish. Myne writes a new note containing the audio as an encrypted attachment and an on-device transcript, then opens it. The transcript sits under a heading with a notice that it is a machine reading and may contain errors; the audio is kept as an ordinary attachment, so you can listen back and correct it.

## What is captured

- **Your microphone** is captured on every platform.
- **Your computer's audio** — what the meeting is playing through your speakers — is captured on macOS 14.2 and later, through a system-audio tap. On macOS below 14.2, and on Linux, the session records the microphone alone and states the limitation before it starts.

The two sources are mixed into one mono recording. They run on separate clocks, so nothing tries to align them sample-for-sample; both are resampled to a common rate first, so the mix is not skewed.

## Silence and permissions

A denied system-audio permission does not raise an error — the tap simply delivers silence. The session therefore watches each source separately and warns when the system-audio side is silent while your microphone is live, which is the signature of a missing permission. A quiet microphone on its own is normal and is not warned about.

## Limits

- The feature sits behind **Developer mode**. Turning the setting off does not stop a session that is already running.
- Windows system audio is not captured yet; a Windows session records the microphone alone.
- The transcript is generated on your device by a small model and is not sent anywhere. Treat it as a best-effort machine reading rather than a verbatim record.
- The note is an ordinary encrypted note with ordinary encrypted audio attachments, so the standard attachment limits apply. See [Attachments](/user-guide/attachments-and-import/attachments/) and [Voice notes](/user-guide/attachments-and-import/voice-notes/).

Recording a meeting captures other people's speech. Make sure you are allowed to record before you start, and see [AI privacy and limits](/user-guide/ai/ai-privacy-and-limits/) for how the on-device transcription boundary works.
