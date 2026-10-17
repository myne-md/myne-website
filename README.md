<p align="center"><img src=".github/banner.gif" alt="Myne website" width="100%"></p>

# Myne website

> The public face of Myne.

The marketing and documentation site for [Myne](https://github.com/myne-md/myne) — served at `myne.md`. Myne is an open-source, end-to-end-encrypted, local-first markdown notes app with optional zero-knowledge sync: no email at signup, a 20-character account number identifies you, recovery rides on a BIP-39 24-word phrase, and the crypto is Argon2id + XChaCha20-Poly1305.

This repo is one of several under [`myne-md`](https://github.com/myne-md). It holds the public landing page, the changelog/ledger, and the user guide — nothing cryptographic. The protocol, threat model, and specs live in the main repo under [`docs/`](https://github.com/myne-md/myne/tree/develop/docs); copy here must stay within those guarantees.

## Status

Pre-alpha, like the rest of the project — but this site is functional and deployed, not a scaffold.

What exists today:

- **Landing page** (`/`): single-page landing with how-it-works, comparison, and roadmap sections, in dark or light (see Themes below).
- **Ledger** (`/ledger`) — changelog/notes collection with `shipped` / `thinking` / `milestone` entries, filter views, per-entry OG images, and an RSS feed (`/ledger/rss.xml`).
- **User guide** (`/user-guide`) — the article collection under `src/content/user-guide/`, served from a Markdown content collection with a validated sidebar. It is **live with real content**: the per-page `noindex`, the draft banner and the sitemap exclusion were dropped together at go-live, so the sitemap filter in `astro.config.mjs` no longer names it.
- **Theme gallery and builder** (`/themes`, `/themes/builder`) — the community gallery, plus a theme builder kept pinned dark.
- **Static surfaces** — `/download`, `/roadmap`, `/security`, `/spec`, a `404`, plus build-time `robots.txt`, `llms.txt`, and a sitemap.
- **Legal pages** — `/privacy` is live and linked. `/impressum`, `/terms`, `/nutzungsbedingungen`, `/law-enforcement`, `/behoerdenanfragen`, `/notice` and `/meldung` are kept and build, but are deliberately delisted from the sitemap, the footer and their own `robots` prop together: `/impressum` until its address is real, and the rest because they describe a service Myne no longer offers (`design-notes/sync/0696`). Several carry a German version that is the same document rather than a shortened rendering.
- **`/.well-known/security.txt`** — RFC 9116 disclosure, served from the apex (`public/.well-known/security.txt`).
- **OG image generation** — built at compile time with `satori` + `@resvg/resvg-js` (no headless browser).
- **Deploy** — Dockerized Astro static output behind nginx, rolled by hand over SSH to `myne.md` (prod) and `preview.example.com` (staging). Procedure: [`operations/runbooks/website-deploy.md`](https://github.com/example-org/operations/blob/develop/runbooks/website-deploy.md). There is **no deploy pipeline at all**: the only GitHub workflow is issue triage (`.github/workflows/triage.yml`), and the site goes out by hand.

Marketing copy, pricing, and the bug-bounty page are intentionally conservative: the security page is acknowledgment-only (no monetary bounty yet), matching `docs/threat-model.md` §6.

## How it works

Astro builds the whole thing to static HTML at compile time. The `site` value (and therefore canonical URLs, the sitemap, and RSS absolute links) is set per environment by the Docker build — `https://myne.md` for release, `https://preview.example.com` for preview — so the same source produces both deployments. There is no server runtime: nginx serves the static `dist/`. No analytics, no third-party trackers.

## Themes

The site ships **dark by default** and a reader may switch to **light** with the icon button in the nav. The choice is stored in `localStorage["myne-theme"]` (`"light"` / `"dark"`, absent means dark) and survives reloads and every full-load navigation. The OS `prefers-color-scheme` is deliberately **not** read: the brand register is dark, so a first visit is dark whatever the platform says.

Everything is token-driven (`src/styles/tokens.css`): `:root` is the dark palette, `:root[data-theme="light"]` the light one, and hairline/wash alphas are written against RGB-triple tokens (`--line-rgb`, `--accent-rgb`, `--paper-rgb`, …) so the same alpha survives the flip. The pre-paint snippet in `layouts/LandingLayout.astro` applies a stored choice before the first paint (no flash), the runtime is `src/lib/theme.mjs` + `components/ThemeToggle.astro`, and `scripts/check-theme-tokens.mjs` pins the dark palette to the values it shipped with so the light theme cannot move it. The theme builder (`/themes/builder/`) is pinned dark with its switch hidden (`data-theme-lock="dark"`), because it is a fixed dark workspace with its own palette.

With JS off the site stays dark and the switch does nothing. That is the accepted fallback.

## Structure

```
myne-website/
├── src/
│   ├── pages/         ← Astro routes: index, download, roadmap, security, spec,
│   │   │                themes/ (gallery + builder), 404, ledger/, user-guide/,
│   │   │                and the legal roster (privacy, impressum, terms, …)
│   │   ├── ledger/    ← feed (index, [filter], [slug]), OG endpoint, rss.xml
│   │   ├── themes/    ← gallery index, builder, preview-frame
│   │   ├── og/        ← build-time OG image endpoint
│   │   ├── robots.txt.ts · llms.txt.ts
│   ├── layouts/       ← LandingLayout, LedgerFeedLayout, UserGuide{Article,Shell}Layout
│   ├── components/    ← GlassNav, SiteFooter, ThemeToggle, ledger/, userguide/, themeBuilder/
│   ├── content/       ← ledger/ + user-guide/ Markdown collections
│   ├── content.config.ts  ← collection schemas (Zod)
│   ├── lib/           ← ledger.ts, og.ts, userGuide.ts, themeBuilder/, theme.mjs
│   ├── data/          ← people.ts, platformIcons.ts, release.ts, notice.ts, the theme index
│   └── styles/        ← global, tokens, ledger, user-guide CSS
├── public/
│   └── .well-known/security.txt   ← RFC 9116, served from /
├── scripts/           ← validate-sidebar.mjs, wire-screenshots.mjs, the theme/token
│                        guards and sync tools, casts, validate-release/-draft-notice
├── .github/workflows/triage.yml   ← issue triage only; there is no deploy pipeline
├── astro.config.mjs   ← site/env wiring, sitemap filters
├── Dockerfile · nginx.conf
├── package.json · pnpm-lock.yaml
└── CLAUDE.md          ← marketing-copy discipline + content rules
```

## Development

```bash
pnpm install
pnpm dev               # Astro dev server
pnpm build             # validate sidebar + release + draft-notice, then build → dist/
pnpm preview           # serve dist/ locally
pnpm validate-sidebar  # check the user-guide sidebar against content
```

Node is pinned via `engines` (≥ 22.12) to match the main repo. Git hooks run through lefthook (`brew install lefthook && lefthook install`): pre-commit runs `astro check`, whitespace, EOF-newline, and a secret-pattern guard; pre-push runs `pnpm build`, `pnpm test` and `protected-branch`, which refuses a direct push to `develop` or `release` (myne-md/myne#592). If that refusal is deliberate, allow it once with `MYNE_ALLOW_PROTECTED_PUSH=1 git push ...`; do not reach for `--no-verify`, which skips the other two as well.

## Discipline

Marketing copy may **not** exceed the guarantees in the main repo's [`docs/threat-model.md`](https://github.com/myne-md/myne/blob/develop/docs/threat-model.md) (normative) — this rule extends to every `/user-guide` article. Brand voice and the "Myne is / Myne is not" lists live in [`docs/vision.md`](https://github.com/myne-md/myne/blob/develop/docs/vision.md). When a claim is in doubt, downgrade it. Adding a tracker or analytics requires a corresponding `design-notes.md` entry. See [`CLAUDE.md`](./CLAUDE.md) for the full content discipline.

## Related repos

- [`myne`](https://github.com/myne-md/myne) — main repo: Tauri desktop client, Rust crypto crate, and the `docs/` specs (protocol, threat model, account number).
- [`myne-server`](https://github.com/myne-md/myne-server) — sync server; self-hosted and hosted share the same zero-knowledge trust boundary (TB5).
- [`myne-test-vectors`](https://github.com/myne-md/myne-test-vectors) — byte-level cross-implementation agreement.

## License

Code in this repo is MIT — see [`LICENSE`](./LICENSE); marketing content does not need copyleft. This mirrors the project's split: the main repo's `docs/` specs stay permissive (CC-BY-4.0) so independent implementations can reuse them, while the Myne application code is AGPL-3.0.
