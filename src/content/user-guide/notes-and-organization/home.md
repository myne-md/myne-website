---
title: "The home surface"
category: "notes-and-organization"
updated: 2026-11-23
summary: "The home surface is a tab you arrange yourself: cards for recent notes, today's tasks, the files you reach for, favorites and more. You choose which cards are there, how wide each one is, and whether Myne opens this surface when the app starts on this device."
tags: ["notes", "workspace"]
---

The home surface is a tab like any other, except that it holds cards instead of a note. It is where a session can start, so the first thing you see is the work you were doing rather than a chooser.

Open it from **Go to Home** in the command palette, or from the **Home** entry in a new tab's destination list. Once it is open it behaves like every other tab: it can sit beside a note in a split pane, it can be pinned, and closing it loses nothing.

## Arranging it

Press **Arrange** on the surface itself. The cards become movable and resizable, and the header changes to **Arrange your home**.

- **Add a card** offers the list of cards this build can draw. Each card you add starts narrow.
- **Remove** takes one card away. The card it draws is not deleted with it: removing the recent-notes card removes a view, not a note.
- **Wide** or **Narrow** sets how much of the row a card takes.
- **When the app opens** is the switch that decides whether this surface is what Myne opens on start. It applies to this device only, so a phone and a computer can answer differently.

Arranging is stored in the vault and syncs, so a layout you set on one device is the layout the others receive. The one exception is that start switch, which is device-local on purpose.

## What the cards are

| Card | What it shows |
|---|---|
| **Recent notes** | The notes you have opened on this device, most recent first |
| **Quick capture** | Starts a note without leaving the surface |
| **Today's tasks** | The tasks due today, from your task notes |
| **Coming up** | What the calendar holds for the next week |
| **Favourites** | The notes you starred |
| **Reference sets** | The folders that hold files, so a file library is one press away |
| **Saved views** | The views you saved in the library |
| **Recent files** | The attachments you opened recently |
| **Writing** | The word counts as the vault grows |
| **Ask the agent** | Opens the agent from the surface |
| **Your vault** | The graph, with a count of the notes in it |

Each card says what is missing rather than showing an empty box: **Nothing is due today.** **No files yet. Import one from the file library.** A card whose folder holds nothing says so in the same voice.

## A card from a newer version

A card a newer build of Myne added stays where it is. The older build cannot draw it, so it shows **Unavailable card** and keeps the position, which means the layout survives a device that has not been updated yet. Nothing is dropped and nothing is reordered silently.

## Limits

The surface is a desktop and mobile surface, not a web one. It reads the same vault as the rest of the app, so a card shows what this device has: a note that has not synced yet is not in **Recent notes** on the other machine.

The start switch is device-local. If you turn it off, Myne goes back to whatever the app opened on before, which is the note list.
