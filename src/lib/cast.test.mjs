import { test } from "node:test";
import assert from "node:assert/strict";
import { serializeCast, parseCast, transcriptAt } from "./cast.mjs";

const sample = {
  header: { version: 2, width: 80, height: 24, title: "myne — list" },
  events: [
    [0, "o", "$ "],
    [0.045, "o", "myne list\n"],
    [0.4, "o", "note-a\nnote-b\n"],
  ],
};

test("serialize → parse round-trips the transcript", () => {
  const text = serializeCast(sample);
  const parsed = parseCast(text);
  assert.equal(parsed.header.title, "myne — list");
  assert.equal(parsed.transcript, "$ myne list\nnote-a\nnote-b\n");
  assert.equal(parsed.duration, 0.4);
});

test("serialize omits timestamp/env and pins key order (deterministic header)", () => {
  const first = serializeCast(sample).split("\n")[0];
  assert.equal(first, '{"version":2,"width":80,"height":24,"title":"myne — list"}');
  assert.ok(!first.includes("timestamp"));
  assert.ok(!first.includes("env"));
});

test("serialize is byte-deterministic across calls", () => {
  assert.equal(serializeCast(sample), serializeCast(sample));
});

test("serialize emits LF endings and a single trailing newline", () => {
  const text = serializeCast(sample);
  assert.ok(!text.includes("\r"));
  assert.ok(text.endsWith("\n"));
  assert.ok(!text.endsWith("\n\n"));
});

test("parse rejects a non-v2 header", () => {
  assert.throws(() => parseCast('{"version":1,"width":80,"height":24}\n'), /unsupported cast version/);
});

test("parse rejects a malformed event line", () => {
  assert.throws(() => parseCast('{"version":2,"width":80,"height":24}\n["oops"]\n'), /malformed event/);
});

test("transcriptAt returns the output up to a given time (scrub)", () => {
  assert.equal(transcriptAt(sample.events, 0), "$ ");
  assert.equal(transcriptAt(sample.events, 0.045), "$ myne list\n");
  assert.equal(transcriptAt(sample.events, 10), "$ myne list\nnote-a\nnote-b\n");
});
