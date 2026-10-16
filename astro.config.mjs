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
    //
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
    // address lands (example-org/operations#9).
    //
    // The rest of the legal roster joined it on 2026-10-16, for the same
    // mechanism and a different reason: those pages are kept and still build,
    // but they describe a service Myne no longer offers (the hosted-sync beta
    // terms, and the pages that say what a Myne-run server holds and how to
    // report content on it). Footer link, sitemap entry and `robots` prop move
    // together, exactly as with /impressum/. /privacy/ is deliberately NOT in
    // this list: it is still live and still linked. SiteFooter.astro's header
    // carries the full reasoning; the decision entry is
    // `design-notes/sync/0696` in the main repo.
    sitemap({
      filter: (page) =>
        !/\/ledger\/(shipped|thinking|milestones)\/?$/.test(page) &&
        !/\/(impressum|terms|nutzungsbedingungen|law-enforcement|behoerdenanfragen|notice|meldung)\/?$/.test(
          page,
        ),
    }),
  ],
});
