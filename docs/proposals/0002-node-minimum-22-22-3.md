# Proposal 0002 — Require Node 22.22.3 or later

| | |
|---|---|
| Author | builder |
| Date | 2026-09-19 (revised after audit 1, finding A00-1-007) |
| Changes | ARCHITECTURE §2 (Node line); PHASES Phase 0 task 2; PHASES Phase 1 task 1; ACCEPTANCE AC-OPS-03.1 |
| Triggered by | Phase 0, task 3 (peer and engine ranges) |
| Status | Open |

## Problem
The pack says Node "22.x" (ARCHITECTURE §2, PHASES Phase 1 task 1, AC-OPS-03.1) and "≥ 22.12, < 23" (PHASES Phase 0 task 2). The locked tree needs more.

`docs/evidence/phase-00/spike-v2/03-engines.txt` checks the `engines.node` range of every package in the lockfile:

- **Node 22.12.0: 16 unsatisfied**, including the locked `eslint@10.10.0 (^20.19.0 || ^22.13.0 || >=24)`, `html-validate@11.16.0 (^22.22.0 || >= 24.8.0)` and `eslint-plugin-astro@3.2.1 (^22.22.3 || …)`, their dependencies (`@eslint/*`, `espree`, `@html-validate/stylish`, `astro-eslint-parser@3.1.0`), and the production transitive `undici@8.10.2 (>=22.19.0)`.
- **Node 22.19.0: 4 unsatisfied**; **22.22.0 and 22.22.2: 3 unsatisfied** (`astro-eslint-parser`, `eslint-plugin-astro`, and the optional win32-only `@img/sharp-win32-ia32`).
- **Node 22.22.3: 1 unsatisfied** — only `@img/sharp-win32-ia32@0.35.4 (^20.9.0) [optional] os=win32`, which npm skips on other platforms.

The direct-package check says the same at the top level: `03c-peer-check.txt` gives `ENGINE eslint-plugin-astro: node ^22.22.3 … not satisfied by 22.22.2`, `issues: 1`, exit 1; at 22.22.3, `issues: 0`, exit 0.

With `engine-strict=true` (SECURITY §6), `npm ci` on Node 22.22.2 stops with `notsup` (the reviewer reproduced this for `astro-eslint-parser@3.1.0`, audit 1 A00-1-007).

The builder's sandbox had Node 22.22.2; it now uses 22.23.2, taken from the npm package `node-linux-x64` because nodejs.org is blocked by the sandbox proxy (`docs/evidence/phase-00/00-environment.txt`).

## Proposed change
- ARCHITECTURE §2: "Node **22.x, at least 22.22.3** (`engines.node: ">=22.22.3 <23"`, `.nvmrc: 22`), npm."
- PHASES Phase 0 task 2: "`node -v` (≥ 22.22.3, < 23)".
- PHASES Phase 1 task 1: "`engines.node: ">=22.22.3 <23"`".
- ACCEPTANCE AC-OPS-03.1: "`engines.node` is `>=22.22.3 <23`".

The Vercel project's Node version setting must be 22.x; the Vercel build log records the exact version used, and the Phase 0 preview check (BLOCKED OWNER-1) records it.

## Options
| Option | Consequence | Criteria affected |
|---|---|---|
| A. Raise the minimum to 22.22.3 (recommended) | A clear `EBADENGINE`/`notsup` message on older Node instead of lint or install failures later | AC-OPS-03 |
| B. Keep "22.x" | Installs fail on 22.12–22.22.2 with `engine-strict`, or lint breaks without it | none |
| C. Pin older eslint/html-validate/eslint-plugin-astro versions | New ADR and a new compatibility check; still needs ≥ 22.19 because of `undici` | AC-OPS-06, AC-SEO-14 |

## Recommendation
A.

## Impact
Phase 1 (`package.json`, `.nvmrc`, the AC-OPS-03 check). The owner's own computer needs Node ≥ 22.22.3 to run the project.

---
Approval: the owner applies the change to the locked file(s), marks this proposal Approved, and merges. Until then, the current text applies.
