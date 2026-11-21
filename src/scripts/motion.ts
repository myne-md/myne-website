/*
 * The driver for styles/motion.css.
 *
 * Three jobs, and no framework: reveal on entry, the pointer spotlight a card
 * opts into, and the scroll rail. Everything it does has a no-JS answer (the
 * page renders in its final state, the rail is absent), so a failure here costs
 * polish and never content.
 *
 * It runs once per full page load and re-scans on `astro:page-load`, which is
 * the event Astro's client router fires after it swaps the document. A module
 * script is NOT re-executed on a client-side navigation, so without that
 * listener the guide's second article would arrive with every `[data-motion]`
 * element permanently hidden.
 */

/* Asked, not remembered. Reading this once at module load meant a reader who
   turned reduced motion on (or off) mid-session kept the answer they arrived
   with, and the module outlives a client-side navigation, so the stale answer
   survived every page after it too. */
import { GEOMETRY_COLLAPSING, revealDue } from "../lib/reveal.mjs";

const prefersReduced = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/** Reveals, wired once per element. */
let io: IntersectionObserver | null = null;

function ensureObserver(): IntersectionObserver | null {
  if (io) return io;
  if (typeof IntersectionObserver === "undefined") return null;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        // One-shot: an element that re-animates every time it scrolls back into
        // view turns reading into a slideshow.
        io!.unobserve(e.target);
      }
    },
    {
      // A little way in, so the element is already moving by the time its top
      // edge is comfortably on screen. A threshold of 0 fires on the first
      // pixel, which makes the motion read as a flicker at the fold.
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.01,
    },
  );
  return io;
}

function scanReveals(root: ParentNode = document) {
  const observer = ensureObserver();
  if (!observer) return;

  // Stagger: a group's children land in sequence. The index is written as a
  // custom property and the delay comes from CSS, so the timing is a token.
  root.querySelectorAll<HTMLElement>("[data-motion-group]").forEach((group) => {
    const step = Number(group.dataset.motionStep || 0);
    if (!step) {
      Array.from(group.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--motion-i", String(i));
      });
      return;
    }
    Array.from(group.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty(
        "--motion-i",
        String(i * (step / 90)),
      );
    });
  });

  root.querySelectorAll<HTMLElement>("[data-motion]").forEach((el) => {
    if (el.dataset.motionBound === "1") return;
    el.dataset.motionBound = "1";
    if (COLLAPSING.has(el.dataset.motion ?? "")) {
      // Handled below, never observed: see `sweep` and `lib/reveal.mjs`.
      pending.add(el);
      return;
    }
    observer.observe(el);
  });

  sweep();
}

/** The variants whose hidden state collapses their own box. */
const COLLAPSING = new Set<string>(GEOMETRY_COLLAPSING);

/** Bound, not yet revealed. A Set keeps the sweep idempotent across re-scans. */
const pending = new Set<HTMLElement>();

/**
 * Reveal the collapsing variants from their layout box rather than their
 * visible area.
 *
 * An observer cannot do this job: it measures the intersection, the hidden
 * state exists to make that intersection zero, and so the callback that would
 * undo the hidden state never fires. `offsetHeight` is the layout box and
 * ignores the element's own transform, which is why a `scaleY(0)` wipe is
 * measurable here, and `clip-path` does not move the client rect at all.
 */
function sweep() {
  if (pending.size === 0) return;
  const viewportHeight = window.innerHeight;
  for (const el of pending) {
    if (!el.isConnected) {
      pending.delete(el);
      continue;
    }
    const rect = el.getBoundingClientRect();
    const height = el.offsetHeight || rect.height;
    if (revealDue({ top: rect.top, height }, viewportHeight)) {
      el.classList.add("is-in");
      pending.delete(el);
    }
  }
}

/** The sweep's trigger: the same scroll the rail already listens to. */
let sweepFrame = 0;
function onViewportChange() {
  if (sweepFrame) return;
  sweepFrame = requestAnimationFrame(() => {
    sweepFrame = 0;
    sweep();
  });
}
window.addEventListener("scroll", onViewportChange, { passive: true });
window.addEventListener("resize", onViewportChange, { passive: true });
window.addEventListener("load", onViewportChange);

/** The spotlight: a card that follows the pointer. */
function bindSpotlights(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((el) => {
    if (el.dataset.spotlightBound === "1") return;
    el.dataset.spotlightBound = "1";
    el.addEventListener(
      "pointermove",
      (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      },
      { passive: true },
    );
  });
}

/** The top-edge progress rail. */
function bindRail() {
  const rail = document.querySelector<HTMLElement>("[data-scroll-rail]");
  const fill = rail?.querySelector<HTMLElement>("[data-scroll-rail-fill]");
  if (!rail || !fill) return;
  let frame = 0;
  const paint = () => {
    frame = 0;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.transform = `scaleX(${p})`;
    // Hidden at the very top so a page that has not been scrolled has no
    // second line under the bar.
    rail.toggleAttribute("data-on", window.scrollY > 8);
  };
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(paint);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  paint();
}

/**
 * First-paint choreography: the page does not simply exist, its opening
 * components arrive.
 *
 * A full load used to paint the whole document in one frame, which is why the
 * first screen felt abrupt next to the guide's client-routed pages: those got a
 * view transition and the front door got nothing. So the first section's own
 * children rise in sequence, 70ms apart, and the class that drives it is
 * removed once the last one has landed, so nothing replays on a later
 * navigation and no element keeps a filter alive.
 *
 * Runs on the initial load only. On a client-side navigation the view
 * transition already owns the arrival, and a second entrance underneath it
 * would read as the page stuttering.
 */
const ENTER_STEP = 70;
const ENTER_CAP = 5;

/** Decorative children that must not be choreographed: the hero's noise canvas
 *  and anything pinned out of flow. */
const NOT_ENTERED = /^(SCRIPT|STYLE|CANVAS|SVG)$/;

function enterTargets(): HTMLElement[] {
  const explicit = Array.from(
    document.querySelectorAll<HTMLElement>("[data-enter]"),
  );
  if (explicit.length > 0) return explicit.slice(0, ENTER_CAP);

  // Walk down through wrappers until the container actually holds several
  // things to sequence. A page whose first section is one `<div>` should not
  // animate that one div: that is a plain fade of the whole screen, which is
  // the thing this exists to replace.
  let node: HTMLElement | null = document.querySelector<HTMLElement>(
    "main section, section",
  );
  for (let depth = 0; node && depth < 6; depth++) {
    const kids = Array.from(node.children).filter((el): el is HTMLElement => {
      if (!(el instanceof HTMLElement) || NOT_ENTERED.test(el.tagName)) {
        return false;
      }
      const pos = getComputedStyle(el).position;
      return pos !== "absolute" && pos !== "fixed";
    });
    if (kids.length === 0) return [];
    if (kids.length > 1) return kids.slice(0, ENTER_CAP);
    node = kids[0]!;
  }
  return [];
}

function choreograph() {
  const targets = enterTargets();
  if (targets.length === 0) return;

  targets.forEach((el, i) => {
    el.setAttribute("data-enter", "");
    el.style.setProperty("--enter-i", String(i));
  });
  document.documentElement.classList.add("motion-enter");
  window.setTimeout(
    () => document.documentElement.classList.remove("motion-enter"),
    720 + targets.length * ENTER_STEP,
  );
}

function boot() {
  if (prefersReduced()) return;
  // The class is what arms the hidden-until-revealed rules. It is added here
  // and only here, so a reader whose script never runs sees the finished page
  // rather than an empty one.
  document.documentElement.classList.add("motion-ready");
  scanReveals();
  bindSpotlights();
  bindRail();
  choreograph();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

// A client-side navigation replaces the content but not this module.
document.addEventListener("astro:before-swap", () => {
  // Disarm, so the incoming document is not hidden between the swap and the
  // observer's first callback. It is re-armed by `boot` below.
  document.documentElement.classList.remove("motion-ready");
});
document.addEventListener("astro:page-load", () => {
  if (prefersReduced()) return;
  document.documentElement.classList.add("motion-ready");
  scanReveals();
  bindSpotlights();
  bindRail();
});
