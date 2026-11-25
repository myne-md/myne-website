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

> Privacy-first, end-to-end encrypted markdown notes. Every byte is encrypted on your device before it leaves; there is no email at signup, and the server stores only ciphertext at rest. Open source (AGPL-3.0-only-only) with a public protocol spec and threat model. Alpha.

Myne is a notes app — desktop-first, with an open-source sync server and an open-source browser client you run yourself (Myne hosts no instance of either) — built on a Rust crypto core (Argon2id key derivation, XChaCha20-Poly1305 authenticated encryption). Encryption is always on — there is no plaintext mode and no encryption opt-in. Recovery is user-held through a 24-word phrase; there is no email reset, by design, because a reset link would be a backdoor. Whatever server you point the client at shares the same zero-knowledge trust boundary: it stores and routes ciphertext and never holds a key.

## Core
- [Home](${origin}/): What Myne is and how it seals your notes.
- [Compare](${origin}/#capab): How Myne lines up against Obsidian, Standard Notes, Joplin, and Notesnook.
- [Features](${origin}/features/): What is actually in it: collaboration on a shared vault, the on-device assistant, meeting notes recorded and transcribed on the device, encryption, the graph, search, and a sync server you can run yourself, each with the limits it stops at.
- [Run the browser client](https://myne.md/user-guide/getting-started/run-your-own-browser-client/): the desktop-browser client is built from source and served yourself. A window onto a synced vault, so it requires sync. Creating a vault, recovering one with a recovery phrase, resetting a forgotten password and adding a device with the phrase all work there. A browser joining an ACCOUNT THAT ALREADY EXISTS stays pending until one of your other devices approves it; a browser that creates the account, or recovers it with the phrase, is approved as the first device. Alpha.
- [User guide](${origin}/user-guide/): The manual for the encrypted desktop app — getting started, the editor, organizing notes, markdown, attachments, search, settings, and recovery.

## Project
- [Specification](${origin}/spec/): The v0.1 cryptographic protocol.
- [Security](${origin}/security/): Coordinated-disclosure policy and researcher acknowledgments.

## Optional
- [Themes](${origin}/themes/): The custom-theme gallery and in-browser theme builder.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
