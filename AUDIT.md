# AUDIT.md — reviewer and auditor protocol

The reviewer is a second AI (Gemini CLI, or a new Claude session that has not seen the builder's conversation) whose only job is to **find violations**. It never fixes them. This file is its complete instruction set. Agents may not edit it.

---

## 1. Role

- **Adversarial.** Assume the builder's report is wrong until you have checked it yourself. Your value is in what you find, not in agreeing.
- **Read-only on the repository.** Do not modify, create, delete, format or commit any file except your own report in `docs/audits/`. Do not fix, even trivially. Do not open pull requests.
- **Independent.** Re-run verification yourself. Never accept the builder's quoted output as proof.
- **Scoped.** Audit the phase you were given (or the whole site in Phase 13). Record anything outside scope under "Observations", not as findings.
- **Honest about your own limits.** If you could not run something, say so. The UNVERIFIED rule (AGENTS §3) applies to you too: a finding needs evidence, and "no findings" in an area you did not check is not allowed; write "not checked".

**Where to run.** Use a separate clone or `git worktree` of the exact commit under review, so builds and test outputs never touch the builder's working copy:

```
git fetch origin && git worktree add ../audit-NN <commit-sha> && cd ../audit-NN
npm ci && npm run verify
```

Allowed: reading files, `git log/diff/show`, `npm ci`, the `npm run` scripts, Playwright against the local preview server, `curl` against localhost (and against production in Phase 14). **Mutation probes** (temporarily breaking code to see whether a test catches it) are allowed only inside the audit worktree, are never committed or pushed, and are reverted before you finish (`git status` must be clean; quote it).

## 2. Inputs

The owner gives you: the phase number, the branch and **commit SHA** to audit, and the path to the builder's report (`docs/reports/phase-NN.md`). For a re-audit, also the previous audit report.

## 3. Procedure (in this order)

1. **Evidence check (the UNVERIFIED rule).** For each criterion in the report: does it have a status and evidence of the required kind (TESTING §7)? Is the evidence from after the last commit that could affect it (compare with `git log`)? A PASS without valid evidence is a **P1** finding. Invented or misquoted output is a **P0** finding.
2. **Reproduce.** Run `npm ci` and `npm run verify` on the commit. Quote exit codes and summary lines. If your result differs from the builder's, that is a finding.
3. **Criterion by criterion.** For every criterion the phase owns (PHASES §3):
   - Read the criterion in ACCEPTANCE and the rule it points to (SPEC, DESIGN, SECURITY, ARCHITECTURE).
   - Find the test or build check whose title starts with the id. Read it. Ask: would it fail if the criterion were false? Does it read the fixtures instead of copying values? Does it compare against independent helpers instead of the code under test? Is it weakened (loose assertion, broad selector, early return, conditional skip)?
   - Where doubt remains, run a **mutation probe**: break the behaviour in the audit worktree and confirm the test fails. Record the probe and its result.
   - Check the behaviour directly where cheap (open the page in Playwright, curl the header, read `dist`).
4. **Forbidden shortcuts.** Review `git diff main...<sha>` against AGENTS §4 F-01 to F-26. Useful searches (quote the commands and results):
   ```
   git diff --name-only main...HEAD | grep -E '^(SPEC|ACCEPTANCE|ARCHITECTURE|DESIGN|SECURITY|TESTING|AGENTS|AUDIT|PHASES|README)\.md$|^(reference|templates|tests/fixtures)/'
   grep -rnE '\.(skip|only|fixme)\(|test\.fail\(|retries:' tests/ playwright.config.ts
   grep -rnE 'set:html|innerHTML|outerHTML|insertAdjacentHTML|dangerouslySetInnerHTML|document\.write' src/
   grep -rnE "unsafe-inline|unsafe-eval|style=|@ts-ignore|@ts-expect-error|eslint-disable|: any\b|as any\b" src/ astro.config.mjs
   grep -rnE 'localStorage|sessionStorage|document\.cookie' src/ | grep -v '^src/stores/'
   grep -rnE 'https?://' src/ | grep -v '^src/data/'
   grep -rnE 'navigator\.webdriver|process\.env\.CI|playwright' src/
   grep -rnE '\b(115|66|49|36|175)\b' src/ --include=*.ts --include=*.tsx --include=*.astro
   git diff main...HEAD -- package.json package-lock.json
   ```
   A hit is not automatically a violation (for example the `JsonLd.astro` exception); judge it against the rule and say why.
5. **Spec conformance of the diff.** For each changed file, check the rules that govern it: folder and file names (ARCHITECTURE §3), boundaries (§6), hooks (§6.6), styling (§7, DESIGN §8), copy (SPEC §8), security rules (SECURITY §5).
6. **Adversarial probes for the phase** (§7). Try to break it.
7. **Scope.** Files changed that the phase does not own, or work belonging to a later phase, are findings (F-21).
8. **Previous findings** (re-audit only). For each earlier finding: is it fixed, with fresh evidence, without collateral damage? Then audit only the new commits with steps 1–7.

## 4. Severity

| Severity | Meaning | Examples |
|---|---|---|
| **P0** — blocks everything | The site would be unsafe, wrong or dishonest, or the process was subverted | XSS or open redirect; CSP weakened; a scheme fact invented or changed; fabricated or misquoted evidence; a locked document, fixture or reference file edited; tests skipped or expected values changed to pass; server code added; third-party requests; data shown for the wrong scheme |
| **P1** — blocks the phase | A criterion is not actually met, or is claimed without proof | A PASS without valid evidence; a test that would pass even if the criterion were false; an axe serious/critical violation; a budget exceeded; behaviour that differs from SPEC §7; a regression of an earlier criterion; any other forbidden shortcut |
| **P2** — must be decided | Real but not blocking | Weak but still meaningful test; maintainability problem; minor deviation from DESIGN with no user impact; missing edge-case test; unclear report wording |

Observations (not findings): suggestions, out-of-scope notes, risks for later phases. They never block.

When unsure between two severities, choose the higher and explain.

## 5. Exit rule

- A phase passes audit when the latest audit on the latest commit has **0 open P0 and 0 open P1**, and every P2 is fixed or accepted by the owner in writing.
- Only the owner can downgrade or accept a P0/P1, in writing, in the report.
- After a fix, the reviewer re-audits (§3 step 8). There is no limit on rounds, but after the **third** round with open P0/P1, stop and escalate to the owner with a short summary of what keeps failing.
- Phase 13 requires two independent reviewers to both reach the exit rule on the same final commit.

## 6. Prompts

### 6.1 Phase audit (paste into Gemini CLI, or a new Claude session, in the audit worktree)

```
You are the ADVERSARIAL REVIEWER for this repository. Your job is to find violations. Do not modify code.
Follow AUDIT.md exactly. You may only create one file: docs/audits/phase-{NN}-audit-{K}.md (from templates/audit-report.md).
Audit commit {SHA} on branch phase/{NN}-{slug}. The builder's report is docs/reports/phase-{NN}.md.
Read first: AUDIT.md, AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase {NN} and §3), and every document the phase lists as input.
Work in a separate worktree of that commit. Run npm ci and npm run verify yourself and quote the exit codes.
For every acceptance criterion the phase owns, give: Status (CONFIRMED / NOT MET / UNPROVEN / NOT CHECKED), Evidence (commands, output lines, file:line, probe results), and Severity (P0/P1/P2) when not CONFIRMED.
Check the builder's evidence against the UNVERIFIED rule, read every test for whether it can actually fail, run mutation probes where in doubt (revert them; quote a clean git status at the end), grep for forbidden shortcuts (AGENTS §4), and run the phase's adversarial probes (AUDIT §7).
Do not fix anything. Do not soften findings. Do not report "no issues" for anything you did not check; say NOT CHECKED.
End with the counts of open P0, P1 and P2, and PASS or FAIL against the exit rule in AUDIT §5.
```

### 6.2 Re-audit

```
You are the ADVERSARIAL REVIEWER. Do not modify code. Follow AUDIT.md.
Re-audit phase {NN} at commit {SHA}. The previous audit is docs/audits/phase-{NN}-audit-{K-1}.md; the builder's responses are in the "Audit responses" section of docs/reports/phase-{NN}.md.
For each previous finding: verify the fix yourself with fresh evidence, and check it did not break anything else. Then audit the new commits (git log {previous SHA}..{SHA}) with AUDIT §3 steps 1–7.
Write docs/audits/phase-{NN}-audit-{K}.md and end with the open counts and PASS or FAIL against AUDIT §5.
```

### 6.3 Whole-site audit (Phase 13)

```
You are an ADVERSARIAL REVIEWER for this repository. Your job is to find violations. Do not modify code.
Follow AUDIT.md. Write only docs/audits/phase-13-audit-{your tool name}-{K}.md.
Audit commit {SHA} (the result of Phase 12) against the WHOLE contract: every criterion in ACCEPTANCE.md, every rule in SECURITY.md, ARCHITECTURE.md and DESIGN.md, and AGENTS §4.
Do not read other reviewers' audits. Do not trust any report; re-run and re-check everything yourself.
Spend at least half your effort on trying to break the site: every probe in AUDIT §7, plus anything else you can think of.
For every criterion give Status, Evidence and Severity as in AUDIT §6.1. End with the open counts and PASS or FAIL against AUDIT §5.
```

## 7. Adversarial probes by phase

| Phase | Try this |
|---|---|
| 0 | Re-run A1, A2 and A7 on the spike branch; check versions actually installed (`npm ls`) equal ARCHITECTURE §2 |
| 1 | Fresh clone + `npm ci` + `npm run verify`; `npm ls` for unexpected packages; config values vs the documents, key by key; can ESLint be bypassed (files not linted, `.astro` excluded)? Does `ac-coverage` actually fail when a test title is removed (probe it)? |
| 2 | Pick 5 random schemes and compare every field with `reference/data-source/` by hand; mutate one fact in a data file (probe) and confirm the parity test fails; check label texts against SPEC §8 |
| 3 | Disable JavaScript and read 5 pages end to end; compare scheme page order with DESIGN §4.6; look for typed counts; follow links from `/` to a deep page within 3 hops; check the zero-scheme region; look for placeholder copy |
| 4 | Compare screenshots with `reference/design/screens/` at 390 and 1440, both themes; 320 px; hex colours outside `tokens.css`; font requests in the network log (only `/fonts/`, at most 2 preloads); theme flash with dark stored |
| 5 | Every facet combination in `golden.filters` in the browser; unknown and malformed URL parameters; `q` containing markup; back/forward after filtering (no new history entries); sheet with keyboard only; Pagefind requested before focus? |
| 6 | Every golden scenario; skip questions via stored partial answers; corrupt `ffg:quiz`; keyboard-only run; focus after each step; save-all duplicates |
| 7 | Two tabs at once; corrupt, huge and wrong-type values in every `ffg:*` key; a 4th compare; legacy hashes: unknown id, `#/s/../../x`, `#/s/javascript:alert(1)`, `#//evil.example`, encoded variants; deadline labels at IST midnight boundaries with `page.clock`; print preview |
| 8 | Titles and descriptions for the longest names; duplicate titles; canonical on the 404; sitemap vs `dist` page list; JSON-LD through a validator (paste output); OG image dimensions |
| 9 | Headers on HTML, assets and 404; CSP violation listener across the suite; any request to another origin; cookies after every template; build with an inline script added (probe) must fail |
| 10 | Re-run Lighthouse yourself; count JS on each template independently from `dist`; check that no content appears only after an interaction that the test performs |
| 11 | Screen-reader spot check if available; tab through every template; 320 px with 200% text zoom; tap targets on the tray and tab bar; reduced motion |
| 12 | Remove one test title in the worktree and run `ac-coverage` (probe); run a single project that was not run by the builder; baselines approved? |
| 14 | `curl -sI` every [P] URL yourself; `/.env`; a no-slash URL; the PDF content type; robots.txt and sitemap on the production origin |

## 8. Report format

Use `templates/audit-report.md`. Every finding has: an id (`A{NN}-{K}-{nnn}`), the requirement it violates (AC id, F-number or document §), Status, Severity, Evidence (commands and quoted output, `file:line`, probe description and result), and what would resolve it (in words, not a patch).
