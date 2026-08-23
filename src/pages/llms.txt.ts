import type { APIRoute } from "astro";

// llms.txt (https://llmstxt.org) — a curated, link-first index that lets LLMs
// and AI crawlers find the canonical public surfaces without scraping the
// whole site. Built at build time so it uses the per-environment `site`; the
// preview host emits nothing useful (it is excluded from indexing, same as
// robots.txt). Every line stays within docs/threat-model.md guarantees — no
// claim here exceeds what the site itself states.
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "https://myne.md";
  const isPreview = (site?.host ?? "").startsWith("preview.");

  if (isPreview) {
    return new Response("# Preview deployment — not for indexing.\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const body = `# Myne

> Privacy-first, end-to-end encrypted markdown notes. Every byte is encrypted on your device before it leaves; there is no email at signup, and the server stores only ciphertext at rest. Open source (AGPL-3.0) with a public protocol spec and threat model. Pre-alpha.

Myne is a notes app — desktop-first, with a hosted browser client (app.example.com, pre-alpha) and open-source multi-device sync — built on a Rust crypto core (Argon2id key derivation, XChaCha20-Poly1305 authenticated encryption). Encryption is always on — there is no plaintext mode and no encryption opt-in. Recovery is user-held through a 24-word phrase; there is no email reset, by design, because a reset link would be a backdoor. Self-hosted and hosted sync share the same zero-knowledge trust boundary: the server stores and routes ciphertext and never holds a key.

## Core
- [Home](${origin}/): What Myne is and how it seals your notes.
- [How it works](${origin}/#work): Key derivation, local encryption, and ciphertext at rest.
- [Compare](${origin}/#capab): How Myne lines up against Obsidian, Standard Notes, Joplin, and Notesnook.
- [Download](${origin}/download/): Desktop builds for macOS and Linux, plus an Android APK for sideloading. Windows is not built yet. The installers are NOT code-signed and desktop builds are not reproducible; what ships is a minisign-signed SHA256SUMS per release. Early access, pre-alpha.
- [Open the app](https://app.example.com): The hosted desktop-browser client — a window onto a synced vault. It requires sync, and a new browser stays pending until an existing device approves it. Creating a vault, recovering one with a recovery phrase and resetting a forgotten password all work here; adding a device with the phrase does not, and never will. Pre-alpha.
- [User guide](${origin}/user-guide/): The manual for the encrypted desktop app — getting started, the editor, organizing notes, markdown, attachments, search, settings, and recovery.

## Project
- [Specification](${origin}/spec/): The v0.1 cryptographic protocol.
- [Roadmap](${origin}/roadmap/): The phased plan and the anti-features Myne commits to never building.
- [Releases](${origin}/releases/): Every published artefact with its SHA-256 and the minisign public key that signs the checksum list. There is no auto-updater.
- [Ledger](${origin}/ledger/): An append-only record of protocol, threat-model, and spec changes, with the reasoning behind them.
- [Security](${origin}/security/): Coordinated-disclosure policy and researcher acknowledgments.

## Optional
- [Themes](${origin}/themes/): The custom-theme gallery and in-browser theme builder.
- [Ledger RSS](${origin}/ledger/rss.xml): Subscribe to ledger updates.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
