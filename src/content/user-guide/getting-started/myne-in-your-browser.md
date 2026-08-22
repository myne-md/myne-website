---
title: "Myne in your browser"
category: "getting-started"
updated: 2026-08-22
summary: "Myne runs in a desktop browser at app.example.com as a second client, with nothing to install. It is the same app compiled for the browser, holding an encrypted copy of a synced vault. You sign in with your account number and approve the browser from a device that is already signed in."
tags: ["basics", "sync", "devices", "privacy", "security"]
---

Alongside the desktop app, Myne runs in a desktop browser at `app.example.com`, with nothing to install. It is the same application compiled to run in the browser: the same interface, the same protocol, holding an encrypted copy of a vault that reaches it over sync. You sign in with your account number and a master password, then approve the browser from a device that is already signed in to the account. This article covers how to sign in, what the browser client is and is not, and one difference in how its code is delivered that is worth understanding before you rely on it.

## Before you start

The browser client is a window onto a synced vault, never a standalone one. Because of that, it has prerequisites the desktop app does not:

- **Sync, and a server to reach.** The browser client is a window onto a synced vault, so it needs an account the sync server already knows. Creating a vault, recovering one with your recovery phrase and resetting a forgotten password all work here as of the 2026-08-15 change, and the 24 words are generated, shown and typed in the browser on those paths. That is a real difference from the desktop app in one respect only, and it is the one below: the code doing it arrives from a server on every load. If you would rather the phrase never touch a browser, do those steps on the desktop app; see [Install Myne](/user-guide/getting-started/install/).
- **Sync set up on the account.** The browser reaches your vault only over a sync server. If you have not connected a server yet, start with [Turn on sync](/user-guide/sync-and-devices/turn-on-sync/).
- **Another device already signed in.** A browser enrolls as a new device and stays pending until an existing device approves it — the browser cannot approve itself. Keep a desktop, mobile, or already-approved browser handy to confirm the new one.
- **A desktop browser.** Phones and tablets are refused before anything loads, because the browser client is the desktop-browser client and the native mobile app is a better fit on a touch device.
- **Accepting the beta terms.** A device does not sync until the person at that device has accepted them, and this client cannot reach your vault any other way.

## Signing in from a browser

1. Open `app.example.com` (or your own address, if you self-host the client) in a desktop browser. There is nothing to download.
2. Read the beta terms and accept them. Myne shows them before anything else here, because sync is how this client reaches your vault at all. In short: sync is a free beta with no warranty and no uptime promise; if you lose your password and your recovery phrase your notes cannot be recovered; your account keeps working when the beta ends; and Myne cannot read what you store, so it cannot screen it. The acceptance is recorded on this browser only — it is not carried across by sync, so each new device is asked once — and Myne asks again if the terms change.
3. Enter your account number. The field formats it into its grouped display form as you type, and Myne checks it on your device before sending anything — a mistyped number is caught locally, not by asking the server.
4. Enter your master password. Myne derives your keys from it in the browser; the raw account number and the password are handled on your device, not sent as-is to the server.
5. The browser enrolls as a new device and waits. This pending state is the normal outcome, not an error — a new browser cannot sync until another device approves it.
6. On a device already signed in to the account, approve the new browser. [Add a device](/user-guide/sync-and-devices/add-a-device/) covers the approval, and [Managing devices](/user-guide/sync-and-devices/managing-devices/) covers the device list.
7. Once approved, the browser pulls the vault and opens the editor. What it downloads is ciphertext, decrypted on your device.

## What runs in the browser

The browser client is not a rewrite. It compiles the same source as the desktop app, and it uses the same cryptographic code — the Myne protocol crate, compiled to WebAssembly and run in the page. It reads and writes byte-identical encrypted blobs: the same formats, the same keys, no new cryptography of its own. A note written on your desktop and a note written in the browser are the same encrypted file.

Its local copy lives in the browser's own storage (the Origin Private File System, or OPFS), scoped to `app.example.com` and to that browser profile. The internal file layout differs slightly from the desktop's folder — the encrypted contents inside do not.

Two behaviours follow from running in a browser:

- **One tab per vault.** A vault is held open in a single tab. If you open a second tab on the same vault, it reports that another tab holds the vault rather than taking over, so two tabs never write over each other.
- **Desktop browsers only.** The client refuses phones and tablets by detecting the device class, not by reading a browser's user-agent string or the window width. A desktop window narrowed to a quarter of the screen is still supported.

## Limits

Your notes are encrypted in the browser exactly as they are on the desktop — the same code, the same byte-identical files. The difference this section is about is not how your notes are encrypted; it is how the client's own code reaches you.

The desktop app is downloaded once as a file you keep, with a published hash you can check before you ever run it, and the copy on your machine stays there for you to inspect. The browser client is different: the page re-delivers it from the server on every visit, you retain no artifact to check, and your browser verifies no signature on it. Whoever operates the address serving the client can, in principle, send a modified version to one specific account and the normal version to everyone else — and because that code runs in the same page you type your master password into, that would be a full compromise of that session. This is a real and weaker trust boundary than the desktop app has (`docs/threat-model.md` A15 / TB11), and the browser cannot close it from inside the page.

What Myne does about it is detection and containment, not prevention. The bundle is reproducible from source, and the hash of every released bundle is published to a public append-only record, so a substitution can be caught after the fact. But catching it afterward does not stop it from reaching you, and the app does not warn you in the moment. Myne also keeps the client open source under the AGPL, so you can build and serve your own copy: self-hosting the client removes the outside operator from the path for your own use — though not for anyone else using an instance you run.

If the strongest delivery guarantee matters for your situation, use the desktop app, which does not have this property.

Two smaller points. The browser's local copy is a cache of a vault that lives on the sync server: if the browser clears that storage, nothing in the vault is lost, and the browser re-syncs and re-establishes itself as a device. And because sync is required here, closing the tab is not a full sign-out — [Delete a vault](/user-guide/settings-and-privacy/delete-a-vault/) erases the browser's local copy when you want it gone. For the encryption model itself — what is protected, what is not, and where the guarantees stop — see [How sync works](/user-guide/sync-and-devices/how-sync-works/) and [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).
