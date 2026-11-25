---
title: "Install Myne"
category: "getting-started"
updated: 2026-10-17
summary: "How Myne is distributed: which download exists for which platform, why your operating system warns on first launch, how to check a download against the signed SHA256SUMS list before you run it, and the two routes that work on NixOS."
tags: ["basics", "security"]
---

Myne runs as a native app on your own machine: a desktop app for macOS and Linux, and a mobile app for Android. Your vault lives on the device as encrypted files. There is also a browser client that runs the same application under a different trust boundary, and you serve it yourself: Myne hosts no client. See [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/). This article covers how to get the app, what your operating system will say about it, and how to check that what you install is what we published.

## Download and install

Download Myne and run the installer for your platform:

- **macOS**: a universal `.dmg` disk image. Open it and drag Myne to your Applications folder. One file covers both Apple silicon and Intel.
- **Linux**: a `.deb`, an AppImage or an `.rpm`, plus a Flatpak, a snap and an Arch package. The `.deb` and the AppImage are built for x86-64 and arm64, the `.rpm` for both architectures as well, the Flatpak and the snaps for x86-64 (and the snap for arm64 too), and the Arch package for both x86-64 and aarch64. All of them carry AppStream metadata, so your software centre lists Myne with its name and description.
- **The `.rpm` has a glibc floor of 2.39.** It installs and runs on Fedora 40 or newer and on openSUSE Tumbleweed, which was verified on both at release time. On openSUSE Leap 15, RHEL, Rocky or Alma 9 it installs but will not start, because those carry glibc 2.38 or older; use the AppImage or the Flatpak there.
- **Android**: a universal `.apk` you install yourself. It is not on the Play Store, so Android asks you to allow the install. This is the one Myne download carrying a signature your device checks, because Android refuses to install a package without one. The key is ours and is unknown to Google, so the warning you see is about where the file came from rather than about a missing signature. An F-Droid listing is prepared but not published; the next section says why, and what to do on the day it is.
- **Windows**: no Windows build is published yet. There is nothing to download for Windows today.
- **iPhone and iPad**: no build you can install. An iOS build needs a developer certificate on your side to sideload, so nothing is published.

## Android and F-Droid

The `.apk` is the only Android download today. F-Droid builds every app it ships from its own copy of the source, and Myne's source is not public yet, so there is nothing for F-Droid to build and no listing to install from. Our side of that packaging is prepared; it waits on the source becoming readable.

When the listing does appear, one thing about it is worth knowing **before** you switch, because it is the only irreversible step in this article.

F-Droid signs what it builds with **its own key**. Android refuses to install an update signed by a key different from the one already on the device, so the F-Droid build cannot be installed over an `.apk` you sideloaded from here. The only route through is to uninstall first, and uninstalling deletes the app's private storage, which is where your vault lives. **Export your notes to markdown before you make that switch.** This is not a hypothetical risk: the Android signing key has had to be replaced twice already, and each time an uninstall was the only way forward, which cost everyone whose notes existed only on their phone.

Myne is attempting a reproducible build for exactly this reason. A build that reproduces byte for byte can be verified against the source and then signed with our key rather than F-Droid's, which removes the uninstall from that day entirely. If that lands, this section will say so instead.

## NixOS

No prebuilt Nix package or AppImage wrapper is published. The repository's flake exposes a **development shell** (`nix develop`), not a runnable Myne package; it deliberately has no `packages` or `apps` output. Build from the tagged source with your normal Tauri/Rust toolchain.

The flake does not fetch an AppImage, does not wrap a release, and does not claim a from-source Nix package exists. That keeps the Nix surface consistent with the rest of this page: source-only, no binary distribution.

## Your computer will warn you on first launch

The desktop installers are **not code-signed**. Nothing in Myne's desktop build produces a signature, so your operating system has no publisher to check the file against and says so the first time you open the app. (Android is the exception noted above, and it is the only one.)

- On **macOS**, the first launch is blocked as coming from an unidentified developer. Right-click the app and choose **Open** to get past it.
- On **Linux**, an AppImage needs to be made executable before it will run.

One consequence is worth knowing before you rely on it: on macOS, Touch ID quick unlock does not work on an unsigned build. Use your master password or a PIN instead; see [Quick unlock](/user-guide/settings-and-privacy/quick-unlock/).

## Checking what you downloaded

Every release publishes a `SHA256SUMS` file next to the installers, listing the hash of each one, and a `SHA256SUMS.minisig` signature over that list. The signature is what makes the check worth running: the key is held offline and is on neither of our servers, so whoever holds the download host cannot forge a hash list to match a swapped installer. Verify the signature first, then the file. Checking a file against a list you have not authenticated only verifies the file against itself.

```
minisign -Vm SHA256SUMS -P <public key from the releases page>
sha256sum -c SHA256SUMS --ignore-missing
```

On macOS, `shasum -a 256 -c SHA256SUMS` does the second step. The same hashes are also published from a different machine with its own deploy chain, so if the two ever disagree, that disagreement is the thing to act on.

What the signature does not cover is worth stating plainly: it authenticates the hash list, not the installer, and it is not something your operating system checks.

No binary update channel exists. The desktop app is built from source; this site publishes no installers, no updater manifests and no automatic update. If you replace a build, rebuild it from the tagged source and keep your own copy; the app does not check a vendor origin for a newer binary.

The desktop build is not reproducible, and no current installer or update channel is offered. Historical release hash lists remain a record of the archived binaries; they are not a download channel and do not describe a current update path. Where this fits in the wider picture is in the [privacy model](/user-guide/settings-and-privacy/privacy-model/).

## Limits

Checking a hash tells you your download matches the list we published, and checking the signature on that list tells you the list is ours. Neither tells you what the published file was built from: the desktop source is not public and the desktop builds are not reproducible, so nobody outside the project can rebuild an installer and compare. Because the desktop installers carry no signature, your operating system cannot vouch for them either, and the warning you dismiss on first launch is the honest version of that. None of this protects a vault whose password or recovery phrase has leaked, and none of it makes a claim about bugs that have not been found yet.
