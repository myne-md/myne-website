# myne-website — Marketing site (Astro)

> Companion repository to [`myne`](https://github.com/myne-md/myne). License: user's call (recommended: MIT or CC-BY for content). The repo currently has a `LICENSE` file — check it.

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
- **`/releases` or release-notes pages** — auto-updater manifest endpoint (Plan 1 §C5 endpoint consumer side; Tauri client-side wiring lives in main repo)
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
