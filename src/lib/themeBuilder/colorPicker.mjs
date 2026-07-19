/**
 * Theme Builder — a custom, on-register color picker (zero-dep, vanilla).
 *
 * Replaces the browser's native `<input type=color>` OS dialog with a styled
 * HSV popover (saturation/value square + hue slider + hex field). The pure
 * conversions are exported + unit-tested; the DOM controller is built lazily by
 * `createColorPicker` (no top-level `document`, so this module imports safely in
 * node tests). Emits `#rrggbb` — always allowlist-valid.
 */
import { hexToRgb } from "./contrast.mjs";

// ── pure color math ──────────────────────────────────────────────────────────

// hex → [r,g,b] is the vendored parser (3/4/6/8 digits, drops alpha). Re-exported
// so this stays the picker's single color-math surface and the test resolves it.
export { hexToRgb };

/** [r,g,b] 0-255 → "#rrggbb". */
export function rgbToHex(r, g, b) {
  const to = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** [r,g,b] 0-255 → { h:0-360, s:0-1, v:0-1 }. */
export function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

/** { h,s,v } → [r,g,b] 0-255. */
export function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** hex → { h,s,v } (null → red at 0,0,0). */
export function hexToHsv(hex) {
  const rgb = hexToRgb(hex) ?? [0, 0, 0];
  return rgbToHsv(...rgb);
}

/** { h,s,v } → "#rrggbb". */
export function hsvToHex(h, s, v) {
  return rgbToHex(...hsvToRgb(h, s, v));
}

/** Coerce free text to "#rrggbb" (expands shorthand, lowercases), or null. */
export function normalizeHex(input) {
  const rgb = hexToRgb(input);
  return rgb ? rgbToHex(...rgb) : null;
}

const clamp01 = (n) => Math.max(0, Math.min(1, n));

// ── DOM controller ───────────────────────────────────────────────────────────

/**
 * Create the singleton picker popover. Returns `{ open(anchor, hex), close(), el }`.
 * `onChange(hex)` fires live as the user drags/types.
 * @param {{ onChange: (hex: string) => void }} opts
 */
export function createColorPicker({ onChange }) {
  let h = 0;
  let s = 0;
  let v = 0;
  let isOpen = false;

  const root = document.createElement("div");
  root.className = "tb-cp";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", "Choose a color");
  root.hidden = true;
  root.innerHTML = `
    <div class="tb-cp-sv"><div class="tb-cp-sv-thumb"></div></div>
    <div class="tb-cp-hue"><div class="tb-cp-hue-thumb"></div></div>
    <div class="tb-cp-foot">
      <span class="tb-cp-swatch"></span>
      <input class="tb-cp-hex" type="text" spellcheck="false" autocomplete="off" aria-label="Hex color" maxlength="7" />
    </div>`;
  document.body.appendChild(root);

  const sv = root.querySelector(".tb-cp-sv");
  const svThumb = root.querySelector(".tb-cp-sv-thumb");
  const hue = root.querySelector(".tb-cp-hue");
  const hueThumb = root.querySelector(".tb-cp-hue-thumb");
  const swatch = root.querySelector(".tb-cp-swatch");
  const hexInput = /** @type {HTMLInputElement} */ (root.querySelector(".tb-cp-hex"));

  const hex = () => hsvToHex(h, s, v);

  function render() {
    const hueHex = hsvToHex(h, 1, 1);
    sv.style.background = `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), ${hueHex}`;
    svThumb.style.left = `${s * 100}%`;
    svThumb.style.top = `${(1 - v) * 100}%`;
    hueThumb.style.left = `${(h / 360) * 100}%`;
    const cur = hex();
    swatch.style.background = cur;
    // Skip the hex field only while the user is typing in it (avoids clobbering).
    if (document.activeElement !== hexInput) hexInput.value = cur;
    return cur;
  }

  function emit() {
    onChange(render());
  }

  // drag helper: track pointer over an element, calling fn(fracX, fracY)
  function drag(el, fn) {
    let active = false;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      fn(clamp01((e.clientX - r.left) / r.width), clamp01((e.clientY - r.top) / r.height));
      emit();
    };
    el.addEventListener("pointerdown", (e) => {
      active = true;
      el.setPointerCapture(e.pointerId);
      move(e);
    });
    el.addEventListener("pointermove", (e) => {
      if (active) move(e);
    });
    el.addEventListener("pointerup", (e) => {
      active = false;
      el.releasePointerCapture(e.pointerId);
    });
  }

  drag(sv, (fx, fy) => {
    s = fx;
    v = 1 - fy;
  });
  drag(hue, (fx) => {
    h = fx * 360;
  });

  hexInput.addEventListener("input", () => {
    const norm = normalizeHex(hexInput.value);
    if (!norm) return;
    ({ h, s, v } = hexToHsv(norm));
    render();
    onChange(norm);
  });

  // dismiss on outside pointerdown (ignore clicks on a swatch trigger — those
  // re-open the picker) and Escape.
  function onDocDown(e) {
    if (root.contains(e.target)) return;
    if (e.target instanceof Element && e.target.closest(".tb-ctl")) return;
    close();
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }

  function position(anchor) {
    const a = anchor.getBoundingClientRect();
    const w = root.offsetWidth || 224;
    const ht = root.offsetHeight || 220;
    // prefer to the right of the swatch; flip left if it would overflow
    let left = a.right + 10;
    if (left + w > window.innerWidth - 8) left = a.left - w - 10;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = a.top - 8;
    top = Math.max(8, Math.min(top, window.innerHeight - ht - 8));
    root.style.left = `${left}px`;
    root.style.top = `${top}px`;
  }

  /** @param {HTMLElement} anchor @param {string} startHex */
  function open(anchor, startHex) {
    ({ h, s, v } = hexToHsv(normalizeHex(startHex) ?? "#000000"));
    root.hidden = false;
    render();
    position(anchor);
    if (!isOpen) {
      isOpen = true;
      // defer so the opening click doesn't immediately dismiss
      setTimeout(() => {
        document.addEventListener("pointerdown", onDocDown, true);
        document.addEventListener("keydown", onKey);
      }, 0);
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.hidden = true;
    document.removeEventListener("pointerdown", onDocDown, true);
    document.removeEventListener("keydown", onKey);
  }

  return { el: root, open, close };
}
