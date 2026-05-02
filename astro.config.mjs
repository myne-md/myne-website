// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://myne.md',
  integrations: [
    // Filter views (/ledger/shipped, /ledger/thinking, /ledger/milestones)
    // canonicalize to /ledger/ — exclude them so the sitemap lists the
    // canonical feed only.
    sitemap({
      filter: (page) => !/\/ledger\/(shipped|thinking|milestones)\/?$/.test(page),
    }),
  ],
});
