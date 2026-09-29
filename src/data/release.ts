/**
 * The current Myne release, as published at downloads.myne.md.
 *
 * ── Why this file exists ───────────────────────────────────────────────────
 *
 * The version was hand-typed in twenty-odd places and said `v0.1` for four
 * releases. One constant, imported everywhere, is the fix.
 *
 * ── Why the hashes are HERE and not fetched ────────────────────────────────
 *
 * This is not a convenience copy of what downloads.myne.md already serves. It
 * is the second witness, and it only works because it is a *different* one:
 * these bytes ship from `myne-website`, through its own Woodpecker chain, onto
 * `myne.md` (91.99.208.85). The artefacts ship from `operations`, by hand, onto
 * the status box (50.114.185.189). Every myne-md repository is private, so
 * there is no public git record to anchor a release hash the way
 * `docs/web-bundle-hashes.md` anchors a web bundle — this page is the anchor.
 *
 * Fetching them at runtime would collapse that: a compromised downloads origin
 * would then be supplying both the binary and the hash a reader checks it
 * against. So: no fetch, no CORS, plain <a href>. Same reasoning as
 * StatusBadge.astro, which links to status.myne.md rather than polling it.
 *
 * ── Updating ───────────────────────────────────────────────────────────────
 *
 * `operations/runbooks/downloads-origin.md` §4b, last step. Copy the values from
 * the release's own SHA256SUMS after `stage-release.sh` has verified them
 * against the GitHub release both ways — never by reading them off the origin,
 * which is the thing this file exists to check.
 */

export const RELEASE_TAG = "v0.8.1";
export const RELEASE_VERSION = "0.8.1";
export const RELEASE_DATE = "2026-09-29";

/** Pre-1.0. The download page frames every artefact with this. */
export const RELEASE_CHANNEL = "early access · pre-alpha";

export const DOWNLOADS_ORIGIN = "https://downloads.myne.md";
export const RELEASE_BASE = `${DOWNLOADS_ORIGIN}/releases/${RELEASE_TAG}`;

/**
 * Public half of the offline release-signing key. It signs SHA256SUMS, NOT the
 * installers — see `operations/runbooks/release-signing-key-custody.md`.
 *
 * Published in three places on purpose (here, security.txt, and the origin's
 * own index.json) so that a reader who distrusts one origin can compare.
 */
export const MINISIGN_PUBKEY = "RWSzhweIGbX53vxsmyZ218e3pqUU8/zKiqHMarzXv3Ddx4rcyvDQOT5k";

export interface ReleaseAsset {
  /** File name, exactly as it appears in SHA256SUMS. */
  name: string;
  bytes: number;
  sha256: string;
}

export const ASSETS: ReleaseAsset[] = [
  {
    name: "Myne_0.8.1_universal.dmg",
    bytes: 542277360,
    sha256: "682c02ee525658b86b5e9b4f6faef9c910815183ff728345291ceba1f97404b0",
  },
];

export function assetUrl(name: string): string {
  return `${RELEASE_BASE}/${name}`;
}

export function assetByName(name: string): ReleaseAsset {
  const found = ASSETS.find((a) => a.name === name);
  // A typo'd file name would otherwise render a link that 404s, silently, on a
  // page whose whole job is handing people a working installer.
  if (!found) throw new Error(`release.ts: no asset named ${name}`);
  return found;
}

/** "512 MB" — what a person reads before clicking a half-gigabyte link. */
export function humanSize(bytes: number): string {
  return `${Math.round(bytes / 1_000_000)} MB`;
}
