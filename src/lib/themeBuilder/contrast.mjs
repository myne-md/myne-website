// WCAG 2.x relative luminance + contrast ratio. Zero dependencies.
//
// VENDORED VERBATIM from myne-themes/tools/contrast.mjs (SYNC-4) so the builder's
// readability hints use the exact same math as the marketplace CI contrast lint.
// If the source changes, re-copy — do not fork the logic here.

/** Parse a #hex color (3/4/6/8 digits) to [r,g,b] 0-255, or null if not hex. */
export function hexToRgb(hex) {
  if (typeof hex !== "string") return null;
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3 || h.length === 4) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length === 8) h = h.slice(0, 6); // drop alpha for contrast
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function linearize(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance of a hex color, or null if it isn't hex. */
export function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio (1..21) between two hex colors, or null if either isn't hex. */
export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  if (l1 == null || l2 == null) return null;
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
