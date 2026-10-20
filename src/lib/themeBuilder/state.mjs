/**
 * Theme Builder: the in-memory theme state (SYNC-1).
 *
 * One flat `{token → "#rrggbb"}` map plus a builder-only `isDark` flag. Controls
 * write it; preview and export read it. The `isDark` flag is builder-only state
 * (it is NOT written into theme.json: it maps to meta.appearance at export,
 * SYNC-8). Zero-dep, framework-free: a tiny observable so the .astro page can
 * wire controls → preview without a UI library.
 *
 * @typedef {import("./tokens.mjs").Palette} Palette
 * @typedef {{ palette: Palette, isDark: boolean }} ThemeSnapshot
 */

/**
 * Create a theme-state store.
 * @param {{ palette?: Palette, isDark?: boolean }} [initial]
 */
export function createThemeState(initial = {}) {
  /** @type {Palette} */
  let palette = { ...(initial.palette ?? {}) };
  let dark = Boolean(initial.isDark);
  /**
   * Tokens the author has deliberately UNLINKED from their anchor. Builder-only
   * state, like `isDark`: it is not written into theme.json (a theme stores raw
   * values either way), it exists so re-deriving a family does not stamp on an
   * override the author made on purpose.
   * @type {Set<string>}
   */
  const pinned = new Set();
  /** @type {Set<(snap: ThemeSnapshot) => void>} */
  const subs = new Set();

  /** @returns {ThemeSnapshot} */
  const snapshot = () => ({ palette: { ...palette }, isDark: dark });
  const notify = () => {
    const snap = snapshot();
    for (const fn of subs) fn(snap);
  };

  return {
    /** @param {string} token */
    get: (token) => palette[token],
    /** @returns {Palette} a defensive copy */
    getPalette: () => ({ ...palette }),
    /** @param {string} token @param {string} value */
    set: (token, value) => {
      palette[token] = value;
      notify();
    },
    /**
     * Set several tokens at once and notify once (e.g. a base color + its derived
     * helper shades). Does not touch `isDark`.
     * @param {Palette} partial
     */
    patch: (partial) => {
      Object.assign(palette, partial);
      notify();
    },
    /**
     * Replace the whole palette (e.g. loading a preset). Optionally set isDark.
     * The pinned set is CLEARED: a preset defines its own anchors, and carrying
     * "unlinked" markers across a preset load would silently refuse to
     * re-derive against the new base: the opposite of what the marker means.
     * @param {Palette} next @param {boolean} [nextDark]
     */
    replace: (next, nextDark) => {
      palette = { ...next };
      pinned.clear();
      if (nextDark !== undefined) dark = Boolean(nextDark);
      notify();
    },
    /** Is this token unlinked from its anchor (an author override)? */
    isPinned: (token) => pinned.has(token),
    /** Unlink a derived shade from its anchor: the value stops following. */
    pin: (token) => {
      if (!pinned.has(token)) {
        pinned.add(token);
        notify();
      }
    },
    /** Re-link a derived shade: it snaps back to its anchor's derivation. */
    unpin: (token) => {
      if (pinned.delete(token)) notify();
    },
    isDark: () => dark,
    /** @param {boolean} v */
    setDark: (v) => {
      dark = Boolean(v);
      notify();
    },
    snapshot,
    /**
     * Subscribe to changes; returns an unsubscribe fn.
     * @param {(snap: ThemeSnapshot) => void} fn
     */
    subscribe: (fn) => {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}
