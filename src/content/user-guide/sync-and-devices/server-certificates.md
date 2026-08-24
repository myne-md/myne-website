---
title: "Server certificates and fingerprints"
category: "sync-and-devices"
updated: 2026-08-24
summary: "Myne pins a sync server's certificate the first time it connects and expects the same one afterwards. Covers the fingerprint you compare across your devices, what happens when a certificate is renewed, how to verify the replacement out of band before your device trusts it, and why a browser cannot pin at all."
tags: ["sync", "security", "devices"]
---

Myne pins a sync server's certificate the first time a device connects to it over `https`, and expects that same certificate every time afterwards. Certificates are renewed on a schedule, so a pinned one is replaced eventually, and when that happens sync stops and names the reason instead of reconnecting to whatever answered. This page covers the fingerprint you compare across your devices, the renewal case, and how to verify a replacement certificate before your device trusts it.

## What Myne pins, and when

The first time you point a desktop or mobile device at an `https://` sync server, Myne completes one handshake, records a hash of the certificate that server presented, and checks every later connection against that hash in place of the usual certificate-authority chain. Nothing about that first connection is verified. It is taken on trust, and the recorded hash is what makes every connection after it checkable.

This applies to every `https` server. Myne has no built-in certificate for its own hosted server, so a hosted address is pinned on first connect in exactly the same way an address you run yourself is. A loopback `http://` address has no TLS and so no certificate, and the panel says that rather than implying a pin: "Connected (local, no TLS)."

What the pin buys you is that after the first connection, this device will not talk to a server presenting a different certificate, whether or not some certificate authority would vouch for it. What it does not buy you is anything about that first connection, and nothing at all about the contents of your notes, which are encrypted before they reach the network either way (see [How sync works](/user-guide/sync-and-devices/how-sync-works/)).

## The fingerprint

The fingerprint is that hash written out, 64 hexadecimal characters. On the desktop it appears in **Settings → Sync**, under **Sync server**, labelled "Server certificate fingerprint:", with a line under it naming where the pin came from: "Pinned on first connect. Compare this fingerprint across your devices." On a phone the same value appears in Settings → Sync as **Certificate fingerprint**, under "Compare this against the same screen on a device you already trust. They must match."

Comparing it is the whole point of showing it. Read the fingerprint on one device against the fingerprint on another. If they match, both devices pinned the same certificate, which means they are talking to the same server. That comparison happens outside the connection being checked, which is what makes it worth anything: it is the same kind of out-of-band check the device-approval code uses in [Add a device](/user-guide/sync-and-devices/add-a-device/).

Right after a device joins, Myne makes the comparison its own step, headed **Server certificate pinned**: "This device pinned your server’s certificate. Check that this fingerprint matches on your other devices." A QR code shown by an already-connected device carries that device's pinned fingerprint alongside the server address and account number, but the joining device still pins the certificate it meets on its own first connection: the carried value is shown to you, not compared for you.

## When a certificate is renewed

Certificates have a lifetime, so a pinned one is replaced sooner or later. This is the ordinary case rather than the alarming one, and it looks the same as the alarming one from your device.

When the replacement arrives, the pin check fails and sync stops. The status reads **Server certificate changed: verify it to reconnect** (see [Reading sync status](/user-guide/sync-and-devices/sync-status/)). Myne stops its retry schedule rather than reconnecting every few seconds, because every attempt would reach the same replacement certificate and fail in the same way.

**Settings → Sync → Devices** states it in full, "The sync server answered, but with a different certificate than the one this device pinned.", and then says where that leaves you: "This is what a renewed certificate looks like, and also what an impostor looks like. Myne cannot tell them apart, so it will not guess. Get the fingerprint from your server, then re-enter the server URL under “Sync server” above and paste it in when asked." The device list gives the short version of the same reason: "its certificate is not the one this device trusts". **Reset sync on this device** is not offered in this state, because a reset clears this device's local sync state without changing which certificate it trusts ([Managing devices](/user-guide/sync-and-devices/managing-devices/)).

## Re-entering the URL does not re-pin

Re-entering the server URL is the remedy the panel recommends, which is exactly why it is not allowed to be a shortcut. Typing the same address again does not adopt whatever certificate answers. Myne reads the pin this device already holds, compares it, and refuses when the two differ, saving nothing: "This server presented a different certificate than the one this device trusts. Nothing was changed. If you renewed it, paste the new fingerprint below; if you did not, do not connect."

That is the safe direction because re-entering the URL is also the obvious thing to try whenever sync breaks, for any reason at all. If it quietly replaced the pin with whatever answered, then anyone in a position to answer in your server's place would only need sync to break once. Replacing a pin now takes a fingerprint you obtained somewhere other than the connection in question.

An address this device has never trusted is unaffected: it is pinned on first connect as before. The refusal is specifically about replacing the pin on a server this device already trusts.

## Verify the new certificate before you trust it

Under that refusal, Myne opens a block headed **Check this server’s certificate before trusting it**, with an **Expected certificate fingerprint** field.

1. Get the fingerprint from the server itself. On the machine running it, the app names the command: "On the machine running your server: openssl x509 -noout -fingerprint -sha256 -in <your certificate file>". The **Where do I find this fingerprint?** disclosure carries that line, and names the other source too: "On a device already connected to this account: Settings → Sync shows the same fingerprint."
2. Do not fetch it over the connection you are trying to check. The same disclosure says why: "Not through this connection. A fingerprint you fetch over the same circuit proves nothing: whatever could swap the certificate could swap that page too."
3. Paste it into the field. The `openssl` output is accepted exactly as that command prints it, `sha256 Fingerprint=` prefix and colons included; a leading `sha256:` and plain spaces are accepted too. What is not accepted is a value of the wrong length, or one with characters in it that are not hexadecimal.
4. Read the echo. Under **What you entered**, Myne repeats your own value in groups of four characters so you can read it against your copy without counting. A complete one says so: "64 of 64 characters. Read it against your own copy before continuing."
5. Choose **Connect**. Myne compares what you entered against the certificate the server presents, and stores the new pin only if they agree. On success the panel reports "Connected. Check that this fingerprint matches on your other device." If they disagree, nothing is saved: "The certificate this server presented is not the one you entered. Nothing was saved. Check the fingerprint you pasted. If it is right, do not connect: something is between this device and your server."

**I don’t have it, cancel** backs out. The refused attempt wrote nothing, so the device stays on the certificate it already trusted and you can come back once you have the fingerprint: "Nothing was saved: this device is not connected to that server. Come back once you have its certificate fingerprint."

Myne does not show you the fingerprint it just captured on this screen, and that is deliberate. Showing it would let someone who cannot find their own copy read the one on screen and type it back, which is not a comparison.

## With Tor routing on

[Routing sync through Tor](/user-guide/settings-and-privacy/route-sync-through-tor/) removes trust on first connect altogether, because the relay that ends a circuit is in a position to answer in your server's place. Adding a server, or joining a device to one, then asks for the fingerprint up front, before anything is pinned: "Tor routing is on, so this device will not trust a certificate it has not been told to expect. Get your server’s SHA-256 certificate fingerprint from the server itself or from a device that is already connected, then paste it here."

It is the same block, the same field and the same two sources as above. The difference is that it is required in advance rather than reached after a refusal, and that a server whose fingerprint you cannot obtain cannot be added at all while Tor routing is on. The Tor article covers the rest of that setting.

## In a browser

[Myne in a browser](/user-guide/getting-started/myne-in-your-browser/) cannot pin a certificate, and that is permanent rather than pending. A page is never shown the server's certificate, so there is no hash for the client to record and no fingerprint for you to compare. What does the checking there is the browser, and the panel says so rather than leaving a gap: "Verified by your browser’s certificate store. This client cannot pin a certificate itself."

That check is real. It is your browser validating the certificate against its own trust store, the same check every website gets, rather than the narrower pin a desktop or mobile device keeps. It is a weaker answer against an attacker sitting on the network, and Myne's threat model records it as such rather than treating the two clients alike.

## Limits

A matching fingerprint tells you one thing: this is the same certificate your device recorded before. It is not evidence that the server is honest, or that its operator is who you believe, and it says nothing about your notes, which are encrypted before they leave the device and stay that way on the server (see [How sync works](/user-guide/sync-and-devices/how-sync-works/) and [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/)).

The first connection is taken on faith. If something was already sitting between your device and your server at that moment, what got recorded is that thing's certificate, and every later connection matches it perfectly. Comparing the fingerprint across devices you set up separately is what turns assumed trust into something you checked, and nothing in the app can take that step for you.

On a desktop or mobile device the pin is the whole of the transport trust. It replaces the certificate-authority check rather than adding to it, and nothing else is carrying weight behind it. Myne does not present certificate trust as verified anywhere in the app, because neither the pin nor the transport beneath it has had a primitive-level security review.

Someone who did successfully impersonate your sync server still would not get your note contents: what crosses the network is ciphertext, and the keys never leave your devices. What such a position does offer is metadata, and the ability to deny you sync, which are real harms of a different kind.

The pin covers the connection to your sync server and nothing else. It says nothing about how the Myne app itself reached your machine, and in a browser it does not apply at all. A loopback `http` address has no certificate, so nothing is pinned and nothing is checked there. That is a legitimate setup for a server on the same machine, not something the app is glossing over.
