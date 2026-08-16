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

export const RELEASE_TAG = "v0.5.0";
export const RELEASE_VERSION = "0.5.0";
export const RELEASE_DATE = "2026-08-13";

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
    name: "Myne_0.5.0_universal.dmg",
    bytes: 537064404,
    sha256: "4597613c34335feb3a1700162940889d1f1d77ad7aa2e29c63fc7ecbff88cb18",
  },
  {
    name: "Myne_0.5.0_amd64.deb",
    bytes: 496076406,
    sha256: "e4ea227ba1df344cd52fccb82f1a2d562b7d2948b38d880b0252f9d87fa805a9",
  },
  {
    name: "Myne_0.5.0_arm64.deb",
    bytes: 495536818,
    sha256: "ae61c5ae523460d80c03ac8090c674e57d2c197216c5543eb8be8b5d63a9c14d",
  },
  {
    name: "Myne_0.5.0_amd64.AppImage",
    bytes: 590428664,
    sha256: "4503f31337319ee2d2675e63268024c84798cc171598dae36515d3cb6afbfbbd",
  },
  {
    name: "Myne_0.5.0_aarch64.AppImage",
    bytes: 585619976,
    sha256: "41dc4727dbaa17ba86a742041ebf2fca7f93e5712636971f1519e2b40021c26e",
  },
  {
    name: "myne-bin-0.5.0-1-x86_64.pkg.tar.zst",
    bytes: 494781926,
    sha256: "07c29b07970cb922e8f2d17ad7f1747f04497d73d5225fd08a5e8b20374e74c8",
  },
  {
    name: "Myne_0.5.0_universal.apk",
    bytes: 286730485,
    sha256: "33acf5b0c047f6a6aaa13835ee3ffed7a475ba22d47723070db9cb14b7bb0ee6",
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
