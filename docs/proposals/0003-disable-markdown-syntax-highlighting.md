# Proposal 0003 — Turn off Markdown syntax highlighting in the Astro config

| | |
|---|---|
| Author | builder |
| Date | 2026-09-19 (revised after audit 1, finding A00-1-009) |
| Changes | ARCHITECTURE §5 (Astro config line); ARCHITECTURE §2 (the note that `astro.config.mjs` starts with "only the core settings"); PHASES Phase 1 task 3 (the list of core settings) |
| Triggered by | Phase 0 spike build log |
| Status | Open |

## Problem
With `security.csp` enabled, every Astro 7.3.3 build prints:

> `[WARN] [config] Shiki syntax highlighting uses inline styles that are not compatible with Content Security Policy (CSP).`

(`docs/evidence/phase-00/spike-v2/04-build-security21.txt`, first line). The site has no Markdown code blocks, so Shiki is never used, but the warning appears in every build log and could hide a real warning.

## Proposed change
- ARCHITECTURE §5, Astro config line: add `markdown: { syntaxHighlight: false }`.
- ARCHITECTURE §2 note and PHASES Phase 1 task 3: add `markdown: { syntaxHighlight: false }` to the list of core settings that `astro.config.mjs` has from Phase 1.

## Options
| Option | Consequence | Criteria affected |
|---|---|---|
| A. Add `markdown.syntaxHighlight: false` (recommended) | Clean build log; no behaviour change (no Markdown code blocks exist) | none |
| B. Leave it | A permanent warning in every build | none |

## Recommendation
A. Tested: with the setting (the committed spike config), the build log has no `WARN` line (`docs/evidence/phase-00/spike-v2/07-build-committed.txt`, exit 0); without it, the first line is the warning (`04-build-security21.txt`).

## Impact
Phase 1 `astro.config.mjs` only.

---
Approval: the owner applies the change to the locked file(s), marks this proposal Approved, and merges. Until then, the current text applies.
