#!/usr/bin/env node
// Copy the repository's NOTICE into the built site.
//
// Astro copies `public/` verbatim and nothing else, and a NOTICE belongs at the
// repository root, where a reader and GitHub's licence heuristics both look for
// it. This is the one line that bridges the two. It runs at the END of `build`,
// after `astro build`, because `dist/` has to exist for the copy to land in the
// artefact rather than beside it.
//
// It fails loudly instead of quietly shipping a site with no notices. A missing
// `dist/` means the build did not run, which is a different event from "there is
// nothing to say", and the two must not be collapsed.

import { copyFileSync, existsSync } from "node:fs";

const SRC = "NOTICE";
const OUT = "dist/NOTICE.txt";

if (!existsSync(SRC)) {
  console.error(
    `ship-notice: no ${SRC} at the repository root, so the deployed site would carry no ` +
      "third-party notices at all.",
  );
  process.exit(1);
}
if (!existsSync("dist")) {
  console.error(
    "ship-notice: no dist/ — this runs after `astro build`; a missing output directory " +
      "means the build did not run, not that there is nothing to copy.",
  );
  process.exit(1);
}

copyFileSync(SRC, OUT);
console.log(`ship-notice: ${SRC} -> ${OUT}`);
