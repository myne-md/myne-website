import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildCast, scanForSecrets, assembleTranscript } from "./generate-casts.mjs";
import { sessions } from "./casts.sessions.mjs";
import { parseCast } from "../src/lib/cast.mjs";

const OUT_DIR = fileURLToPath(new URL("../public/casts/", import.meta.url));

test("buildCast is byte-deterministic", () => {
  for (const s of sessions) assert.equal(buildCast(s), buildCast(s));
});

test("every committed cast matches a fresh regeneration (freshness)", () => {
  for (const s of sessions) {
    const path = `${OUT_DIR}${s.name}.cast`;
    assert.ok(existsSync(path), `missing public/casts/${s.name}.cast — run node scripts/generate-casts.mjs`);
    assert.equal(readFileSync(path, "utf8"), buildCast(s), `${s.name}.cast is stale`);
  }
});

test("a built cast parses and its transcript contains the typed command + real output", () => {
  const help = sessions.find((s) => s.name === "cli-help");
  const parsed = parseCast(buildCast(help));
  assert.equal(parsed.header.version, 2);
  assert.ok(parsed.transcript.includes("$ myne --help\n"));
  assert.ok(parsed.transcript.includes("USAGE:"));
});

test("scanForSecrets refuses a real account number", () => {
  assert.throws(() => scanForSecrets("$ x\nMY-4C2K-9F7H-BQ3M-2T8R-5W1N\n"), /account-number/);
});

test("scanForSecrets refuses a UUID note id", () => {
  assert.throws(() => scanForSecrets("0191f0a2-1c3d-7b4e-9a2f-0c1d2e3f4a5b\n"), /uuid-note-id/);
});

test("scanForSecrets refuses a vault/socket path", () => {
  assert.throws(() => scanForSecrets("/home/omer/.local/share/md.myne.desktop/cli.sock\n"), /vault-path/);
});

test("the committed demo sessions carry no secrets", () => {
  for (const s of sessions) assert.doesNotThrow(() => scanForSecrets(assembleTranscript(s), s.name));
});
