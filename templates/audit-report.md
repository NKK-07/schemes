# Phase {NN} — audit {K}

| | |
|---|---|
| Commit audited | `{SHA}` (branch `phase/{NN}-{slug}`) |
| Reviewer | {tool and model} |
| Date | {YYYY-MM-DD} |
| Worktree clean at end | {quote `git status --short` — must be empty} |
| Previous audit | {path or "none"} |

## 1. Reproduction
| Command | Exit code | Summary lines (quoted) |
|---|---|---|
| `npm ci` | | |
| `npm run verify` | | |

## 2. Criteria

| Criterion | Status (CONFIRMED / NOT MET / UNPROVEN / NOT CHECKED) | Evidence | Severity if not CONFIRMED |
|---|---|---|---|
| AC-… | | | |

## 3. Findings

### A{NN}-{K}-001 — {short title}
- **Violates:** {AC id / F-number / document §}
- **Severity:** P0 / P1 / P2
- **Status:** NOT MET / UNPROVEN / VIOLATION
- **Evidence:** {commands and quoted output, `file:line`, probe and result}
- **Resolved when:** {the condition, in words; no patch}

## 4. Forbidden-shortcut scan
{Each search from AUDIT §3 step 4, with the command, the hits, and the judgement for each hit.}

## 5. Adversarial probes
| Probe | How | Result |
|---|---|---|

## 6. Previous findings (re-audit only)
| Finding | Builder response | Verified? | Evidence |
|---|---|---|---|

## 7. Observations (not findings)

## 8. Result
Open P0: {n} · Open P1: {n} · Open P2: {n} — **{PASS | FAIL}** against AUDIT §5.
