/**
 * Theme Builder — client-side file download (Blob + a[download]).
 *
 * No dependency, no server: the file is produced in the browser and handed to
 * the user. `theme.json` alone is import-ready in the desktop app; `meta.json`
 * rides along for a gallery submission. No zip (that would add a dep — SYNC-2).
 */

/**
 * Trigger a download of `contents` as `filename`.
 * @param {string} filename @param {string} contents @param {string} [type]
 */
export function downloadFile(filename, contents, type = "application/json") {
  if (typeof document === "undefined") return;
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
