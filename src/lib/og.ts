import type { CollectionEntry } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

/* =========================================================================
   Unified OG-image system. One dark-brand 1200×630 template renders every
   social card: the static pages (registry below), every ledger entry, and the
   user-guide section. Same design as the site — near-black, Inter display,
   iron-blue accent, hairline rules — with consistent 72×80 padding.

   Inter is the only bundled font, so the technical accents (the badge, the
   URL) lean on uppercase + tracking rather than a separate mono face.
   ========================================================================= */

const require = createRequire(import.meta.url);
const FONT_DIR = dirname(require.resolve("@fontsource/inter/400.css"));
const font = (w: 400 | 600 | 700) =>
  readFileSync(join(FONT_DIR, "files", `inter-latin-${w}-normal.woff`));
const FONTS = [
  { name: "Inter", data: font(400), weight: 400 as const, style: "normal" as const },
  { name: "Inter", data: font(600), weight: 600 as const, style: "normal" as const },
  { name: "Inter", data: font(700), weight: 700 as const, style: "normal" as const },
];

export const OG_W = 1200;
export const OG_H = 630;

// Brand tokens (dark).
const BG = "#0a0a0a";
const TEXT = "#e6e6e4";
const MUTED = "#8a8a86";
const DIM = "#6a6a66";
const LINE = "rgba(255,255,255,0.12)";
export const ACCENT = "#8aa4d0";

// Ledger entry-type → label + status colour (matches the site).
export const TYPE_LABEL: Record<string, string> = {
  shipped: "Shipped",
  thinking: "Thinking",
  milestone: "Milestone",
};
export const TYPE_COLOR: Record<string, string> = {
  shipped: "#7fb89a",
  thinking: "#c2a35e",
  milestone: "#8aa4d0",
};

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#141416"/><rect x="0.6" y="0.6" width="30.8" height="30.8" rx="6.4" fill="none" stroke="#2a2a28" stroke-width="1.2"/><path d="M8 22 V10 L16 18 L24 10 V22" stroke="#e6e6e4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
const LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG)}`;

/* Tiny satori-node helpers (satori takes a React-element-shaped object tree). */
type Node = Record<string, unknown>;
const box = (style: Node, children?: unknown): Node => ({
  type: "div",
  props: { style: { display: "flex", ...style }, ...(children !== undefined ? { children } : {}) },
});
const text = (style: Node, children: string): Node => ({
  type: "div",
  props: { style, children },
});

export interface OgOpts {
  /** Section/type label shown in the top-right badge (rendered uppercase). */
  kicker: string;
  /** Badge + accent-rule colour. Defaults to the iron-blue accent. */
  accent?: string;
  /** Show a status dot before the kicker (ledger entry types). */
  dot?: boolean;
  title: string;
  description: string;
  /** Footer-left display URL, e.g. "myne.md/roadmap". */
  url: string;
  /** Footer-right note, e.g. "Sealed by math." or "Furkan · May 2, 2026". */
  note?: string;
}

const titleSize = (t: string) =>
  t.length > 52 ? "50px" : t.length > 34 ? "58px" : "66px";

export async function renderOgPng(o: OgOpts): Promise<Buffer> {
  const accent = o.accent ?? ACCENT;

  const badgeChildren: unknown[] = [];
  if (o.dot)
    badgeChildren.push(
      box({
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: accent,
      }),
    );
  badgeChildren.push(o.kicker);

  const tree = box(
    {
      width: `${OG_W}px`,
      height: `${OG_H}px`,
      flexDirection: "column",
      backgroundColor: BG,
      padding: "72px 80px",
      fontFamily: "Inter",
      color: TEXT,
    },
    [
      // ---- header: brand + section badge ----
      box({ alignItems: "center", justifyContent: "space-between" }, [
        box({ alignItems: "center", gap: "13px" }, [
          { type: "img", props: { src: LOGO_DATA_URL, width: 36, height: 36, style: { display: "block" } } },
          text(
            { fontSize: "25px", fontWeight: 700, letterSpacing: "-0.01em", color: TEXT },
            "Myne",
          ),
        ]),
        box(
          {
            alignItems: "center",
            gap: "11px",
            padding: "9px 18px",
            border: `1px solid ${LINE}`,
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: accent,
          },
          badgeChildren,
        ),
      ]),

      // ---- main: accent rule + title + description ----
      box({ flexDirection: "column", marginTop: "58px" }, [
        box({
          width: "56px",
          height: "4px",
          borderRadius: "2px",
          backgroundColor: accent,
          marginBottom: "30px",
        }),
        text(
          {
            fontSize: titleSize(o.title),
            lineHeight: 1.05,
            letterSpacing: "-0.022em",
            fontWeight: 700,
            color: TEXT,
            maxWidth: "1010px",
          },
          o.title,
        ),
        text(
          {
            marginTop: "28px",
            fontSize: "26px",
            lineHeight: 1.42,
            fontWeight: 400,
            color: MUTED,
            maxWidth: "920px",
          },
          o.description,
        ),
      ]),

      // ---- footer: hairline + url + note ----
      box({ flexDirection: "column", marginTop: "auto" }, [
        box({ height: "1px", width: "100%", backgroundColor: LINE }),
        box(
          {
            marginTop: "26px",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "18px",
          },
          [
            text({ color: DIM, letterSpacing: "0.01em" }, o.url),
            text(
              { color: o.note ? MUTED : DIM, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "15px", fontWeight: 600 },
              o.note ?? "Sealed by math.",
            ),
          ],
        ),
      ]),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: OG_W,
    height: OG_H,
    fonts: FONTS,
  });

  return Buffer.from(
    new Resvg(svg, { fitTo: { mode: "width", value: OG_W } }).render().asPng(),
  );
}

/* ---- static-page registry ------------------------------------------------ */

export type OgKey =
  | "home"
  | "download"
  | "roadmap"
  | "spec"
  | "security"
  | "releases"
  | "ledger"
  | "guide";

interface PageOg {
  kicker: string;
  title: string;
  description: string;
  note?: string;
  /** Path under the host, no leading/trailing slash. "" = home. */
  path: string;
}

export const PAGE_OG: Record<OgKey, PageOg> = {
  home: {
    kicker: "Encrypted notes",
    title: "Your notes. Sealed.",
    description:
      "A privacy-first markdown notes app that encrypts every byte before it leaves your device, asks for no email, and stores only ciphertext at rest.",
    note: "Sealed by math.",
    path: "",
  },
  download: {
    kicker: "Download",
    title: "Run it on your own machine.",
    description:
      "One desktop app, installed once, running entirely on your device. Code-signed and reproducible — verify the binary matches the public source.",
    note: "signed · reproducible · open",
    path: "download",
  },
  roadmap: {
    kicker: "Roadmap",
    title: "Where Myne is going.",
    description:
      "An order, not a schedule. Foundation, desktop, zero-knowledge sync, and mobile — shipped one phase at a time, inside the public threat model.",
    note: "An order, not a schedule",
    path: "roadmap",
  },
  spec: {
    kicker: "Specification",
    title: "Public by design.",
    description:
      "KDF parameters, AEAD construction, the key hierarchy, recovery derivation, and the account-number scheme — the at-rest encryption, in the open.",
    note: "myne-protocol-v0.1",
    path: "spec",
  },
  security: {
    kicker: "Security",
    title: "Report it. We credit you.",
    description:
      "Acknowledgment-only disclosure: we credit researchers, no monetary bounty yet. Report privately via GitHub security advisories or security@myne.md.",
    note: "coordinated disclosure",
    path: "security",
  },
  releases: {
    kicker: "Releases",
    title: "Pre-alpha, in progress.",
    description:
      "No installers are published yet. The v0.1 spec and threat model are public, in draft; the desktop client is in progress. Watch GitHub releases.",
    note: "v0.1 · pre-alpha",
    path: "releases",
  },
  ledger: {
    kicker: "Ledger",
    title: "Notes from building Myne.",
    description:
      "An append-only record of threat-model, protocol, and spec changes — and the reasoning behind them. Not a blog. Not a roadmap.",
    note: "append-only",
    path: "ledger",
  },
  guide: {
    kicker: "User guide",
    title: "How to use Myne.",
    description:
      "Getting started, the editor, organizing notes, markdown, attachments, search, settings, and recovery — the manual for the encrypted desktop app.",
    note: "careful, by default",
    path: "user-guide",
  },
};

export const displayUrl = (host: string, path: string) =>
  path ? `${host}/${path}` : host;

export const ogImagePath = (key: OgKey) => `/og/${key}.png`;
export const absoluteOg = (key: OgKey, site: URL) =>
  new URL(ogImagePath(key), site).toString();

/* ---- ledger per-entry helpers ------------------------------------------- */

export const ledgerOgPath = (entry: CollectionEntry<"ledger">) =>
  `/ledger/og/${entry.id}.png`;

export const absoluteLedgerOg = (entry: CollectionEntry<"ledger">, site: URL) =>
  new URL(ledgerOgPath(entry), site).toString();
