// A space written as a line break is not a space.
//
// Astro compresses the emitted HTML (`compressHTML`, on by default), and the collapse removes a
// whitespace-only text node that sits on its own line. Wrapping prose therefore has a trap: break
// the line between a word and a following inline element — or between an inline element and the
// word after it — and the rendered page reads "Theprotocol specandthreat model". This guard walks
// the page and component sources and refuses that shape, because the fix is always the same:
// write the space explicitly as `{" "}` on the same line as the text it separates.
//
// Two shapes are exempt, both structural rather than stylistic:
//   * a decorative icon (`aria-hidden="true"`) followed by its label — the gap comes from the
//     parent's flex `gap`, not from a space;
//   * a line that already ends in `{" "}` — the space is explicit, so the wrap is safe.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";

const ROOT = "src";
const INLINE = "a|strong|em|b|i|code|span|small|sup|sub";
const opensInline = new RegExp(`^\\s*<(?:${INLINE})[\\s>]`);
const closesInline = new RegExp(`</(?:${INLINE})>$`);
// Prose, not markup: a word or sentence punctuation, never a tag boundary (`>`, `"`, `}`).
const endsInProse = /[A-Za-z0-9,.;:!?]$/;
const endsWithExplicitSpace = /\{" "\}$/;
const isDecorative = /aria-hidden="true"/;

function astroFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return astroFiles(path);
    return entry.name.endsWith(".astro") ? [path] : [];
  });
}

/** The line's text with any trailing `{" "}` removed, so an explicit space never re-triggers. */
function withoutExplicitSpace(line) {
  return line.replace(/\{" "\}$/, "");
}

function linesOutsideCode(text) {
  const lines = text.split("\n");
  let inFrontmatter = false;
  let inScriptOrStyle = false;
  return lines.map((line, index) => {
    const trimmed = line.trim();
    // Line 0 of a .astro file opens the frontmatter fence when it is `---`.
    if (index === 0 && trimmed === "---") {
      inFrontmatter = true;
      return null;
    }
    if (inFrontmatter) {
      if (trimmed === "---") inFrontmatter = false;
      return null;
    }
    if (/^<(script|style)\b/.test(trimmed)) inScriptOrStyle = true;
    if (inScriptOrStyle) {
      if (/<\/(script|style)>$/.test(trimmed)) inScriptOrStyle = false;
      return null;
    }
    return line;
  });
}

/** Every place a line break is standing in for a space. */
export function joinedByLineBreak(source) {
  const lines = linesOutsideCode(source);
  const problems = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === null) continue;
    const next = lines.slice(i + 1).find((candidate) => candidate && candidate.trim());
    if (!next) continue;
    const text = withoutExplicitSpace(line);
    if (endsWithExplicitSpace.test(line)) continue;

    // "…iteration is" / "<strong …>" — the space before the element is gone.
    if (endsInProse.test(text) && opensInline.test(next) && !isDecorative.test(next)) {
      problems.push({ line: i + 1, text: line.trim(), next: next.trim() });
      continue;
    }
    // "</a>" / "and the contract." — the space after the element is gone.
    if (closesInline.test(text) && /^\s*[A-Za-z0-9]/.test(next) && !isDecorative.test(text)) {
      problems.push({ line: i + 1, text: line.trim(), next: next.trim() });
    }
  }
  return problems;
}

test("no inline element is glued to the prose around it by a line break", () => {
  const failures = [];
  for (const file of astroFiles(ROOT)) {
    const problems = joinedByLineBreak(readFileSync(file, "utf8"));
    for (const problem of problems) {
      failures.push(
        `${relative(".", file)}:${problem.line}\n` +
          `    ${problem.text}\n` +
          `    ${problem.next}\n` +
          `    → write the space as {" "} on the line it separates, or the HTML compressor drops it`,
      );
    }
  }
  assert.deepEqual(failures, [], `\n${failures.join("\n\n")}\n`);
});
