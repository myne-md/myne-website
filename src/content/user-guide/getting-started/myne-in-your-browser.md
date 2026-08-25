---
title: "Myne in your browser"
category: "getting-started"
updated: 2026-08-24
summary: "Myne runs in a desktop browser at app.example.com as a second client, with nothing to install. It is the same app compiled for the browser, holding an encrypted copy of a synced vault. You can create an account here or sign in to one you already have, and how the client's code reaches you differs from the desktop app."
tags: ["basics", "sync", "devices", "privacy", "security"]
---

Alongside the desktop app, Myne runs in a desktop browser at `app.example.com`, with nothing to install. It is the same application compiled to run in the browser: the same interface, the same protocol, holding an encrypted copy of a vault that reaches it over sync. You can create a new account and vault here, or sign in to one that already exists with your account number and master password. This article covers both doors, what the browser client is and is not, and one difference in how its code is delivered that is worth understanding before you rely on it.

## Before you start

The browser client is a window onto a synced vault, never a standalone one. Because of that, it has prerequisites the desktop app does not:

- **A sync server to reach.** The browser holds an encrypted copy of a vault that arrives over sync, so the account needs a server. Creating a brand-new account here registers it with the sync server as part of setup. If you already have an account and have not connected a server yet, start with [Turn on sync](/user-guide/sync-and-devices/turn-on-sync/).
- **One account per browser profile.** A browser origin holds a single vault. Once this browser holds an account, creating a second one tells you to open the Myne desktop app or use a different browser profile.
- **Another device already signed in, when you are joining an account that exists.** A browser signing in to an existing account enrolls as a new device and stays pending until an approved device confirms it; the browser cannot approve itself. Keep a desktop, mobile, or already-approved browser handy. Creating a brand-new account needs no second device, because there is nothing yet to approve it against.
- **A desktop browser.** Phones and tablets are refused before anything loads, because the browser client is the desktop-browser client and the native mobile app is a better fit on a touch device.
- **Accepting the beta terms.** A device does not sync until the person at that device has accepted them, and this client cannot reach your vault any other way.

## When a browser asks for your recovery phrase

This is worth learning as a rule, because it is one you can apply yourself. Myne's browser client asks for your 24 words in exactly one place: a recovery *you* started, after forgetting your password. It never asks for them to sign you in, and never asks for them to add a device. Adding a device in a browser takes your account number and your master password, and nothing else.

Anyone who has those words plus your account number can open your vault from anywhere and keep opening it, because the phrase does not change when you change your password and there is no way to revoke it. Check the address before you type them, and if whatever sent you there arrived as a link in a message or an email, do not type them at all.

The browser does show you the phrase once, when you create a vault here. That is the other half of the same rule: Myne shows it in a creation you started, and asks for it only in a recovery you started.

## Signing in from a browser

1. Open `app.example.com` (or your own address, if you self-host the client) in a desktop browser. There is nothing to download.
2. Read the beta terms and accept them. Myne shows them before anything else here, because sync is how this client reaches your vault at all. In short: sync is a free beta with no warranty and no uptime promise; if you lose your password and your recovery phrase your notes cannot be recovered; your account keeps working when the beta ends; and Myne cannot read what you store, so it cannot screen it. The acceptance is recorded on this browser only — it is not carried across by sync, so each new device is asked once — and Myne asks again if the terms change.
3. Enter your account number. The field formats it into its grouped display form as you type, and Myne checks it on your device before sending anything — a mistyped number is caught locally, not by asking the server.
4. Enter your master password. Myne derives your keys from it in the browser; the raw account number and the password are handled on your device, not sent as-is to the server.
5. The browser enrolls as a new device and waits. This pending state is the normal outcome, not an error: a new browser cannot sync until another device approves it.
6. On a device already signed in to the account, approve the new browser. [Add a device](/user-guide/sync-and-devices/add-a-device/) covers the approval, and [Managing devices](/user-guide/sync-and-devices/managing-devices/) covers the device list.
7. Compare the code both screens show, then confirm on each. This is the check that the two devices are looking at the same vault history, and it is the only thing standing between you and a connection that is not what it claims to be. If the code changes while you are reading it, Myne says so: "The code changed while you were looking. Compare both screens again. If it keeps changing, stop and do not continue." One change is ordinary, because the value tracks your vault and your vault can move. A code that keeps changing, or two codes that stay different, is a reason to stop rather than to try again.
8. The browser pulls the vault and opens the editor. What it downloads is ciphertext, decrypted on your device.

## Creating a vault from a browser

If you have no account yet, the account-number screen carries a link below **Continue**: **I do not have an account yet. Create one.** It opens the same setup the desktop app runs, the safety briefing and then the four steps, with one extra screen in the middle.

1. Read the beta terms and accept them, as above. They come first here whichever door you take.
2. Select **I do not have an account yet. Create one.**
3. Work through the briefing and set a master password, exactly as in [Create your vault](/user-guide/getting-started/create-your-vault/).
4. **Creating your account.** After **Encrypting your vault**, the browser pauses on a screen headed **Creating your account**, reading "Registering this vault with the sync server. Your recovery phrase comes next." Leave the tab open until it finishes.
5. The rest of the wizard follows: your recovery phrase, the four-word confirmation, and your account number.

The order in step 4 is deliberate and worth knowing. On the desktop, Myne shows you the phrase and then writes the vault. In the browser the account is registered with the server first, so the 24 words are never shown for an account that does not exist. If the registration fails you get **Your account was not created**, which says so plainly: this browser was left with nothing to open, and your recovery phrase was never shown to you, so there is nothing to write down and nothing to lose. Start again when you are back online.

Two things about the phrase are different here, and both are covered in [Your recovery phrase](/user-guide/getting-started/your-recovery-phrase/): a browser cannot clear your clipboard after you copy the words, and an extension with access to the site can read the page they are on.

## Coming back later

Closing the tab ends the session on purpose. Your encrypted vault stays in the browser's storage, so it is still there next time; what does not stay is anything that could open it. Returning to `app.example.com` therefore asks for your master password again, every time.

That is the whole of it. You are **not** asked to approve the browser a second time, and no other device has to do anything: the browser is already a known device on your account, and the password is what it needs to start using it again.

If you are asked to approve it again, this browser is enrolling from scratch rather than returning. That happens whenever the stored copy is not there to be found: you cleared the site's data, the browser reclaimed the space, or you are in a different browser, a different browser profile, or a private window. Approving it is safe in each of those cases. It enrols as a new device on the account, and **Settings → Sync** lists what is enrolled.

## What runs in the browser

The browser client is not a rewrite. It compiles the same source as the desktop app, and it uses the same cryptographic code — the Myne protocol crate, compiled to WebAssembly and run in the page. It reads and writes byte-identical encrypted blobs: the same formats, the same keys, no new cryptography of its own. A note written on your desktop and a note written in the browser are the same encrypted file.

Its local copy lives in the browser's own storage (the Origin Private File System, or OPFS), scoped to `app.example.com` and to that browser profile. The internal file layout differs slightly from the desktop's folder — the encrypted contents inside do not.

Two behaviours follow from running in a browser:

- **One tab per vault.** A vault is held open in a single tab. If you open a second tab on the same vault, it reports that another tab holds the vault rather than taking over, so two tabs never write over each other.
- **Desktop browsers only.** The client refuses phones and tablets by detecting the device class, not by reading a browser's user-agent string or the window width. A desktop window narrowed to a quarter of the screen is still supported.

## Limits

Your notes are encrypted in the browser exactly as they are on the desktop — the same code, the same byte-identical files. The difference this section is about is not how your notes are encrypted; it is how the client's own code reaches you.

The desktop app is downloaded once as a file you keep, with a published hash you can check before you ever run it, and the copy on your machine stays there for you to inspect. The browser client is different: the page re-delivers it from the server on every visit, you retain no artifact to check, and your browser verifies no signature on it. Whoever operates the address serving the client can, in principle, send a modified version to one specific account and the normal version to everyone else — and because that code runs in the same page you type your master password into, that would be a full compromise of that session. This is a real and weaker trust boundary than the desktop app has (`docs/threat-model.md` A15 / TB11), and the browser cannot close it from inside the page.

What Myne does about it is detection and containment, not prevention, and one half of that is not yet something you can use yourself. Every released bundle's hash is recorded, append-only, before it is deployed, and the browser shows you the hash of the bundle you are actually running: **Settings → About**, under **Build**, beneath the commit. The same value is served at `app.example.com/version.json`. **That record is not public today.** It lives in a repository that is not open, so you cannot look your hash up in it, and this page said you could until 2026-08-25. What the hash on your screen is still good for is reporting it: quoting it lets someone with access settle the question, so a substitution can be found later rather than never. Publishing the record is something Myne owes this page and intends to do; Myne is in beta, and this is one of the pieces still to come rather than one that was dropped. It is not something you can work around in the meantime. Either way, this catches a substitution afterwards. It does not stop one from reaching you, and the app does not warn you in the moment.

The bundle does rebuild byte for byte, but only inside a fixed reference build environment: the build host's architecture reaches the compiled WebAssembly, so a rebuild made anywhere else differs for reasons that are not evidence of anything. Rebuilding it also needs the source, and Myne's source is not published today. The client is licensed AGPL, so an instance you run is yours to serve, and self-hosting removes the outside operator from the path for your own use, though not for anyone else using an instance you run. With the source unpublished, that route is open in principle rather than in practice, which is a reason to weigh the desktop app if the strongest delivery guarantee matters to you.

Two smaller points. The browser's local copy is a cache of a vault that lives on the sync server: if the browser clears that storage, nothing in the vault is lost, and the browser re-syncs and re-establishes itself as a device. And because sync is required here, closing the tab is not a full sign-out — [Delete a vault](/user-guide/settings-and-privacy/delete-a-vault/) erases the browser's local copy when you want it gone. For the encryption model itself — what is protected, what is not, and where the guarantees stop — see [How sync works](/user-guide/sync-and-devices/how-sync-works/) and [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).
