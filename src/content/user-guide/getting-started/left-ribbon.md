---
title: "The left ribbon"
category: "getting-started"
updated: 2026-09-13
summary: "The left ribbon is a thin column of icon buttons at the window's far-left edge. Pin the commands you use most, reorder them, hide the ribbon, or turn it off for a vault."
tags: ["basics", "sidebar", "workspace"]
---

The left ribbon is a thin column of icon buttons along the far-left edge of the window, separate from the note sidebar. Each button runs a command, so the handful of actions you reach for constantly stay one click away instead of behind the command palette. The ribbon belongs to the vault, so a different vault can keep a different set of buttons.

## What starts on the ribbon

A new vault starts with three buttons: **New note**, **Today's note**, and **This week's note**. You can remove any of them, and add many more.

If the ribbon is empty because you removed everything, it stays empty. Myne does not put the default buttons back.

## Pinning a command

1. Open the command palette with `Command/Ctrl + K`.
2. Find the command you want.
3. Select the pin icon on its row, or press `Alt + P`.

The command appears on the ribbon. Only commands that can live on a ribbon offer the pin; destructive commands such as deleting a workspace do not.

## Removing and reordering

- **Remove a button:** right-click it and choose **Unpin from ribbon**.
- **Reorder:** drag a button up or down the ribbon. With the keyboard, focus a button and press `Alt + Up` or `Alt + Down`.
- **From Settings:** open **Settings → Appearance → Left ribbon** for the full list. Each command has a checkbox to show or hide it and arrows to move it.

The order you set is saved with the vault.

## Hiding and showing the ribbon

Turn on **Show left ribbon** in **Settings → Appearance** to show the ribbon on this device, or turn it off to reclaim the edge. The ribbon also hides on its own in focus mode and when the window is too narrow, and collapsing the note sidebar does not hide it.

## Limits

The ribbon is how one device arranges its own chrome. The choice of pinned commands travels inside your encrypted vault, but it does not merge between devices: once each device has an arrangement, changing it on one does not change it on the other. A device that opens the vault for the first time may start from the arrangement already stored in it. The ribbon only appears in the editor, after the vault is unlocked, and a command that is not available in the current state either drops off the ribbon or appears greyed out with an explanation rather than running.
