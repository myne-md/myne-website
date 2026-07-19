/**
 * Theme Builder — the singleton app state shared across the builder's client
 * scripts. ES modules are per-URL singletons, so every `<script>` that imports
 * `appState` (controls, preview, export) gets the SAME store instance — that's
 * how the controls' edits reach the preview and export without a UI framework.
 *
 * Seeded with the canonical LIGHT palette (the "blank light" starting point).
 */
import { createThemeState } from "../lib/themeBuilder/state.mjs";
import { LIGHT_DEFAULTS } from "../lib/themeBuilder/tokens.mjs";

export const appState = createThemeState({ palette: { ...LIGHT_DEFAULTS }, isDark: false });

// Interop/debug handle for a purely-cosmetic tool (no secrets, no vault). Lets
// the preview/export scripts and E2E checks reach the live store.
if (typeof window !== "undefined") {
  (window as unknown as { __themeBuilder?: { state: typeof appState } }).__themeBuilder = {
    state: appState,
  };
}
