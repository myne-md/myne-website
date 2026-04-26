// Demo only: production includes a Damm-32 check character (spec §4).
// Here the trailing position is filled with CSPRNG output and labelled
// in the UI as a format demonstration, not a verified identifier.

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const NB = "‑";
const GROUPS = [4, 4, 4, 4, 4] as const;

export const PLACEHOLDER = `MY${NB}XXXX${NB}XXXX${NB}XXXX${NB}XXXX${NB}XXXX`;

function randomCrockfordChar(): string {
  // 256 = 8 × 32 → no modulo bias for an 8-bit byte against a 32-symbol alphabet.
  const buf = new Uint8Array(1);
  crypto.getRandomValues(buf);
  return CROCKFORD[buf[0] & 31];
}

function randomCrockfordString(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += randomCrockfordChar();
  return out;
}

export function generateAccountNumber(): string {
  const body = randomCrockfordString(GROUPS.reduce((a, b) => a + b, 0));
  let display = "MY";
  let cursor = 0;
  for (const len of GROUPS) {
    display += NB + body.slice(cursor, cursor + len);
    cursor += len;
  }
  return display;
}

export function animateAccountNumber(
  el: HTMLElement,
  target: string,
  total = 700,
): void {
  const chars = [...target];
  const fixed = new Set<number>();
  chars.forEach((c, i) => {
    if (c === "M" && i === 0) fixed.add(i);
    if (c === "Y" && i === 1) fixed.add(i);
    if (c === NB) fixed.add(i);
  });

  const animatedIndices = chars.map((_, i) => i).filter((i) => !fixed.has(i));
  const stepDelay = total / animatedIndices.length;
  const settleDelay = 60;

  const live = chars.map((c, i) => (fixed.has(i) ? c : randomCrockfordChar()));
  el.textContent = live.join("");

  animatedIndices.forEach((idx, order) => {
    const startAt = order * stepDelay;
    let cycles = 0;
    const tick = () => {
      cycles++;
      live[idx] = cycles >= 3 ? chars[idx] : randomCrockfordChar();
      el.textContent = live.join("");
      if (cycles < 3) setTimeout(tick, settleDelay);
    };
    setTimeout(tick, startAt);
  });
}

const prefersReducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export function reroll(el: HTMLElement): void {
  const next = generateAccountNumber();
  if (prefersReducedMotion()) el.textContent = next;
  else animateAccountNumber(el, next);
}

export function mountAccountNumber(el: HTMLElement, trigger?: HTMLElement): void {
  reroll(el);
  el.style.cursor = "pointer";
  el.title = "Click to generate a new account number";
  el.addEventListener("click", () => reroll(el));
  if (trigger) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      reroll(el);
    });
  }
}
