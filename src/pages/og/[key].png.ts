import type { APIRoute, GetStaticPaths } from "astro";
import { PAGE_OG, type OgKey, renderOgPng, displayUrl } from "../../lib/og";

// One social card per static page, rendered from the shared dark-brand
// template. Routes: /og/home.png, /og/roadmap.png, … (see PAGE_OG).
export const getStaticPaths: GetStaticPaths = () =>
  (Object.keys(PAGE_OG) as OgKey[]).map((key) => ({ params: { key }, props: { key } }));

export const GET: APIRoute = async ({ props, site }) => {
  const key = props.key as OgKey;
  const p = PAGE_OG[key];
  const host = site?.host ?? "myne.md";

  const png = await renderOgPng({
    kicker: p.kicker,
    title: p.title,
    description: p.description,
    url: displayUrl(host, p.path),
    note: p.note,
  });

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
