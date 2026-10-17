# myne-website — Marketing site (Astro)

> Companion repository to [`myne`](https://github.com/myne-md/myne). License: **MIT** for code, see `LICENSE`; the two bundled webfonts are SIL OFL-1.1 and keep their own notice at `public/fonts/OFL.txt`.

## Stack

- **Astro** (static-first marketing site)
- pnpm — pinned via `.nvmrc` (matches main repo Node version)
- TypeScript (Astro default)
- No React/Vue/Svelte unless absolutely necessary — Astro islands keep the bundle small

## Status

Active companion. Astro scaffold landed (`astro.config.mjs`, `src/`, `public/`). Marketing content authoring + Phase 1 §C-launch security pages live here.

## Repo's responsibilities

This site owns these public-facing surfaces required by main repo's Phase 1 ship gate (`agent-tooling/features/phase-1-plan/shared.md` §C-launch):

- **`/.well-known/security.txt`** — RFC 9116 disclosure file. Plan 1 §C6 batch (Day 1 hygiene), but the FILE itself ships from this repo's `public/.well-known/security.txt`
- **`/security` page** — public bug-bounty page (Plan 1 §C7). First iteration acknowledgment-only per `threat-model.md` §6 — no monetary bounty, just credited researchers + scope/contact channel
- **`/download` + `src/data/release.ts`** — the public download surface and the second-witness hash list. The standalone `/releases` page was removed during the closed beta (`610a7c8`); `/download` states the closed-beta position while a release is team-only. The auto-updater manifest endpoint Plan 1 §C5 called for is not built: Myne ships no updater by design, so there is nothing to sign or serve.
- **Marketing copy** — landing, pricing (free / hosted-paid / self-host-free), FAQ, philosophy

## Marketing copy discipline (HARD RULE)

Marketing copy may NOT exceed the guarantees in main repo `docs/threat-model.md` (NORMATIVE). Examples of phrasings that violate this:

- ❌ "Unbreakable encryption" — overstates; threat model has compensating controls + assumes no audit
- ❌ "Anonymous accounts" — protocol is zero-knowledge but operator can correlate connection metadata pre-shielding
- ❌ "Bulletproof" / "military-grade" — empty marketing words, audit-incompatible
- ✅ "Zero-knowledge sync — your password derives the keys; the server can't decrypt your notes"
- ✅ "Open source, reproducible builds, third-party verifiable"

Brand discipline lives in main repo `docs/vision.md` "Myne is" / "Myne is not" lists. **Read both before writing marketing copy.** When in doubt, downgrade the claim.

The same don't-exceed-the-threat-model rule **explicitly extends to `/user-guide` content** — placeholder and real. Per `design-notes.md` 2026-05-04 "Placeholder-first /user-guide route on myne-website with atomic go-live + marketing-copy discipline extension", every user-guide article (recovery flow, vault creation, settings, etc.) must (i) not exceed `docs/threat-model.md` guarantees, (ii) match `PRODUCT.md` "careful engineer to careful engineer" voice, (iii) not contradict `docs/spec/protocol.md` or `docs/spec/account-number.md`. Real-content go-live is gated by a (g2) per-article checklist and ships atomically (banner + noindex + sitemap-filter all dropped in one PR).

The site **links no downloads and no route into the hosted web client**. Per `design-notes/clients/0624`, Myne is a closed beta and the legal texts have had no legal review, so the site states that Myne is **in private testing** and offers nothing to install: no download CTA, and no "Open app" route into `app.example.com`. The web client keeps working and stays reachable at its own origin, and `/download` states the closed-beta position instead of linking installers. Reopening either is a new decision entry, not a copy edit.

## Release role (this site is one of the shipped surfaces)

Team-only is the default for every Myne release, and while a release is team-only **this site does
not change**: `/download` keeps stating the closed-beta position and `src/data/release.ts` stays
where it is. The site moves only when the maintainer makes a release **public**, and then the change
is in one release pass (owned by `operations/runbooks/release-checklist.md` phases 8–9 and
`operations/runbooks/website-deploy.md`):

1. `src/data/release.ts` — bump `RELEASE_TAG`/`RELEASE_VERSION`/`RELEASE_DATE` and replace the
   `ASSETS` rows (name, bytes, sha256) with the values **from the verified staging tree**, never
   read back off the origin this page exists to check.
2. `node scripts/validate-release.mjs` (already wired into `pnpm build`) must be green: it is the
   gate that catches a placeholder key, a truncated hash, and a filename that does not carry its own
   version.
3. `src/pages/download.astro` must still resolve every asset name (`assetByName()` throws on a typo,
   which is the intended tripwire).
4. Deploy **by hand over SSH** (`operations/runbooks/website-deploy.md`); this repo has had no CI
   since 2026-10-01, so a push builds and deploys nothing.

**Independent of public/team-only:** a user-facing feature ships with its `/user-guide` update in the
same change (root `AGENTS.md` standing obligation). The site's hashes are the *second witness* for
release integrity (`design-notes/ops/0496`), so they are copied from the staging tree and never
fetched — a compromise of the downloads origin must not supply both the binary and its hash.

## Reproducibility discipline

This site is part of the trust chain (it serves the auto-updater manifest). Hash-pin `pnpm-lock.yaml`. Don't add Google Analytics, Plausible, or other trackers without a `decisions.md` entry justifying the trust trade-off (most of them are out per anti-features).

## UI patterns

`PRODUCT.md` line 73 lists "modals as the first reach for any interaction" as a banned pattern. A narrow carve-out is logged at `design-notes.md` 2026-05-03 — **"Modal carve-out for solicited single-action surfaces (subscribe-rss-dialog)"** — permitting native `<dialog>` modals only when **all three** conditions hold: (1) solicited click on a dedicated CTA element whose label telegraphs the dialog's contents, (2) single primary action plus at most one passive supporting affordance, (3) dismiss-default through `Esc` + backdrop + explicit `×`. Time-based, scroll-based, exit-intent, and multi-action overlays remain disallowed. Future modal proposals must measure against the three-condition criterion or add a superseding `decisions.md` entry.

## Common commands

```bash
pnpm install
pnpm dev            # Astro dev server
pnpm build          # static output → dist/
pnpm preview        # serve dist/ locally
```

## Gotchas

- **`.well-known/security.txt` MUST be served from `/`, not `/some-path/.well-known/`.** RFC 9116 is strict. Test with `curl https://myne.md/.well-known/security.txt` after deploy.
- **Don't link to internal-only docs** (anything in main repo `agent-tooling/`) — those are private. Stick to public main-repo `docs/` content (CC-BY-4.0).
- **Astro islands are JS-on-demand** — but each island still ships a small runtime. For pure-static pages don't add islands.
- **Update `Expires:` field in `security.txt` annually** or it becomes invalid per RFC 9116. Calendar reminder.
