---
title: "Pop-out windows"
category: "editor-and-writing"
updated: 2026-09-05
summary: "Open a note in its own operating-system window, for a second monitor. Desktop only. A pop-out is as private as the main window, no more and no less."
tags: ["editor"]
---

Pop a note out into its own operating-system window and move it to a second monitor, the way you would any other window. The note you pop out leaves its tab and lives in the new window; opening it again brings that window forward rather than making a second copy. Pop-out windows are a desktop feature, because the web and mobile clients cannot open operating-system windows.

## Popping a note out

You need an unlocked vault and the note open.

1. Open the command palette and run "Open note in new window", or open the note's "…" menu and choose "Open in new window".
2. Or drag the note's tab out of the window and drop it on the desktop or another monitor.

The note moves into the new window. Its tab in the main window closes, because a note is open in exactly one place at a time.

## Bringing a pop-out back

Closing the pop-out window closes the note, the same as closing a tab. To edit the note in the main window again, open it there.

If you have "reopen last session" turned on, your pop-out windows and their positions come back the next time you open the vault. If the monitor a window was on is gone, the window reappears on your primary display instead of off-screen.

## Limits

A pop-out window is exactly as private as the main window, no more and no less. It holds the same decrypted note text, so the same protections and the same gaps apply:

- **Screen capture.** On Windows 10 (May 2020 update) and later, Myne asks the system to exclude its windows from screen capture, and a pop-out is excluded like the main window. On macOS and Linux the operating system offers no such exclusion, so a pop-out is capturable there, exactly as the main window already is. Myne cannot make a second window more private than the first.
- **Locking.** When the vault locks, whether from the idle timeout, a manual lock, or quitting, every pop-out window is torn down along with the main window. A locked vault leaves no note text on screen in any window.
- **This device only.** Which notes you had popped out, and where their windows were, is remembered on this device only. It is never synced, so it is not sent anywhere.
