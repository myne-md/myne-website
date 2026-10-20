---
title: "Route sync and desktop AI through Tor"
category: "settings-and-privacy"
updated: 2026-10-09
summary: "Send Myne's sync traffic, and on desktop its remote AI provider requests, through Tor so those destinations see a Tor exit rather than your own address. Off by default and behind Developer mode, it pauses rather than connecting directly while Tor is unavailable; the certificate is still checked against the public authorities."
tags: ["sync", "privacy", "security", "settings"]
---

Myne can send its sync traffic through Tor, and on desktop it routes remote AI provider requests the same way. The destination then sees a Tor exit rather than your own address, and your network and your internet provider see you connecting to Tor rather than to a particular server. It is off by default, it is a desktop setting behind [Developer mode](/user-guide/settings-and-privacy/developer-mode/), and it changes where your connection comes from — not what the destination can see about your syncing.

## Prerequisites

- A vault open, and [sync set up](/user-guide/sync-and-devices/turn-on-sync/). Routing applies to sync traffic and, on desktop, to AI provider requests, so there is nothing to route until one of those is configured.
- [Developer mode](/user-guide/settings-and-privacy/developer-mode/) on, in Settings → About. The Network panel is hidden until it is.
- The desktop app. Myne in a browser cannot do this; there, the answer is to run the whole browser through Tor Browser.

## Before you turn it on

Read this first, because it is the behaviour most likely to look like a bug. While Tor is connecting, and whenever the Tor client is unavailable, **sync pauses**. Myne does not quietly fall back to a direct connection — refusing to connect at all is the point of the setting. So the first sync after you turn it on is not instant, and a Tor client that fails to start leaves your notes unsynced until you either fix it or turn the setting off.

## The server certificate, over Tor

Tor routing does not change how the server's certificate is checked, and there is nothing extra to set up. The relay that ends a Tor circuit could answer in your server's place, and the chain-and-name check is what rules that out: an exit cannot present a certificate that passes verification for your server's name unless a public authority issued one for it. Adding a server, or joining a device to one, does not ask for a fingerprint. [Server certificates](/user-guide/sync-and-devices/server-certificates/) covers what the check does and does not prove.

## Turning it on

1. Open Settings from the gear in the bottom bar or with `⌘,`.
2. Choose **Network** in the left rail, under the **Developer** section.
3. Switch on **Route sync and desktop AI through Tor**. Myne starts a Tor client it ships with; the first connection usually takes a few seconds.

## Reading the status row

The switch records what you asked for. The **Right now** row below it reports what is actually happening, which is a different question — a Tor client that failed to start leaves the setting on and the tunnel down. Five states:

- **Sync goes straight to the sync server**. The setting is off. This is the shipped default and a legitimate choice, not a fault.
- **Connecting to Tor: sync is paused**. The client is starting. Nothing is being sent directly in the meantime.
- **Sync is going through Tor**. The state in which your traffic is actually routed. An AI provider request uses the same proxy, and while the proxy is not ready it is refused rather than sent directly.
- **Tor is unavailable: sync is paused**. The client could not start or has stopped. Nothing is being sent directly. Turn the setting off and on again to try starting it, or turn it off to sync without Tor.
- **Sync isn't using Tor: this address points at this device**. The sync server address you configured names this computer, so there is no circuit to route through. Sync is not paused. If that address forwards on to a server somewhere else, Myne cannot see that and cannot route it.

## Turning it off

Switch **Route sync and desktop AI through Tor** off. New connections go straight to the sync server again, and sync resumes.

## What this doesn't hide

The panel keeps this list behind a **What this doesn't hide** disclosure, and it is worth reading before you rely on the setting:

- The last relay in a Tor circuit, the exit node, sees which sync server you connect to, and on desktop with this on, which AI provider you reach. It cannot read what you sync; that stays encrypted end to end.
- The sync server still sees when you sync, how many blobs you push and how large they are, and how many devices you have. Tor does not change that.
- If a server you use charges for storage, the payment and your account can still be linked to you. Tor changes where the connection comes from, not the billing trail.
- On desktop this covers your AI provider requests too, not only sync: with the option on, a request to a remote AI provider goes through the same Tor proxy, so the provider sees the exit node rather than this device, and when the proxy is not ready the request is refused rather than sent directly. Mobile has no Tor routing yet, so its provider requests go direct. Nothing else on this device is affected.

## Limits

This reduces what the sync server and your network provider learn about **where you are connecting from**. It does not make you anonymous to Myne, and it does not change what the server can see about your syncing — that list is above, and it is unchanged by this setting.

Your network and your internet provider can still see that this device is connecting to Tor. Hiding the fact that you use Tor at all is a different problem and this setting does not solve it.

The Tor client ships inside Myne, but Myne does not operate it, and the relay network is run by volunteers nobody here controls. That is why the setting sits behind [Developer mode](/user-guide/settings-and-privacy/developer-mode/) rather than in the ordinary Privacy panel: it is a door you open deliberately, onto something Myne cannot vouch for on your behalf.

## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open settings | ⌘, | Ctrl , |
