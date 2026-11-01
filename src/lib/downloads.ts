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
  /** Sort key inside a group: installer kind, so the newest format is not the first row. */
  order: number;
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

/**
 * Which architecture the reader is choosing between, worded for ITS platform.
 *
 * The label used to be computed from the file name alone, so every `arm64` and
 * `aarch64` asset was called "Apple Silicon" — including the Linux .deb and
 * AppImage, where Apple has nothing to do with it. A target triple is accurate
 * and unreadable, which is the other half of the same mistake.
 */
function arch(name: string, platform: "macos" | "linux" | "windows" | "android"): string {
  if (platform === "macos") return /universal/.test(name) ? "Universal" : "Apple Silicon · arm64";
  if (platform === "android") {
    if (name.includes("arm64-v8a")) return "arm64-v8a";
    if (name.includes("armeabi-v7a")) return "armeabi-v7a";
    if (/app-arm64-release/.test(name)) return "arm64";
    if (/app-arm-release/.test(name)) return "arm";
    if (/app-x86_64-release/.test(name)) return "x86_64";
    if (/app-x86-release/.test(name)) return "x86";
    if (/x86\.apk$/.test(name)) return "x86";
    return "universal";
  }
  // Linux and Windows: Arch spells it `aarch64`, everyone else `arm64`.
  if (/aarch64|arm64/.test(name)) return name.endsWith(".pkg.tar.zst") ? "aarch64" : "arm64";
  if (/x86_64|amd64/.test(name)) return "x86_64";
  return "";
}

/** A published decrypter binary is named after its Rust target triple. */
const TRIPLE: Record<string, string> = {
  "aarch64-unknown-linux-gnu": "Linux · arm64",
  "x86_64-unknown-linux-gnu": "Linux · x86_64",
  "universal-apple-darwin": "macOS · Universal",
  "x86_64-pc-windows-msvc": "Windows · x86_64",
};

const LINUX_NOTE =
  "x86_64 and arm64. The AppImage needs no install, just the executable bit.";

/** Where an asset belongs, or null when it is not for a person to install. */
function classify(
  name: string,
): { key: string; title: string; note: string; label: string; order?: number } | null {
  if (SKIP.some((re) => re.test(name))) return null;

  if (name.endsWith(".dmg")) {
    return {
      key: "macos",
      title: "macOS",
      note: "macOS 11 Big Sur or later. Drag the app to Applications.",
      label: `${arch(name, "macos") || "Universal"} .dmg`,
    };
  }
  if (name.endsWith(".pkg")) {
    return {
      key: "macos",
      title: "macOS",
      note: "macOS 11 Big Sur or later. Drag the app to Applications.",
      label: `${arch(name, "macos") || "Universal"} .pkg installer`,
    };
  }
  if (name.endsWith(".AppImage")) {
    return {
      key: "linux",
      title: "Linux",
      note: LINUX_NOTE,
      label: `AppImage · ${arch(name, "linux") || "x86_64"}`,
      order: 10,
    };
  }
  if (name.endsWith(".deb")) {
    return {
      key: "linux",
      title: "Linux",
      note: LINUX_NOTE,
      label: `.deb · ${arch(name, "linux") || "x86_64"}`,
      order: 20,
    };
  }
  if (name.endsWith(".rpm")) {
    return {
      key: "linux",
      title: "Linux",
      note: LINUX_NOTE,
      label: `.rpm · ${arch(name, "linux") || "x86_64"}`,
      order: 30,
    };
  }
  if (name.endsWith(".flatpak")) {
    return {
      key: "linux",
      title: "Linux",
      note: LINUX_NOTE,
      label: `Flatpak · ${arch(name, "linux") || "x86_64"}`,
      order: 40,
    };
  }
  if (name.endsWith(".snap")) {
    return {
      key: "linux",
      title: "Linux",
      note: LINUX_NOTE,
      label: `Snap · ${arch(name, "linux") || "amd64"}`,
      order: 50,
    };
  }
  if (name.endsWith(".pkg.tar.zst")) {
    return {
      key: "linux",
      title: "Linux",
      note: LINUX_NOTE,
      label: `Arch package · ${arch(name, "linux") || "x86_64"}`,
      order: 60,
    };
  }
  if (/^Myne_.*\.tar\.gz$/.test(name)) {
    return {
      key: "linux",
      title: "Linux",
      note: "x86_64 and arm64. The AppImage needs no install, just the executable bit.",
      label: `Portable tarball · ${arch(name, "linux") || "x86_64"}`,
      order: 70,
    };
  }
  if (name.endsWith(".apk")) {
    return {
      key: "android",
      title: "Android",
      note: "Sideload the APK for your phone's ABI. Any file manager can install it once you allow the source.",
      label: `APK · ${arch(name, "android")}`,
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
  if (/^Myne_.*-setup\.exe$/.test(name)) {
    return {
      key: "windows",
      title: "Windows",
      note: "Windows 10 or later, x86_64. Unsigned: no Authenticode certificate exists yet, and no Windows installer has been executed on Windows.",
      label: `NSIS installer · ${arch(name, "windows") || "x86_64"}`,
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
      label: `myne-decrypt · ${
        TRIPLE[name.replace(/^myne-decrypt-/, "").replace(/\.exe$/, "")] ??
        name.replace(/^myne-decrypt-/, "").replace(/\.exe$/, "")
      }`,
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
      order: where.order ?? 100,
    });
  }

  // Within a group the reader is choosing between install kinds first and
  // architectures second, so the order is set by classify() rather than by the
  // order the release happens to publish files in.
  for (const group of groups.values()) {
    group.items.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  }

  return [...groups.values()];
}

/** One line for the archive table: what a release actually contains. */
export function releaseSummary(release: Release): string {
  const groups = downloadGroups(release).filter((g) => g.key !== "other");
  return groups.map((g) => g.title).join(" · ") || "checksums only";
}
