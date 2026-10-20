import { test } from "node:test";
import assert from "node:assert/strict";

import { isDarkBackground } from "./syntaxTheme.mjs";

test("isDarkBackground matches WCAG-luminance<0.5 (dark) vs light vs non-hex", () => {
  assert.equal(isDarkBackground("#121210"), true);
  assert.equal(isDarkBackground("#282a36"), true); // dracula paper
  assert.equal(isDarkBackground("#fbfbfa"), false);
  assert.equal(isDarkBackground("not-a-color"), false); // unparseable → keep light default
});
