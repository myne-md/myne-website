---
title: "Run your own sync server"
category: "sync-and-devices"
updated: 2026-10-19
summary: "Bring up the Myne sync server on a machine you control: a pinned source tag, a compose file, and a domain. Covers the TLS edge, the policy knobs, the operator panel, sizing, backup, and what operating the server makes you responsible for."
tags: ["sync", "security", "privacy"]
---

Myne's sync server is open source and built from the same tree, so you can run the same zero-knowledge server Myne ships, on a machine you control. Running it yourself changes who operates the server, not what it can see: it holds encrypted blobs and no keys either way. This page covers bringing one up, pointing a device at it, and the things that become your responsibility once it is yours.

## Prerequisites

- A machine with Docker and Docker Compose.
- A public domain pointed at the machine, reachable on ports 80 and 443. That is what lets the bundled edge issue a certificate from a public authority. Without one, the internal profile below issues a self-signed certificate, which Myne's desktop and mobile clients refuse: they require a certificate a public authority issued for a public name.
- About 1 vCPU, 512 MB of memory, and disk for your vault plus roughly twice that again. See [Sizing](#sizing) for why the headroom is there.

## Bring the server up

The server is built from the source tag pinned below rather than pulled from a public registry, so the compose file reproduces the bytes from the repository you can read. It is the bundle's own `docker-compose.yml`, reproduced here so that this page and the file you actually run cannot drift apart: every tunable is read from the environment with the shipped default beside it, which is why the rest of this page tells you to edit `.env` rather than the file. Save it as `docker-compose.yml`, and copy the annotated `bundle.env.example` beside it as `.env`:

```yaml
name: myne-server

services:
  server:
    build:
      context: https://github.com/myne-md/myne-server.git#v0.17.0
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      MYNE_SERVER_ADDR: ":8080"
      MYNE_STORAGE_BACKEND: "fs"
      MYNE_STORAGE_PATH: "/data"
      MYNE_MAX_ACCOUNTS: "${MYNE_MAX_ACCOUNTS:-1000000}"
      MYNE_QUOTA_CEILING_BYTES: "${MYNE_QUOTA_CEILING_BYTES:-0}"
      MYNE_RATELIMIT_BURST: "${MYNE_RATELIMIT_BURST:-256}"
      MYNE_RATELIMIT_REFILL: "${MYNE_RATELIMIT_REFILL:-16}"
      MYNE_HORIZON_MARKERS: "${MYNE_HORIZON_MARKERS:-120}"
      MYNE_INVITE_CODE: "${MYNE_INVITE_CODE:-}"
      MYNE_EXTENDED_RETENTION: "${MYNE_EXTENDED_RETENTION:-false}"
      MYNE_MAX_DEVICES_PER_ACCOUNT: "${MYNE_MAX_DEVICES_PER_ACCOUNT:-0}"
      MYNE_PREAUTH_RATELIMIT_BURST: "${MYNE_PREAUTH_RATELIMIT_BURST:-64}"
      MYNE_PREAUTH_RATELIMIT_REFILL: "${MYNE_PREAUTH_RATELIMIT_REFILL:-8}"
      MYNE_MAX_HANDSHAKES: "${MYNE_MAX_HANDSHAKES:-16384}"
      MYNE_HANDSHAKE_TTL_SECONDS: "${MYNE_HANDSHAKE_TTL_SECONDS:-60}"
      MYNE_MAX_ATTACHMENTS_PER_VAULT: "${MYNE_MAX_ATTACHMENTS_PER_VAULT:-100000}"
      MYNE_AWARENESS_RATELIMIT_BURST: "${MYNE_AWARENESS_RATELIMIT_BURST:-64}"
      MYNE_AWARENESS_RATELIMIT_REFILL: "${MYNE_AWARENESS_RATELIMIT_REFILL:-16}"
      MYNE_AWARENESS_MAX_SUBSCRIBERS: "${MYNE_AWARENESS_MAX_SUBSCRIBERS:-64}"
      MYNE_ADMIN_PANEL_ADDR: "${MYNE_ADMIN_PANEL_ADDR:-}"
      MYNE_ADMIN_PANEL_HOSTS: "${MYNE_ADMIN_PANEL_HOSTS:-}"
      MYNE_METRICS_ADDR: "${MYNE_METRICS_ADDR:-}"
      MYNE_ALLOWED_ORIGINS: "${MYNE_ALLOWED_ORIGINS:-}"
      MYNE_BACKUP_ENABLED: "${MYNE_BACKUP_ENABLED:-false}"
      MYNE_BACKUP_REPOSITORY: "${MYNE_BACKUP_REPOSITORY:-}"
      MYNE_BACKUP_PASSWORD_FILE: "${MYNE_BACKUP_PASSWORD_FILE:-/run/secrets/restic-pass}"
      MYNE_BACKUP_INTERVAL_SECONDS: "${MYNE_BACKUP_INTERVAL_SECONDS:-86400}"
      MYNE_BACKUP_RETENTION_DAYS: "${MYNE_BACKUP_RETENTION_DAYS:-14}"
      MYNE_BACKUP_RCLONE_CONFIG: "${MYNE_BACKUP_RCLONE_CONFIG:-}"
      MYNE_ADMIN_SOCKET: "${MYNE_ADMIN_SOCKET:-/tmp/myne-admin.sock}"
    volumes:
      - myne-data:/data
    expose:
      - "8080"

  caddy:
    image: caddy:2-alpine@sha256:77c07d5ebfa5be9fd6c820d2094ae662c9e7eeb9bf98346b7f639900263ee2a2
    restart: unless-stopped
    depends_on:
      - server
    environment:
      MYNE_SITE_ADDRESS: "${MYNE_SITE_ADDRESS:-localhost}"
      MYNE_UPSTREAM: "server:8080"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ${MYNE_CADDYFILE:-./Caddyfile}:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config

volumes:
  myne-data:
  caddy-data:
  caddy-config:
```

The `caddy` service is a reverse proxy that terminates TLS, and it is where the domain lives: it reads `MYNE_SITE_ADDRESS` from `.env`, so that is the one value worth setting before the first start (`localhost` is only the default for a local experiment). It publishes both web ports; the server publishes none of its own, so the only way in is through the proxy. The two volumes it keeps are Caddy's certificates and its own configuration, and losing them means the next start re-requests a certificate.

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

### If you would rather use a different proxy

Caddy is bundled because its log filter is the vetted one, not because another proxy cannot do this. If you front the server with something you already run, do the same two things: keep the address out of the log, and do not pass the forwarding headers through.

nginx, in the server block:

```nginx
access_log off;                      # or a log_format with no $remote_addr / $http_x_forwarded_for
proxy_set_header X-Forwarded-For "";
proxy_set_header X-Real-IP "";
proxy_set_header Forwarded "";
proxy_pass http://127.0.0.1:8080;
```

Traefik, in the entrypoint or router configuration:

```yaml
accessLog: null                      # omitted entirely is the point
# and on the router's middleware chain:
headers:
  customRequestHeaders:
    X-Forwarded-For: ""
    X-Real-Ip: ""
```

Whatever you use, TLS still has to be a certificate a public authority issued for a public name, or the desktop and phone clients will refuse the connection.

### Without a public domain

If you have no domain to point here, the bundle ships a second profile for exactly this: set `MYNE_CADDYFILE=./Caddyfile.internal` in `.env` and the proxy issues a certificate from its own local authority instead of asking a public one, so nothing has to reach the internet. Save `bundle/Caddyfile.internal` beside the compose file as `Caddyfile.internal` when you do. The same change by hand is one line inside the site block, directly under the opening brace:

```caddyfile
{$MYNE_SITE_ADDRESS:localhost} {
	tls internal
	…
}
```

The cost is the same either way: Myne's desktop and mobile clients will not accept that certificate, because it does not chain to a public authority, so the connection is refused. Use the internal profile only behind a proxy that terminates TLS with a public certificate, or for a browser you have told to trust the local authority. The native clients cannot use it.

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

Open **Settings → Sync → Connection** on a desktop client, enter `https://your.domain` under **Sync server**, and choose **Connect**. Myne checks the server's certificate against the public authorities and checks the server name, automatically, on the first connection and every one after it. There is nothing to compare or paste. [Server certificates](/user-guide/sync-and-devices/server-certificates/) covers what the check does and does not prove.

The first device on an account approves itself, and it also has to accept the beta terms before it will sync. Every device added after that waits for approval. [Turn on sync](/user-guide/sync-and-devices/turn-on-sync/) walks the whole flow.

## The policy knobs

Each of these bounds storage or abuse. None of them can weaken the zero-knowledge property: the server still cannot read, merge, or reorder your notes, and it still cannot log client IPs however you set them.

| Setting | Default | What it does |
|---|---|---|
| `MYNE_QUOTA_CEILING_BYTES` | `0` | Per-account storage ceiling in deduplicated ciphertext bytes. `0` means unlimited, which is the right default when the disk is yours. |
| `MYNE_MAX_ACCOUNTS` | `1000000` | How many accounts may exist. Set it to your own number plus some margin and let it fill. On its own this is a coarse cap, not an admission control: to admit only people you gave a code to, set `MYNE_INVITE_CODE` as well. |
| `MYNE_INVITE_CODE` | *(unset)* | A shared invite code that closes new-account registration. Unset means registration is open (the self-host default). When set (at least 32 characters, or the server refuses to start), a new account is refused unless it carries the code; an account that already exists is unaffected, so later devices on it need no code. The code is never stored or logged server-side. |
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

The sync server repository ships an annotated `bundle.env.example`, and that file is the one you edit. The server's own README carries the same list. What each knob obliges you to do, and what it costs, is written out as an operator contract in the specification (`self-host-policy.md`), which is the normative half; it has no web address yet, so the obligations that follow from it are summarised under [What you take on](#what-you-take-on) below. This page is the how.

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

## What you take on

Running the server puts four obligations on you that the app cannot enforce on your behalf. They are the operator contract written out in full in the specification's `self-host-policy.md`; this is the summary, and it is worth reading before you invite anyone else onto your server.

**Do not add IP logging anywhere in the stack.** The server itself strips addresses, and the bundled Caddy edge deletes every field that would carry one. If you put your own proxy or load balancer in front — and on Kubernetes you will — scrubbing the client address there becomes your job, not the bundle's. A request log with the address in it is a record of when and from where each account connected, which is the record the whole design refuses to keep.

**Do not keep deleted ciphertext past the retention horizon.** Deletion is meant to be permanent within a bounded window. The one compatible exception is a backup, which necessarily carries what existed when it was taken: keep it encrypted, off-box and short-cycle, and tell your users the number — the worst case becomes the horizon plus the backup window, which is why [Backing it up](#backing-it-up) makes you choose the second one deliberately.

**Never expose the operator panel.** It is read-only and it has **no password**, and what it shows is a roster of account hashes. A hash is not a harmless identifier: it is the selector your own server answers account queries with, and it is enough to mount an offline attempt on a password. Bind it to loopback, or reach it over an SSH tunnel.

**Do not weaken the encryption to make something easier.** You cannot read a vault either way, but adding a plaintext side-channel, a metadata log or a "temporary" decryption helper takes the deployment outside the model the app documents, and a user who read that model deserves better than a quiet deviation.

## Backing it up

Everything the server holds is in one named volume: blobs, account metadata, the chain of record heads, the device registrations that keep your own devices enrolled (`auth.json`), your operator policy (`accounts.json`), and the person-to-vault state — invitations, member profiles, group packages and the membership list (`b2b.json`) — together. That is deliberate — one volume is one consistent backup unit, and every write is an atomic rename, so a copy taken while the server is running is always a complete one rather than a half-written file.

Two things to know before you rely on that. The volume is the only thing worth copying; the compose file and `Caddyfile` are configuration, not data, and re-typing them is cheaper than restoring them. And **removing the volume is not reversible from the server side** — it takes every account with it, and each device has to push its notes back up. Copy the volume before anything that could drop it, including `docker compose down -v`.

The server can also back itself up. Set `MYNE_BACKUP_ENABLED` to `true` with a repository and a mounted password file, and it drives a bundled restic to copy the store to an off-box target on a schedule. It is off by default, and it does not change what the server can read: the blobs are already encrypted. What it changes is how long a deleted note survives on your side, which becomes the retention horizon plus the backup retention window, so the second number is one you owe your users rather than one you set quietly.

### Putting it back

A backup nobody has restored is a guess, so do this once against a throwaway copy before you rely on it. The shape is the same either way — stop the server first, because two processes writing one store is the one way to make a copy useless:

```sh
docker compose down                       # stop the writer
# copy the volume back, or restore the restic repository into the store path:
docker compose exec server myne-server restore /data-restore   # then swap it into place
docker compose up -d
curl https://your.domain/readyz           # {"status":"ready"}
```

Then check three things by hand, because they are what a restore can silently get wrong: a device that was enrolled is still enrolled (sign in from an app rather than re-adding it), an invitation that was pending is still listed, and a member's shared vault still opens. The first comes from `auth.json`, the other two from `b2b.json`, and a copy that missed one of those files looks like a working server with a smaller past.

Two more things worth knowing. Restoring an **older** copy is not destructive to anyone's notes: each device still holds the vault locally and pushes what the server is missing on the next sync, which is what local-first means. And the direction that is not reversible is the other one — dropping the volume (`docker compose down -v`) takes every account with it, and every device then has to push its notes back up.

## Serving the browser client too

The browser client is a separate thing from the sync server, and it needs one setting from you. It runs in the page, so the sync server has to be told which origin may talk to it:

```yaml
MYNE_ALLOWED_ORIGINS: "https://notes.example.org"
```

The value is the client's **origin** — scheme, host, and port, with no path and no trailing slash. An empty value switches cross-origin access off entirely, which is the correct state when only desktop and phone clients connect, and is what the setting is set to in the file above. A wildcard is refused rather than honoured: it could not carry credentials, and it would make your sync edge addressable by any page on the internet.

There is one more line in the browser client's own deployment that has to name this server, and the two files fail in opposite directions if you only set one of them. [Run your own browser client](/user-guide/getting-started/run-your-own-browser-client/) has the pair side by side.

The browser client has no certificate control and no field to change the server address. The address is fixed when the deployment is built, and the sync origin comes from a setting on the deployment rather than from anything you can edit in the app. It is built from source, so you can run your own: [Run your own browser client](/user-guide/getting-started/run-your-own-browser-client/) covers it, including the setting on this side that has to name your address.

## On Kubernetes

The same server, the same image and the same settings can run on a cluster instead of as a compose file. The chart is published as `oci://ghcr.io/myne-md/charts/myne-server`, so you install it from the registry without downloading anything from a repository. This is the cluster-shaped version of the walkthrough above; the settings, the obligations and the limits do not change with it.

### What you need first

- A cluster, and a storage class that can provision a `ReadWriteOnce` volume. The server keeps its store on a filesystem, so one pod owns one volume.
- An ingress controller and a public domain, with a certificate from a public authority. The desktop and phone apps check the certificate against the public authorities and check the server name on every connection, and a certificate from your own authority is not consulted, so a cluster-internal one will not let a device connect.
- Nothing else. The chart pins the server image by digest, and that digest is a multi-architecture manifest list, so the same install works on `amd64` and on `arm64` nodes.

### Install it

**Check that you can reach the package before you plan around it.** The chart is published to a public package from a private source repository, the same shape as the server image, and a private package answers a pull with `401`/`403` rather than with the chart:

```sh
helm show chart oci://ghcr.io/myne-md/charts/myne-server
```

A failure there is about access, not about the chart existing. Once it answers:

```sh
helm install myne-server oci://ghcr.io/myne-md/charts/myne-server \
  --version 0.9.0 \
  --namespace myne --create-namespace \
  --set storage.size=20Gi
```

Pin the chart version, for the same reason you pin the image by digest: `latest` is whatever the last release published, and you would rather know which build your server is running.

**The chart's version tracks the server image, which is not the app's version.** A release cycle can ship the app without shipping a server image, and v0.10.0 did exactly that: the newest published server image is still the v0.9.0 cycle's, which is why the chart says `0.9.0` while the app says `0.10.0`. So pick the chart version that matches the server image you intend to run, and treat a newer app version as the app's business rather than this server's.

Size the volume the way [Sizing](#sizing) describes it: your vault's ciphertext, plus roughly twice that again for the tombstones the horizon has not reclaimed and for a copy you can take while the server is running.

Then give it an address, so a device can reach it. With the chart's own ingress:

```sh
helm upgrade myne-server oci://ghcr.io/myne-md/charts/myne-server -n myne \
  --set ingress.enabled=true \
  --set ingress.host=sync.your.domain \
  --set 'ingress.tls[0].secretName=myne-sync-tls' \
  --set 'ingress.tls[0].hosts[0]=sync.your.domain'
```

Before you keep that ingress, read [What is different from the compose file](#what-is-different-from-the-compose-file): its access log becomes yours.

### Check it came up

```sh
kubectl -n myne port-forward svc/myne-server-myne-server 8080:8080
curl http://127.0.0.1:8080/healthz     # {"status":"ok"}
curl http://127.0.0.1:8080/readyz      # {"status":"ready"} once the store is initialised
```

`healthz` answers as soon as the process is up, and `readyz` stays unready until the store is ready to serve; the chart's readiness probe waits on the same endpoint. Then connect a device exactly as above, in **Settings → Sync**, with the address of your ingress rather than a compose hostname.

### The operator console

The console has no TCP port in the server. It is a socket inside the pod, and the image deliberately has no shell, so you run the binary itself:

```sh
kubectl -n myne exec deploy/myne-server-myne-server -- myne-server admin list
```

The read-only browser panel stays off unless you set its address, and if you do set it, reach it with `kubectl port-forward` rather than through a Service or an ingress route. Everything [What you take on](#what-you-take-on) says about the panel applies unchanged.

### Settings

The chart passes the same settings as the compose file above, under `config`, with the same names and the same defaults, so the table of knobs earlier on this page is the reference. Four are worth knowing separately: `storage.size`, `ingress.*`, `backup.*` (which needs a Secret you create, and mounts it read-only), and `metrics.enabled` (aggregate counters on their own port, never on the public edge).

### Upgrades, and removing it

```sh
helm upgrade myne-server oci://ghcr.io/myne-md/charts/myne-server -n myne --reuse-values
helm uninstall myne-server -n myne
```

An upgrade restarts the pod rather than rolling a new one in beside it, because the store is a single writer: expect a short outage, and take a snapshot of the claim before an upgrade whose release notes mention a change to the stored format. `helm uninstall` deliberately leaves the volume behind, so the store survives a mistake. Deleting the claim afterwards is what takes every vault with it, and every device then has to push its notes back up; the direction that is not reversible is that one, not the upgrade.

### What is different from the compose file

Three things, and each is yours rather than the bundle's. The edge is your ingress and so is its access log, which is the [obligation](#what-you-take-on) above broken by a default rather than by a decision. There is exactly one replica, because the store is a single writer on one volume; a second pod is two writers on one disk, not more capacity. And the operator console is the socket and the tunnel described above rather than a published port.

The backup unit is the same idea in a cluster shape: the claim holds the blobs, the chain of record heads, the device registrations and the person-to-vault state together, so a volume snapshot is a consistent copy and [Putting it back](#putting-it-back) describes the same three things to check afterwards.

### What has been tested, and what has not

The chart has been installed on a real cluster: a `kind` cluster on `arm64` hardware, where the pod reaches Ready as its unprivileged user, the claim mounts, both endpoints answer over the Service, `myne-server admin list` returns over the socket, a restart keeps the same claim, and a second replica is refused. That is the deployment, not sync itself: no device was enrolled in that run, so treat the cluster path as verified as an installation and unverified as a syncing setup. The no-IP obligation is not exercised there either, because the chart ships no edge to test.

Two properties of the server itself are worth knowing, and both are the same on any orchestration. **Retired namespaces are reclaimed on a grace window**, not instantly: when an owner retires a key epoch, the old namespace's ciphertext is refused for writes forever and is physically released once the grace has elapsed, so plan for that window on disk rather than for the live data alone. And the collaboration routes carry their own share of the per-account rate limit rather than an unlimited one, which matters if you run a server for other people.

## Limits

**The compose file on this page is the runnable copy.** The same stack file exists in Myne's operations repository, and the two can drift. If a line here contradicts what you were given elsewhere, the operations repository is the one that is deployed. [Myne in a browser](/user-guide/getting-started/myne-in-your-browser/) covers the client-side half.

**Myne's source is not published, which is why things cannot be rebuilt — not why they cannot be run.** The sync server and the browser client are both built from source, which is what makes the rest of this page followable, and the browser client bundles its own security headers so a self-hosted instance is not a weaker copy. What nobody outside the project can do is rebuild a release and compare it byte for byte, and the desktop installers carry no signature for your operating system to check. Serving the bundle to other people is a different matter, and the honest position is in [Myne in a browser](/user-guide/getting-started/myne-in-your-browser/): an instance you run is yours to serve, and it removes an outside operator from the path for your own use, but not for anyone else using it.

**Running the server does not make it trustworthy, and no server is.** A server operator can see that a device connected, the connection's IP for as long as it lasts, how many devices the account has, and the size and count of the encrypted blobs. It cannot read a note. What changes when you self-host is which person can do that, not whether they can.

**The certificate check is against public authorities, and that is its limit.** Myne confirms the server's certificate chains to a public authority and names your server, on every connection. A compromised or compelled authority can still issue a certificate these clients accept, and revocation is not checked; [Server certificates](/user-guide/sync-and-devices/server-certificates/) states each of those plainly.

**Sync is not a backup, on your server or anyone else's.** It keeps devices in step, including propagating deletions, rather than preserving a fixed copy. A [backup](/user-guide/safety-and-recovery/back-up-your-vault/) is a separate deliberate copy that you keep.
