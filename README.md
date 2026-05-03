# myne-website

Marketing site for [Myne](https://github.com/myne-md/myne) — `myne.md`. Built with [Astro](https://astro.build).

## Stack

- **Astro** (static-first, islands on demand)
- TypeScript (Astro default)
- pnpm (Node version pinned via `.nvmrc`, matches main repo)
- No React/Vue/Svelte by default — keeps the bundle small

## Layout

```
myne-website/
├── src/
│   ├── pages/       ← Astro routes (index, security, releases, …)
│   ├── layouts/     ← BaseLayout.astro
│   └── components/  ← shared Astro components
├── public/
│   └── .well-known/security.txt   ← RFC 9116 disclosure (served from /)
├── astro.config.mjs
├── package.json
└── CLAUDE.md        ← marketing-copy discipline + ship-gate responsibilities
```

## Public surfaces this repo owns

Required by main repo's Phase 1 ship gate:

- **`/.well-known/security.txt`** — RFC 9116 disclosure (served from `/`, not a subpath)
- **`/security`** — bug-bounty page; acknowledgment-only first iteration
- **`/releases`** — release notes + auto-updater manifest consumer
- **Landing / pricing / FAQ / philosophy** — marketing copy

## Marketing-copy rule

Marketing copy may **not** exceed the guarantees in main repo [`docs/threat-model.md`](https://github.com/myne-md/myne/blob/main/docs/threat-model.md) (NORMATIVE). When in doubt, downgrade the claim. Brand voice and the "Myne is / Myne is not" lists live in main repo [`docs/vision.md`](https://github.com/myne-md/myne/blob/main/docs/vision.md). See [`CLAUDE.md`](./CLAUDE.md) for the full discipline.

## Local development

```bash
pnpm install
pnpm dev        # Astro dev server
pnpm build      # static output → dist/
pnpm preview    # serve dist/ locally
```

## Reproducibility

The site is part of the trust chain (it serves the auto-updater manifest). `pnpm-lock.yaml` is hash-pinned. No analytics or third-party trackers without a corresponding entry in main repo `design-notes.md`.

## License

MIT — see [`LICENSE`](./LICENSE). Marketing content does not need copyleft.

## Related

- [`myne`](https://github.com/myne-md/myne) — main repo (specs, Tauri desktop client, Rust crypto crate)
- [`agent-tooling`](https://github.com/example-org/agent-tooling) — internal agent tooling (private)
