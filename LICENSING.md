# Licensing

This repository is multi-licensed by subtree. The root [`LICENSE`](LICENSE) is
MIT for the code. Prose and marketing copy are CC-BY-4.0, and the visual assets
are all rights reserved. A file that mixes code and prose is governed by the
part being used: the code is MIT, the prose is CC-BY-4.0.

| Subtree / material | Licence | Licence file |
|---|---|---|
| `src/`, `scripts/`, `astro.config.mjs`, `Dockerfile`, `nginx.conf` — Astro site, build scripts, container | **MIT** | [`LICENSE`](LICENSE) |
| `README.md`, page copy under `src/pages/`, user-guide articles under `src/content/`, the ledger, and other prose | **CC-BY-4.0** | [`LICENSE-CONTENT`](LICENSE-CONTENT) |
| Screenshots, app renders, story and theme captures, Open Graph images, illustrations, imagery under `public/` and `src/assets/`, and the Myne Marks | **All rights reserved** | [`LICENSE-ASSETS`](LICENSE-ASSETS) |
| `public/fonts/` — Inter and JetBrains Mono | **SIL OFL-1.1** | [`public/fonts/OFL.txt`](public/fonts/OFL.txt) |

The Myne name, wordmark, "M" mark and app icon are not covered by MIT or
CC-BY-4.0. Their usage policy is in [`TRADEMARK.md`](TRADEMARK.md).

Build-time dependencies (Astro, satori, sharp, markdown-it, the font packages)
are not redistributed as source; the bundled webfonts are the only third-party
files the site serves, and their licence travels with them. See
[`NOTICE`](NOTICE) for the dependency split and font attribution.

Copyright (C) 2026 Myne contributors.
