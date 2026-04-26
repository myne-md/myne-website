// Live AES-256-GCM encryption demo.
// Real Web Crypto, no libraries. Per-session ephemeral key.
// AES-GCM stands in for the production XChaCha20-Poly1305 + CTX construction;
// same authenticated-encryption principle, slightly different bytes.

const HEX = "0123456789abcdef";

function toHex(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) {
    s += HEX[b >> 4] + HEX[b & 15];
  }
  return s;
}

function randHexByte(): string {
  const buf = new Uint8Array(1);
  crypto.getRandomValues(buf);
  return HEX[buf[0] >> 4] + HEX[buf[0] & 15];
}

interface DemoElements {
  textarea: HTMLTextAreaElement;
  cipher: HTMLElement;
  iv: HTMLElement;
  tag: HTMLElement;
  size: HTMLElement;
  status: HTMLElement;
}

interface DemoConfig {
  autoDemoText: string;
  autoDemoIdleMs: number;
}

export function mountEncryptionDemo(els: DemoElements, cfg: DemoConfig): void {
  let key: CryptoKey | null = null;
  let lastBytes = new Uint8Array(0);
  let pending = 0;
  let lastUserInteraction = Date.now();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Per-byte cell, indexed left-to-right. Each cell shows a 2-char hex pair.
  // We mutate textContent imperatively so we can do glyph cycling without
  // re-creating DOM nodes.
  function renderHex(bytes: Uint8Array, animate: boolean) {
    const cells = els.cipher.children as HTMLCollectionOf<HTMLElement>;
    const needed = bytes.length;

    // Add or remove cells to match.
    while (cells.length < needed) {
      const span = document.createElement("span");
      span.className = "byte";
      span.textContent = "..";
      els.cipher.appendChild(span);
    }
    while (cells.length > needed) {
      els.cipher.removeChild(els.cipher.lastChild!);
    }

    for (let i = 0; i < needed; i++) {
      const next = HEX[bytes[i] >> 4] + HEX[bytes[i] & 15];
      const prev = i < lastBytes.length ? HEX[lastBytes[i] >> 4] + HEX[lastBytes[i] & 15] : null;
      const cell = cells[i];
      if (prev === next) {
        cell.textContent = next;
        continue;
      }
      if (!animate || reduce) {
        cell.textContent = next;
        cell.classList.remove("changed");
        // Force reflow before re-adding so the highlight replays.
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        void cell.offsetWidth;
        cell.classList.add("changed");
        continue;
      }
      // Animate: cycle 3 random hex pairs over ~150ms then settle.
      let cycles = 0;
      const tick = () => {
        cycles++;
        if (cycles >= 3) {
          cell.textContent = next;
          cell.classList.remove("changed");
          void cell.offsetWidth;
          cell.classList.add("changed");
          return;
        }
        cell.textContent = randHexByte();
        setTimeout(tick, 50);
      };
      // Stagger by 6ms × index so the whole pane sweeps left-to-right.
      setTimeout(tick, i * 6);
    }
  }

  async function ensureKey(): Promise<CryptoKey> {
    if (key) return key;
    key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
    return key;
  }

  async function encrypt() {
    pending++;
    const k = await ensureKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(els.textarea.value);
    let cipherBytes: Uint8Array;
    try {
      const buf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, plaintext);
      cipherBytes = new Uint8Array(buf);
    } catch {
      pending--;
      return;
    }

    pending--;
    // Only render if no further keystroke landed during the await.
    if (pending > 0) return;

    // GCM ciphertext = ciphertext || 16-byte auth tag.
    const tagBytes = cipherBytes.slice(cipherBytes.length - 16);
    const ctBytes = cipherBytes.slice(0, cipherBytes.length - 16);

    renderHex(ctBytes, true);
    els.iv.textContent = toHex(iv);
    els.tag.textContent = toHex(tagBytes);
    els.size.textContent = `${ctBytes.length}B`;

    lastBytes = ctBytes;

    flashStatus();
  }

  let statusTimer: number | undefined;
  function flashStatus() {
    els.status.classList.add("active");
    if (statusTimer !== undefined) clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => {
      els.status.classList.remove("active");
    }, 240);
  }

  let debounce: number | undefined;
  function onInput() {
    lastUserInteraction = Date.now();
    if (debounce !== undefined) clearTimeout(debounce);
    debounce = window.setTimeout(encrypt, 60);
  }

  els.textarea.addEventListener("input", onInput);

  // Initial render.
  encrypt();

  // Idle auto-demo: if the user hasn't typed for a while, type a phrase
  // character-by-character, encrypting along the way.
  if (!reduce) {
    let demoIndex = 0;
    let demoActive = false;
    setInterval(() => {
      const idleFor = Date.now() - lastUserInteraction;
      if (idleFor < cfg.autoDemoIdleMs) {
        demoActive = false;
        return;
      }
      if (!demoActive) {
        // Reset and start.
        els.textarea.value = "";
        demoIndex = 0;
        demoActive = true;
      }
      if (demoIndex < cfg.autoDemoText.length) {
        els.textarea.value = cfg.autoDemoText.slice(0, demoIndex + 1);
        demoIndex++;
        encrypt();
      } else {
        // Pause at the end before resetting.
        if (idleFor > cfg.autoDemoIdleMs + cfg.autoDemoText.length * 80 + 4000) {
          els.textarea.value = "";
          demoIndex = 0;
          encrypt();
        }
      }
    }, 80);
  }
}
