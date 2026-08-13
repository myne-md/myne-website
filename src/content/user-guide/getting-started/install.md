---
title: "Install Myne"
category: "getting-started"
updated: 2026-08-13
summary: "How the Myne desktop app is distributed: which installer exists for which platform, why your operating system warns on first launch, and how to check a download against the published SHA256SUMS file before you run it."
tags: ["basics", "security"]
---

Myne is a desktop application. You install it once, and it runs on your computer as a native app. Your vault lives on your device as encrypted files. This desktop app is the primary way to run Myne, but there is also a browser client at `app.example.com` that runs the same application under a different trust boundary; see [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/). This article covers how to get the app, what your operating system will say about it, and how to check that what you install is what we published.

## Download and install

Download Myne from the [releases page](/releases/) and run the installer for your platform:

- **macOS** — a `.dmg` disk image (open it and drag Myne to your Applications folder), or a `.pkg` installer if you prefer one.
- **Linux** — a `.deb`, an AppImage, or a plain `.tar.gz`, each built for both x86-64 and arm64. The `.deb` and the AppImage carry AppStream metadata, so your software centre lists Myne with its name and description. An Arch package is published alongside them.
- **Windows** — no Windows build is published yet. There is nothing to download for Windows today.

## Your computer will warn you on first launch

The installers are **not code-signed**. Nothing in Myne's build produces a signature, so your operating system has no publisher to check the file against and says so the first time you open the app.

- On **macOS**, the first launch is blocked as coming from an unidentified developer. Right-click the app and choose **Open** to get past it.
- On **Linux**, an AppImage needs to be made executable before it will run.

One consequence is worth knowing before you rely on it: on macOS, Touch ID quick unlock does not work on an unsigned build. Use your master password or a PIN instead; see [Quick unlock](/user-guide/settings-and-privacy/quick-unlock/).

## Checking what you downloaded

Every release publishes a `SHA256SUMS` file next to the installers, listing the hash of each one. After downloading, check your file against that list — that is what tells you the file you have is the file we published. On macOS and Linux, `shasum -a 256` or `sha256sum -c SHA256SUMS` does it.

Myne ships no auto-updater. Nothing in the app ever asks whether a newer version exists, so a new version reaches you only by a download you started — which is exactly the moment the check is worth running.

Myne's builds are meant to be **reproducible**: the source is public, the dependency lockfile is hash-pinned, and a rebuild is intended to produce the same binary, so a third party can compare a release against the source rather than take our word for it. Today that comparison is verified automatically only for the browser client's WebAssembly; for the desktop installers it is a property you would have to check yourself. Where this fits in the wider picture is in the [privacy model](/user-guide/settings-and-privacy/privacy-model/).

## Limits

Checking a hash tells you your download matches the published file. It does not tell you the published file is what the public source builds into — for the desktop installers, nobody verifies that automatically today. Because the installers carry no signature, your operating system cannot vouch for them either, and the warning you dismiss on first launch is the honest version of that. None of this protects a vault whose password or recovery phrase has leaked, and none of it makes a claim about bugs that have not been found yet.
