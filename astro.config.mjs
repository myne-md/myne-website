// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // `site` drives canonical URLs, the sitemap and RSS absolute links. The
  // Docker build sets SITE per environment (release → https://myne.md,
  // preview → https://preview.example.com); falls back to the prod apex locally.
  site: process.env.SITE ?? 'https://myne.md',
  // Default (sharp) image service: markdown images — the user-guide
  // screenshots especially — get responsive `srcset` widths, intrinsic
  // width/height, and lazy-loading generated at build time. `sharp` is
  // already resolved as astro's optional dependency (`pnpm-lock.yaml`), so
  // enabling the default service adds no new download. SVGs still ship
  // untransformed (sharp leaves vector sources as-is). The macOS window
  // chrome on guide screenshots is baked into the PNG upstream by
  // `scripts/frame-screenshots.mjs`, not drawn by the image pipeline here.
  integrations: [
    // Filter views (/ledger/shipped, /ledger/thinking, /ledger/milestones)
    // canonicalize to /ledger/ — exclude them so the sitemap lists the
    // canonical feed only. (The /user-guide/ subtree went live with real
    // content — its per-page noindex, the TodoBanner, and its sitemap
    // exclusion were dropped together at go-live, per design-notes.md.)
    sitemap({
      filter: (page) =>
        !/\/ledger\/(shipped|thinking|milestones)\/?$/.test(page),
    }),
  ],
});
