// Declarative terminal-session specs for the `myne` CLI guide demos.
//
// Each session is turned into a byte-deterministic asciicast v2 file by
// `scripts/generate-casts.mjs`. The rule that keeps these honest AND
// reproducible: the OUTPUT of each step is the real bytes the `myne` binary
// prints, captured once and pasted here verbatim; only the TYPING TIMING is
// synthesized (fixed intervals), so the file never carries wall-clock jitter.
//
// Truth sources (do not retype from memory):
//   - the `--help` output is the `HELP` const in `cli/src/main.rs`.
//   - the `search` line shape is `<id>\t<title>` + the fixed stderr advisory
//     (`cli/src/output.rs::print_search` / `SEARCH_SCOPE_ADVISORY`).
//   - the locked-refusal message is `error_parts(VaultLocked)` in
//     `cli/src/output.rs`.
//
// Demo hygiene: note ids in demos are short illustrative placeholders
// (`note-…`), never real UUIDv7 ids — real ids are a vault-stable correlation
// tag and are refused by the generator's secret scan. The article prose says
// real ids are longer.

// Verbatim from cli/src/main.rs `HELP` (a trailing newline is added because
// `myne --help` prints it with `println!`).
const HELP = `myne — talk to the running Myne desktop app from the terminal

USAGE:
    myne [--json] <command>

COMMANDS:
    list                     List every live note id in scope
    show <id>                Print one note's markdown to stdout
    search <query>           Full-text search over live notes in scope
    new [--folder <path>]    Create a note from stdin
    daily                    Print today's daily note, creating it if needed
    daily:append <text>      Append a line to today's daily note

Trashed notes and templates are not notes you are working with, so they
are absent from list, search and show — the same notes the app itself
leaves out of its own lists.

Some folders may be excluded from these results — see Settings. An
excluded note's id looks identical to an unknown one everywhere above, and
an excluded search hit is simply absent, with no count of what was hidden.
Writing into an excluded folder with \`new --folder\` is refused outright.
If the configured daily-notes folder is excluded, \`daily\`/\`daily:append\`
both fail with a clear error rather than a silent no-op.

Myne must already be running, unlocked, and have CLI access enabled in
Settings; this command never prompts for a password.
`;

/**
 * @typedef {Object} Step
 * @property {string} type   The command the user types (animated character by character).
 * @property {string} output The real bytes the command prints (pasted verbatim).
 */

/**
 * @typedef {Object} Session
 * @property {string} name   Output file basename → public/casts/<name>.cast
 * @property {string} title  Player chip label.
 * @property {Step[]} steps
 */

/** @type {Session[]} */
export const sessions = [
  {
    name: "cli-help",
    title: "myne --help",
    steps: [{ type: "myne --help", output: HELP }],
  },
  {
    name: "cli-search",
    title: "myne search",
    steps: [
      {
        type: "myne search onboarding",
        // `<id>\t<title>` per hit, then the fixed advisory (stderr, shown inline
        // in the terminal). Ids here are illustrative placeholders.
        output:
          "note-7f3a\tOnboarding checklist\n" +
          "note-2b91\tWelcome to Myne\n" +
          "Some notes may be excluded from search results — see Settings.\n",
      },
    ],
  },
  {
    name: "cli-locked",
    title: "myne list (locked)",
    steps: [
      {
        type: "myne list",
        // error_parts(VaultLocked): human mode writes `myne: <message>` to stderr,
        // exit code 4.
        output: "myne: Myne is locked. Unlock it in the app first.\n",
      },
    ],
  },
];
