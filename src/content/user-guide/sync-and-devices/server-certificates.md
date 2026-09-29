---
title: "Server certificates"
category: "sync-and-devices"
updated: 2026-09-29
summary: "Myne checks a sync server's certificate against public certificate authorities and the server name, on the first connection and every one after it. There is no fingerprint to compare and nothing to do when a certificate is renewed, and a self-hosted server needs a publicly trusted certificate."
tags: ["sync", "security", "devices"]
---

Myne checks that the sync server it connects to really is that server, on every connection, by verifying the server's certificate chain against the public certificate authorities and verifying the server's name. That check runs on the first connection and on every later one, over Tor included. There is no fingerprint for you to compare and no setup step for it.

This replaces an earlier design that pinned a server's certificate the first time a device connected to it. That design is gone, along with the fingerprint, the renewal-recovery procedure, and the requirement to enter a fingerprint before joining a server while Tor routing was on.

## How the check works

On desktop and mobile, Myne verifies two things on each connection: that the server's certificate chains to a certificate authority it trusts, and that the certificate is issued for the name you entered. The trusted authorities are the public Mozilla root set, which ships inside the app rather than being read from your operating system's certificate store. That is what keeps the check a property of the Myne client on every machine, instead of depending on what has been installed on that particular computer.

This applies to every `https` server. Myne's own hosted server and a server you run yourself are checked the same way. A loopback `http://` address has no TLS and so no certificate, and the panel says that rather than implying a check that did not happen: "Connected (local, no TLS)."

When the check passes, the panel reports it plainly: "Connected over TLS. The certificate and server name were verified." If it fails, the failure is separate from "could not reach the server": "Couldn't verify the server's HTTPS certificate. Check the server address, certificate and its validity."

## Self-hosted servers need a publicly trusted certificate

A self-hosted endpoint must present a certificate from a public authority. A private certificate authority, an internal hostname, or a bare IP address will not work: the certificate is refused on the first connection, and a private authority you installed as a trusted root on your own machine is not consulted, because the roots ship with the app. If you run your own server, obtain a certificate that a public authority issues for a public domain name. The self-hosting guide covers this in [Run your own sync server](/user-guide/sync-and-devices/run-your-own-sync-server/).

## When a certificate is renewed

Nothing happens. A renewed certificate with a valid replacement is simply a valid certificate, and sync continues. The status no longer has a "certificate changed" state, because there is no saved certificate for a new one to differ from.

## With Tor routing on

Tor routing no longer changes how the server is checked. The relay that ends a Tor circuit could answer in your server's place, and the chain-and-name check is what rules that out: an exit cannot present a certificate that passes verification for your server's name unless it holds a certificate a public authority issued for it. Adding a server, or joining a device to one, does not ask for a fingerprint. [Routing sync through Tor](/user-guide/settings-and-privacy/route-sync-through-tor/) covers the rest of that setting.

## In a browser

[Myne in a browser](/user-guide/getting-started/myne-in-your-browser/) is checked by the browser's own certificate store rather than by Myne, and the panel says so: "Server certificate verified by this client's trust store." A web page is never shown the server's certificate, so a browser client cannot run Myne's own check. That is a real check against the public authorities, made by the browser, and it is the same class of check the native clients make.

## Limits

The check proves the server is the one named by a certificate a public authority issued. It does not prove the operator is honest, and it says nothing about your notes, which are encrypted before they leave the device and stay that way on the server (see [How sync works](/user-guide/sync-and-devices/how-sync-works/) and [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/)).

Four things are given up relative to the old pin, and they are stated rather than implied:

- **A compromised or compelled public authority can issue a certificate these clients accept.** The old pin refused any certificate but the one first recorded; the authority check accepts any certificate a trusted authority signs. Root verification cannot detect a mis-issuance by an authority that is itself trusted.
- **An authority distrusted after a mis-issuance keeps working until Myne ships a release that updates the bundled root set.** Nothing needs to be compromised for this to be true, and nothing fails loudly when it happens.
- **Revocation is not checked.** A certificate that its issuer has revoked is accepted until it expires.
- **A private certificate authority or self-signed certificate is refused**, which strands a server on a private network, an internal hostname, or a bare IP. There is no supported client answer for such a setup today.

Myne does not present certificate trust as *verified* in any stronger sense than the check above, because the transport beneath it has not had a primitive-level security review. Someone who did manage to impersonate your sync server still would not get your note contents: what crosses the network is ciphertext, and the keys never leave your devices. What such a position offers is metadata and the ability to deny you sync, which are real harms of a different kind.

The check covers the connection to your sync server and nothing else. It says nothing about how the Myne app itself reached your machine. A loopback `http` address has no certificate, so nothing is checked there; that is a legitimate setup for a server on the same machine, not something the app is glossing over.
