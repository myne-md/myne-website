// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://myne.md',
  // Passthrough image service skips raster transforms (no `sharp` dep).
  // SVGs and pre-sized PNGs ship as-is; markdown still gets the asset
  // pipeline (hashed URLs, lazy-loading, width/height). Switch to the
  // default service + add `sharp` if we ever need responsive `srcset`s.
  image: { service: passthroughImageService() },
  integrations: [
    // (1) Filter views (/ledger/shipped, /ledger/thinking, /ledger/milestones)
    //     canonicalize to /ledger/ — exclude them so the sitemap lists the
    //     canonical feed only.
    // (2) Exclude the placeholder-first /user-guide/ subtree from the sitemap
    //     while it is unlinked from nav and noindex per page. When real content
    //     lands the atomic go-live PR drops this line + per-page noindex meta
    //     + the TodoBanner in one move (per PRD US20 + design-notes.md).
    sitemap({
      filter: (page) =>
        !/\/ledger\/(shipped|thinking|milestones)\/?$/.test(page) &&
        !/\/user-guide(\/|$)/.test(page),
    }),
  ],
});
