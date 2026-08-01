#!/usr/bin/env node
// generate-casts — turn the declarative CLI session specs into byte-deterministic
// asciicast v2 files under public/casts/, ready for the guide's cast player.
//
//   node scripts/generate-casts.mjs           # write public/casts/*.cast
//   node scripts/generate-casts.mjs --check    # verify committed casts match a fresh regen (CI-friendly)
//
// Why generate instead of `asciinema rec`: a real recording stamps wall-clock
// timing + a live `timestamp`/`env` header, none of which is reproducible. Here
// the OUTPUT is the real bytes the `myne` binary prints (pasted into
// casts.sessions.mjs) and only the TYPING TIMING is synthesized at fixed
// intervals — so two runs produce identical bytes and drift (a changed HELP
// blob, a changed error string) is a visible diff, mirroring the screenshot
// pipeline's freshness model (docs/dev/userguide-screenshots.md).
//
// A refuse-to-emit secret scan (scanForSecrets) closes the "one keystroke from
// the DOM" gap for casts: a real account number, UUID note id, or vault path
// must never reach a committed .cast (same posture as scripts/check-web-no-phrase.mjs).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { serializeCast } from "../src/lib/cast.mjs";
import { sessions } from "./casts.sessions.mjs";

const OUT_DIR = fileURLToPath(new URL("../public/casts/", import.meta.url));

// Synthetic timing (milliseconds). Accumulated as integers and divided once per
// event so no float error compounds — every emitted time is `<intMs>/1000`.
export const TIMING = {
  promptMs: 250, // pause before the user starts typing
  keystrokeMs: 55, // per typed character
  submitMs: 400, // after Enter, before output
  outputMs: 250, // after output settles, before the idle prompt
};

const PROMPT = "$ ";

// The concrete leak vectors in `myne` CLI output. Recovery phrases are NOT here
// because no command prints one (there is no such surface); account numbers,
// UUID note ids, and data-dir/socket paths are the ones that can appear.
export const SECRET_PATTERNS = [
  // Account number: MY- + 4+ Crockford-base32 groups (Crockford omits I,L,O,U).
  { name: "account-number", re: /\bMY-[0-9A-HJKMNP-TV-Z]{4}(?:-[0-9A-HJKMNP-TV-Z]{4}){3,}/i },
  // Any UUID (a real note id is UUIDv7 — a vault-stable correlation tag).
  { name: "uuid-note-id", re: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i },
  // App-data dir / socket / home paths that an error message could surface.
  { name: "vault-path", re: /md\.myne\.desktop|cli\.sock|\/Users\/[^/\s]|\/home\/[a-z]|\.local\/share|[A-Za-z]:\\Users\\/ },
];

/** The full terminal text a session will show (prompt + typed + output per step). */
export function assembleTranscript(session) {
  let t = "";
  for (const step of session.steps) t += PROMPT + step.type + "\n" + step.output;
  return t;
}

/** Refuse to emit if any real-secret pattern appears. Throws WITHOUT echoing the
 *  matched text (echoing it would defeat the point). */
export function scanForSecrets(text, where = "cast") {
  for (const { name, re } of SECRET_PATTERNS) {
    if (re.test(text)) {
      throw new Error(`generate-casts: refusing to emit ${where}: matched secret pattern "${name}"`);
    }
  }
}

/** Build one session into deterministic asciicast v2 text. */
export function buildCast(session) {
  scanForSecrets(assembleTranscript(session), session.name);

  /** @type {import("../src/lib/cast.mjs").CastEvent[]} */
  const events = [];
  let ms = 0;
  const emit = (data) => events.push([ms / 1000, "o", data]);

  for (const step of session.steps) {
    emit(PROMPT);
    for (const ch of step.type) {
      ms += TIMING.keystrokeMs;
      emit(ch);
    }
    ms += TIMING.submitMs;
    emit("\n");
    ms += TIMING.promptMs;
    emit(step.output);
    ms += TIMING.outputMs;
  }
  emit(PROMPT); // settle on an idle prompt

  return serializeCast({ header: { version: 2, width: 80, height: 24, title: session.title }, events });
}

function main() {
  const check = process.argv.includes("--check");
  if (!check) mkdirSync(OUT_DIR, { recursive: true });

  let wrote = 0;
  const drift = [];
  for (const session of sessions) {
    const text = buildCast(session);
    const path = `${OUT_DIR}${session.name}.cast`;
    if (check) {
      const on = existsSync(path) ? readFileSync(path, "utf8") : null;
      if (on !== text) drift.push(session.name);
    } else {
      writeFileSync(path, text);
      wrote++;
    }
  }

  if (check) {
    if (drift.length) {
      console.error(`generate-casts --check: ${drift.length} cast(s) stale: ${drift.join(", ")}`);
      console.error("  run `node scripts/generate-casts.mjs` and commit the result.");
      process.exit(1);
    }
    console.log(`generate-casts --check: OK — ${sessions.length} cast(s) match.`);
  } else {
    console.log(`generate-casts: wrote ${wrote} cast(s) to public/casts/`);
  }
}

// Only run when invoked directly (not when imported by the test).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
