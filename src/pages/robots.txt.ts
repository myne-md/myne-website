import type { APIRoute } from "astro";

// robots.txt is generated at build time so it can read the per-environment
// `site` (set by the Docker build: release → https://myne.md, preview →
// https://preview.example.com). The preview host is excluded from crawling
// entirely — it must never be indexed. There is no server-side logic here;
// the gate is purely the build-time host, which is the only thing that
// distinguishes the two deployments.
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "https://myne.md";
  const isPreview = (site?.host ?? "").startsWith("preview.");

  const body = isPreview
    ? ["# Preview deployment — not for indexing.", "User-agent: *", "Disallow: /", ""].join(
        "\n",
      )
    : [
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
