import type { APIRoute } from "astro";

// robots.txt is generated at build time so it can read `site` (the Docker
// build sets SITE=https://myne.md). There is one deployment; no origin is
// excluded and there is no server-side logic here.
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "https://myne.md";

  const body = [
    "# Myne — privacy-first, end-to-end encrypted markdown notes.",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${origin}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
