// Minimal asciicast v2 read/write for the user guide's `myne` CLI demos.
//
// Format (https://docs.asciinema.org/manual/asciicast/v2/): newline-delimited
// JSON — line 1 is a header object, every following line is a `[time, code,
// data]` event. We only ever emit/consume `"o"` (stdout) events: the `myne`
// CLI writes plain UTF-8 text with zero ANSI/colour/cursor control
// (`cli/src/output.rs`), so "rendering" a cast is string concatenation — no
// terminal emulator, and hence no third-party player dependency.
//
// This module is the ONE place the byte format lives. It is consumed by the
// browser player (`src/scripts/castPlayer.ts`), by the generator
// (`scripts/generate-casts.mjs`), and by the tests next to each — so the read
// side and the write side can never drift.

/**
 * @typedef {Object} CastHeader
 * @property {2} version
 * @property {number} width   Terminal columns (header metadata; the player soft-scrolls).
 * @property {number} height  Terminal rows.
 * @property {string} [title] Optional label shown on the player chip.
 */

/** @typedef {[number, string, string]} CastEvent  `[seconds, code, data]` — code is "o" for output. */

/**
 * @typedef {Object} Cast
 * @property {CastHeader} header
 * @property {CastEvent[]} events
 */

/**
 * Serialize a cast to asciicast v2 text. Deterministic by construction: a fixed
 * header key order (no `timestamp`/`env`, which vary run-to-run), `JSON.stringify`
 * for every number (V8's shortest round-trip is stable across platforms), LF line
 * endings, a single trailing newline, and no incidental whitespace. Two calls with
 * the same input produce byte-identical output — the property the freshness gate
 * leans on.
 * @param {Cast} cast
 * @returns {string}
 */
export function serializeCast(cast) {
  const h = cast.header;
  /** @type {CastHeader} */
  const header = { version: 2, width: h.width, height: h.height };
  if (h.title !== undefined) header.title = h.title;
  const lines = [JSON.stringify(header)];
  for (const ev of cast.events) lines.push(JSON.stringify(ev));
  return lines.join("\n") + "\n";
}

/**
 * Parse asciicast v2 text. Blank lines are ignored. `transcript` is the
 * concatenation of every `"o"` event's data — the complete terminal text, used
 * as the static (no-JS / reduced-motion) rendering and for copy-to-clipboard.
 * @param {string} text
 * @returns {{ header: CastHeader, events: CastEvent[], transcript: string, duration: number }}
 */
export function parseCast(text) {
  const rows = String(text)
    .split("\n")
    .filter((l) => l.trim() !== "");
  if (rows.length === 0) throw new Error("empty cast");
  const header = JSON.parse(rows[0]);
  if (header.version !== 2) throw new Error(`unsupported cast version: ${header.version}`);
  /** @type {CastEvent[]} */
  const events = [];
  for (let i = 1; i < rows.length; i++) {
    const ev = JSON.parse(rows[i]);
    if (!Array.isArray(ev) || ev.length < 3 || typeof ev[0] !== "number") {
      throw new Error(`malformed event on line ${i + 1}`);
    }
    events.push([ev[0], ev[1], ev[2]]);
  }
  const transcript = events
    .filter((e) => e[1] === "o")
    .map((e) => e[2])
    .join("");
  const duration = events.length ? events[events.length - 1][0] : 0;
  return { header, events, transcript, duration };
}

/**
 * The concatenated output up to and including time `t` — for scrubbing: render
 * the terminal exactly as it stood at that moment.
 * @param {CastEvent[]} events
 * @param {number} t
 * @returns {string}
 */
export function transcriptAt(events, t) {
  let out = "";
  for (const [time, code, data] of events) {
    if (time > t) break;
    if (code === "o") out += data;
  }
  return out;
}
