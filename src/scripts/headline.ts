// Slow, ambient encrypt-cycle on a target word. Once every cycleMs,
// the word's glyphs scramble to random Crockford-base32 chars and resolve
// back to the original. Width is preserved by inline-block letter spans
// frozen to their measured widths.

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function randCrock(): string {
  const buf = new Uint8Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= 256 - (256 % 32));
  return CROCKFORD[buf[0] % 32];
}

interface CycleConfig {
  cycleMs: number;     // total period between cycle starts
  scrambleMs: number;  // how long the scramble lasts before resolving
}

export function mountHeadlineCycle(el: HTMLElement, cfg: CycleConfig): void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const original = el.textContent || "";
  const chars = [...original];

  // Replace the text node with per-letter spans. Measure widths once on layout,
  // pin them so cycling never reflows the headline.
  el.textContent = "";
  const spans: HTMLSpanElement[] = chars.map((c) => {
    const s = document.createElement("span");
    s.textContent = c;
    s.style.display = "inline-block";
    s.style.willChange = "contents";
    return s;
  });
  for (const s of spans) el.appendChild(s);

  // Pin widths in a microtask so layout has resolved.
  queueMicrotask(() => {
    for (const s of spans) {
      s.style.minWidth = `${s.getBoundingClientRect().width}px`;
      s.style.textAlign = "center";
    }
  });

  function runCycle() {
    let elapsed = 0;
    const stepMs = 70;
    const totalSteps = Math.floor(cfg.scrambleMs / stepMs);
    let step = 0;

    const interval = window.setInterval(() => {
      step++;
      // Fade pattern: scramble for the first 60% of steps, then settle in waves.
      const settleStart = Math.floor(totalSteps * 0.55);
      for (let i = 0; i < spans.length; i++) {
        const original = chars[i];
        if (original === " " || original === " ") continue;
        const settled = step >= settleStart && i < (step - settleStart) * 2;
        spans[i].textContent = settled ? original : randCrock();
      }
      if (step >= totalSteps) {
        clearInterval(interval);
        for (let i = 0; i < spans.length; i++) spans[i].textContent = chars[i];
      }
      elapsed += stepMs;
    }, stepMs);
  }

  // First run after one full cycle delay, then every cycleMs.
  setTimeout(() => {
    runCycle();
    setInterval(runCycle, cfg.cycleMs);
  }, cfg.cycleMs);
}
