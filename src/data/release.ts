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

export const RELEASE_TAG = "v0.8.0";
export const RELEASE_VERSION = "0.8.0";
export const RELEASE_DATE = "2026-09-23";

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
    name: "Myne_0.8.0_universal.dmg",
    bytes: 542230222,
    sha256: "bae1ef3c73013dc4c4e8b110bee13c8e292ff0d53edc1305c266bbf718716c87",
  },
  {
    name: "Myne_0.8.0_arm64.deb",
    bytes: 498304550,
    sha256: "dc981f82a8d20515bb1d66fc42033fe3bb90a5c5ec6fc218aa8959a67e14d6d4",
  },
  {
    name: "Myne_0.8.0_aarch64.AppImage",
    bytes: 164682248,
    sha256: "7edb33004332289de99411cf75b13ec49ba1e40787f4e87fabc6206847fa85ec",
  },
  {
    name: "Myne_0.8.0_universal.apk",
    bytes: 315114565,
    sha256: "a4fc6ecfcb8cb7b8bd9d322e665223d9d957fc8d28880a575e7472bc4874c974",
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
