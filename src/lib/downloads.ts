/**
 * Turning a release's asset list into something a person can choose from.
 *
 * The roster is flat and name-driven (`Myne_0.9.0_amd64.deb`), which is right
 * for verification and wrong for a download page: nobody wants to read
 * twenty-one file names to find the one for their machine, and a `.aab` or a
 * Tauri updater payload in that list invites a download that cannot be
 * installed.
 *
 * Two rules, both of which are about not handing someone a broken file:
 *
 * 1. Artefacts a person cannot install are DROPPED, not listed and explained.
 *    A `.aab` is a Play Store bundle, not a sideload, and `Myne.app.tar.gz` is
 *    the updater's payload; the origin still serves both, and the archive row
 *    links the origin directory for anyone who needs them.
 * 2. A platform with nothing in a given release gets no group. The old page
 *    carried three fixed platform cards and filled the empty ones with "not
 *    built for this release", which made every release look like a broken one.
 *    Here a group exists only when it has something in it, and the archive row
 *    says what each release contains in one line instead.
 */
import type { Release, ReleaseAsset } from "../data/release";
import { assetUrl, humanSize } from "../data/release";

export interface DownloadItem {
  name: string;
  /** What the reader is choosing between: an architecture, an installer kind. */
  label: string;
  url: string;
  size: string;
  sha256: string;
}

export interface DownloadGroup {
  key: string;
  /** Group heading, e.g. "macOS" or "Command line". */
  title: string;
  /** One line on what this group is for, shown under the heading. */
  note: string;
  items: DownloadItem[];
}

const SKIP = [
  /\.aab$/, // Play Store bundle, not a sideload
  /^Myne\.app\.tar\.gz$/, // the updater's payload
  /\.sig$/, // the updater's detached signature
];

const arch = (name: string): string => {
  if (/universal/.test(name)) return "Universal";
  if (/aarch64|arm64|apple-darwin/.test(name)) return "Apple Silicon · arm64";
  if (/x86_64|amd64/.test(name)) return "x86_64";
  if (/arm64-v8a/.test(name)) return "arm64-v8a";
  if (/armeabi-v7a|app-arm-release/.test(name)) return "armeabi-v7a";
  if (/app-arm64-release/.test(name)) return "arm64";
  if (/x86-release/.test(name)) return "x86";
  if (/app-x86_64-release/.test(name)) return "x86_64";
  if (/x86\.apk$/.test(name)) return "x86";
  if (/arm64\.deb$|arm64\.tar\.gz$|aarch64\.AppImage$/.test(name)) return "arm64";
  return "";
};

/** Where an asset belongs, or null when it is not for a person to install. */
function classify(name: string): { key: string; title: string; note: string; label: string } | null {
  if (SKIP.some((re) => re.test(name))) return null;

  if (name.endsWith(".dmg")) {
    return {
      key: "macos",
      title: "macOS",
      note: "macOS 11 Big Sur or later. Drag the app to Applications.",
      label: `${arch(name) || "Universal"} .dmg`,
    };
  }
  if (name.endsWith(".pkg")) {
    return {
      key: "macos",
      title: "macOS",
      note: "macOS 11 Big Sur or later. Drag the app to Applications.",
      label: `${arch(name) || "Universal"} .pkg installer`,
    };
  }
  if (name.endsWith(".AppImage")) {
    return {
      key: "linux",
      title: "Linux",
      note: "x86_64 and arm64. The AppImage needs no install, just the executable bit.",
      label: `AppImage · ${arch(name) || "x86_64"}`,
    };
  }
  if (name.endsWith(".deb")) {
    return {
      key: "linux",
      title: "Linux",
      note: "x86_64 and arm64. The AppImage needs no install, just the executable bit.",
      label: `.deb · ${arch(name) || "x86_64"}`,
    };
  }
  if (name.endsWith(".pkg.tar.zst")) {
    return {
      key: "linux",
      title: "Linux",
      note: "x86_64 and arm64. The AppImage needs no install, just the executable bit.",
      label: "Arch package · x86_64",
    };
  }
  if (/^Myne_.*\.tar\.gz$/.test(name)) {
    return {
      key: "linux",
      title: "Linux",
      note: "x86_64 and arm64. The AppImage needs no install, just the executable bit.",
      label: `Portable tarball · ${arch(name) || "x86_64"}`,
    };
  }
  if (name.endsWith(".apk")) {
    return {
      key: "android",
      title: "Android",
      note: "Sideload the APK for your phone's ABI. Any file manager can install it once you allow the source.",
      label: `APK · ${arch(name) || "unknown ABI"}`,
    };
  }
  if (name.endsWith(".ipa")) {
    return {
      key: "ios",
      title: "iOS",
      note: "An .ipa installs only on a device with a development certificate, so most readers cannot use this yet.",
      label: "iOS .ipa",
    };
  }
  if (/^myne-clipper-.*\.zip$/.test(name)) {
    return {
      key: "clipper",
      title: "Browser clipper",
      note: "The extension source for a manual load. The store listings are the normal install.",
      label: "Clipper .zip",
    };
  }
  if (/^myne-decrypt-/.test(name)) {
    return {
      key: "cli",
      title: "Command line",
      note: "The standalone decrypter: opens a vault without the app installed. It holds no keys of its own.",
      label: `myne-decrypt · ${name.replace(/^myne-decrypt-/, "").replace(/\.exe$/, "")}`,
    };
  }
  return {
    key: "other",
    title: "Other files",
    note: "Published with this release and not a download for a person.",
    label: name,
  };
}

export function downloadGroups(release: Release): DownloadGroup[] {
  const groups = new Map<string, DownloadGroup>();

  for (const asset of release.assets as ReleaseAsset[]) {
    const where = classify(asset.name);
    if (!where) continue;
    let group = groups.get(where.key);
    if (!group) {
      group = { key: where.key, title: where.title, note: where.note, items: [] };
      groups.set(where.key, group);
    }
    group.items.push({
      name: asset.name,
      label: where.label,
      url: assetUrl(asset.name, release.tag),
      size: humanSize(asset.bytes),
      sha256: asset.sha256,
    });
  }

  return [...groups.values()];
}

/** One line for the archive table: what a release actually contains. */
export function releaseSummary(release: Release): string {
  const groups = downloadGroups(release).filter((g) => g.key !== "other");
  return groups.map((g) => g.title).join(" · ") || "checksums only";
}
