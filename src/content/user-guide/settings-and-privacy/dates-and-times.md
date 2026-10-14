---
title: "Dates and times"
category: "settings-and-privacy"
updated: 2026-08-30
summary: "How to choose the way Myne writes dates and times, which of those choices travel with your vault and which stay on the device, and what the time zone setting does and deliberately does not do to the times you write in a note."
tags: ["settings"]
---

Myne shows dates in a lot of places, and three settings decide how they are written. They live in Settings, under Editor.

## Prerequisites

You need an unlocked vault. These settings are stored in the vault's encrypted preferences, so they are not available on the lock screen.

## Choose a date format

1. Open **Settings**, then **Editor**.
2. Find **Date format**.
3. Pick one. Each option is shown as a worked example of the same date, so you are choosing the output rather than a name for it. **Match language** follows the language you chose for Myne, not your operating system's region.

The choice applies wherever Myne prints a date: a due date on a task line inside a note, the same task's row in the Tasks panel, a date column in a saved view, an attachment's date. It does not change anything written in your notes. What is stored is always the same, and only the way it is drawn changes.

## Choose a time format

**Time format** is the same idea with fewer options: **Match language**, **24-hour**, or **12-hour**. It applies to times Myne prints, including a time carried on a task's due date or reminder.

## Set a time zone

**Time zone** takes an IANA zone name such as `Europe/Berlin`. Leave it empty to follow the device you are on, which is what most people want.

This setting is narrower than it looks, and the narrowness is the point.

It decides two things. What counts as **today**, which is what puts a task in the Today bucket and what the daily note action opens. And how a real moment is printed, such as the date an attachment was added, which is a fixed point in time that genuinely reads differently in different zones.

It changes nothing about a time you write in a note. A reminder written for 09:00 is 09:00 wherever you are. Myne never converts it, never stores an offset, and never stores a zone alongside it.

## What travels and what stays

**Date format** and **Time format** travel with your vault. Choose one on a computer and your phone shows it too, once it has synced. There is no second choice to make.

**Time zone** is settled per device. When two devices disagree, each keeps its own: the zone you set here never overwrites the one on your computer. That is deliberate, because the right zone is a property of where a device is, and a phone that travels and a computer that does not should not have to agree.

One thing worth being exact about, because it is easy to read the sentence above as more than it says. The zone is stored in your vault's encrypted preferences, and with sync on that file travels to the server like the rest of your vault. What is inside it, this setting included, stays unreadable there. And a device joining an existing vault for the first time starts from the vault's stored preferences, this value among them, until it sets its own.

## Finding a date you can see

When you search inside a note with Find, Myne looks for the text as it is stored. A due date is stored as `2026-08-01` however you have chosen to read it, so if you type the date the way it appears on screen and get nothing, Myne searches for the stored form instead and tells you in the find bar that it did.

Replace is switched off while that is happening. The text being matched is the stored form, so a replacement written the way you read dates would leave a date Myne can no longer understand, and the task would quietly drop out of every dated view. Opening Find shows you the stored text on the line, so if you do want to replace a date, that is the text to type.

This works whichever date format you have chosen, and in whichever language you are reading Myne in. One thing it does not do: if your language prints its own numerals, Find needs the date typed in those, not in the Western ones.

## Limits

These settings change presentation only. They do not encrypt anything, protect anything, or change what is stored: nothing here alters a byte in a note, and nothing here changes what the server can read, which for the encrypted preferences file is nothing. The server does hold that file's ciphertext, its size and a version counter, as it does for everything else you sync.

The date and time formats are two of the settings the AI can change for you. Ask in the AI Chat tab, as [Let the AI change your notes](/user-guide/ai/agent-runs/#changing-settings) describes, and approve the change on the review screen.
