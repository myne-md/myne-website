---
title: "Install Myne"
category: "getting-started"
updated: 2026-11-25
summary: "How Myne is distributed: source only, with no prebuilt installers. What you need to build a desktop, web or mobile client, which platforms the project tests, and where the guarantees stop."
tags: ["basics", "security"]
---

Myne is **source-only**. There are no installers, no app-store listings, no
prebuilt packages and no binary update channel. The source is the deliverable:
you build the client on the machine that will run it, with your own toolchain.

This article covers what that means in practice, what you need, and which parts
of the build the project actually tests.

## What source-only means

There is nothing to download and run. Myne publishes no `.dmg`, `.deb`, `.rpm`,
AppImage, Flatpak, snap, Arch package, `.apk`, `.ipa` or Windows installer, and
no store listing. The desktop and mobile clients are built from the application
repository:

- `https://github.com/myne-md/myne` — desktop client, web client and mobile
  clients, with the build instructions in its `README.md` and `AGENTS.md`

The browser client is a separate target in the same tree; [Run your own browser
client](/user-guide/getting-started/run-your-own-browser-client/) covers serving
it yourself. Myne operates no hosted client and no sync service of its own.

## What you need

- **Node.js 22.23.4 or newer** and the pnpm version pinned in `package.json`
  (`packageManager`).
- **Rust**, installed through `rustup`; the repository's `rust-toolchain.toml`
  pins the exact toolchain.
- **The Tauri 2 system dependencies** for your platform. On Linux that means
  the WebKitGTK 4.1, GTK 3, librsvg and related development packages; macOS
  needs Xcode Command Line Tools; Windows needs the WebView2 runtime and the
  MSVC build tools. The application README carries the current package names.
- Disk space and memory for a Rust build. A first desktop build is measured in
  gigabytes, not megabytes.

## Build

From a clone of the application repository:

```bash
pnpm install --frozen-lockfile
pnpm tauri build          # desktop bundle under target/release/bundle/
pnpm web:build            # browser client under web/
```

The mobile clients build through their own Tauri targets; see `mobile/README.md`
in the same repository. The flake is a development shell only (`nix develop`),
with no `packages` or `apps` output.

## What is verified

- **Linux** is what the project's CI builds and tests.
- **macOS and Windows** build instructions exist, but those platforms are not
  covered by CI. A report from them is welcome and is treated as unverified
  until someone reproduces it.
- **Android and iOS** are built from source by the person who wants them. No
  public APK, IPA or TestFlight build is offered.
- No build is code-signed or notarized by the project. Your operating system
  will warn on first launch; that warning is the honest state of an unsigned
  local build.
- The desktop build is **not reproducible** yet. Two builds of the same commit
  can differ, and nobody outside the project can rebuild a binary and compare
  it to one the project shipped. There is no shipped binary to compare.

## Updating and verifying

There is no vendor update channel. To update, pull the source and rebuild. Keep
your own copy of the build you rely on. Because you build from source, the
verification is the source and your toolchain, not a publisher signature on a
downloaded file.

Historical binaries distributed before the source-only switch are not
maintained and are not a current download channel. The application repository's
`SOURCE-OFFER.md` explains how to request the corresponding source for one of
those binaries.

## Limits

A local build protects you from a substituted download, not from a compromised
machine, a malicious dependency, or a bug in the source. The application
repository's threat model is the normative description of what Myne defends
against; this page does not add a guarantee to it.
