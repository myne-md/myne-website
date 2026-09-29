---
title: "Run your own sync server"
category: "sync-and-devices"
updated: 2026-09-28
summary: "Bring up the Myne sync server on a machine you control: a pinned container image, a compose file, and a domain. Covers the TLS edge, the policy knobs, the operator panel, sizing, backup, and what operating the server makes you responsible for."
tags: ["sync", "security", "privacy"]
---

Myne's sync server is open source and ships as a container image, so you can run the same zero-knowledge server Myne runs instead of the hosted one. Running it yourself changes who operates the server, not what it can see: it holds encrypted blobs and no keys either way. This page covers bringing one up, pointing a device at it, and the things that become your responsibility once it is yours.

## Prerequisites

- A machine with Docker and Docker Compose.
- A public domain pointed at the machine, reachable on ports 80 and 443. That is what lets the bundled edge issue a certificate from a public authority. Without one, the internal profile below issues a self-signed certificate and your devices pin it on first connect, which is a weaker starting position.
- About 1 vCPU, 512 MB of memory, and disk for your vault plus roughly twice that again. See [Sizing](#sizing) for why the headroom is there.

## Bring the server up

The server image is pinned by digest rather than by tag, so the file below resolves to the same bytes on every machine. **Replace `your.domain` with your own before starting it** — it is the one value there has no default worth having. Save it as `docker-compose.yml`:

```yaml
name: myne-server

services:
  server:
    image: ghcr.io/myne-md/myne-server@sha256:bbe55033c9855170158b19d75872617ff7a153ddd3289e00e67f84493549b730
    restart: unless-stopped
    environment:
      MYNE_SERVER_ADDR: ":8080"
      MYNE_STORAGE_BACKEND: "fs"
      MYNE_STORAGE_PATH: "/data"
      MYNE_ALLOWED_ORIGINS: ""
      MYNE_MAX_ACCOUNTS: "1000000"
      MYNE_QUOTA_CEILING_BYTES: "0"
      MYNE_RATELIMIT_BURST: "256"
      MYNE_RATELIMIT_REFILL: "16"
      MYNE_HORIZON_MARKERS: "120"
      MYNE_ADMIN_SOCKET: "/tmp/myne-admin.sock"
    volumes:
      - myne-data:/data
    expose:
      - "8080"

  edge:
    image: caddy:2.8-alpine@sha256:77c07d5ebfa5be9fd6c820d2094ae662c9e7eeb9bf98346b7f639900263ee2a2
    restart: unless-stopped
    depends_on:
      - server
    environment:
      MYNE_SITE_ADDRESS: "your.domain"
      MYNE_UPSTREAM: "server:8080"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config

volumes:
  myne-data:
  caddy-data:
  caddy-config:
```

The `edge` service is a reverse proxy that terminates TLS, and it is where the domain lives. It publishes both web ports; the server publishes none of its own, so the only way in is through the edge. The two volumes it keeps are Caddy's certificates and its own configuration, and losing them means the next start re-requests a certificate.

Save this as `Caddyfile` beside the compose file:

```caddyfile
{
	admin off
}

{$MYNE_SITE_ADDRESS:your.domain} {
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

	reverse_proxy {$MYNE_UPSTREAM:server:8080} {
		header_up -X-Forwarded-For
		header_up -X-Real-Ip
		header_up -Forwarded
	}
}
```

That log block is load-bearing and it is easy to undo by accident. A Caddy edge with a default access log writes the client IP on every request, and that log is a record of when and from where each of your devices connected. The block above deletes every IP-bearing field before anything is written, and the three `header_up` lines stop those headers reaching the server at all. Removing either half reintroduces IP logging quietly. **If you put your own load balancer or reverse proxy in front of this one, scrubbing the client IP becomes your responsibility instead.**

### Without a public domain

If you have no domain to point here, add one line inside the site block, directly under the opening brace:

```caddyfile
{$MYNE_SITE_ADDRESS:localhost} {
	tls internal
	…
}
```

`tls internal` makes the edge issue a certificate from its own local authority instead of asking a public one, so nothing has to reach the internet. The cost is that no device will trust that certificate on arrival: each one records it on first connect and you compare the fingerprints across your devices by hand. That is the same comparison the public profile needs anyway, except here there is no authority behind it to fall back on if something is already in the path.

### Then start it

```sh
docker compose up -d
```

Two endpoints report whether it came up:

```sh
curl https://your.domain/healthz    # {"status":"ok"}
curl https://your.domain/readyz     # {"status":"ready"} once migrations finish
```

`healthz` answers as soon as the process is up. `readyz` stays unready until the store is initialised, so a `healthz` that succeeds while `readyz` does not is a server that is running but not yet able to serve a device.

## Connect a device

Open **Settings → Sync** on a desktop client, enter `https://your.domain` under **Sync server**, and choose **Connect**. Myne completes one handshake, records a hash of the certificate it saw, and shows you that fingerprint. Compare it across your devices: matching values mean they are all talking to the same server. [Server certificates and fingerprints](/user-guide/sync-and-devices/server-certificates/) covers what the comparison is worth and what it is not.

The first device on an account approves itself, and it also has to accept the beta terms before it will sync. Every device added after that waits for approval. [Turn on sync](/user-guide/sync-and-devices/turn-on-sync/) walks the whole flow, including what to do when the certificate is later replaced.

## The policy knobs

Each of these bounds storage or abuse. None of them can weaken the zero-knowledge property: the server still cannot read, merge, or reorder your notes, and it still cannot log client IPs however you set them.

| Setting | Default | What it does |
|---|---|---|
| `MYNE_QUOTA_CEILING_BYTES` | `0` | Per-account storage ceiling in deduplicated ciphertext bytes. `0` means unlimited, which is the right default when the disk is yours. |
| `MYNE_MAX_ACCOUNTS` | `1000000` | How many accounts may exist. Set it to your own number plus some margin and let it fill; that is the whole access-control mechanism, there are no invite tokens. |
| `MYNE_MAX_DEVICES_PER_ACCOUNT` | `0` | Active devices per account. `0` means unlimited. A per-account override set through the operator console wins over this. |
| `MYNE_RATELIMIT_BURST` / `_REFILL` | `256` / `16` | A per-account token bucket, keyed on the account's hash. It is never keyed on an IP address. |
| `MYNE_PREAUTH_RATELIMIT_BURST` / `_REFILL` | `64` / `8` | The same idea for the requests that arrive before a session exists, where there is no account yet to key on. The hardened values; you rarely need to change them. Unlike every other ceiling here, a burst of `0` is **refused at startup**, because it would reject every enrolment rather than lift the limit. |
| `MYNE_MAX_HANDSHAKES` / `MYNE_HANDSHAKE_TTL_SECONDS` | `16384` / `60` | How many handshakes may be in flight, and how long one is held. What bounds a flood of unauthenticated enrolment attempts. |
| `MYNE_MAX_ATTACHMENTS_PER_VAULT` | `100000` | How many attachment ids one vault may hold. |
| `MYNE_HORIZON_MARKERS` | `120` | How long deleted notes' tombstones are kept. The server clamps this to a floor of 30 and your configuration cannot go below it. |
| `MYNE_EXTENDED_RETENTION` | `false` | **Leave it off.** It stops the server reclaiming deleted ciphertext once the horizon passes, which keeps it on your disk past the point your users expect a deletion to be permanent. A deliberate weakening rather than a convenience. |
| `MYNE_ALLOWED_ORIGINS` | empty | Which browser origins may talk to the server, if you serve the browser client. Empty means off, which is what you want for a native-only setup. |
| `MYNE_ADMIN_SOCKET` | `/tmp/myne-admin.sock` | A local Unix socket for the operator console, reachable by anyone who can run `docker compose exec`. Set it empty to switch the console off. It is never a TCP port. |
| `MYNE_ADMIN_PANEL_ADDR` | empty | The operator panel's address. Off by default; see [the operator panel](#the-operator-panel) before you set it. |
| `MYNE_METRICS_ADDR` | empty | Where to serve Prometheus counters, on their own listener. Off by default. A non-loopback address is normal here, since another machine usually scrapes them. |
| `MYNE_BACKUP_ENABLED` and friends | off | The built-in encrypted off-box backup. Off unless you set it; see [backing it up](#backing-it-up). |

`operations` ships an annotated copy of all of this, `bundle/bundle.env.example`, and that file is the one you edit. The server's own README carries the same list. What each knob obliges you to do, and what it costs, is in the [self-hosting policy](https://myne.md/self-host-policy/) in the specification, which is the normative half; this page is the how.

## The operator panel

The sync server has an operator panel: a web page showing your accounts, how much ciphertext each holds, how many devices it has, and which accounts you have frozen. It is off by default. To turn it on, set the address in your `.env` and restart:

```
MYNE_ADMIN_PANEL_ADDR=127.0.0.1:8081
```

Then open `http://127.0.0.1:8081` on the server machine. If the server is somewhere else, tunnel to it rather than binding a wider address: `ssh -L 8081:127.0.0.1:8081 you@your-server`, then open the same URL locally.

Four things to know before you set it.

**It is read-only.** The panel shows you things; it does not change anything. Freezing an account, setting a quota or a device cap, and deleting an account are still `myne-server admin` commands on the local socket:

```
docker compose exec server myne-server admin list
docker compose exec server myne-server admin freeze <account-hash>
```

That is deliberate rather than a limitation we plan to remove soon. A page you open in a browser can be reached by any other page you happen to visit, so a panel that could act would be acting on your behalf from a tab you were not looking at.

**It has no password.** There is no login. Anything that can reach the address reads the whole roster. Bind it to `127.0.0.1` and do not add a reverse-proxy route for it. The server prints a warning at startup when the address is not loopback, and does not refuse it.

**It shows hashes, not account numbers.** Your account numbers never reach the server, so there is nothing for it to show. What you see is a hash, which is how you identify an account to a command.

**It records nothing.** The panel keeps no history, shows no timestamp, and does not log who connected. Two visits a minute apart show the same numbers.

## Sizing

Disk is the resource that grows, and it is the one to plan for. Budget your vault's ciphertext plus roughly twice that: once for the tombstones the horizon has not yet reclaimed, and once for a copy you can take while the server is running.

Memory does not grow with your vault. The server keeps blobs on disk and holds only a small index, connection buffers, and the rate limiter, so memory scales with how many devices are connected at once rather than with how much you have stored. CPU is the least constrained: the server performs no cryptography at all, since decryption happens on your devices, and it mostly waits on disk.

A single person or a small group fits in 1 vCPU and 512 MB. These are starting figures rather than measured ones, so treat them as a floor to grow from rather than a tested guarantee.

## Backing it up

Everything the server holds is in one named volume: blobs, account metadata, and the chain of record heads together. That is deliberate — one volume is one consistent backup unit, and every write is an atomic rename, so a copy taken while the server is running is always a complete one rather than a half-written file.

Two things to know before you rely on that. The volume is the only thing worth copying; the compose file and `Caddyfile` are configuration, not data, and re-typing them is cheaper than restoring them. And **removing the volume is not reversible from the server side** — it takes every account with it, and each device has to push its notes back up. Copy the volume before anything that could drop it, including `docker compose down -v`.

The server can also back itself up. Set `MYNE_BACKUP_ENABLED` to `true` with a repository and a mounted password file, and it drives a bundled restic to copy the store to an off-box target on a schedule. It is off by default, and it does not change what the server can read: the blobs are already encrypted. What it changes is how long a deleted note survives on your side, which becomes the retention horizon plus the backup retention window, so the second number is one you owe your users rather than one you set quietly.

## Serving the browser client too

The browser client is a separate thing from the sync server, and it needs one setting from you. It runs in the page, so the sync server has to be told which origin may talk to it:

```yaml
MYNE_ALLOWED_ORIGINS: "https://notes.example.org"
```

The value is the client's **origin** — scheme, host, and port, with no path and no trailing slash. An empty value switches cross-origin access off entirely, which is the correct state when only desktop and phone clients connect, and is what the setting is set to in the file above. A wildcard is refused rather than honoured: it could not carry credentials, and it would make your sync edge addressable by any page on the internet.

There is one more line in the browser client's own deployment that has to name this server, and the two files fail in opposite directions if you only set one of them. [Run your own browser client](/user-guide/getting-started/run-your-own-browser-client/) has the pair side by side.

The browser client has no certificate fingerprint to compare and no field to change the server address. The address is fixed when the deployment is built, and the sync origin comes from a setting on the deployment rather than from anything you can edit in the app. It ships as a public container image, so you can run your own: [Run your own browser client](/user-guide/getting-started/run-your-own-browser-client/) covers it, including the setting on this side that has to name your address.

## Limits

**The compose file on this page is the runnable copy.** The same stack file exists in Myne's operations repository, and the two can drift. If a line here contradicts what you were given elsewhere, the operations repository is the one that runs the hosted server.

**Myne's source is not published.** That is why the browser client cannot be self-hosted today, and why the desktop installers are not reproducible. The sync server is the exception: it ships as a public container image, which is what makes the rest of this page followable. Serving the bundle to other people is a different matter, and the honest position is the one in [Myne in a browser](/user-guide/getting-started/myne-in-your-browser/): an instance you run is yours to serve, and it removes an outside operator from the path for your own use, but not for anyone else using it.

**Running the server does not make it trustworthy, and neither is the hosted one.** A server operator can see that a device connected, the connection's IP for as long as it lasts, how many devices the account has, and the size and count of the encrypted blobs. It cannot read a note. What changes when you self-host is which person can do that, not whether they can.

**The fingerprint comparison is a check you perform, not one the app performs.** The first connection to your server is taken on trust. If something was already in the path at that moment, that is what gets recorded, and every later connection matches it perfectly. Comparing the fingerprint across devices you set up separately is what turns that assumption into something you checked.

**Sync is not a backup, on your server or anyone else's.** It keeps devices in step, including propagating deletions, rather than preserving a fixed copy. A [backup](/user-guide/safety-and-recovery/back-up-your-vault/) is a separate deliberate copy that you keep.
