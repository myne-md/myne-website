// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // `site` drives canonical URLs, the sitemap and RSS absolute links. The
  // Docker build sets SITE per environment (release → https://myne.md,
  // preview → https://preview.example.com); falls back to the prod apex locally.
  site: process.env.SITE ?? 'https://myne.md',
  // Passthrough image service skips raster transforms (no `sharp` dep).
  // SVGs and pre-sized PNGs ship as-is; markdown still gets the asset
  // pipeline (hashed URLs, lazy-loading, width/height). Switch to the
  // default service + add `sharp` if we ever need responsive `srcset`s.
  image: { service: passthroughImageService() },
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
