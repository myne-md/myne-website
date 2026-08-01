// Terminal-session ("asciinema-style") player for the user guide's `myne` CLI
// demos. Zero third-party dependency: the CLI emits plain UTF-8 (no ANSI), so
// playback is string concatenation into a <pre>, and the asciicast v2 format
// is read by our own `parseCast` (src/lib/cast.mjs).
//
// Brand + a11y discipline (PRODUCT.md "no looping animations", reduced-motion
// disables all motion):
//   - the FULL transcript is rendered up front (static), so no-JS and
//     screen-reader users get the complete text and there is nothing to "wait
//     for";
//   - motion is strictly user-initiated (Replay), NEVER autoplay, and NEVER
//     loops — playback stops at the end;
//   - under `prefers-reduced-motion` the animated controls are hidden entirely
//     and only Copy remains;
//   - playback is torn down on client-router navigation (astro:before-swap).
//
// Security: a .cast file is untrusted input — it is only ever written to the
// DOM via `textContent`, never innerHTML (mirrors applyPreview.mjs discipline;
// the site serves no CSP, so the code is the only gate).

import { parseCast, transcriptAt } from "../lib/cast.mjs";

const mounted = new WeakSet<Element>();
const pausers = new Set<() => void>();

function prefersReducedMotion(): boolean {
  return !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

async function mountOne(host: HTMLElement): Promise<void> {
  if (mounted.has(host)) return;
  mounted.add(host);

  const url = host.getAttribute("data-cast");
  if (!url) return;

  let cast: ReturnType<typeof parseCast>;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cast = parseCast(await res.text());
  } catch {
    // Leave the host empty rather than surface an error into the article.
    return;
  }

  const title = cast.header.title ?? host.getAttribute("data-title") ?? "terminal";
  const label = host.getAttribute("aria-label") || `Terminal session: ${title}`;
  const duration = cast.duration;
  const reduced = prefersReducedMotion();

  // ---- DOM (textContent only; never innerHTML with cast data) ----
  const frame = el("div", "ug-cast__frame");
  frame.setAttribute("role", "group");
  frame.setAttribute("aria-label", label);

  const bar = el("div", "ug-cast__bar");
  const dots = el("span", "ug-cast__dots");
  dots.append(el("i"), el("i"), el("i"));
  const titleEl = el("span", "ug-cast__title", title);
  const spacer = el("span", "ug-cast__spacer");
  bar.append(dots, titleEl, spacer);

  const playBtn = el("button", "ug-cast__btn", "Replay");
  playBtn.type = "button";
  playBtn.setAttribute("aria-label", "Replay the typing animation");
  const copyBtn = el("button", "ug-cast__btn", "Copy");
  copyBtn.type = "button";
  copyBtn.setAttribute("aria-label", "Copy the terminal text");

  const screen = el("pre", "ug-cast__screen");
  screen.tabIndex = 0;
  screen.textContent = cast.transcript; // static full render by default

  const scrub = el("input", "ug-cast__scrub") as HTMLInputElement;
  scrub.type = "range";
  scrub.min = "0";
  scrub.max = String(duration || 0);
  scrub.step = "0.01";
  scrub.value = String(duration || 0);
  scrub.setAttribute("aria-label", "Scrub the terminal session");

  if (reduced) {
    // Motion-sensitive: no animated playback at all, just the full text + Copy.
    bar.append(copyBtn);
    frame.append(bar, screen);
  } else {
    bar.append(playBtn, copyBtn);
    frame.append(bar, screen, scrub);
  }
  host.replaceChildren(frame);

  // ---- Copy (works in both modes) ----
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(cast.transcript);
      copyBtn.textContent = "Copied";
      window.setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
    } catch {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(screen);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  });

  if (reduced || duration <= 0) return; // nothing more to wire without motion

  // ---- Playback: a wall-clock rAF loop (playback need not be deterministic;
  //      only the .cast bytes are). `pos` is the current cast-time in seconds. ----
  let raf = 0;
  let pos = duration; // starts showing the full transcript
  let playing = false;
  let startWall = 0;
  let base = 0;

  const render = (t: number) => {
    screen.textContent = transcriptAt(cast.events, t);
    scrub.value = String(t);
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    playing = false;
    pausers.delete(pause);
    playBtn.textContent = pos >= duration ? "Replay" : "Play";
  };

  function pause(): void {
    if (!playing) return;
    pos = base + (performance.now() - startWall) / 1000;
    if (pos > duration) pos = duration;
    render(pos);
    stop();
  }

  const tick = () => {
    pos = base + (performance.now() - startWall) / 1000;
    if (pos >= duration) {
      render(duration);
      pos = duration;
      stop(); // ends and holds — never loops
      return;
    }
    render(pos);
    raf = requestAnimationFrame(tick);
  };

  const play = () => {
    if (playing) return;
    if (pos >= duration) pos = 0; // Replay/Play from a finished state restarts
    base = pos;
    startWall = performance.now();
    playing = true;
    playBtn.textContent = "Pause";
    pausers.add(pause);
    raf = requestAnimationFrame(tick);
  };

  playBtn.addEventListener("click", () => (playing ? pause() : play()));
  scrub.addEventListener("input", () => {
    if (playing) pause();
    pos = Number(scrub.value);
    render(pos);
    playBtn.textContent = pos >= duration ? "Replay" : "Play";
  });
}

/** Mount every not-yet-mounted cast placeholder in the article. */
export function mountCastPlayers(root: ParentNode = document): void {
  root
    .querySelectorAll<HTMLElement>(".ledger-prose [data-cast]")
    .forEach((host) => void mountOne(host));
}

/** Pause every playing cast — called on client-router navigation so a session
 *  never keeps animating after you leave the page. */
export function pauseCastPlayers(): void {
  for (const pause of [...pausers]) pause();
}
