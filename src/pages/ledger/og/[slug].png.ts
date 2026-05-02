import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { getPublishedLedgerEntries } from "../../../lib/ledger";

const require = createRequire(import.meta.url);
const FONT_DIR = dirname(require.resolve("@fontsource/inter/400.css"));
const loadFont = (weight: 400 | 600 | 700) =>
  readFileSync(join(FONT_DIR, "files", `inter-latin-${weight}-normal.woff`));
const interRegular = loadFont(400);
const interSemibold = loadFont(600);
const interBold = loadFont(700);

const PAPER = "#fbfbfa";
const LINE_1 = "#e3e2dd";
const INK_0 = "#0b0b09";
const INK_2 = "#3a3934";
const INK_3 = "#6b6a64";

const FONT_MONO =
  'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

const TYPE_LABEL: Record<string, string> = {
  shipped: "Shipped",
  thinking: "Thinking",
  milestone: "Milestone",
};

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1a1a17"/><path d="M8 22 V10 L16 18 L24 10 V22" stroke="#fbfbfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
const LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG)}`;

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getPublishedLedgerEntries();
  return entries.map((entry: CollectionEntry<"ledger">) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props, site }) => {
  const entry = props.entry as CollectionEntry<"ledger">;
  const { title, date, type, summary } = entry.data;

  const host = site?.host ?? "myne.md";
  const displayUrl = `${host}/ledger/${entry.id}/`;

  const SUMMARY_MAX = 160;
  const trimmedSummary =
    summary.length > SUMMARY_MAX
      ? summary
          .slice(0, SUMMARY_MAX)
          .replace(/\s+\S*$/, "")
          .replace(/[.,;:—\-\s]+$/, "") + "…"
      : summary;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PAPER,
          padding: "80px 88px",
          fontFamily: "Inter",
          color: INK_0,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "18px",
                color: INK_3,
                fontFamily: FONT_MONO,
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "16px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: INK_2,
                    },
                    children: TYPE_LABEL[type] ?? type,
                  },
                },
                { type: "span", props: { style: { color: LINE_1 }, children: "·" } },
                { type: "span", props: { children: formatDate(date) } },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                marginTop: "32px",
                fontSize: "64px",
                lineHeight: 1.08,
                letterSpacing: "-0.018em",
                fontWeight: 700,
                color: INK_0,
              },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                marginTop: "28px",
                fontSize: "26px",
                lineHeight: 1.45,
                fontWeight: 400,
                color: INK_2,
                maxWidth: "960px",
              },
              children: trimmedSummary,
            },
          },
          {
            type: "div",
            props: {
              style: {
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      height: "1px",
                      backgroundColor: LINE_1,
                      width: "100%",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      marginTop: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          },
                          children: [
                            {
                              type: "img",
                              props: {
                                src: LOGO_DATA_URL,
                                width: 32,
                                height: 32,
                                style: { display: "block" },
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: "22px",
                                  fontWeight: 700,
                                  letterSpacing: "-0.01em",
                                  color: INK_0,
                                },
                                children: "Myne",
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "18px",
                            color: INK_3,
                            fontFamily: FONT_MONO,
                          },
                          children: displayUrl,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interSemibold, weight: 600, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
