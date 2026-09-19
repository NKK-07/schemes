# Proposal 0002 — Require Node 22.22.3 or later

| | |
|---|---|
| Author | builder |
| Date | 2026-09-19 |
| Changes | ARCHITECTURE §2 (Node line), PHASES Phase 0 task 2, ACCEPTANCE AC-OPS-03.1 |
| Triggered by | Phase 0, task 3 (peer and engine ranges) |
| Status | Open |

## Problem
`eslint-plugin-astro@3.2.1` (locked in ARCHITECTURE §2) declares `engines.node: "^22.22.3 || ^24.16.0 || >=26.3.0"` (`docs/evidence/phase-00/02-peer-check.txt`: `ENGINE eslint-plugin-astro: node ^22.22.3 … not satisfied by 22.22.2`).

The pack says Node "22.x" (`engines.node: "22.x"`, AC-OPS-03) and "≥ 22.12, < 23" (PHASES Phase 0 task 2). A machine on Node 22.12–22.22.2 satisfies the pack but not the locked lint plugin; with `engine-strict=true` (SECURITY §6) `npm ci` would refuse to install.

The builder's sandbox had Node 22.22.2; it now uses Node 22.23.2 (from the npm package `node-linux-x64`, because nodejs.org is blocked by the sandbox proxy) — `00-environment.txt`.

## Proposed change
- ARCHITECTURE §2: "Node **22.x, at least 22.22.3** (`engines.node: ">=22.22.3 <23"`, `.nvmrc: 22`)".
- PHASES Phase 0 task 2: "`node -v` (≥ 22.22.3, < 23)".
- ACCEPTANCE AC-OPS-03.1: "`engines.node` is `>=22.22.3 <23`".

## Options
| Option | Consequence | Criteria affected |
|---|---|---|
| A. Raise the minimum (recommended) | Clear error on old Node; Vercel's "22.x" uses the latest 22 release | AC-OPS-03 |
| B. Keep "22.x" and document it | Silent install failures on older 22.x machines when `engine-strict` is on | none |
| C. Pin an older `eslint-plugin-astro` | Needs a new ADR and version checks | AC-OPS-06 |

## Recommendation
A.

## Impact
Phase 1 (`package.json`, `.nvmrc`, AC-OPS-03 check). The owner's own machine needs Node ≥ 22.22.3 to run the project locally.

---
Approval: the owner applies the change to the locked file(s), marks this proposal Approved, and merges. Until then, the current text applies.
