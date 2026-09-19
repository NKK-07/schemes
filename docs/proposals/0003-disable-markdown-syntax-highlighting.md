# Proposal 0003 — Turn off Markdown syntax highlighting in the Astro config

| | |
|---|---|
| Author | builder |
| Date | 2026-09-19 |
| Changes | ARCHITECTURE §5 (Astro config line) |
| Triggered by | Phase 0 spike build log |
| Status | Open |

## Problem
With `security.csp` enabled, every Astro 7.3.3 build prints:

> `[WARN] [config] Shiki syntax highlighting uses inline styles that are not compatible with Content Security Policy (CSP).`

(`docs/evidence/phase-00/spike/14-build.txt`). The site has no Markdown code blocks, so Shiki is never used, but the warning appears in every build log and could hide a real warning.

## Proposed change
ARCHITECTURE §5, Astro config line: add `markdown: { syntaxHighlight: false }`.

## Options
| Option | Consequence | Criteria affected |
|---|---|---|
| A. Add `markdown.syntaxHighlight: false` (recommended) | Clean build log; no behaviour change (no Markdown code blocks exist) | none |
| B. Leave it | A permanent warning in every build | none |

## Recommendation
A. Tested in the spike: with the setting, the build log has no `WARN` line (`docs/evidence/phase-00/spike/28-proposal-0003-variant.txt`, exit 0).

## Impact
Phase 1 `astro.config.mjs` only.

---
Approval: the owner applies the change to the locked file(s), marks this proposal Approved, and merges. Until then, the current text applies.
