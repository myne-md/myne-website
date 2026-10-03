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

export const RELEASE_TAG = "v0.9.0";
export const RELEASE_VERSION = "0.9.0";
export const RELEASE_DATE = "2026-10-03";

/** Pre-1.0. The download page frames every artefact with this. */
export const RELEASE_CHANNEL = "early access · pre-alpha";

export const DOWNLOADS_ORIGIN = "https://downloads.myne.md";
export const RELEASE_BASE = `${DOWNLOADS_ORIGIN}/releases/${RELEASE_TAG}`;

/**
 * Public halves of the offline release-signing keys. They sign SHA256SUMS, NOT
 * the installers — see `operations/runbooks/release-signing-key-custody.md`.
 *
 * The key rotated on 2026-10-03: the previous key was held only on a machine no
 * longer used to sign, so a new one was minted (no compromise is implied). Both
 * are published in three places on purpose (here, security.txt, and the origin's
 * own index.json) so a reader who distrusts one origin can compare. Releases at
 * or after v0.9.0 verify against the first key; earlier releases against the
 * second. `minisign -Vm SHA256SUMS -P <key>` takes one key at a time.
 */
export const MINISIGN_PUBKEY = "RWRk3+M9oGvHo33oHg5kOL7a5DbNj8sR2KPLg0gwHMujnHOpQI+kX+nm";
export const MINISIGN_PUBKEYS = [
  "RWRk3+M9oGvHo33oHg5kOL7a5DbNj8sR2KPLg0gwHMujnHOpQI+kX+nm",
  "RWSzhweIGbX53vxsmyZ218e3pqUU8/zKiqHMarzXv3Ddx4rcyvDQOT5k",
];

export interface ReleaseAsset {
  /** File name, exactly as it appears in SHA256SUMS. */
  name: string;
  bytes: number;
  sha256: string;
}

export const ASSETS: ReleaseAsset[] = [
  { name: "Myne_0.9.0_aarch64.AppImage", bytes: 253188616, sha256: "0f2e52161173e4b3782c33e1146d5f4343eb7e95e1994c9f573d2338fb558efc" },
  { name: "Myne_0.9.0_amd64.AppImage", bytes: 257595896, sha256: "46ded4de989d5031b089b6d52c6ad5138f384d111e1c73d30f12b58eb89eef0b" },
  { name: "Myne_0.9.0_amd64.deb", bytes: 157304056, sha256: "cf9dbf894a32987c199168f05aaaf43627dd813e57e067a5afee4349c68290fc" },
  { name: "Myne_0.9.0_amd64.tar.gz", bytes: 279220650, sha256: "cd7ab7f9c29c46adc5093e1cb2be27a5ee294488225d19edb93194ea4a7a0bed" },
  { name: "Myne_0.9.0_arm64-v8a.apk", bytes: 126368655, sha256: "599152b6c030ca060412b504bc1ed12cc85dbed532f60cc1e6075fc3572b9c3d" },
  { name: "Myne_0.9.0_arm64.deb", bytes: 156775510, sha256: "f357f3843d46b44c7ba310ffdb02d5bc4d1e2d32dc7984fb81506a21cbb3f2bb" },
  { name: "Myne_0.9.0_arm64.tar.gz", bytes: 274541601, sha256: "2828d2bbb504db8e93af7891dd808ca1038a22f1828b0d91b897f7e66d712dfc" },
  { name: "Myne_0.9.0_armeabi-v7a.apk", bytes: 111311853, sha256: "6376a84794526e5b285f535d97c36b391f8610677cf9c582c7301351eb2af28f" },
  { name: "Myne_0.9.0_universal.dmg", bytes: 200013450, sha256: "938cea30273ecaf9d1f548d5144350773217ff294bcd389dbdd809343d812e11" },
  { name: "Myne_0.9.0_universal.pkg", bytes: 200172069, sha256: "603a77f3ebf88406c5471244b0054ba612f5409334df9de3eed6b5f28e2f9c5a" },
  { name: "Myne_0.9.0_x86_64.apk", bytes: 127343940, sha256: "8da3c8f0fe973403c80ad92faa779e955b99cb051a5a6d99a7dac51f5a78bdf4" },
  { name: "Myne_0.9.0_x86.apk", bytes: 129078389, sha256: "59685834fc551522111b33739f2d4ee652cf28dba8ca3e4c42845a65029134cf" },
  { name: "Myne_0.9.0.aab", bytes: 94840551, sha256: "1eafd47c741d8731df31ebe6f753359efab67dc5c6894725a8db72adb1043fa8" },
  { name: "Myne-0.9.0-ios.ipa", bytes: 92216185, sha256: "6f4b7a173732cd2cca597f518605da9443d65d1653998ebd1f68bd2b257caebc" },
  { name: "myne-bin-0.9.0-1-x86_64.pkg.tar.zst", bytes: 155306084, sha256: "0c9be88e7b9ee1a914d5c9fa4f4bd038b865fddbb8c2d67c919e01e6d373b7b8" },
  { name: "myne-clipper-0.9.0.zip", bytes: 44521, sha256: "28f47cacd4bd4a1e4d5acb217bc60c1511ddf4dbd7dd0e2e4c2fa3b31a121250" },
  { name: "myne-decrypt-aarch64-unknown-linux-gnu", bytes: 3494312, sha256: "af712ff7de029c49517162b1d3b6768ea537b3c4e2aab6366a72ba9b2e1de3a8" },
  { name: "myne-decrypt-universal-apple-darwin", bytes: 6288736, sha256: "8c2dd852bd31d81d06470c3a225974f22ef74bc9e59d4639f1aa26b257e53bbd" },
  { name: "myne-decrypt-x86_64-pc-windows-msvc.exe", bytes: 2868224, sha256: "9f27371654c55d218cb514b258e2570e5af2654dd3a8fe51a776917e3b8d547a" },
  { name: "myne-decrypt-x86_64-unknown-linux-gnu", bytes: 3697864, sha256: "c488c9c638c7f2c2f8e31eeb149e3557618f86f95eabcfe287cd2a03cb548047" },
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
