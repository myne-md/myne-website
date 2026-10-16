---
title: "Install Myne"
category: "getting-started"
updated: 2026-10-07
summary: "How Myne is distributed: which download exists for which platform, why your operating system warns on first launch, and how to check a download against the signed SHA256SUMS list before you run it."
tags: ["basics", "security"]
---

Myne runs as a native app on your own machine: a desktop app for macOS and Linux, and a mobile app for Android. Your vault lives on the device as encrypted files. There is also a browser client that runs the same application under a different trust boundary, and you serve it yourself: Myne hosts no client. See [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/). This article covers how to get the app, what your operating system will say about it, and how to check that what you install is what we published.

## Download and install

Download Myne and run the installer for your platform:

- **macOS**: a universal `.dmg` disk image. Open it and drag Myne to your Applications folder. One file covers both Apple silicon and Intel.
- **Linux**: a `.deb` or an AppImage, each built for x86-64 and arm64. Both carry AppStream metadata, so your software centre lists Myne with its name and description. An Arch package is published alongside them, for x86-64 only.
- **Android**: a universal `.apk` you install yourself. It is not on the Play Store, so Android asks you to allow the install. This is the one Myne download carrying a signature your device checks, because Android refuses to install a package without one. The key is ours and is unknown to Google, so the warning you see is about where the file came from rather than about a missing signature.
- **Windows**: no Windows build is published yet. There is nothing to download for Windows today.
- **iPhone and iPad**: no build you can install. An iOS build needs a developer certificate on your side to sideload, so nothing is published.

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

On desktop, Myne now updates itself. It checks for a newer version shortly after launch and once a day, and when one is available it verifies the download against the same offline release key before installing it, so a downloaded update your operating system cannot vouch for is still checked against a key we publish. You can turn the automatic check off in Settings under About, and check by hand there too. The check sends only your version and platform to our download host, which keeps no IP logs; it sends nothing about your notes or your account. Android still updates through you installing a new APK, and the browser client is re-sent on every load.

The desktop installers are **not reproducible**, and Myne's source is not published today, so nobody outside the project can rebuild a release and compare it byte for byte. That check exists only for the browser client's WebAssembly, and only inside a fixed reference build environment. What holds the desktop side instead is the hash list above: it is signed with a key kept offline and on neither server, and the same hashes are published on a second site with its own machine and its own deploy chain, so one compromised host cannot make its lie agree with the other. The desktop update channel is signature-gated: an update installs only if its signature verifies against the offline release key and its version is strictly newer, so a substituted file is refused rather than installed, and a downgrade is refused too. Where this fits in the wider picture is in the [privacy model](/user-guide/settings-and-privacy/privacy-model/).

## Limits

Checking a hash tells you your download matches the list we published, and checking the signature on that list tells you the list is ours. Neither tells you what the published file was built from: the desktop source is not public and the desktop builds are not reproducible, so nobody outside the project can rebuild an installer and compare. Because the desktop installers carry no signature, your operating system cannot vouch for them either, and the warning you dismiss on first launch is the honest version of that. None of this protects a vault whose password or recovery phrase has leaked, and none of it makes a claim about bugs that have not been found yet.
