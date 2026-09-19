# Phase {NN} — {name}: builder report

| | |
|---|---|
| Branch / commit | `phase/{NN}-{slug}` @ `{short SHA}` |
| Builder | {tool and model, as reported by the tool} |
| Date | {YYYY-MM-DD} |
| Environment | `node -v` = {…}, `npm -v` = {…}, OS = {…} |
| `.phase` | {NN} |

## 1. Summary
{Three sentences at most: what was built, what is left, what is blocked. No claims that are not in §2.}

## 2. Acceptance criteria

Every criterion this phase owns (PHASES §3). Status is exactly one of PASS / FAIL / UNVERIFIED / N/A / BLOCKED (AGENTS §3).

| Criterion | Status | Evidence (command + exit code + quoted lines, test title seen passing, screenshot path, or manual note) |
|---|---|---|
| AC-… | | |

## 3. Commands run (in order)

| # | Command | Exit code | Output (summary lines quoted; long output saved under `docs/evidence/phase-{NN}/`) |
|---|---|---|---|
| 1 | `npm run verify` | | |

## 4. Files
- Added: …
- Changed: …
- Deleted: …

## 5. Deviations from the spec
{Should be "None". Each deviation also has a proposal in `docs/proposals/`.}

## 6. Stop notes
{BLOCKED notes in the AGENTS §5 format, or "None".}

## 7. Data questions
{Facts in the data that look wrong or out of date, with the file, field and why. Not changed. Or "None".}

## 8. UNVERIFIED items
| Criterion or claim | Why unverified | What would verify it |
|---|---|---|

## 9. For the reviewer
{Where to look first; risky changes; anything you are unsure about.}

## 10. Audit responses
{Filled after an audit. For each finding: id — FIXED (commit, fresh evidence) / DISPUTED (spec references) / DEFERRED (P2 only, owner approval quoted).}

## 11. Owner sign-off
{Owner writes: accepted / not accepted, date, and any accepted UNVERIFIED or P2 items.}
