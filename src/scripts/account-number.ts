// Crockford-base32 alphabet — excludes I L O U.
// Generates a fresh, well-formed account number on every call.
// Demo only: production includes a Damm-32 check character (spec §4);
// here the trailing position is filled with CSPRNG output and labelled
// as a demonstration of the format, not a verified identifier.

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const NB = "‑"; // U+2011 non-breaking hyphen

function randomCrockfordChar(): string {
  const buf = new Uint8Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= 256 - (256 % 32));
  return CROCKFORD[buf[0] % 32];
}

export function randomCrockfordString(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += randomCrockfordChar();
  return out;
}

export function generateAccountNumber(): string {
  const body = randomCrockfordString(20);
  return `MY${NB}${body.slice(0, 4)}${NB}${body.slice(4, 8)}${NB}${body.slice(8, 12)}${NB}${body.slice(12, 16)}${NB}${body.slice(16, 20)}`;
}

// Animate from random Crockford glyphs to a target string, character-by-character.
// Each non-prefix, non-hyphen position cycles through ~6 random glyphs over `total`ms,
// settling left-to-right. No bouncing, no easing overshoot — pure crossfade through chars.
export function animateAccountNumber(
  el: HTMLElement,
  target: string,
  total = 700,
): void {
  const chars = [...target];
  const fixed = new Set<number>();
  // Mark the "MY" prefix and hyphens as fixed (no animation needed).
  chars.forEach((c, i) => {
    if (c === "M" && i === 0) fixed.add(i);
    if (c === "Y" && i === 1) fixed.add(i);
    if (c === NB) fixed.add(i);
  });

  const animatedIndices = chars.map((_, i) => i).filter((i) => !fixed.has(i));
  const stepDelay = total / animatedIndices.length;
  const settleDelay = 60;

  // Render initial scrambled state immediately.
  const live = chars.map((c, i) => (fixed.has(i) ? c : randomCrockfordChar()));
  el.textContent = live.join("");

  // Each animated index cycles through ~3 random glyphs then settles to target.
  animatedIndices.forEach((idx, order) => {
    const startAt = order * stepDelay;
    let cycles = 0;
    const maxCycles = 3;
    const tick = () => {
      cycles++;
      if (cycles >= maxCycles) {
        live[idx] = chars[idx];
      } else {
        live[idx] = randomCrockfordChar();
      }
      el.textContent = live.join("");
      if (cycles < maxCycles) {
        setTimeout(tick, settleDelay);
      }
    };
    setTimeout(tick, startAt);
  });
}

// Wire up an element to (1) render a fresh account number with an entrance
// animation on first paint, and (2) re-roll on click. Respects prefers-reduced-motion.
export function mountAccountNumber(el: HTMLElement): void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reroll = () => {
    const next = generateAccountNumber();
    if (reduce) {
      el.textContent = next;
    } else {
      animateAccountNumber(el, next);
    }
  };
  reroll();
  el.style.cursor = "pointer";
  el.title = "Click to generate a new account number";
  el.addEventListener("click", reroll);
}
