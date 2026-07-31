---
title: "Install Myne"
category: "getting-started"
updated: 2026-07-31
summary: "How the Myne desktop app is distributed: code-signed installers from the releases page, in the native format for each platform, with reproducible builds you can verify against the public source, and why that matters."
tags: ["basics"]
---

Myne is a desktop application. You install it once, and it runs on your computer as a native app. Your vault lives on your device as encrypted files. This desktop app is the primary way to run Myne, but there is also a browser client at `app.example.com` that runs the same application under a different trust boundary; see [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/). This article covers how to get the app and how its distribution lets you check that what you install is what we published.

## Download and install

Download Myne from the [releases page](/releases/) and run the installer for your platform. Each build ships in the native format for its operating system:

- **macOS** — a `.dmg` disk image; open it and drag Myne to your Applications folder.
- **Windows** — an installer built with NSIS; run it and follow the prompts.
- **Linux** — a `.deb`, `.rpm`, or AppImage, each carrying AppStream metadata so your software centre lists Myne with its name and description.

The installers are **code-signed**, so your operating system can confirm the file came from us and was not altered on its way to you.

## Why signed and reproducible builds matter

Myne's builds are **reproducible**: anyone can rebuild the published source and get byte-for-byte the same binary. Combined with code signing, that means you do not have to trust that the download is what we built: the binary can be independently checked against the public source. This is part of the trust chain the project commits to in its public threat model; the [privacy model](/user-guide/settings-and-privacy/privacy-model/) explains where it fits and what it does and doesn't cover.

## Limits

Signed, reproducible builds let you verify that the app you run matches the published source. They do not, by themselves, protect a vault whose password or recovery phrase has leaked, and they make no claim about bugs that have not yet been found. They are one link in the chain, described no more strongly than the threat model allows.
