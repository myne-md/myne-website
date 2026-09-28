---
title: "Run your own browser client"
category: "getting-started"
updated: 2026-09-28
summary: "Serve the Myne browser client from an address you control: a published container image, a domain, and a TLS terminator. Covers the required sync origin, what changes about the code-delivery trust boundary when you operate it, and why there is nothing to back up."
tags: ["basics", "sync", "privacy", "security"]
---

The browser client at `app.example.com` is published as a container image, so you can serve the same client from your own address. The one thing that changes is who hands the page its code on every visit, and that is worth being precise about before you point anyone else's notes at it. This page covers running one, the one setting it cannot start without, and the obligation you take on if anyone else uses it.

## Before you start

- **A sync server.** The browser client holds an encrypted copy of a vault that arrives over sync, so it has nothing to show without one. It cannot create a standalone vault and it will not open offline. [Run your own sync server](/user-guide/sync-and-devices/run-your-own-sync-server/) brings one up, and the two have to be told about each other — see [Pointing them at each other](#pointing-them-at-each-other) below.
- **A public domain and a machine that serves ports 80 and 443.** The container serves plain HTTP and expects a TLS terminator in front of it, the same way the sync server's edge does. A browser refuses to give a page your master password over anything else, so an instance reachable only over `http` is not a weaker version of this, it is a broken one.
- **An `amd64` machine, or a way to emulate one.** The published images are `linux/amd64` only. On an Apple Silicon or ARM Linux host, add `platform: linux/amd64` to the service and let Docker run it under emulation; it works, and it is slower. Building the image yourself on your own architecture avoids that entirely, at the cost of needing the source, which is not published.

## Bring it up

Save this as `docker-compose.yml`. Use a version tag rather than `latest`: the moving tags follow whatever the maintainer deployed, and you would rather know which build your users are running.

```yaml
name: myne-web

services:
  app:
    image: ghcr.io/myne-md/myne-web:0.8.0
    # Only needed on an ARM host. The published images are linux/amd64.
    platform: linux/amd64
    restart: unless-stopped
    environment:
      MYNE_SYNC_ORIGIN: "https://sync.your.domain"
    expose:
      - "8080"

  edge:
    image: caddy:2.8-alpine@sha256:77c07d5ebfa5be9fd6c820d2094ae662c9e7eeb9bf98346b7f639900263ee2a2
    restart: unless-stopped
    depends_on:
      - app
    environment:
      MYNE_SITE_ADDRESS: "notes.your.domain"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config

volumes:
  caddy-data:
  caddy-config:
```

The application publishes no port of its own. It speaks plain HTTP inside the compose network and the `edge` service holds the certificate, the TLS and the two public ports. That service needs a config file beside the compose file, saved as `Caddyfile`:

```caddyfile
{
	admin off
}

{$MYNE_SITE_ADDRESS:localhost} {
	log {
		output stdout
		format filter {
			wrap console
			fields {
				request>remote_ip delete
				request>remote_port delete
				request>client_ip delete
				request>headers>X-Forwarded-For delete
				request>headers>X-Real-Ip delete
				request>headers>Forwarded delete
			}
		}
	}
	log_skip /healthz

	reverse_proxy app:8080 {
		header_up Host {host}
		header_up -X-Forwarded-For
		header_up -X-Real-Ip
		header_up -Forwarded
	}
}
```

Two things in that file are not optional, and one of them is not obvious.

The log block is load-bearing. A Caddy edge with a default access log writes the client IP on every request, and on this particular origin a request is a vault opening — so the log would be a record of when and from where each of your users opened their notes. The block deletes every IP-bearing field before anything is written, and the three `header_up` lines stop those headers reaching the application at all, which has no use for them.

**Do not add security headers to this file.** The image already sets the whole set, and it sets them at start-up from the sync origin you gave it, so a self-hoster and the hosted instance get the identical policy from the identical image. A header added at the edge applies to your deployment only, which is precisely the drift that makes "the same in both deployment modes" quietly untrue. The `Host` line is the one thing the edge must pass through, since the application is matching on it.

Then:

```sh
docker compose up -d
curl -s https://notes.your.domain/healthz
```

Three endpoints are worth knowing, and the first is the one that catches a misconfiguration rather than reporting success:

- `/healthz` answers `ok` and nothing else. A static server that returns the whole page for every path answers this with a 200 and the wrong body, so read what came back rather than only the status.
- `/config.json` is what the page reads to learn which sync server to talk to. If it does not name the origin you set, the container picked up something else.
- `/version.json` reports the commit and the hash of the bundle being served, and is never cached. This is the one to check after every upgrade.

## The setting it cannot start without

`MYNE_SYNC_ORIGIN` is scheme, host and optional port, with nothing else. The container validates it when it starts and **exits rather than serving anything** if it is missing, a wildcard, plain `http` to anything but loopback, or carries a path. Each refusal names its own reason. A page that loads and then cannot reach its server is a worse outcome than a page that does not load.

It is read at start-up rather than baked into the bundle for a reason worth knowing: a bundle with your server's address inside it would be unique to you, and unique bundles cannot be compared against each other. Reading it at start-up keeps the bytes identical to everyone else's, which is what makes verifying the build worth doing at all.

## Pointing them at each other

The browser client runs in the page, so the sync server has to be told which origin may talk to it, and the browser has to be told where the server is. Two settings, in two files, and they have to name each other:

| Where | Setting | Value |
|---|---|---|
| The browser client's deployment | `MYNE_SYNC_ORIGIN` | `https://sync.your.domain` |
| The sync server | `MYNE_ALLOWED_ORIGINS` | `https://notes.your.domain` |

Both are origins: scheme, host, and port, no path, no trailing slash. An empty `MYNE_ALLOWED_ORIGINS` switches cross-origin access off entirely, which is what the sync server page sets by default and is correct until you add a browser client. A wildcard is refused rather than honoured, because it could not carry credentials and would make your sync edge addressable by any page on the internet.

## What you take on by operating it

Running your own copy of the browser client changes your position in one specific favourable way and one specific unfavourable one.

**Favourable, for your own use.** The page is re-sent from whatever address serves it, on every visit, and your browser checks no signature on it. That is why the hosted instance is a weaker trust position than the desktop app, and it is why serving it yourself is worth the trouble: there is no third party in that path. For notes you reach only through your own instance, the concern is gone rather than reduced.

**Unfavourable, and it is the part that gets skipped.** That exemption is yours, not your users'. Anyone else who opens your instance is receiving code from you, on every page load, and they keep no copy to check it against. They are in the weaker position the hosted instance is in, and you are the one who put them there. If other people's notes are going to sit behind your address, the honest thing is to say so — plainly, before they create a vault rather than in a footer afterwards.

Serving it to others over a network also carries the source obligation that comes with the licence. The client is AGPL, and an operator serving it owes its users the corresponding source. The image label names the repository it came from.

## Upgrading

Point the compose file at a newer version tag and bring it back up:

```sh
docker compose pull
docker compose up -d
curl -s https://notes.your.domain/version.json
```

The commit and hash in that response have to match what you just deployed. If they do not, the container did not replace — every other check passes against the old build, which is the only reason the field exists.

A browser that has already opened your instance may keep serving an older build for a while, because the page pins what it is running and updates it on its own schedule. Rolling back does not reach back and withdraw it. Publishing a replacement is a forward release, not an erasure.

## There is nothing to back up

This is worth saying plainly because every other page in this guide that mentions a server tells you to back it up. This one has no state. The bundle is baked into the image, the container writes nothing to disk, and the only copy of a user's notes is the one in their own browser. There is no volume holding a vault, no backup unit, and nothing to restore.

Losing the container loses nothing. Recovery is `docker compose up -d`. The cost of that arrangement is the one in the section above: the thing that would be lost is trust in the code, not data.

## Limits

**The hash record is not public, so you can prepare to verify the build but not finish.** Myne records a hash of every released bundle before it is deployed, and the page shows you the hash of the build you are actually running under **Settings → About**. The record itself is not public today, so the comparison is one you can set up and not one you can complete alone. Any build from the published image carries the recorded hash, which is worth something: a substituted image would not. A build you compiled from source would carry a different hash, and that is expected rather than a warning sign, because the build machine's architecture reaches the compiled WebAssembly and any rebuild outside the reference environment differs for reasons that say nothing about the code.

**The source is not published, so you cannot rebuild the image yourself.** Running a published image does not need it. Verifying that image against its source, and serving a bundle to other people with a source offer attached, do.

**Architecture is `linux/amd64`.** On an ARM host, emulation works and is slower. This is a property of the published images rather than of the client.

**The client cannot pin a certificate and shows no fingerprint.** That is not a missing feature awaiting a build: a web page is never shown a server's certificate, so there is no hash for it to record and nothing for you to compare between devices. What checks the connection is the browser's own certificate store, which is a real check and a different one from what desktop and mobile clients do.
