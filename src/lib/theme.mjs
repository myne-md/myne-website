/**
 * Theme runtime for the Myne website: the pure half.
 *
 * The site ships DARK by default (`:root` in styles/tokens.css) and a reader
 * can switch to light; the choice lives in localStorage so it survives a
 * reload and every full-load navigation. There is deliberately NO
 * `prefers-color-scheme` read: the brand register is dark, so a first visit
 * is dark whatever the OS says, and only an explicit switch moves it.
 *
 * Everything here is DOM-optional so `node --test` can drive it: the storage
 * and the root element are passed in (or defaulted to the globals), never
 * reached for at module scope. The DOM wiring (the delegated click listener
 * and the View-Transitions re-sync) lives in components/ThemeToggle.astro, and
 * the pre-paint snippet that avoids a flash lives inline in
 * layouts/LandingLayout.astro (it must run before the stylesheet, so it can
 * not import this module; the three share THEME_KEY and DEFAULT_THEME).
 */

/** localStorage key holding the reader's explicit choice. */
export const THEME_KEY = "myne-theme";

/** Theme shown when nothing is stored: the brand default. */
export const DEFAULT_THEME = "dark";

/** Window event fired after a theme change, for the canvas/JS art to redraw. */
export const THEME_EVENT = "myne:themechange";

/** The two accepted values. Anything else normalises to DEFAULT_THEME. */
export const THEMES = ["dark", "light"];

/** Browser UI chrome colour per theme (the <meta name="theme-color">). */
export const THEME_COLOR = { dark: "#0a0a0a", light: "#fbfbfa" };

/**
 * Coerce any input to a valid theme name. Anything that is not exactly
 * "light" is dark, so a corrupt or absent value can never blank the palette.
 */
export function normalizeTheme(value) {
  return value === "light" ? "light" : DEFAULT_THEME;
}

/** The other theme. */
export function nextTheme(theme) {
  return normalizeTheme(theme) === "light" ? "dark" : "light";
}

/** Read the stored choice; dark when absent, unreadable or corrupt. */
export function readTheme(storage) {
  const store =
    storage ?? (typeof localStorage !== "undefined" ? localStorage : null);
  if (!store) return DEFAULT_THEME;
  try {
    return normalizeTheme(store.getItem(THEME_KEY));
  } catch {
    // Private-mode storage can throw on read; dark is always a safe answer.
    return DEFAULT_THEME;
  }
}

/** Persist a choice. Best-effort: a full/blocked store must not break the UI. */
export function writeTheme(theme, storage) {
  const store =
    storage ?? (typeof localStorage !== "undefined" ? localStorage : null);
  if (!store) return;
  try {
    store.setItem(THEME_KEY, normalizeTheme(theme));
  } catch {
    /* storage unavailable: the switch still works for this page view */
  }
}

/**
 * Apply a theme to a root element. "dark" is written as the literal
 * data-theme="dark" (not the absence of the attribute) so this matches the
 * head snippet and the builder's lock check reads the same on both.
 */
export function applyTheme(root, theme) {
  const t = normalizeTheme(theme);
  if (root && root.dataset) root.dataset.theme = t;
  return t;
}

/** The theme a root element is currently showing. */
export function themeOf(root) {
  return normalizeTheme(root && root.dataset ? root.dataset.theme : null);
}

/** The theme-color value for a theme. */
export function themeColorFor(theme) {
  return THEME_COLOR[normalizeTheme(theme)];
}
