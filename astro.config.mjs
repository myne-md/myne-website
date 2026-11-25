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
    // Two routes are PARKED, not sitemap-filtered: /roadmap/ and /ledger/.
    // Both source trees live under a leading underscore in src/pages
    // (`_roadmap.astro`, `_ledger/`), which Astro excludes from routing, so no
    // page is emitted at all and a direct URL answers 404. That is deliberate
    // and it is temporary: a public launch is coming and neither surface is
    // ready to be read, but nothing is deleted, so reviving one is a rename
    // back (and restoring its inbound links: the nav entry in GlassNav, the
    // footer entry here in SiteFooter, the ledger RSS <link> in
    // LandingLayout's head, the llms.txt entries, and the § 18 MStV sentence on
    // /impressum/). The OG routes and the ledger content collection are left
    // in place, inert, for the same reason.
    //
    // The filter below therefore covers only the legal roster.
    //
    // Filter views (/ledger/shipped, /ledger/thinking, /ledger/milestones)
    // canonicalize to /ledger/ — that filter is gone with the routes; the
    // reasoning stays in `src/lib/ledger.ts` for whenever they come back.
    // /impressum/ is excluded for a different reason, and only until its
    // address is real. The page carries a placeholder where the ladungsfähige
    // Anschrift belongs, and an *incomplete* Impressum is a worse position
    // than a missing one — it is the classic Abmahnung target precisely
    // because it looks compliant. Leaving it out of the footer is not enough
    // on the prod origin: robots.txt there is `Allow: /` and the sitemap is
    // advertised in it, so a listed URL gets indexed whether or not anything
    // links to it. (On preview.example.com the host nginx sends
    // `X-Robots-Tag: noindex` for the whole origin, which is why this never
    // mattered there.) The page stays reachable by URL — it is written and
    // correct apart from the address — it just does not get advertised.
    // Drop this filter and the page's `robots` prop together when the
    // address lands.
    //
    // The rest of the legal roster joined it on 2026-10-16, and four of those
    // pages were DELETED on 2026-10-17 rather than merely unlisted. /terms/ and
    // /nutzungsbedingungen/ are the hosted-sync beta terms, and the offering
    // they are the terms of is closed; /law-enforcement/, /behoerdenanfragen/,
    // /notice/ and /meldung/ said what a Myne-run server holds and how to
    // notify it about content, and Myne operates no such server. A page about
    // a mechanism that does not
    // exist is not a quieter version of the page — it is a claim, so those four
    // are gone, and the "never have" inventory the law-enforcement page carried
    // moved to `docs/self-host-policy.md`. /privacy/ is deliberately NOT in this
    // list: it is still live and still linked. SiteFooter.astro's header carries
    // the full reasoning.
    sitemap({
      filter: (page) =>
        !/\/(impressum|terms|nutzungsbedingungen)\/?$/.test(page),
    }),
  ],
});
