# Authoring conventions — Myne user guide

> **Not a content article.** This file is the authoring canon every user-guide
> content slice writes against. The leading underscore keeps it out of the
> `userGuide` content collection (same exclusion mechanism as `_sidebar.json`);
> it never renders as a page.
>
> Source of truth for these rules: the `user-guide-content` epic sync ledger
> (MYND-243) and the per-slice grill sessions. Each block below cites its
> ratified ledger entry. When the app and this doc disagree, the shipped app
> wins and this doc is corrected in the same PR.

---

## 1. Voice rules (PRODUCT.md projection)

Anchored to the main-repo `PRODUCT.md` "careful engineer to careful engineer"
voice (per `myne-website/CLAUDE.md`). Do not paraphrase `PRODUCT.md` here —
follow it. The load-bearing rules for guide copy:

- **Sentence case** for headings and UI references.
- **No hype words** — never "unbreakable", "bulletproof", "military-grade",
  "100% secure", "anonymous". When in doubt, downgrade the claim.
- **No emoji, no exclamation points.**
- **"You"** is the reader; use "we" sparingly and only for Myne-the-project.
- **Technically literal.** Say what the software does, not what it aspires to.
- **State irreversibility plainly, in advance** — before the destructive step,
  not after.
- Marketing-copy discipline is binding even on placeholder copy: never exceed
  `docs/threat-model.md` (block 6 below is the gate).

## 2. Article body template

Every article follows this shape:

1. **Summary-mirror opening paragraph** — one short paragraph restating the
   frontmatter `summary` in prose. No heading above it.
2. **Prerequisites** (optional) — a short list when the task depends on prior
   state ("You need an unlocked vault").
3. **Numbered steps** — the walkthrough, in order, each step an action.
4. **"Limits"** — an `## Limits` H2 honesty block that maps the feature to its
   `docs/threat-model.md` bounds (what it does NOT protect against / does NOT
   do). Required for any article making a safety, privacy, or durability claim.
5. **Headings: `h2`/`h3` only.** The table of contents renders `h2`/`h3`; never
   go deeper.
6. **"Related" is automatic.** The `RecommendedBlock` (tag overlap) replaces
   manual see-also lists — do not hand-write a related-articles list.
7. **Shortcuts** — the optional per-article footer block (format in block 7).

## 3. Terminology table — glossary → user-facing (SYNC-5)

UI labels win for body copy; the glossary is the canonical source for concept
names. The **verb reservation** is a hard wall — `validate-sidebar` does not
enforce it, so it is a g2-review item.

| Concept | Use | Never |
|---|---|---|
| `.myne-backup` export/restore | **backup**, **restore** (restore = from a backup, only) | "archive", "snapshot" for a backup; "restore" for the phrase flow |
| Per-note version history | **snapshot** | "backup", "version backup" |
| Recovery-phrase unlock flow | **unlock with recovery phrase** | "restore from phrase", "restore your vault with the phrase" |
| Leftover-file cleanup flow | **clean up leftover files** | "repair", "vault repair" (user-facing) |
| Bringing external content in | **import** (Obsidian vault, attachment files) | "import" for backups/restores |
| Trash restore | **restore** (sentence-cased; disambiguate from backup restore in context) | conflating with backup restore |
| Graph isolated-node filter | **Isolated** (UI label) | "orphan note" (glossary alias) in body copy |
| 24-word phrase | **recovery phrase** | "seed phrase", "mnemonic" |
| Other | **master password**, **auto-lock on idle**, **screen-capture protection**, **vault label** (per glossary) | inventing synonyms |

## 4. Tag vocabulary (SYNC-2)

Pick article tags **only** from this pinned 23-tag vocabulary. `validate-sidebar`
errors on any out-of-vocabulary tag.

```
basics, vault, notes, editor, markdown, links, tags, search,
attachments, import, backup, recovery, snapshots, templates,
folders, sidebar, workspace, settings, privacy, security,
ai, sync, devices
```

The `ai`, `sync`, and `devices` tags were added when the guide gained the AI (Beta)
and Sync & devices categories (feature-sync, 2026-07-11) — extending the vocabulary
in both this mirror and the `validate-sidebar` constant, per the rule below.

- **Rule:** no category-spanning generic tag on more than 6 articles
  (`validate-sidebar` surfaces this as a non-blocking **warning**; membership is
  the hard error). Refine tags within your slice to keep the Recommended box
  meaningful.
- **Extending the vocabulary** is a deliberate one-line PR that touches BOTH the
  `validate-sidebar` constant (the machine-readable source) AND this block (the
  human-readable mirror). Never invent a tag ad hoc in frontmatter.

## 5. Screenshot capture procedure (SYNC-6)

Real screenshots are allowed for a per-article allowlist (each slice's own grill
decides its allowlist). Procedure:

1. **Disable screen-capture protection** in the app (Settings → Privacy /
   auto-lock & screen-capture) — the OS screenshot API is blocked while it is
   on (macOS, Windows ≥ 19041).
2. Capture the frame.
3. **Re-enable screen-capture protection.**

- **Single theme: light.** One theme only, default light.
- **Graph captures** use the staged fixture-vault recipe below — deterministic
  enough that golive can re-capture the same shape.
- Every capture is registered for the **golive screenshot-freshness recheck**.

### Graph fixture-vault staging recipe (find-and-connect)

Stage a throwaway vault that produces a legible, repeatable graph:

1. Create ~10–14 notes with realistic, distinct titles in two or three loose
   clusters (e.g. a "Projects" cluster, a "Reading" cluster), so the graph shows
   structure rather than a hairball or a sparse scatter.
2. Add wikilinks **within** each cluster and one or two **across** clusters, so
   most nodes are connected and a couple of hub notes emerge. Use resolved links
   only (the target notes exist) — unresolved links draw no edge.
3. Leave **at least one note with no links in or out** so the **Isolated** filter
   has something to show.
4. Pick one well-connected note to open before the "Around this note" capture so
   the 1–2 hop neighborhood is non-trivial.
5. Capture two frames, light theme, protection toggled off→capture→on: the
   whole-vault **All** view, and the **Around this note** view on the chosen note.

Keep the fixture notes free of anything sensitive — they appear on screen.
- Alt text is required and follows the voice rules (literal description).

## 6. g2 checklist template (SYNC-4)

Paste into every content-slice PR description and check every article against it:

- [ ] **(i) Threat-model ceiling** — does not exceed `docs/threat-model.md`
      guarantees (no "tamper-proof", "safe forever", "leak-free", etc.).
- [ ] **(ii) Voice** — matches `PRODUCT.md` "careful engineer to careful
      engineer" (block 1).
- [ ] **(iii) Spec non-contradiction** — no conflict with
      `docs/spec/protocol.md` or `docs/spec/account-number.md`.
- [ ] **(iv) Terminology wall** — block 3 table + verb reservation honored.
- [ ] **(v) Anti-feature honesty** — no plaintext mode, no email recovery, no
      telemetry, no sync promise; unshipped layers use the honest-limitation
      note (block 8).
- [ ] **(vi) Glossary-canonical terms** — concept names match `docs/glossary.md`.

guide-golive re-runs the consolidated table over ALL articles as the binding
gate, plus the pre-alpha-drift recheck and the screenshot-freshness recheck.

## 7. Shortcut footer block (SYNC-7)

Keyboard shortcuts go in a per-article **"Shortcuts"** footer block (not scattered
inline as the canonical record; inline `<kbd>` is allowed in prose, but the
footer block is canonical). Rules:

- **Cmd/Ctrl dual-form** notation — write both, e.g. `⌘K` / `Ctrl K`.
- **`⌘P` is documented as an alias of `⌘K`** (the command palette), not a
  separate shortcut.
- Source the shortcut canon **from the app's code**, never retype from memory.
- One block format across all slices — no per-chapter variants.

Format:

```markdown
## Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open command palette | ⌘K (alias ⌘P) | Ctrl K |
```

## 8. Honest-limitation-note pattern (SYNC-10)

When an article documents a layer that is **visible in the UI but not yet
shipped** (a disabled control, a stubbed surface), use exactly **one
present-tense factual note**:

- No dates, no version numbers, no feature IDs, no roadmap, no "coming soon".
- State what the control does today (nothing / is disabled) — not what it will do.
- Example posture: the disabled search input, the disabled custom-theme control,
  the wikilink interactive layer.

## 9. Privacy-first framing pattern (SYNC-10)

When a visible "missing" behavior is a **deliberate privacy decision** (no search
result snippets, no backlink body previews), lead with the **why**, not a neutral
limitation:

- e.g. "Results never decrypt your notes just to preview them."
- The claim must stay spec-backed per article (cite the mechanism, don't
  over-claim). Pair with a link to the privacy-model explainer where useful.

## 10. Pinned sentences (reuse verbatim)

Copy these verbatim — do not paraphrase. Each has a single canonical home; other
articles reuse the exact wording.

### Local-only (SYNC-8)

> Myne today runs entirely on your device; nothing leaves it.

Reuse wherever sync-adjacency comes up. Never add roadmap dates, never write
"when you sync". The bottom bar's literal "Local-only · not synced" is the honest
anchor.

### Attachment portability (SYNC-10, attachments-import grill)

> Attachments live as encrypted files inside the vault; today they're accessible only through the app. There is no bulk attachment-export tool.

Canonical home: the `attachments` article (`attachments-and-import`).
`what-myne-doesnt-do` (`settings-and-privacy`) may reuse it verbatim. Keeps the
"plain markdown after decryption" walk-away claim scoped to **notes**, never
attachments.

### Attachment size/count visibility caveat (SYNC-10, attachments-import grill)

> An attachment's name, contents, and type are encrypted; what a copy of the vault folder can still reveal is how many attachments there are and how big each one is.

Canonical home: the `attachments` article, immediately after the encryption
ceiling. `privacy-model` (`settings-and-privacy`) reuses it verbatim. States the
v0.1 no-padding reality plainly — never "everything is hidden".

### Backup-replay triangle (pinned from `docs/threat-model.md` §7)

The canonical **paragraph** lives in the `back-up-your-vault` article
(`safety-and-recovery`); `what-myne-doesnt-do` reuses it verbatim. The three
pinned facts the paragraph must carry, in plain language:

1. **An old password opens old backups.** After a password change, every backup
   taken before the change still unlocks with the old password.
2. **The recovery phrase opens every backup of the vault, forever.** The phrase
   never rotates, so it unlocks any backup ever made of that vault.
3. **Restore resurrects permanently-deleted notes.** A backup taken before a
   note was deleted still carries that note; restoring it brings the note back.

Present backups strictly within these bounds: no "tamper-proof", no "safe
forever", no leak-free claims (threat-model §7; `decisions.md` 2026-06-10).
