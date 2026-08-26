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

export const RELEASE_TAG = "v0.6.0";
export const RELEASE_VERSION = "0.6.0";
export const RELEASE_DATE = "2026-08-26";

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
    name: "Myne_0.6.0_universal.dmg",
    bytes: 538244457,
    sha256: "ba5d360852c338b47e1fbcde3e5d409acb4a7ced4141342b1e513792f7d22cae",
  },
  {
    name: "Myne_0.6.0_amd64.deb",
    bytes: 496703512,
    sha256: "d418dd78bbbf3d27ec1a6568d206a72220840fbfda063017b321dcfd813d3753",
  },
  {
    name: "Myne_0.6.0_arm64.deb",
    bytes: 496115110,
    sha256: "8dd379767c8d330cc69ac2f6f0d440bb1ffa0ae69b8ec541432237ead430f673",
  },
  {
    name: "Myne_0.6.0_amd64.AppImage",
    bytes: 590993912,
    sha256: "a8af41651734544710e1e6c7ba211086dad8be00d825a1701a2741d54e6bbe3a",
  },
  {
    name: "Myne_0.6.0_aarch64.AppImage",
    bytes: 586156552,
    sha256: "c18010da272b5e874b3f3669ed2079ce3b217beb6d190d38a8b9a8f3ae23ac1c",
  },
  {
    name: "myne-bin-0.6.0-1-x86_64.pkg.tar.zst",
    bytes: 495326918,
    sha256: "169e616a7d550c8e730f25e0dad02b8ea3fdb646ce1331082d132e3bd4577a67",
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
