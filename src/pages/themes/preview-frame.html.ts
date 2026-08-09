// The theme builder's preview document (myne#394).
//
// Serves the captured Myne interface — `src/data/preview/`, synced from the app
// repo by `scripts/sync-preview.mjs` — as a standalone page the builder loads in
// an iframe.
//
// WHY AN ENDPOINT AND NOT A COMPONENT
// The snapshot is a whole `<html>` document, so it cannot be nested inside an
// Astro page's own. And it must not be flattened into one either: its CSS is
// written against `:root` and `:root[data-o-*]` selectors, so it needs to BE the
// root of its document. Inlining it into the builder page would mean rewriting
// every one of those selectors on every capture — a transformation to re-verify
// forever — and would let the site's own stylesheet leak into the preview, which
// is the exact drift this whole snapshot exists to end.
//
// WHY AN IFRAME IS SAFE HERE
// Same-origin, so the builder can reach `contentDocument` and drive the palette
// through `setProperty` exactly as the app drives `:root` (SYNC-4 — per-property
// CSSOM, never a concatenated style block, because the builder's input is an
// unvalidated live form). The document carries no script of its own: the capture
// strips every `<script>` before writing the snapshot.

import previewHtml from "../../data/preview/preview.html?raw";
import previewCss from "../../data/preview/preview.css?raw";

// Prerendered: this is a static artefact, not a request-time render.
export const prerender = true;

const FALLBACK = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  html,body{margin:0;height:100%;font:14px/1.6 ui-sans-serif,system-ui,sans-serif;
    display:grid;place-items:center;background:#fbfbfa;color:#5c5c50;text-align:center}
  p{max-width:36ch}
</style></head><body><p>The interface preview has not been captured yet.</p></body></html>`;

export function GET() {
  const html =
    previewHtml && previewHtml.trim().length > 0
      ? previewHtml.replace(
          "</head>",
          // Appended rather than linked so the frame paints in one round trip —
          // an empty flash inside the builder reads as a broken preview.
          `<style>\n${previewCss}\n</style></head>`,
        )
      : FALLBACK;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // The frame is a static artefact keyed by deploy, and it is large (~190 KB
      // before compression). Let it cache; a new capture ships a new deploy.
      "cache-control": "public, max-age=3600",
    },
  });
}
