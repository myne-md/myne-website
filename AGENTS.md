# myne-website — Marketing site (Astro)

Companion repository to [`myne`](https://github.com/myne-md/myne). Code is MIT
([`LICENSE`](LICENSE)); prose is CC-BY-4.0 ([`LICENSE-CONTENT`](LICENSE-CONTENT));
visual assets and the Myne Marks are all rights reserved
([`LICENSE-ASSETS`](LICENSE-ASSETS)); the two bundled webfonts are SIL OFL-1.1
([`public/fonts/OFL.txt`](public/fonts/OFL.txt)). The scope table is
[`LICENSING.md`](LICENSING.md); the name policy is [`TRADEMARK.md`](TRADEMARK.md).

## Stack

- **Astro** (static-first marketing site)
- pnpm, pinned through `package.json`'s `packageManager`
- TypeScript (Astro default)
- No React/Vue/Svelte unless absolutely necessary — Astro islands keep the
  bundle small

## Status

Active companion. The site is deployed at `myne.md`. Distribution is
**source-only**: there is no download page, no binary roster, no hosted web
client and no route into one. The application, web and mobile clients are built
from the main repository; the install guide says how.

## Repo's responsibilities

- **`/.well-known/security.txt`** — RFC 9116 disclosure file, served from the
  origin root.
- **`/security` page** — acknowledgment-only disclosure policy and scope.
- **Marketing copy** — landing, philosophy, FAQ and the user guide.
- **Legal surfaces** — privacy, terms and the German versions. Substantive
  wording is owner/counsel territory; do not change it to win an argument with
  a linter.

## Copy discipline (HARD RULE)

Marketing and user-guide copy may NOT exceed the guarantees in the main
repository's `docs/threat-model.md` (normative). Examples:

- ❌ "Unbreakable encryption" — the threat model has compensating controls and
  assumes no external audit.
- ❌ "Anonymous accounts" — zero-knowledge content does not hide connection
  metadata from an operator.
- ❌ "Bulletproof" / "military-grade" — empty words.
- ✅ "Zero-knowledge sync — your password derives the keys; the server cannot
  decrypt your notes."
- ✅ "Source-only; you build the client yourself."

When in doubt, downgrade the claim. A user-facing feature ships with its
user-guide update in the same change.

## Development

```bash
pnpm install --frozen-lockfile
pnpm dev            # Astro dev server
pnpm test           # node:test suites
pnpm build          # validate + static output to dist/
pnpm preview        # serve dist/ locally
```

## CI and deploy

`.github/workflows/ci.yml` runs the build and test suite on every change to
`develop` and on pull requests. On a push to `release` it also builds the image
with `SITE=https://myne.md` and pushes it to the private
`ghcr.io/myne-md/myne-website-release` package. The server pulls the `release` tag
on a systemd timer; there is no SSH deploy step and no deploy secret in the
repository.

Branch model: ordinary work lands on `develop`; when the site should go live,
`release` is fast-forwarded to the commit to ship. Only `release` publishes an
image.

Pull requests never receive registry credentials. Do not add a workflow that
needs a secret to the public lane.

## Gotchas

- **`.well-known/security.txt` MUST be served from `/`**, not a subpath.
  RFC 9116 is strict; test with `curl https://myne.md/.well-known/security.txt`.
- **Do not link to private companion repositories or internal docs.** Public
  links point at `myne-md/myne` and its published `docs/` tree only.
- **Astro islands are JS-on-demand**, but each island still ships a small
  runtime. Do not add one to a pure-static page.
- **No analytics or third-party trackers.** The site is part of the privacy
  claim, not a place to measure it.
- Update the `Expires:` field in `security.txt` annually.
