# AGENTS.md — operating rules for AI agents

Read this file first, every session. It applies to every AI agent working in this repository: the **builder** (Claude Code) and the **reviewer** (Gemini CLI or a separate Claude session, whose protocol is `AUDIT.md`). The **owner** is the human who owns the repository. Only the owner changes the rules.

---

## 1. Roles and start of session

| Role | Tool | May change | May not change |
|---|---|---|---|
| Builder | Claude Code (`CLAUDE.md` imports this file) | `src/`, `tests/` (except fixtures), `scripts/`, `public/`, config files, `docs/reports/`, `docs/adr/` (drafts), `docs/proposals/` (drafts), `docs/evidence/`, `.phase` | Everything in §4 F-01 |
| Reviewer | Gemini CLI (`GEMINI.md` imports `AUDIT.md`) or a new Claude session started with the prompt in `AUDIT.md` §6 | `docs/audits/` only | Any code, test, config or document |
| Owner | Human | Everything | — |

**Start of every builder session**, before touching code:
1. Read, in order: this file → `SPEC.md` → `ACCEPTANCE.md` → the current phase in `PHASES.md` → every document that phase lists as input.
2. Run and quote: `cat .phase`, `git status --short`, `git log --oneline -5`, `node -v`.
3. If resuming, read the latest `docs/reports/phase-NN.md` and any `docs/audits/phase-NN-audit-*.md` for the current phase.
4. State, in one short paragraph: the phase, the acceptance criteria you will close, and anything already known to be BLOCKED.

Do not rely on memory of these documents from an earlier session or earlier in a long session. Re-open the exact section before implementing anything it governs, and cite it (`SPEC §7.2`) in the commit message.

## 2. Lifecycle

```
SPEC → RECON → ARCHITECTURE LOCK → DATA CONTRACT → IMPLEMENT → TEST → ADVERSARIAL AUDIT → FIX → RE-AUDIT → SHIP
```

| Stage | Phases | Leaves this stage when |
|---|---|---|
| SPEC | before 0 | The owner has filled in D1–D4 (SPEC §3) |
| RECON | 0 | Assumptions A1–A10 are VERIFIED or have approved proposals |
| ARCHITECTURE LOCK | 1 | Scaffold, configs, ADRs 0001–0008 merged |
| DATA CONTRACT | 2 | Data migrated, schema tests green, goldens match |
| IMPLEMENT + TEST | 3–12 | Each phase's criteria PASS with evidence |
| ADVERSARIAL AUDIT → FIX → RE-AUDIT | after every phase, and 13 for the whole site | 0 open P0 and 0 open P1 findings |
| SHIP | 14 | Production criteria PASS; owner signs off |

Every phase, without exception, runs: implement → `npm run verify` → phase report → reviewer audit → fixes → re-audit until clean → owner merges. A phase is not finished because the code is written.

## 3. The UNVERIFIED rule

**Never claim a requirement is satisfied because code exists for it.** A criterion is satisfied only when it has been verified in this session, after the last change to any file that could affect it, by one of: an automated test, build output, browser inspection (Playwright or a screenshot), or an explicit manual check with written steps.

Every acceptance criterion in a report has exactly one status:

| Status | Meaning | Required with it |
|---|---|---|
| **PASS** | Verified as above | The evidence (TESTING §7): command + exit code + the quoted lines, or the test title seen passing in quoted output, or the screenshot path, or the manual-check note |
| **FAIL** | Verified and not met | The failing output, and what happens next |
| **UNVERIFIED** | Not verified, or verified before a later change | Why, and exactly what would verify it |
| **N/A** | Does not apply because of an owner decision | The decision id (e.g. D3 = No) |
| **BLOCKED** | Cannot proceed without the owner | The stop note (§5) |

Rules:
- Evidence is quoted from real output of commands you ran. Never write output you did not see. Never summarise a run you did not do. If a command was not run, the status is UNVERIFIED.
- Changing code after a run makes that run's evidence stale for every criterion the change could affect. Re-run or downgrade to UNVERIFIED.
- A partial run (one test file, one project, `--grep`) proves only what it ran. Say which subset.
- These phrases are banned in reports unless immediately followed by evidence: "should work", "should pass", "will work", "I believe", "looks good", "seems to", "done", "complete", "all tests pass", "fully implemented", "production-ready".
- When unsure whether something is verified, it is UNVERIFIED.
- The reviewer checks this rule first (AUDIT §3). A PASS without evidence is a P1 finding.

## 4. Forbidden shortcuts

Any of these in a diff fails the phase (SPEC §9 item 5). If one seems necessary, stop (§5).

| # | Forbidden |
|---|---|
| F-01 | Editing `SPEC.md`, `ACCEPTANCE.md`, `ARCHITECTURE.md`, `DESIGN.md`, `SECURITY.md`, `TESTING.md`, `AGENTS.md`, `AUDIT.md`, `PHASES.md`, `README.md`, `CLAUDE.md`, `GEMINI.md`, `templates/`, `reference/`, `tests/fixtures/`, or visual baselines. Propose instead. |
| F-02 | Adding, removing, upgrading or downgrading any package, or using `--force` / `--legacy-peer-deps`. Only ARCHITECTURE §2, exactly, each added in the phase its table names. |
| F-03 | Skipping or weakening tests: `.skip`, `.only`, `fixme`, `fail`, retries, larger timeouts to get a pass, changed expected values, looser assertions, deleted tests, commented-out tests, conditional tests that silently do nothing. |
| F-04 | Lowering any threshold or budget (Lighthouse, JS size, HTML size, fonts, axe impact level, contrast), disabling axe or html-validate rules, relaxing TypeScript strictness or ESLint rules, `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable` without an ADR reference. |
| F-05 | Hard-coding counts, ids, URLs or facts in `src/` outside `src/data/`, or copying golden values into code or tests. |
| F-06 | Inventing, rounding, rewording or "correcting" any fact in the data. Suspected errors go under "Data questions" in the report. |
| F-07 | Behaving differently under test: checking `navigator.webdriver`, the user agent, `process.env.CI`, test ports or query flags to change output; test-only branches in `src/`. |
| F-08 | Mocking the thing under test (for example stubbing `lib/filters` in a filter test) or asserting code against its own output. |
| F-09 | CSP workarounds: `'unsafe-inline'`, `'unsafe-eval'`, removing the meta policy, nonces, `style` attributes, inline event handlers, moving scripts into `data:` or `blob:` URLs. |
| F-10 | `set:html`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML` (except `JsonLd.astro`). |
| F-11 | Any server code: API routes, `prerender = false`, middleware, adapters, serverless or edge functions. |
| F-12 | Requests to any other origin at build or run time: CDNs, Google Fonts, analytics other than D4, remote images, remote data. |
| F-13 | `localStorage` / `sessionStorage` outside `src/stores/` (except the theme boot script), cookies, or keys without the `ffg:` prefix. |
| F-14 | `client:only` for content, or islands whose server output is empty (except `CompareTray`, ARCHITECTURE §6.6). |
| F-15 | Changing any URL or slug, or adding redirects the spec does not list. |
| F-16 | Placeholder or fake content: lorem ipsum, "TODO", "coming soon", sample schemes, dummy links, in anything that ships. |
| F-17 | Emoji anywhere in the UI or copy. |
| F-18 | Committing `dist/`, `node_modules/`, `.lighthouseci/`, `playwright-report/`, `test-results/`, `.env*`, or any secret. |
| F-19 | Force-pushing, rewriting pushed history, committing directly to `main`, merging your own phase, deploying, or changing anything in the Vercel or GitHub settings. |
| F-20 | Choosing an owner decision (D1–D4) or any option the spec leaves to the owner, including resolving a document conflict yourself. |
| F-21 | Working on another phase's scope, or refactoring outside the current phase's files "while you are there". |
| F-22 | Reporting PASS without evidence, or with evidence older than the last relevant change. |
| F-23 | Swallowing errors: empty `catch` blocks (except the store decoders, which reset to defaults), `\|\| true` in scripts, `continue-on-error` in CI, suppressing console errors, env flags that skip `verify-dist` checks. |
| F-24 | Removing or hiding a feature, element or content to make a test, audit or budget pass. |
| F-25 | CSS frameworks, `!important` outside the exceptions in ARCHITECTURE §7, colours outside `tokens.css` and the OG route (except the two exceptions in ARCHITECTURE §7), new fonts or weights. |
| F-26 | Mass reformatting, renaming or moving files the phase does not own. |

## 5. Stop conditions

Stop work on the affected item, write a stop note in the report, and continue only with work that does not depend on it, when:

1. Two documents conflict, or a document conflicts with the fixtures.
2. An assumption (ARCHITECTURE §11) fails, or a locked choice looks impossible or wrong.
3. Meeting a criterion would require a forbidden shortcut or a change to a locked file.
4. A package conflict, install failure or platform limit appears.
5. A criterion is ambiguous enough that two reasonable implementations would both pass it but behave differently.
6. A data fact looks wrong or out of date.
7. A budget cannot be met without trading away another requirement.
8. An owner decision is missing.
9. The next step touches production, accounts, secrets, DNS, the firewall, or anything outside the repository.
10. An action is destructive (deleting data files, history, branches).

Stop note format (one per item, in the report and repeated in the final message):

```
BLOCKED <id>: <what cannot proceed>
Why: <facts, with file and section references>
Options: <A> / <B> / <C>, with the consequence of each
Recommendation: <one option and why>
Needs: owner decision | proposal approval | owner action
```

Guessing is never the fallback.

## 6. Changes to rules and data

- **Rules:** write `docs/proposals/NNNN-title.md` from `templates/proposal.md`. The owner approves by editing the locked file themselves and merging. Until then, the old rule applies.
- **Decisions:** architectural decisions inside the rules are recorded as ADRs (`templates/adr.md`). The builder drafts; the owner accepts by merging.
- **Data:** scheme facts change only when the owner provides the new fact and its source. The builder edits the JSON, updates `verifiedNote` and `lastVerified`, runs `verify`, and lists every changed field in the report. If a golden count changes, the owner regenerates the golden file with a proposal.

## 7. Git hygiene

- One branch per phase: `phase/NN-short-name`. The first commit sets `.phase` to `NN`.
- Small commits, each building and passing lint. Message: `phase-NN: <what> (<AC ids or doc §>)`, for example `phase-05: filter predicate and URL state (AC-FUNC-01, AC-FUNC-05, SPEC §7.2)`.
- The phase report is committed on the branch. The owner opens or merges the pull request after the audit exit (AUDIT §5).
- Never rebase or amend commits that the reviewer has already audited; add new commits.
- End commit messages with the attribution lines the session provides, if any.

## 8. Coding conventions

- **TypeScript:** `tsconfig.json` extends `astro/tsconfigs/strictest`. ES modules only. Named exports only, except where Astro or a tool requires a default export (pages, config files). Union types plus Zod instead of `enum`. Explicit return types on exported functions. `readonly` arrays in props and function parameters.
- **Files:** Astro components and Preact islands in PascalCase (`SchemeCard.astro`, `CompareTray.tsx`); everything else kebab-case or single lowercase words, exactly as named in ARCHITECTURE §3. No new top-level folders.
- **`src/lib/`** holds pure functions only: no DOM, no Astro, no Preact, no I/O, no `Date.now()` (time is passed in). The one exception is `lib/data.ts`, which statically imports the JSON in `src/data/` (ARCHITECTURE §4.1). Every export has a unit test.
- **Bundled scripts** (`src/scripts/`) attach behaviour through the DOM hooks in ARCHITECTURE §6.6 with one delegated listener per event type, ≤ 150 lines per file, and render text with `textContent` only.
- **Islands** receive serializable props, import their CSS from a companion file, and never import another island.
- **CSS:** class names follow `reference/design/site.css`; colours and fonts only through `var(--…)` tokens (the two exceptions are in ARCHITECTURE §7: copied `box-shadow` `rgba()` values, and `#fff`/`#000` in `print.css`); component styles scoped in their `.astro` file; no `style` attributes.
- **Copy:** every visible string comes from the data files, from SPEC/DESIGN (quoted exactly), or from the prototype copy sources in DESIGN §9 (with the overrides listed there). Do not write new copy.
- **Errors:** build-time code throws with the file, id and field in the message. Client code never throws on bad stored data (it resets). No `console.log` in `src/`.
- **Comments** explain why, not what. No commented-out code.

## 9. Reporting

At the end of a phase (and whenever you stop), write `docs/reports/phase-NN.md` from `templates/phase-report.md`:
- the acceptance criteria table with a status and evidence for every criterion the phase owns (PHASES §3);
- the exact commands run, with exit codes;
- files added, changed and deleted;
- deviations from the spec (should be none; each one is also a proposal);
- stop notes, data questions, UNVERIFIED items and what would verify them;
- anything the reviewer should look at first.

Your final chat message for a phase is the same table in short form, with the report path. It never says more than the report does.

## 10. Working with the reviewer

- You never edit `docs/audits/`. You answer each finding in your next report under "Audit responses" with one of: **FIXED** (commit hash + fresh evidence), **DISPUTED** (why, with spec references; the owner decides), or **DEFERRED** (only for P2/P3, with the owner's written approval quoted).
- P0 and P1 findings cannot be deferred or disputed away by the builder. Only the owner can accept one, in writing.
- After fixing, ask for a re-audit. The phase exits only on a clean re-audit (AUDIT §5).
