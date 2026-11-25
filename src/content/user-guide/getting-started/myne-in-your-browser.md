---
title: "Myne in your browser"
category: "getting-started"
updated: 2026-10-22
summary: "Myne also runs in a desktop browser: the same app compiled for the browser, a second client holding an encrypted copy of a synced vault. You serve it yourself, because Myne offers no hosted browser client, and how its code reaches you differs from the desktop app."
tags: ["basics", "sync", "devices", "privacy", "security"]
---

Alongside the desktop app, Myne runs in a desktop browser: the same application compiled to run in the browser, the same interface, the same protocol, holding an encrypted copy of a vault that reaches it over sync. You can create a new account and vault there, sign in to one that already exists, or hold an identity for the session and open any vault it owns.

**Myne does not serve one.** No browser client is offered under Myne's own name: the client is built from source and run by you, and [Run your own browser client](/user-guide/getting-started/run-your-own-browser-client/) is how. Everything below is about the client itself, and it holds whether the address you open is one you run or one a friend runs for you.

This article covers the prerequisites, what the browser client is and is not, and one difference in how its code is delivered that is worth understanding before you rely on it.

## Before you start

The browser client is a window onto a synced vault, never a standalone one. Because of that, it has prerequisites the desktop app does not:

- **A sync server to reach.** The browser holds an encrypted copy of a vault that arrives over sync, so the account needs a server. Creating a brand-new account here registers it with the sync server as part of setup. If you already have an account and have not connected a server yet, start with [Turn on sync](/user-guide/sync-and-devices/turn-on-sync/).
- **One account per browser profile, and several vaults inside it.** A browser origin holds one account's vaults. You can keep more than one vault here: each gets its own container under the same address, each opens with its own password, and from two vaults up the launch screen becomes a picker. What a browser still cannot do is group them under a named account, because that grouping needs a key store the browser does not have.
- **Another device already signed in, when you are joining an account that exists.** A browser signing in to an existing account enrolls as a new device and stays pending until an approved device confirms it; the browser cannot approve itself. Keep a desktop, mobile, or already-approved browser handy. Creating a brand-new account needs no second device, because there is nothing yet to approve it against, and neither does recovering one with the 24 words: a recovery-path browser is admitted on the strength of the phrase itself. That is deliberate rather than an oversight, and it is the reason those words are worth guarding, because whoever holds them plus your account number is admitted the same way you are.
- **The 24 words are generated, shown and typed in the browser** on the create, recover and password-reset paths, and on every identity action since identities became available here. The difference from the desktop app is the one below and only that one: the code doing it arrives from a server on every load. If you would rather the phrase never touch a browser, do those steps in the desktop app; see [Install Myne](/user-guide/getting-started/install/).
- **A desktop browser.** Phones and tablets are refused before anything loads, because the browser client is the desktop-browser client and the native mobile app is a better fit on a touch device.
- **Accepting the beta terms.** A device does not sync until the person at that device has accepted them, and this client cannot reach your vault any other way.

## When a browser asks for your recovery phrase

There is no longer a short rule of the form "a browser only asks in one place". Since the person account exists here, the browser asks for the 24 words on every action that has to prove the identity is yours: creating an identity from **Settings → Sync → Connection**, registering it, joining a device, unlocking a vault whose recovery credential is the identity (the unlock screen's identity-phrase door), and a recovery *you* started after forgetting a password. A vault that still carries its own phrase asks for that phrase on its own recovery path.

Two things bound that surface. The phrase is asked for only when you are deliberately doing one of those actions, never as a side effect of opening a page. And the browser keeps **no identity at rest**: the sealed keypair and the device token live in the page's memory, so a reload asks for the words again, and the page says so where it shows them.

Anyone who has those words can open every vault the identity owns, from anywhere, and keep opening them, because the phrase does not change when you change a password and there is no way to revoke it. Check the address before you type them, and if whatever sent you there arrived as a link in a message or an email, do not type them at all.

## Signing in from a browser

1. Open your own address for the client (see [Run your own browser client](/user-guide/getting-started/run-your-own-browser-client/)) in a desktop browser. There is nothing to download.
2. Read the beta terms and accept them. Myne shows them before anything else here, because sync is how this client reaches your vault at all. In short: your notes go to the server you name, encrypted, and the server holds ciphertext and no key, so it cannot read them and neither can Myne, which runs no server for you; if you lose your password and your recovery phrase your notes cannot be recovered; your notes live on your devices, so a server going away costs you sync until you point it at another server rather than your notes; and whoever runs that server can refuse to serve you, keep a copy of something you deleted until their retention window passes, and see that an account synced, when, and roughly how much, none of which lets them read a note. The acceptance is recorded on this browser only — it is not carried across by sync, so each new device is asked once — and Myne asks again if the terms change.
3. Enter your account number. The field formats it into its grouped display form as you type, and Myne checks it on your device before sending anything — a mistyped number is caught locally, not by asking the server.
4. Enter your master password. Myne derives your keys from it in the browser; the raw account number and the password are handled on your device, not sent as-is to the server.
5. The browser enrolls as a new device and waits. This pending state is the normal outcome, not an error: a new browser cannot sync until another device approves it.
6. On a device already signed in to the account, approve the new browser. [Add a device](/user-guide/sync-and-devices/add-a-device/) covers the approval, and [Managing devices](/user-guide/sync-and-devices/managing-devices/) covers the device list.
7. Compare the code both screens show, then confirm on each. This is the check that the two devices are looking at the same vault history, and it is the only thing standing between you and a connection that is not what it claims to be. If the code changes while you are reading it, Myne says so: "The code changed while you were looking. Compare both screens again. If it keeps changing, stop and do not continue." One change is ordinary, because the value tracks your vault and your vault can move. A code that keeps changing, or two codes that stay different, is a reason to stop rather than to try again.
8. The browser pulls the vault and opens the editor. What it downloads is ciphertext, decrypted on your device.

## Creating a vault from a browser

If you have no account yet, the account-number screen carries a link below **Continue**: **I do not have an account yet. Create one.** It opens the same first run the desktop and mobile apps run: the identity, its 24 words, then the vault.

1. Read the beta terms and accept them, as above. They come first here whichever door you take.
2. Select **I do not have an account yet. Create one.**
3. Create your identity, exactly as in [Create your identity](/user-guide/getting-started/create-your-identity/). The phrase step says what is different here: this browser keeps no identity on disk, so a reload asks for the words again, and an extension with access to the site can read the page they are on.
4. The vault comes next: the safety briefing, a name and a master password, as in [Create your vault](/user-guide/getting-started/create-your-vault/). There is no second phrase and no account number, because the identity is both.
5. After the vault is encrypted, the browser pauses on a screen headed **Creating your account**, registering the vault with the sync server. Leave the tab open until it finishes. (A vault that carries its own recovery phrase is told the words come next; one created from your identity is not, because they do not.)

Step 5 is worth knowing about, and the order is deliberate. On the desktop, Myne writes the vault and opens it. In the browser the vault is registered with the server first, so a failure never leaves you holding words for an account that does not exist. If the registration fails you get **Your account was not created**, which says so plainly: this browser was left with nothing to open, and the vault's key material was never kept, so start again when you are back online.

This browser path is the older shape of creation: the vault it makes carries its own recovery phrase and its own account number, because the browser's entry screen does not start from an identity yet. If you add an identity here first (**Settings → Sync → Connection**), a vault created afterwards uses the identity instead, and gets neither. An identity created in a browser lives for the session only, so the words are asked for again after a reload.

Two things about the phrase are different here, and both are covered in [Your recovery phrase](/user-guide/getting-started/your-recovery-phrase/): a browser cannot clear your clipboard after you copy the words, and an extension with access to the site can read the page they are on. A third is specific to the identity: the browser keeps none of it at rest, so a reload asks for the 24 words again.

## Coming back later

Closing the tab ends the session on purpose. Your encrypted vaults stay in the browser's storage, so they are still there next time; what does not stay is anything that could open them. Returning to the address that serves the client therefore asks for your master password again, every time. If you were holding an identity here, it is gone with the tab and its 24 words are asked for again; that is the cost of keeping no phrase-derived key file in a place any script on the origin could read.

If you forget the password of a vault you made here from your identity, that phrase is still the way in. Open the vault from the picker, and the recovery link under the password field reads **Use your identity phrase** on a vault whose recovery credential is the identity rather than a vault phrase. Enter the 24 words there and the vault opens. A vault that has its own recovery phrase keeps the older link, which asks for that phrase instead.

That is the whole of it. You are **not** asked to approve the browser a second time, and no other device has to do anything: the browser is already a known device on your account, and the password is what it needs to start using it again.

If you are asked to approve it again, this browser is enrolling from scratch rather than returning. That happens whenever the stored copy is not there to be found: you cleared the site's data, the browser reclaimed the space, or you are in a different browser, a different browser profile, or a private window. Approving it is safe in each of those cases. It enrols as a new device on the account, and **Settings → Sync → Devices and members** lists what is enrolled.

## What runs in the browser

The browser client is not a rewrite. It compiles the same source as the desktop app, and it uses the same cryptographic code — the Myne protocol crate, compiled to WebAssembly and run in the page. It reads and writes byte-identical encrypted blobs: the same formats, the same keys, no new cryptography of its own. A note written on your desktop and a note written in the browser are the same encrypted file.

Its local copy lives in the browser's own storage (the Origin Private File System, or OPFS), scoped to the address serving the client and to that browser profile. The internal file layout differs slightly from the desktop's folder — the encrypted contents inside do not.

Two behaviours follow from running in a browser:

- **More than one vault, one at a time.** Each vault on this origin is its own container with its own password. Unlocking one does not open another, and the launch screen lists all of them once there are two.
- **One tab per open vault.** A vault is held open in a single tab. If you open a second tab on the same vault, it reports that another tab holds the vault rather than taking over, so two tabs never write over each other.
- **Desktop browsers only.** The client refuses phones and tablets by detecting the device class, not by reading a browser's user-agent string or the window width. A desktop window narrowed to a quarter of the screen is still supported.

## Limits

Your notes are encrypted in the browser exactly as they are on the desktop — the same code, the same byte-identical files. The difference this section is about is not how your notes are encrypted; it is how the client's own code reaches you.

The desktop app is downloaded once as a file you keep, with a published hash you can check before you ever run it, and the copy on your machine stays there for you to inspect. The browser client is different: the page re-delivers it from the server on every visit, you retain no artifact to check, and your browser verifies no signature on it. Whoever operates the address serving the client can, in principle, send a modified version to one specific account and the normal version to everyone else — and because that code runs in the same page you type your master password into, that would be a full compromise of that session. This is a real and weaker trust boundary than the desktop app has (`docs/threat-model.md` A15 / TB11), and the browser cannot close it from inside the page.

What the client does about it is detection and containment, not prevention, and one half of that is not yet something you can use yourself. Every bundle Myne released was recorded, append-only, before it was deployed, and the browser shows you the hash of the bundle you are actually running: **Settings → About**, under **Build**, beneath the commit. The same value is served at `<your address>/version.json`. **That record is not public today.** It lives in a repository that is not open, so you cannot look your hash up in it, and this page said you could until 2026-08-25. What the hash on your screen is still good for is reporting it: quoting it lets someone with access settle the question, so a substitution can be found later rather than never. Publishing the record is something Myne owes this page and intends to do. Either way, this catches a substitution afterwards. It does not stop one from reaching you, and the client does not warn you in the moment.

The bundle does rebuild byte for byte, but only inside a fixed reference build environment: the build host's architecture reaches the compiled WebAssembly, so a rebuild made anywhere else differs for reasons that are not evidence of anything. Rebuilding it also needs the source, and Myne's source is published today. The client is licensed AGPL, so an instance you run is yours to serve, and self-hosting removes the outside operator from the path for your own use, though not for anyone else using an instance you run. Running your own does not need a prebuilt image — the source is public, so that route is open in practice, and [Run your own browser client](/user-guide/getting-started/run-your-own-browser-client/) is how. Rebuilding it yourself does need the source, and the hash record that would tell you whether a rebuild matched is not public either, so what you can do there is prepare the comparison rather than complete it.

Two smaller points. The browser's local copy is a cache of a vault that lives on the sync server: if the browser clears that storage, nothing in the vault is lost, and the browser re-syncs and re-establishes itself as a device. And every vault in this profile shares one address: a script running on that origin can reach all of them, which is a reason to give the client its own address rather than host it beside something else. And because sync is required here, closing the tab is not a full sign-out: [Delete a vault](/user-guide/settings-and-privacy/delete-a-vault/) erases the browser's local copy when you want it gone. For the encryption model itself (what is protected, what is not, and where the guarantees stop) see [How sync works](/user-guide/sync-and-devices/how-sync-works/) and [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/).
