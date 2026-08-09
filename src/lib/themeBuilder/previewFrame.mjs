/**
 * Theme Builder — the captured-interface frame (myne#394).
 *
 * The preview is an iframe serving `/themes/preview-frame.html`: the real Myne
 * editor's DOM and stylesheet, captured from the running desktop app. Three
 * separate `<script>` blocks on the builder page need to reach into it (palette
 * apply, ornament reflect, export's appearance read), and an iframe's document
 * does not exist until it loads — so the wait belongs in one place rather than
 * three, and so does the ornament reflect, which is the half that was wrong.
 *
 * ── WHY THE ORNAMENT REFLECT LIVES HERE ─────────────────────────────────────
 * The builder used to write `data-o-<role>-<primitive>` onto the preview wrapper
 * and stop there. Every rule in `ornaments.css` is scoped under `:root[data-o-on]`,
 * so without that flag the attributes selected nothing — and the site did not
 * load `ornaments.css` at all, so nothing could have drawn them anyway. Both
 * halves are fixed by the snapshot (which carries the real stylesheet) plus the
 * flag below.
 *
 * This mirrors `@myne/ornaments`'s `applyOrnamentAttributes`, including the case
 * that module itself had wrong until this work: the tint wash reflects to no
 * attribute of its own, and still needs the flag.
 */

/**
 * Is this iframe showing the captured snapshot yet?
 *
 * **`readyState === "complete"` is not enough on its own, and trusting it cost
 * an afternoon.** A freshly-created iframe holds an `about:blank` document that
 * is ALREADY "complete". Callers that measure the frame — the measure sliders
 * read every token's built-in default off it — then measured an empty document,
 * found nothing, and concluded no band could be established. All 29 controls
 * removed themselves, silently, with no error anywhere. Whether it happened
 * depended on which won the race, so it worked most of the time, which is the
 * worst frequency for a bug to have.
 *
 * The captured document carries its stylesheet inline, so a sheet count is a
 * reliable "this is the snapshot, not the placeholder" test.
 *
 * Exported for its own test: the failure is a race, and a race is exactly what
 * a browser check reproduces least reliably.
 */
export function isFrameLoaded(frame) {
  let doc;
  try {
    doc = frame?.contentDocument;
  } catch {
    return false; // cross-origin — not ours to read
  }
  return !!doc && doc.readyState === "complete" && (doc.styleSheets?.length ?? 0) > 0;
}

/**
 * Resolve the preview document's root element, once it exists.
 *
 * Calls `fn(root)` with the iframe's `documentElement`. Returns a promise for
 * callers that want to sequence, but the callback form is what the page uses —
 * the three blocks each want "run now if ready, else on load".
 */
export function withPreviewRoot(fn) {
  const frame = document.getElementById("tb-pv-frame");
  if (!frame) return Promise.resolve(null);

  const resolveRoot = () => {
    // Same-origin, so this is reachable; a cross-origin frame would throw here
    // rather than return null, which is why the access is guarded.
    try {
      return frame.contentDocument?.documentElement ?? null;
    } catch {
      return null;
    }
  };

  const isLoaded = () => isFrameLoaded(frame);

  return new Promise((resolve) => {
    const ready = () => {
      const root = resolveRoot();
      if (!root) return resolve(null);
      fn?.(root);
      resolve(root);
    };
    // Already there (a cached frame, where `load` has fired and never will
    // again — the shape that makes a preview blank on a second visit and work on
    // a hard reload).
    if (isLoaded()) return void ready();
    frame.addEventListener(
      "load",
      () => {
        // `load` can still land a tick before the stylesheet is live. Poll a few
        // frames rather than assume; give up rather than hang, so a genuinely
        // missing snapshot degrades to "no measure controls" instead of a
        // spinner that never resolves.
        let tries = 0;
        const settle = () => {
          if (isLoaded() || tries++ > 30) return ready();
          requestAnimationFrame(settle);
        };
        settle();
      },
      { once: true },
    );
  });
}

/**
 * The reflect half now lives in `@myne/preview`'s `apply.mjs` — the ONE
 * implementation, shared with the `myne-themes` gallery renderer, synced into
 * `src/data/preview/` by `scripts/sync-preview.mjs`.
 *
 * This file used to carry its own copy and the gallery carried a third; they had
 * already diverged over `none`, which must be WRITTEN rather than removed
 * (`frame` and `shadow` write their slots on the host and custom properties
 * inherit, so a nested box needs an explicit reset to refuse an inherited
 * frame). Re-exported here so the page's three script blocks keep one import
 * site, and so a reader who greps this file still finds the mechanism.
 */
export {
  ON_ATTR,
  ornamentAttr,
  drawableOrnaments as drawableFromCss,
  ornamentAttributes,
  applyPalette,
  clearPalette,
} from "../../data/preview/apply.mjs";

import { ornamentAttributes as _ornamentAttributes } from "../../data/preview/apply.mjs";

/**
 * Reflect a palette onto `root`, using the vocabulary the loaded stylesheet can
 * actually draw.
 *
 * Thin wrapper over the shared helper: it returns the attribute MAP, and the
 * page wants them written to an element. Returns whether any ornament was
 * selected.
 *
 * @param {Element | null} root
 * @param {Record<string, string>} palette
 * @param {Map<string, Set<string>>} drawable
 */
export function reflectOrnament(root, palette, drawable) {
  if (!root) return false;
  const attrs = _ornamentAttributes(palette, drawable);
  // Clear first: a selection removed in the UI must leave the DOM, and the
  // attribute set shrinks as well as grows.
  for (const a of [...root.attributes].map((x) => x.name)) {
    if (a.startsWith("data-o-")) root.removeAttribute(a);
  }
  for (const [attr, value] of Object.entries(attrs)) root.setAttribute(attr, value);
  return Object.prototype.hasOwnProperty.call(attrs, "data-o-on");
}

/**
 * The ornament attributes the frame's stylesheet can draw, read off its live
 * `document.styleSheets` (the captured CSS is inline in the frame).
 *
 * The shared helper parses CSS TEXT; the builder has a live document instead, so
 * this collects the selectors and hands them over in the same shape.
 *
 * @param {Element | null} root
 */
export function drawableOrnaments(root) {
  const out = new Map();
  const doc = root?.ownerDocument;
  if (!doc) return out;
  for (const sheet of Array.from(doc.styleSheets)) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // an unreadable sheet contributes nothing
    }
    for (const rule of Array.from(rules)) {
      const selector = rule.selectorText;
      if (!selector) continue;
      for (const m of selector.matchAll(/\[data-o-([a-z-]+)="([a-z]+)"\]/g)) {
        const attr = `data-o-${m[1]}`;
        if (!out.has(attr)) out.set(attr, new Set());
        out.get(attr).add(m[2]);
      }
    }
  }
  return out;
}
