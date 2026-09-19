# PHASES.md — phase plan and builder prompts

The build runs in 15 phases. Each phase has a goal, inputs, tasks, what is out of scope, deliverables, the acceptance criteria it closes, an exit gate, and a copy-paste prompt for the builder (Claude Code). Agents may not edit this file.

---

## 1. The loop every phase follows

```
owner: start phase ─► builder: implement ─► builder: npm run verify ─► builder: phase report
      ▲                                                                         │
      │                                                                         ▼
owner: merge ◄─ reviewer: clean re-audit ◄─ builder: fix ◄─ reviewer: adversarial audit (AUDIT.md)
```

1. The owner pastes the phase prompt (§4) into a **new** Claude Code session in the repository.
2. The builder works on branch `phase/NN-name`, runs `npm run verify`, writes `docs/reports/phase-NN.md` and stops.
3. The owner starts the reviewer (Gemini CLI, or a new Claude session) with the prompt in `AUDIT.md` §6. The reviewer writes `docs/audits/phase-NN-audit-1.md`.
4. If there are P0 or P1 findings, the owner pastes the fix prompt (§2.2) into the builder session. Then the reviewer re-audits (`…-audit-2.md`), and so on.
5. On a clean audit, the owner merges the branch into `main`. Only then does the next phase start.

Phases 0 and 13 are different: Phase 0 changes no code on `main`, and Phase 13 is a whole-site audit with fixes.

## 2. Prompt templates

### 2.1 Start of phase (the per-phase prompts in §4 follow this shape)

```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase {NN} — {name}. Work on branch phase/{NN}-{slug}; your first commit sets .phase to {NN}.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase {NN}), then: {inputs}.
Do only the tasks listed for Phase {NN}. Everything else is out of scope. Add only the packages ARCHITECTURE §2 lists for Phase {NN}, at their exact versions.
Close these acceptance criteria: {ids}.
{phase-specific rules}
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, writing docs/reports/phase-{NN}.md from templates/phase-report.md, and replying with the criteria table (PASS / FAIL / UNVERIFIED / N/A / BLOCKED, each with evidence). A criterion without evidence from this session is UNVERIFIED.
```

### 2.2 Fix after an audit

```
You are the BUILDER. Follow AGENTS.md. Read docs/audits/phase-{NN}-audit-{K}.md.
For every P0 and P1 finding: reproduce it, fix it with the smallest change inside Phase {NN}'s scope, and prove the fix with fresh evidence. For P2 findings: fix them if they are inside scope; otherwise list them for the owner.
Do not edit docs/audits/. Do not weaken tests or rules to make a finding go away (AGENTS §4).
Add an "Audit responses" section to docs/reports/phase-{NN}.md with FIXED (commit + evidence), DISPUTED (spec references) or DEFERRED (P2 only, owner approval quoted) for every finding.
Re-run `npm run verify`, quote the exit code, and reply with the updated criteria table.
```

## 3. Criteria allocation

Each [T] and [B] criterion belongs to exactly one phase. `scripts/ac-coverage.ts` parses the JSON block below: for the phase in `.phase`, every [T] and [B] criterion allocated to that phase **or an earlier one** must have a matching test title or build check (TESTING §2). [M], [L] and [P] parts are closed in the phase listed, with the evidence named in ACCEPTANCE. The [P] part of any criterion is closed in Phase 14.

```json
{
  "0": [],
  "1": ["AC-OPS-03", "AC-OPS-05", "AC-OPS-06", "AC-OPS-07", "AC-OPS-09", "AC-SEC-06"],
  "2": ["AC-DATA-01", "AC-DATA-02", "AC-DATA-03", "AC-DATA-04", "AC-DATA-06", "AC-ROUTE-02"],
  "3": ["AC-DATA-05", "AC-ROUTE-01", "AC-ROUTE-03", "AC-ROUTE-04", "AC-ROUTE-05", "AC-ROUTE-06",
        "AC-SEO-01", "AC-SEO-02", "AC-SEO-03", "AC-SEO-04", "AC-SEO-05", "AC-SEO-11", "AC-SEO-12", "AC-SEO-13", "AC-SEO-14",
        "AC-CONTENT-01", "AC-CONTENT-02", "AC-CONTENT-03", "AC-CONTENT-04", "AC-CONTENT-05", "AC-CONTENT-06",
        "AC-CONTENT-07", "AC-CONTENT-08", "AC-CONTENT-09", "AC-CONTENT-10", "AC-CONTENT-11", "AC-CONTENT-12",
        "AC-FUNC-26"],
  "4": ["AC-DES-01", "AC-A11Y-05", "AC-FUNC-30", "AC-MOB-03", "AC-MOB-04", "AC-PERF-03"],
  "5": ["AC-FUNC-01", "AC-FUNC-02", "AC-FUNC-03", "AC-FUNC-04", "AC-FUNC-05", "AC-FUNC-06",
        "AC-FUNC-07", "AC-FUNC-08", "AC-FUNC-09", "AC-FUNC-10", "AC-FUNC-11", "AC-FUNC-12"],
  "6": ["AC-FUNC-13", "AC-FUNC-14", "AC-FUNC-15"],
  "7": ["AC-FUNC-16", "AC-FUNC-17", "AC-FUNC-18", "AC-FUNC-19", "AC-FUNC-20", "AC-FUNC-21", "AC-FUNC-22",
        "AC-FUNC-23", "AC-FUNC-24", "AC-FUNC-25", "AC-FUNC-27", "AC-FUNC-28", "AC-FUNC-29"],
  "8": ["AC-SEO-06", "AC-SEO-07", "AC-SEO-08", "AC-SEO-09", "AC-SEO-10"],
  "9": ["AC-SEC-01", "AC-SEC-02", "AC-SEC-03", "AC-SEC-04", "AC-SEC-05", "AC-PRIV-01", "AC-PRIV-02", "AC-OPS-01"],
  "10": ["AC-PERF-02", "AC-PERF-04", "AC-PERF-05", "AC-OPS-02"],
  "11": ["AC-A11Y-01", "AC-A11Y-02", "AC-A11Y-03", "AC-A11Y-04", "AC-A11Y-06", "AC-MOB-01", "AC-MOB-02"],
  "12": ["AC-DES-03"],
  "13": [],
  "14": []
}
```

Manual, Lighthouse and production criteria:

| Phase | Criteria |
|---|---|
| 4 | AC-DES-02 (home, scheme, region sign-off) |
| 5 | AC-DES-02 (`/schemes/` sign-off) |
| 6 | AC-DES-02 (finder sign-off; the criterion closes here) |
| 10 | AC-PERF-01 [L] |
| 11 | AC-A11Y-07 [M], AC-MOB-05 [M] |
| 12 | AC-OPS-08 [M] (N/A if D3 = No) |
| 14 | AC-PROD-01..05, AC-SEC-07, AC-OPS-04, every [P] part (AC-ROUTE-03, AC-ROUTE-06, AC-SEO-07, AC-CONTENT-11, AC-PERF-05, AC-SEC-01, AC-PRIV-01), and the production half of AC-CONTENT-10 (the analytics sentence on `/about/` when D4 = On) |

## 4. Phases

---

### Phase 0 — Repository reconnaissance

**Goal.** Prove the locked architecture works before anything is built on it. No code reaches `main`.

**Inputs.** All documents; `reference/`; `tests/fixtures/`.

**Tasks.**
1. Confirm SPEC §3 has all four owner decisions filled in. If not: BLOCKED.
2. Record the environment: OS, `node -v` (≥ 22.12, < 23), `npm -v`, `git --version`, whether Playwright can install Chromium and WebKit.
3. For every package in ARCHITECTURE §2: `npm view <name>@<version> version engines peerDependencies`. Record any peer range that the set does not satisfy.
4. On a throwaway branch `spike/phase-00` (never merged), build the smallest project that exercises each assumption in ARCHITECTURE §11 and record VERIFIED or FAILED with output:
   - A1: a page with a `client:idle` Preact island and the theme boot inline script; build; show the CSP meta tag; open in Chromium through Playwright with a `securitypolicyviolation` listener and show zero violations.
   - A2: Pagefind indexes two pages with `trailingSlash: "always"`; a search in the browser returns results under the CSP.
   - A3: `astro-og-canvas` writes a 1200×630 PNG using the files in `reference/fonts/`.
   - A4: the sitemap `filter` excludes a page and `serialize` sets `lastmod`.
   - A6: `npm ci` succeeds with no `--legacy-peer-deps`.
   - A7: two tabs share a `persistentAtom` change within 1 s in Chromium and WebKit.
   - A8: `npm ci --ignore-scripts && npm run build` succeeds locally.
   - A10: `import { z } from "astro/zod"` works in an Astro page, a Vitest test and a `tsx` script.
   The spike installs the **whole** package set of ARCHITECTURE §2 at once (A6), even though the real phases add packages gradually.
   - A5, A9 and the Vercel half of A8 need a Vercel preview build. Ask the owner (BLOCKED note with exact steps) to push `spike/phase-00`; Vercel builds it as a preview. Then check the preview URL with `curl -sI` (308 for a no-slash path, 200 for an asset, 404 with headers for an unknown path) and read the build log.
5. Sanity-check the reference data against `golden.json.totals` (counts of schemes, central, state, student, regions).
6. List everything in the documents you found ambiguous or contradictory.

**Out of scope.** Any code on `main`; choosing replacements for failed assumptions (propose instead).

**Deliverables.** `docs/reports/phase-00.md` (on a `phase/00-recon` branch with only docs), `docs/evidence/phase-00/*`, one proposal per FAILED assumption.

**Closes.** No acceptance criteria. Exit requires A1–A10 each VERIFIED, or FAILED with an owner-approved proposal.

**Exit gate.** Report shows D1–D4 filled; A1–A10 resolved; reviewer audit clean (the reviewer re-runs at least A1, A2 and A7 on the spike branch).

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 00 — Repository reconnaissance. Your report goes on branch phase/00-recon (docs only). Spikes go on a throwaway branch spike/phase-00 that is never merged.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 0), ARCHITECTURE.md (all, especially §2 and §11), SECURITY.md §2, TESTING.md §2–§3.
Do only the Phase 0 tasks. The spike installs the whole package set of ARCHITECTURE §2 at once; nothing is installed on any other branch. Write no application code on any branch other than spike/phase-00.
For each assumption A1–A10 report VERIFIED or FAILED with the exact commands and quoted output. A FAILED assumption gets a proposal in docs/proposals/ (templates/proposal.md); do not pick a replacement yourself.
You may not deploy. For A5, A9 and the Vercel half of A8, write a BLOCKED note asking the owner to push spike/phase-00, with exact steps, then verify with curl once the owner gives you the preview URL.
If SPEC §3 decisions are not filled in, stop with a BLOCKED note.
Finish with docs/reports/phase-00.md from templates/phase-report.md and reply with the assumption table (VERIFIED / FAILED / UNVERIFIED / BLOCKED, each with evidence).
```

---

### Phase 1 — Architecture lock

**Goal.** A repository skeleton where every tool, config and rule is in place and enforced, before any feature exists.

**Inputs.** ARCHITECTURE §2–§4, §6.2, §7, §9–§11; SECURITY §2, §5, §6; TESTING §2–§5; the Phase 0 report.

**Tasks.**
1. `package.json`: `"type": "module"`, `"private": true`, `engines.node: "22.x"`, the packages ARCHITECTURE §2 lists for Phase 1 at their exact versions (no ranges), the scripts of TESTING §2. Generate `package-lock.json` with `npm install` once, then use `npm ci`. Quote `npm run audit`.
2. Config files exactly as specified: `tsconfig.json` (strictest), `eslint.config.js` (TESTING §3.3), `.prettierrc`, `knip.json`, `vitest.config.ts`, `playwright.config.ts` (projects in TESTING §3.1), `lighthouserc.json` (TESTING §3.2), `.prettierignore` and ESLint ignores (TESTING §3.4), `vercel.json` (JSON-equal to SECURITY §2), `.nvmrc`, `.npmrc` (only if A8 VERIFIED), `.gitignore`.
3. `astro.config.mjs` with only the core settings (static output, `site` from the SPEC §5 rule, `trailingSlash: "always"`, `build.format: "directory"`, `build.inlineStylesheets: "never"`) and `security.csp` from SECURITY §2.1. Integrations are added in their packages' phases (ARCHITECTURE §2).
4. `scripts/serve-dist.ts` (applies `vercel.json` headers, `trailingSlash` 308s and `cleanUrls`; serves `404.html` with status 404; prints `listening`), `scripts/verify-dist.ts` (check registry and fail-closed runner; checks are added in the phase that owns them), `scripts/ac-coverage.ts` (TESTING §2, PHASES §3).
5. `tests/helpers/predicate.ts` and `tests/helpers/order.ts`, written from SPEC §7.1 and §7.2 only, importing nothing from `src/`.
6. `tests/e2e/fixtures.ts` with the automatic guards of TESTING §5.1.
7. ADR drafts 0001–0008 (ARCHITECTURE §10) from `templates/adr.md`, restating the locked decisions and their reasons.
8. Confirm `CLAUDE.md` and `GEMINI.md` from the pack are at the root (they are locked; do not edit them).
9. If Astro needs at least one page to build, add `src/pages/404.astro` with the final copy from DESIGN §4.12, unstyled.
10. Unit tests: `deps.test.ts` (AC-SEC-06), `tooling.test.ts` (AC-OPS-05..07), an `ac-coverage` self-test (AC-OPS-09); verify-dist check `AC-OPS-03`.

**Out of scope.** Schemas and data (Phase 2), pages (other than a possible 404), styles, islands, client scripts, `html-validate` and `node-html-parser` (Phase 3).

**Deliverables.** The files above; `docs/reports/phase-01.md`.

**Closes.** AC-OPS-03, AC-OPS-05, AC-OPS-06, AC-OPS-07, AC-OPS-09, AC-SEC-06.

**Exit gate.** `npm run verify` exits 0 on a clean clone after `npm ci`; `git diff --stat` shows no locked file changed; audit clean; the owner merges ADRs 0001–0008.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 01 — Architecture lock. Work on branch phase/01-architecture; your first commit sets .phase to 01.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 1), then ARCHITECTURE.md, SECURITY.md §2, §5, §6, TESTING.md §2–§5, docs/reports/phase-00.md.
Do only the Phase 1 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 1, at their exact versions. No data, pages, styles, islands or client scripts (a bare 404 page only if Astro requires a page).
Close these acceptance criteria: AC-OPS-03, AC-OPS-05, AC-OPS-06, AC-OPS-07, AC-OPS-09, AC-SEC-06.
Use exactly the package versions in ARCHITECTURE §2. Configuration values are given in the documents; copy them, do not tune them. vercel.json must be JSON-equal to SECURITY §2. tests/helpers/ must be written from the SPEC text without importing src/.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm ci` and `npm run verify` on a clean state and quoting both exit codes, writing docs/reports/phase-01.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 2 — Data contract

**Goal.** All facts live in `src/data/`, validated by the schema, identical to the legacy data, with URLs that match the locked map.

**Inputs.** ARCHITECTURE §4, §5; SPEC §7.1, §7.6, §8; `reference/data-source/`; `tests/fixtures/golden.json`, `url-map.json`, `invalid/`.

**Tasks.**
1. `scripts/migrate-legacy.ts`: read `reference/data-source/*.mjs`, apply the mapping in ARCHITECTURE §4.3, and write `src/data/**` (one pretty-printed JSON file per scheme named `{id}.json`, keys in schema order; `order.json`; and the other data files in the shapes of ARCHITECTURE §4.1). Run it once; commit its output.
2. `labels.json`: TYPE, STAGE and SECTOR labels from `meta.mjs`; effort labels and STATUS labels exactly as ARCHITECTURE §4.1 lists them (not from `meta.mjs`); `lastVerified: "2026-09-18"`; `dpiitSchemeId: "dpiit"`.
3. `topics.json` and `sectors.json`: copy from `pages.mjs` verbatim, with topic types from SPEC §7.6.
4. `src/lib/schema.ts` (the Zod schemas of ARCHITECTURE §4.1, exactly), `src/content.config.ts` (the `schemes` collection), `src/lib/data.ts` (loads and validates every data file, ARCHITECTURE §4.1), `content.ts` (`validateDataset()`), `slug.ts`, `urls.ts`, `status.ts` (build-time closing, clock passed in), `order.ts`, `format.ts`.
5. Tests: `schema.test.ts` (every file in `tests/fixtures/invalid/` is rejected by the check and at the field its README names), `migration-parity.test.ts`, `slug.test.ts` (`url-map.json` and `slug-cases.json`), `status.test.ts`, an `order` unit test against `tests/helpers/order.ts`.
6. verify-dist checks `AC-DATA-01`, `AC-DATA-03`, `AC-DATA-04`.
7. Data questions: anything in the legacy data that looks wrong goes in the report. Do not change it.

**Out of scope.** Pages and UI. Editing any fact.

**Deliverables.** `scripts/migrate-legacy.ts`, `src/data/**`, the lib files, the tests, `docs/reports/phase-02.md`.

**Closes.** AC-DATA-01, AC-DATA-02, AC-DATA-03, AC-DATA-04, AC-DATA-06, AC-ROUTE-02.

**Exit gate.** Parity test shows 115/115 schemes and every mapped field equal; slug test reproduces all of `url-map.json`; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 02 — Data contract. Work on branch phase/02-data; your first commit sets .phase to 02.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 2), then ARCHITECTURE.md §4–§5, SPEC §7.1, §7.6, §8, reference/data-source/, tests/fixtures/.
Do only the Phase 2 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 2, at their exact versions. No pages or UI.
Close these acceptance criteria: AC-DATA-01, AC-DATA-02, AC-DATA-03, AC-DATA-04, AC-DATA-06, AC-ROUTE-02.
Facts are copied, never edited: not a word, number, date or link. If something in the legacy data looks wrong, list it under "Data questions" and leave it. Status and effort labels come from ARCHITECTURE §4.1, not from meta.mjs. Tests read the fixtures; they never copy values from them. lib/ functions are pure and take the clock as a parameter.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, writing docs/reports/phase-02.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 3 — Static routes and templates

**Goal.** Every page exists at its locked URL with complete, correct content and markup, readable without JavaScript and without the design system.

**Inputs.** SPEC §4–§5, §7.4, §7.6, §7.8, §8; ARCHITECTURE §3, §5, §6.6, §8.1; DESIGN §4 (anatomy and class names), §4.3 (labels), §9 (copy sources); `reference/design/prototype/*.html` (markup reference and copy source).

**Tasks.**
1. `Layout.astro`, `Head.astro` (title, description, canonical, robots meta per ARCHITECTURE §8.1 and AC-SEO-05; the theme boot script is added in Phase 4), `Header.astro`, `Footer.astro`, `TabBar.astro`, `Breadcrumbs.astro` (visible trail only), and the other components in ARCHITECTURE §3 that pages need, using the class names in `reference/design/site.css`.
2. Every page and dynamic route in SPEC §5, with the anatomy of DESIGN §4.2–§4.12, including all `data-*` hooks of ARCHITECTURE §6.6 and `js-only` classes on controls that need JavaScript.
3. `lib/seo.ts`, `lib/content.ts` (topic and sector membership), `lib/similar.ts`, `lib/glossary.ts` (first-occurrence linking).
4. `public/`: the PDF (byte-copy of `reference/`), and the favicons, app icons and `manifest.webmanifest` byte-copied from `reference/icons/`.
5. Add `html-validate` and `node-html-parser` (ARCHITECTURE §2) and `.html-validate.json` (TESTING §4). Build checks: AC-ROUTE-01, -04, -05; AC-SEO-01..05, -11, -13, -14; AC-CONTENT-11, -12; AC-FUNC-26.
6. Tests: `similar.test.ts`, `seo.test.ts`, `counts.test.ts`; e2e `routes.spec.ts` (AC-ROUTE-03, -06), `nojs.spec.ts` (AC-SEO-12), `scheme-page.spec.ts` (AC-CONTENT-01..03), `lists.spec.ts` (AC-CONTENT-04..10).
7. Only the CSS needed for the pages to be legible may be added: `base.css` element defaults and the `.js-only` / `.no-js` rules of DESIGN §6.3. No tokens, fonts or component styles yet.
8. Head tags rendered directly in `Head.astro` (ARCHITECTURE §8.1); Open Graph images come in Phase 8.

**Out of scope.** Styling (Phase 4), islands and client scripts (Phases 5–7), JSON-LD, social images, sitemap and robots.txt (Phase 8).

**Deliverables.** Components, pages, lib files, public files, checks, tests, `docs/reports/phase-03.md`.

**Closes.** AC-DATA-05; AC-ROUTE-01, -03, -04, -05, -06; AC-SEO-01, -02, -03, -04, -05, -11, -12, -13, -14; AC-CONTENT-01..12; AC-FUNC-26.

**Exit gate.** `dist` has exactly the pages of SPEC §5 (175 indexable plus the non-indexable ones); all checks green; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 03 — Static routes and templates. Work on branch phase/03-routes; your first commit sets .phase to 03.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 3), then ARCHITECTURE.md §3, §5, §6.6, §8.1, DESIGN.md §4, reference/design/prototype/*.html.
Do only the Phase 3 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 3, at their exact versions. No design system, islands, client scripts, JSON-LD, social images, sitemap or robots.txt.
Close these acceptance criteria: AC-DATA-05, AC-ROUTE-01, AC-ROUTE-03, AC-ROUTE-04, AC-ROUTE-05, AC-ROUTE-06, AC-SEO-01, AC-SEO-02, AC-SEO-03, AC-SEO-04, AC-SEO-05, AC-SEO-11, AC-SEO-12, AC-SEO-13, AC-SEO-14, AC-CONTENT-01 to AC-CONTENT-12, AC-FUNC-26.
Every visible string comes from data, from SPEC/DESIGN, or from the prototype copy sources in DESIGN §9. Counts are computed, never typed. The scheme page order is DESIGN §4.6, exactly. Use the class names from reference/design/site.css and the hooks from ARCHITECTURE §6.6. Every page must be complete without JavaScript.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, writing docs/reports/phase-03.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 4 — Design system

**Goal.** The site looks like the approved design in both themes at every width, from tokens up.

**Inputs.** DESIGN (all); `reference/design/site.css`, `screens/`, `reference/fonts/`; ARCHITECTURE §7; SECURITY §2.1 (inline script hashing).

**Tasks.**
1. Copy the 9 font files and the OFL licences to `public/fonts/`; write `fonts.css`; preload the 2 fonts in `Head.astro`.
2. `tokens.css` (DESIGN §2, both themes), `base.css`, `print.css`; port the component styles from `site.css` into scoped styles, applying every difference in DESIGN §8.
3. Header, footer, tab bar (with safe areas), breadcrumbs, cards, stamps, stats, steps, checklist, tiles, tile map, timeline, glossary, prose, empty states.
4. Theme: the boot inline script in `Head.astro` (DESIGN §6.2), `stores/theme.ts`, `scripts/theme-toggle.ts`, `theme-color` metas.
5. Tests: `tokens.test.ts` (AC-DES-01), `contrast.test.ts` (AC-A11Y-05), `theme.spec.ts` (AC-FUNC-30), the AC-MOB-03 and AC-MOB-04 tests; verify-dist AC-PERF-03.
6. Screenshots of home, a central scheme and a region page at 390 and 1440, light and dark, next to `reference/design/screens/`, in `docs/evidence/design/`. Ask the owner for sign-off (AC-DES-02, first part).

**Out of scope.** Islands and behaviours (Phases 5–7). New visual ideas: if something is not in DESIGN or `site.css`, it is not built.

**Deliverables.** Styles, fonts, theme files, tests, screenshots, `docs/reports/phase-04.md`.

**Closes.** AC-DES-01, AC-A11Y-05, AC-FUNC-30, AC-MOB-03, AC-MOB-04, AC-PERF-03; AC-DES-02 first sign-off.

**Exit gate.** Owner sign-off on the screenshots recorded in the report; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 04 — Design system. Work on branch phase/04-design; your first commit sets .phase to 04.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 4), then DESIGN.md (all), ARCHITECTURE.md §7, SECURITY.md §2.1, reference/design/site.css, reference/design/screens/.
Do only the Phase 4 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 4, at their exact versions. No islands or behaviours other than the theme toggle.
Close these acceptance criteria: AC-DES-01, AC-A11Y-05, AC-FUNC-30, AC-MOB-03, AC-MOB-04, AC-PERF-03, and prepare AC-DES-02 (home, scheme, region) for the owner's sign-off.
Port site.css; do not invent. Apply every row of DESIGN §8. Colours only through var(--…) tokens, with the one box-shadow exception in ARCHITECTURE §7; no style attributes; !important only where ARCHITECTURE §7 allows it. If D1 is not Editorial and no approved amendment exists, stop with a BLOCKED note.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, saving the comparison screenshots to docs/evidence/design/, writing docs/reports/phase-04.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 5 — Browse and search

**Goal.** `/schemes/` filters, sorts, searches and keeps its state in the URL, exactly per the rules, and degrades to a plain list without JavaScript.

**Inputs.** SPEC FR-05, FR-06, §7.1, §7.2; ARCHITECTURE §6.1, §6.4, §6.5; DESIGN §4.8; `tests/fixtures/golden.json` (`filters`), `search.json`.

**Tasks.**
1. `lib/filters.ts` (predicate, facet counts, result-line text) and its use of `lib/order.ts`.
2. `islands/BrowseControls.tsx` (`client:idle`): tier tabs, facets, sort, result line (`aria-live="polite"`), empty state with "Clear filters", URL state with `replaceState`, the phone bottom sheet with focus trap, Esc, backdrop, focus return and scroll lock. It filters the server-rendered list as ARCHITECTURE §6.4 describes.
3. Add `@astrojs/preact` and `astro-pagefind` to `astro.config.mjs`. Pagefind: `data-pagefind-body` and `data-pagefind-meta` on scheme pages (already in markup), lazy `import()` on first focus or when `q` is present, results intersected with the filters.
4. Search entry points: the home and 404 forms submit to `/schemes/?q=`; the header search link goes to `/schemes/#search` and focuses the input.
5. Tests: `filters.test.ts` (AC-FUNC-01, -02 against the helper and golden), `order.test.ts` (AC-FUNC-04), `browse.spec.ts`, `search.spec.ts`, the AC-FUNC-08 no-JS test.
6. Screenshots of `/schemes/` with the sheet open at 390 and the sidebar at 1440 for the owner (AC-DES-02, second part).

**Out of scope.** Finder, shortlist, compare (save and compare buttons render but are wired in Phase 7).

**Deliverables.** The island and its CSS, lib files, tests, screenshots, `docs/reports/phase-05.md`.

**Closes.** AC-FUNC-01..12; AC-DES-02 second sign-off.

**Exit gate.** All golden filter counts reproduced in the browser; search fixtures pass; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 05 — Browse and search. Work on branch phase/05-browse; your first commit sets .phase to 05.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 5), then SPEC §7.1–§7.2, ARCHITECTURE.md §6, DESIGN.md §4.8, tests/fixtures/golden.json and search.json.
Do only the Phase 5 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 5, at their exact versions. Save and compare buttons stay unwired until Phase 7.
Close these acceptance criteria: AC-FUNC-01 to AC-FUNC-12, and prepare AC-DES-02 (/schemes/) for the owner's sign-off.
The filter and sort rules in SPEC §7 are exact; implement them literally, including the any-sector rule and the "searching all tiers" rule. Tests compare lib code with tests/helpers and golden.json, never with itself. The island filters the server-rendered cards (ARCHITECTURE §6.4); it does not render cards. Pagefind loads only on demand (AC-FUNC-12).
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, writing docs/reports/phase-05.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 6 — Eligibility finder

**Goal.** The six-question finder produces exactly the ranked matches the algorithm defines, remembers answers, and is fully accessible.

**Inputs.** SPEC FR-07, §7.3; ARCHITECTURE §6.1–§6.3; DESIGN §4.9; `golden.json` (`finder`).

**Tasks.**
1. `lib/finder.ts` (scoring, reasons, warnings, match %).
2. `src/pages/data/schemes.json.ts` (ARCHITECTURE §6.3) and a memoized loader for islands.
3. `stores/quiz.ts` and `stores/shortlist.ts` (the shortlist store is needed for "Save all").
4. `islands/EligibilityFinder.tsx` (`client:load`): one question per screen, Back and Next, the inline validation message, progress, focus to the question heading on change, results with reasons and warnings, "Change answers", "Save all {N}". Its server output is the first question and a short explanation, not an empty box.
5. Tests: `finder.test.ts` (AC-FUNC-14 against golden), `finder.spec.ts` (AC-FUNC-13..15).
6. Finder screenshots at 390 and 1440 for the owner (AC-DES-02, final part).

**Out of scope.** The header shortlist count and the shortlist page (Phase 7).

**Deliverables.** The files above, `docs/reports/phase-06.md`.

**Closes.** AC-FUNC-13, AC-FUNC-14, AC-FUNC-15; AC-DES-02 (closes).

**Exit gate.** Every golden finder scenario reproduced in the browser; owner sign-off on the finder screenshots; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 06 — Eligibility finder. Work on branch phase/06-finder; your first commit sets .phase to 06.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 6), then SPEC §7.3, ARCHITECTURE.md §6.1–§6.3, DESIGN.md §4.9, tests/fixtures/golden.json (finder).
Do only the Phase 6 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 6, at their exact versions.
Close these acceptance criteria: AC-FUNC-13, AC-FUNC-14, AC-FUNC-15, and prepare AC-DES-02 (finder) for the owner's sign-off.
The scoring table in SPEC §7.3 is exact, including the tie-break (id ascending), the "above 2" cut-off, the top 20, and match % = max(35, round(score / top × 100)). Tests read golden.json; they never copy values from it. The island's server output must be meaningful without JavaScript. Stored answers are validated against the enums on read.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, writing docs/reports/phase-06.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 7 — Shortlist, compare and page behaviours

**Goal.** Saving, comparing, sharing, printing, checklists, glossary popovers, live deadlines and legacy redirects all work, persist correctly and sync across tabs.

**Inputs.** SPEC FR-08..FR-12, FR-17, FR-18, §7.5; ARCHITECTURE §6.1–§6.3, §6.6; DESIGN §4.3, §4.4, §4.10, §7; SECURITY §5.

**Tasks.**
1. Stores `compare.ts` and `docs.ts`; cross-tab sync with `listen: true`; defensive decoding.
2. Bundled scripts: `actions.ts`, `share-print.ts`, `doc-checklist.ts`, `glossary-popover.ts`, `deadlines.ts`, `legacy-redirect.ts`, `toast.ts`.
3. Islands: `ShortlistView.tsx` and `CompareView.tsx` (`client:load`), `CompareTray.tsx` (`client:idle`, on every page except `/compare/`).
4. Wire the save and compare buttons on every card and scheme page; header and tab-bar counts.
5. Tests: `stores.test.ts`, `shortlist.spec.ts`, `compare.spec.ts`, `scheme-page.spec.ts` additions (AC-FUNC-23..25), `glossary.spec.ts`, `legacy.spec.ts`, `deadlines.spec.ts` (with `page.clock`), and the finder "Save all" count test (AC-FUNC-16); cross-tab tests tagged `@webkit` too.

**Out of scope.** SEO metadata, security hardening beyond SECURITY §5, performance tuning.

**Deliverables.** The files above, `docs/reports/phase-07.md`.

**Closes.** AC-FUNC-16..25, AC-FUNC-27, AC-FUNC-28, AC-FUNC-29.

**Exit gate.** All feature tests green in `mobile-390`, `desktop-1440` and (tagged) `webkit-390`; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 07 — Shortlist, compare and page behaviours. Work on branch phase/07-behaviours; your first commit sets .phase to 07.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 7), then SPEC FR-08 to FR-12, FR-17, FR-18 and §7.5, ARCHITECTURE.md §6, DESIGN.md §4.3, §4.4, §4.10, §7, SECURITY.md §5.
Do only the Phase 7 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 7, at their exact versions.
Close these acceptance criteria: AC-FUNC-16 to AC-FUNC-25, AC-FUNC-27, AC-FUNC-28, AC-FUNC-29.
Only the stores touch localStorage. Bundled scripts use the DOM hooks in ARCHITECTURE §6.6, event delegation, textContent only, ≤ 150 lines each. The legacy redirect follows SPEC §7.7 and only navigates to paths from the build's own URL map (SECURITY §5 rule 5); tests/fixtures/legacy-routes.json is the test list. Deadline labels follow DESIGN §4.3 exactly, computed in Asia/Kolkata. Messages are the exact strings in DESIGN §4.10.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, writing docs/reports/phase-07.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 8 — Search engine indexing

**Goal.** Every indexable page is correctly described to search engines and social platforms, and nothing else is.

**Inputs.** SPEC §5, NFR-SEO; ARCHITECTURE §8; DESIGN §5; SECURITY §4 (D2).

**Tasks.**
1. `lib/jsonld.ts` with `schema-dts` types and `JsonLd.astro` (the only `set:html`), per template (ARCHITECTURE §8.2); breadcrumb JSON-LD matching the visible trail.
2. Open Graph and Twitter tags in `Head.astro`, on indexable pages only (non-indexable pages get no `og:*` or `twitter:*` tags); `og:title` rules (ARCHITECTURE §8.1).
3. `src/pages/og/[...route].ts` with `astro-og-canvas` (DESIGN §5): one image per scheme, per region, and the default.
4. Add `@astrojs/sitemap` to `astro.config.mjs` (filter and `lastmod`); `src/pages/robots.txt.ts` from D2; the `GOOGLE_SITE_VERIFICATION` meta when set.
5. Build checks AC-SEO-06..10.

**Out of scope.** Search Console and rich-results checks in production (Phase 14).

**Deliverables.** The files above, `docs/reports/phase-08.md`.

**Closes.** AC-SEO-06, AC-SEO-07, AC-SEO-08, AC-SEO-09, AC-SEO-10.

**Exit gate.** Build checks green; 3 sample pages' JSON-LD pasted in the report; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 08 — Search engine indexing. Work on branch phase/08-seo; your first commit sets .phase to 08.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 8), then ARCHITECTURE.md §8, DESIGN.md §5, SECURITY.md §4, SPEC §3 (D2).
Do only the Phase 8 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 8, at their exact versions.
Close these acceptance criteria: AC-SEO-06, AC-SEO-07, AC-SEO-08, AC-SEO-09, AC-SEO-10.
JSON-LD is built through schema-dts types and serialized only in JsonLd.astro with "<" escaped. The sitemap contains exactly the indexable set. robots.txt is exactly SECURITY §4 for the D2 value in SPEC §3. Social images are generated at build with the local font files; no network.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, pasting the JSON-LD of one scheme, one region and one topic page into the report, writing docs/reports/phase-08.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 9 — Security and privacy

**Goal.** Prove the security and privacy contract holds everywhere, and that the build refuses to ship when it does not.

**Inputs.** SECURITY (all); ACCEPTANCE §I; TESTING §4, §5.1.

**Tasks.**
1. Build checks AC-SEC-02 and AC-SEC-05.
2. E2E: `routes.spec.ts` header assertions through `serve-dist` (AC-SEC-01), the automatic guards across the full suite (AC-SEC-03, -04, AC-PRIV-01), `privacy.spec.ts` (AC-PRIV-02).
3. Hostile-input tests: `?q=` and filter parameters containing markup and script text render as text; legacy hashes with unknown ids, `javascript:`, `//evil.example` and encoded variants end on `/`; corrupted and oversized values in every `ffg:*` key reset without errors.
4. `fail-closed.test.ts` (AC-OPS-01): each injected fault fails the build.
5. Review every `target="_blank"`, every store decoder and every place that reads the URL.
6. If D4 = On: add the analytics script behind `PUBLIC_ANALYTICS` (ARCHITECTURE §9), with a verify-dist check that it appears exactly once per page when `on` and never when `off`.

**Out of scope.** Firewall configuration (Phase 14, owner).

**Deliverables.** Checks, tests, `docs/reports/phase-09.md` with a table of every hostile input tried and the result.

**Closes.** AC-SEC-01..05, AC-PRIV-01, AC-PRIV-02, AC-OPS-01 (AC-SEC-06 closed in Phase 1; quote `npm run audit` again).

**Exit gate.** Zero CSP violations and zero foreign requests across the whole e2e suite; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 09 — Security and privacy. Work on branch phase/09-security; your first commit sets .phase to 09.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 9), then SECURITY.md (all), TESTING.md §4 and §5.1.
Do only the Phase 9 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 9, at their exact versions.
Close these acceptance criteria: AC-SEC-01 to AC-SEC-05, AC-PRIV-01, AC-PRIV-02, AC-OPS-01; quote `npm run audit`.
Never relax the CSP or headers to make something work; if something breaks under the policy, fix the code or stop with a BLOCKED note. Hostile-input tests must assert exact outcomes (the text rendered, the final URL), not just "no crash".
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, writing docs/reports/phase-09.md from templates/phase-report.md with the hostile-input table, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 10 — Performance

**Goal.** Meet every budget with margin on a throttled mid-range phone profile.

**Inputs.** SPEC NFR-PERF; ACCEPTANCE §H; TESTING §3.2, §6.

**Tasks.**
1. Build checks AC-PERF-02 (JS budgets, TESTING §6) and AC-PERF-04 (HTML weight).
2. AC-PERF-05 caching test through `serve-dist`.
3. `npm run lhci`: median of 3 runs on the 3 URLs; fix what fails without breaking any other criterion (font preloads, layout shift from fonts or the tab bar, blocking work in islands, oversized props).
4. `reproducible.test.ts` (AC-OPS-02).
5. `npm run links` (internal links) and record the result.

**Out of scope.** Changing budgets, removing features, or deferring content to meet a number.

**Deliverables.** Checks, fixes, `.lighthouseci/` summary quoted in `docs/reports/phase-10.md`.

**Closes.** AC-PERF-01 [L], AC-PERF-02, AC-PERF-04, AC-PERF-05, AC-OPS-02.

**Exit gate.** Lighthouse assertions pass; budgets printed by the build with margin; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 10 — Performance. Work on branch phase/10-performance; your first commit sets .phase to 10.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 10), then ACCEPTANCE §H, TESTING.md §3.2 and §6.
Do only the Phase 10 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 10, at their exact versions.
Close these acceptance criteria: AC-PERF-01, AC-PERF-02, AC-PERF-04, AC-PERF-05, AC-OPS-02.
Budgets and Lighthouse settings are fixed. Meeting a number by removing a feature, hiding content, delaying content past the test, or changing throttling is forbidden (AGENTS §4 F-04, F-24). Quote the median values for each URL and each metric.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify`, `npm run links` and `npm run lhci` and quoting their exit codes, writing docs/reports/phase-10.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 11 — Accessibility and mobile usability

**Goal.** WCAG 2.2 AA in practice, and comfortable use on a 320 px phone, proven by automated sweeps and a real screen reader.

**Inputs.** SPEC NFR-A11Y, NFR-MOB; ACCEPTANCE §F, §G; DESIGN §4.1, §4.5, §6, §8 (tap-target rule).

**Tasks.**
1. `a11y.spec.ts`: axe on every template in `tests/helpers/templates.ts` at 390 and 1440, light and dark (AC-A11Y-01); keyboard path and skip link (-02); focus management for sheet, finder and popover (-03); names and states (-04); reduced motion (-06).
2. `mobile.spec.ts`: overflow sweep at 6 widths on every template (AC-MOB-01); tap targets at 390 (AC-MOB-02).
3. Manual: screen-reader walkthroughs (AC-A11Y-07) and safe areas on a notched iPhone or simulator (AC-MOB-05), with notes and screenshots in `docs/evidence/phase-11/`. If the builder cannot run a screen reader or simulator, write the exact steps in the report and mark them BLOCKED for the owner.

**Out of scope.** Visual redesign; changing tokens (proposal if contrast fails).

**Deliverables.** Tests, fixes, evidence, `docs/reports/phase-11.md`.

**Closes.** AC-A11Y-01..04, AC-A11Y-06, AC-A11Y-07 [M], AC-MOB-01, AC-MOB-02, AC-MOB-05 [M].

**Exit gate.** Zero serious or critical axe violations anywhere; manual evidence present or accepted by the owner; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 11 — Accessibility and mobile usability. Work on branch phase/11-a11y; your first commit sets .phase to 11.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 11), then ACCEPTANCE §F and §G, DESIGN.md §4.1, §4.5, §6, §8.
Do only the Phase 11 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 11, at their exact versions.
Close these acceptance criteria: AC-A11Y-01, AC-A11Y-02, AC-A11Y-03, AC-A11Y-04, AC-A11Y-06, AC-A11Y-07, AC-MOB-01, AC-MOB-02, AC-MOB-05.
Fix the markup or CSS, never the test: no disabled axe rules, no aria-hidden on real content, no removing controls to pass tap-target checks. Manual checks you cannot perform are BLOCKED with exact steps for the owner, never PASS.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify` and quoting its exit code, writing docs/reports/phase-11.md from templates/phase-report.md, and replying with the criteria table. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 12 — End-to-end completeness

**Goal.** Every [T] and [B] criterion is covered and green in every relevant project, and CI (if chosen) enforces it on every push.

**Inputs.** ACCEPTANCE (all); TESTING (all).

**Tasks.**
1. Set `.phase` to 12, so `ac-coverage` runs in strict mode; close every gap it reports.
2. Run the full suite in all 7 projects; fix anything that fails in only one browser or width.
3. After the owner has signed off AC-DES-02: create visual baselines (AC-DES-03) for the five templates at 390 and 1440 in Chromium, and commit them with the owner's approval quoted.
4. If D3 = Yes: add `.github/workflows/ci.yml` and `daily-rebuild.yml` exactly as TESTING §8. Ask the owner (BLOCKED note with steps) to add the `VERCEL_DEPLOY_HOOK_URL` secret, push, and send links to one green run of each (AC-OPS-08).
5. A final full `npm run verify`, `npm run links`, `npm run lhci` and `npm run audit`.

**Out of scope.** New features or content.

**Deliverables.** Tests, baselines, workflows, `docs/reports/phase-12.md` with the full AC table (every criterion, every status).

**Closes.** AC-DES-03, AC-OPS-08 [M]; re-confirms every earlier [T] and [B] criterion.

**Exit gate.** `ac-coverage` strict passes; every [T]/[B] criterion PASS; audit clean.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 12 — End-to-end completeness. Work on branch phase/12-e2e; your first commit sets .phase to 12.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 12), then TESTING.md (all).
Do only the Phase 12 tasks. Add only the packages ARCHITECTURE §2 lists for Phase 12, at their exact versions. No new features or content.
Close: AC-DES-03 and AC-OPS-08 (N/A if D3 = No), and bring every [T] and [B] criterion to PASS under ac-coverage strict mode.
Visual baselines are created only after the owner's AC-DES-02 sign-off, and only with the owner's approval quoted in the report. Workflows are copied from TESTING §8 exactly; you do not push or add secrets.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish by running `npm run verify`, `npm run links` and `npm run lhci` and quoting their exit codes, writing docs/reports/phase-12.md with the status of every criterion in ACCEPTANCE.md, and replying with the summary counts per status. A criterion without evidence from this session is UNVERIFIED.
```

---

### Phase 13 — Adversarial audit (whole site)

**Goal.** Independent reviewers try to break the finished site against the whole contract before it ships.

**Inputs.** Everything; the Phase 12 report.

**Tasks.**
1. The owner runs **two independent reviewers** on the same commit (for example Gemini CLI and a fresh Claude session), each with the whole-site prompt in AUDIT §6.3. They do not see each other's reports.
2. The builder fixes every P0 and P1 on branch `phase/13-fixes` using the fix prompt (§2.2), with fresh evidence.
3. Re-audit until both reviewers report 0 open P0 and 0 open P1. The owner accepts or rejects each P2 in writing.

**Out of scope.** New features; any change not tied to a finding.

**Deliverables.** `docs/audits/phase-13-audit-{reviewer}-{K}.md`, fixes, `docs/reports/phase-13.md` with every finding and its resolution.

**Closes.** No new criteria. Re-confirms all of them.

**Exit gate.** Both reviewers clean; owner's P2 decisions recorded.

**Prompt (builder, for fixes).** Use §2.2 with `{NN}` = 13.

---

### Phase 14 — Production verification

**Goal.** The live site at the production URL meets the contract, is configured and monitored, and can be rolled back.

**Inputs.** SECURITY §3, §6, §7; ACCEPTANCE §L and every [P] part; TESTING §7.

**Owner tasks** (the builder cannot do these; F-19):
1. If D4 = On: enable Web Analytics for the project in the Vercel dashboard **before** merging (otherwise `/_vercel/insights/script.js` returns 404). Then merge to `main`; Vercel deploys production.
2. Configure the firewall exactly as SECURITY §3 and take screenshots.
3. Complete the SECURITY §6 owner checklist.
4. Verify the Search Console property, submit the sitemap, run URL inspection on home and one scheme page; run the Rich Results Test and Schema Markup Validator on one scheme, one region and one topic page.
5. Real-device walkthrough on one Android and one iPhone (AC-PROD-04).
6. Rehearse Instant Rollback to the previous deployment and back (AC-PROD-05).
7. After 7 days: record Vercel usage (AC-OPS-04) and switch Bot Protection from Log to Challenge per SECURITY §3 R3.

**Builder tasks.**
1. Quote `npm run audit`. Run every [P] check with `curl` against the production origin and paste the output: AC-PROD-01, and the [P] parts of AC-ROUTE-03, AC-ROUTE-06, AC-SEO-07, AC-CONTENT-11, AC-PERF-05, AC-SEC-01, AC-PRIV-01; `/.env` → 403 (AC-SEC-07).
2. Run the tests tagged `@prod-safe` against production with `BASE_URL` set (TESTING §3); no other tests.
3. Collect the owner's evidence into `docs/evidence/phase-14/` and write the final report with every criterion's final status.

**Closes.** AC-PROD-01..05, AC-SEC-07, AC-OPS-04, and all [P] parts.

**Exit gate.** Every criterion in ACCEPTANCE is PASS, or N/A by an owner decision, or explicitly accepted by the owner in writing. The owner signs the report.

**Prompt.**
```
You are the BUILDER for this repository. Follow AGENTS.md exactly; it overrides your defaults.
Phase 14 — Production verification. Work on branch phase/14-production; your first commit sets .phase to 14.
Read first, in this order: AGENTS.md, SPEC.md, ACCEPTANCE.md, PHASES.md (Phase 14), then SECURITY.md §3, §6, §7, TESTING.md §7.
You may not deploy, merge, or change Vercel or GitHub settings. List the owner tasks in PHASES.md Phase 14 as BLOCKED notes with exact steps, and verify each one from the evidence the owner gives you.
Run every [P] check against the production origin I give you, with curl, and paste the full output. Run only read-only Playwright tests against production.
Close: AC-PROD-01 to AC-PROD-05, AC-SEC-07, AC-OPS-04, and the [P] parts of AC-ROUTE-03, AC-ROUTE-06, AC-SEO-07, AC-CONTENT-11, AC-PERF-05, AC-SEC-01, AC-PRIV-01, plus the AC-CONTENT-10 analytics sentence on production when D4 = On.
If anything conflicts, is ambiguous, or would need a forbidden shortcut (AGENTS §4), write a BLOCKED note (AGENTS §5) and continue with what does not depend on it. Never guess.
Finish with docs/reports/phase-14.md listing the final status of every criterion in ACCEPTANCE.md, and reply with the summary counts per status. A criterion without evidence is UNVERIFIED.
```
