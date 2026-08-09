#!/usr/bin/env node
// Guard: the builder's ornament controls must agree with the app's vocabulary.
//
// Three lists describe the same thing and none can be derived from the others
// at build time: `theme-validator/src/ornament.rs` decides what a theme may
// legally SAY, `@myne/ornaments` decides what the app DRAWS, and this repo's
// `src/lib/themeBuilder/ornament.mjs` decides what a user can PICK. A control
// offering a value the validator rejects produces an invalid theme; one the
// stylesheet does not draw produces a control that silently does nothing.
//
// This checks the pair it can see from here — builder against validator. It
// needs the main `myne` repo checked out as a sibling (the same assumption the
// CI `validate` step already makes) and self-skips when it is absent.
//
// Run by hand: node scripts/check-ornament-vocabulary.mjs

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const { PRIMITIVES, ROLES, ROLE_PRIMITIVES } = await import(
  join(HERE, "..", "src", "lib", "themeBuilder", "ornament.mjs")
);

const CANDIDATES = [
  join(HERE, "..", "..", "theme-validator", "src", "ornament.rs"),
  join(HERE, "..", "..", "myne", "theme-validator", "src", "ornament.rs"),
  join(HERE, "..", "_myne", "theme-validator", "src", "ornament.rs"),
];
const rustPath = CANDIDATES.find((p) => existsSync(p));
if (!rustPath) {
  console.log("ornament-vocabulary: skipped (the myne repo is not checked out beside this one)");
  process.exit(0);
}

const rust = readFileSync(rustPath, "utf8");
const problems = [];

// PARSE the primitive table and set-compare, rather than probing it with a
// windowed regex.
//
// The old check was `name: "<primitive>",[\s\S]{0,200}?"<value>"` — a 200-char
// window that spills straight into the NEXT `Primitive` block, so any value
// belonging to a neighbouring primitive satisfied it. Probed with six
// deliberately-wrong pairings (`shadow=grain`, `fold=band`, `texture=lines`,
// `ribbon=left`, `edge=folded`, `frame=soft`), it false-accepted 6/6 and still
// printed `ok`. The `ROLE_PRIMITIVES` half of this same file already parses and
// set-compares; this half now does what that half does.
const rustPrimitives = new Map();
{
  const start = rust.indexOf("pub const PRIMITIVES");
  const block = start < 0 ? "" : rust.slice(start, rust.indexOf("];", start));
  for (const m of block.matchAll(/name:\s*"([a-z]+)"\s*,\s*values:\s*&\[([^\]]*)\]/g)) {
    rustPrimitives.set(m[1], new Set([...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1])));
  }
  if (rustPrimitives.size === 0) problems.push("PRIMITIVES: not found in theme-validator");
}
for (const p of PRIMITIVES) {
  const known = rustPrimitives.get(p.id);
  if (!known) {
    if (rustPrimitives.size > 0) problems.push(`${p.id}: offered here, unknown to theme-validator`);
    continue;
  }
  for (const { value } of p.values) {
    if (!known.has(value)) problems.push(`${p.id}=${value} is offered here but unknown to theme-validator`);
  }
  // …and the other direction, so a value the validator gained never sits
  // unofferable in the builder.
  for (const value of known) {
    if (!p.values.some((v) => v.value === value)) {
      problems.push(`${p.id}=${value} is known to theme-validator but not offered here`);
    }
  }
}
for (const r of ROLES) {
  if (!rust.includes(`"${r.id}"`)) problems.push(`role ${r.id} is offered here but unknown to theme-validator`);
}

// The role x primitive matrix is SPARSE, and this repo keeps its own copy of it
// (`ROLE_PRIMITIVES`). A cell offered here but not accepted by the validator is
// a control that authors a key the app stores and ignores — the "validates, then
// does nothing" failure this guard exists for, one level up from a bad value.
const rustMatrix = new Map();
{
  const start = rust.indexOf("pub const ROLE_PRIMITIVES");
  const block = start < 0 ? "" : rust.slice(start, rust.indexOf("pub fn role_accepts"));
  for (const m of block.matchAll(/\(\s*"([a-z]+)"\s*,\s*&\[([^\]]*)\]/g)) {
    rustMatrix.set(m[1], new Set([...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1])));
  }
  if (rustMatrix.size === 0) problems.push("ROLE_PRIMITIVES: not found in theme-validator");
}
for (const [role, prims] of Object.entries(ROLE_PRIMITIVES ?? {})) {
  const rustPrims = rustMatrix.get(role);
  if (!rustPrims) {
    if (rustMatrix.size > 0) problems.push(`role ${role}: offered here, absent from the validator's matrix`);
    continue;
  }
  for (const p of prims) {
    if (!rustPrims.has(p)) problems.push(`${role} offers ${p} here, which the validator does not accept`);
  }
  for (const p of rustPrims) {
    if (!prims.includes(p)) problems.push(`${role} accepts ${p} in the validator, not offered here`);
  }
}

if (problems.length > 0) {
  console.error("ornament-vocabulary: builder and validator disagree:\n");
  for (const p of problems) console.error(`    ${p}`);
  console.error("\n  Update src/lib/themeBuilder/ornament.mjs, or add the value to the");
  console.error("  validator and the ornaments stylesheet in the myne repo first.");
  process.exit(1);
}

console.log(
  `ornament-vocabulary: ok (${PRIMITIVES.length} primitives × ${ROLES.length} roles agree with theme-validator)`,
);
