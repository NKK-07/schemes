# TESTING.md — how every claim gets proven

`ACCEPTANCE.md` says **what** must be true. This file says **how** it is checked: tools, commands, test layout, fixtures, budgets, evidence and CI. Agents may not edit it; changes go through `docs/proposals/`.

---

## 1. Rules

1. **A test proves an acceptance criterion or it does not exist.** Every Vitest and Playwright test title starts with the AC id it proves (`test("AC-FUNC-04 largest-amount sort matches reference order", …)`). A test may name several ids: `"AC-FUNC-17 AC-A11Y-04 save toggle …"`.
2. **Tests never check code against itself.** Logic in `src/lib/` is compared with:
   - the golden files (`tests/fixtures/golden.json`, `url-map.json`, `search.json`), which were generated from the approved prototype and are **read** by tests, never copied into them; or
   - independent reference helpers in `tests/helpers/` (`predicate.ts` for SPEC §7.2, `order.ts` for SPEC §7.1), written from the SPEC text **without importing from `src/`**. An ESLint rule forbids `src/` imports in `tests/helpers/`.
3. **No weakening.** A failing test is fixed by fixing the code. Changing a test's expected value, skipping it (`.skip`, `.only`, `test.fixme`, `test.fail`), raising a timeout to hide slowness, loosening a selector until it matches something else, or lowering a budget is forbidden (AGENTS §4). If a test is wrong, the agent writes a proposal.
4. **Deterministic.** No retries (`retries: 0` everywhere). A test that passes only sometimes is a failing test. Time is controlled with `page.clock` or an injected clock; network is local only.
5. **Snapshots are not truth.** The only snapshots are the visual baselines in AC-DES-03, created after the owner signs off the screenshots, and updated only with the owner's approval.

## 2. Commands (`package.json` scripts, exact)

```json
{
  "dev": "astro dev",
  "build": "astro build && tsx scripts/verify-dist.ts",
  "build:test": "tsx scripts/build-test.ts",
  "preview": "tsx scripts/serve-dist.ts --port 4321",
  "typecheck": "astro check && tsc --noEmit",
  "lint": "eslint .",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "knip": "knip",
  "test:unit": "vitest run",
  "test:e2e": "playwright test --pass-with-no-tests",
  "ac-coverage": "tsx scripts/ac-coverage.ts",
  "links": "linkinator dist --recurse --skip \"^(?!http://localhost)\"",
  "lhci": "lhci autorun",
  "audit": "npm audit --omit=dev --audit-level=high",
  "verify": "npm run typecheck && npm run lint && npm run format:check && npm run knip && npm run test:unit && npm run build:test && npm run ac-coverage && npm run test:e2e"
}
```

- `npm run verify` is the gate for every phase (SPEC §9). `--pass-with-no-tests` exists only so Phases 1–2 can run the same command before any e2e spec exists. Coverage is enforced by `ac-coverage`, not by Playwright: it reads the current phase number from the one-line file `.phase` at the repository root and fails if any [T] or [B] criterion allocated to that phase **or an earlier one** (PHASES.md §3) has no matching test title or build check. From Phase 12 on, every [T] and [B] criterion must be covered.
- `npm run build` is what Vercel runs (real clock). `npm run build:test` is the same build with `BUILD_DATE` pinned to `golden.json.buildDate` and `PUBLIC_ANALYTICS=off` (the analytics script only exists on Vercel), so deadline-dependent golden values (open filters, finder, similar schemes) stay valid after real deadlines pass. `verify`, `fail-closed.test.ts` and `reproducible.test.ts` use `build:test`. verify-dist compares deadline-dependent golden values only when `BUILD_DATE` equals `golden.json.buildDate`; status-independent checks always run.
- `npm run links` and `npm run lhci` run in CI (§8) and in Phases 10, 11 and 14 by hand.
- The builder always runs commands from the repository root with Node 22 (`node -v` is quoted in every report).

## 3. Tools and configuration

| Tool | Config file | Settings that are fixed |
|---|---|---|
| Vitest 5.0.1 | `vitest.config.ts` | `environment: "node"`, `include: ["tests/unit/**/*.test.ts"]`, `testTimeout: 20000` (600000 only for `reproducible.test.ts` and `fail-closed.test.ts`) |
| Playwright 1.63.0 | `playwright.config.ts` | `testDir: "tests/e2e"`, `retries: 0`, `forbidOnly: true`, `failOnFlakyTests: true`, `fullyParallel: true`, `use.baseURL: process.env.BASE_URL ?? "http://localhost:4321"`, `webServer`: `{ command: "npm run preview", url: "http://localhost:4321/", reuseExistingServer: !process.env.CI }` only when `BASE_URL` is not set (Phase 14 sets it to the production origin and runs only tests tagged `@prod-safe`), `reporter: [["list"], ["html", { open: "never" }]]`, projects in §3.1 |
| axe | `@axe-core/playwright` 4.13.0 | Tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`; fail on impact `serious` or `critical`; no rules disabled |
| Lighthouse CI 0.15.1 | `lighthouserc.json` | §3.2 |
| linkinator 8.1.0 | CLI flags in `links` script | Internal links only |
| html-validate 11.16.0 | `.html-validate.json` | §4 |
| ESLint 10.10.0 | `eslint.config.js` | §3.3 |
| Prettier 3.9.8 | `.prettierrc`, `.prettierignore` | `.prettierrc` = `{ "printWidth": 100, "plugins": ["prettier-plugin-astro"] }`; `.prettierignore` is §3.4, exactly. The locked documents are ignored so that `format:check` never asks anyone to reformat them |
| knip 6.37.0 | `knip.json` | `entry`: `src/pages/**/*.{astro,ts}`, `src/content.config.ts`, `scripts/*.ts`, `tests/**/*.ts`, and the root config files; `project`: `src/**`, `scripts/**`, `tests/**`; `ignore`: `reference/**`; no `ignoreDependencies`, no `ignoreExportsUsedInFile`. Because every test file is an entry, helpers and fixtures created before their first test are not reported as unused; everything in `src/` must be used by a page or a test from the phase that creates it |

### 3.1 Playwright projects

| Project | Browser | Viewport | Other | Runs |
|---|---|---|---|---|
| `mobile-320` | Chromium | 320×640 | `isMobile`, `hasTouch`, DPR 2 | Tests tagged `@mobile` |
| `mobile-390` | Chromium | 390×844 | `isMobile`, `hasTouch`, DPR 3 | All tests except those tagged `@desktop-only`, `@nojs`, `@dark-only` or `@webkit-only` |
| `tablet-768` | Chromium | 768×1024 | `hasTouch` | Tests tagged `@mobile` |
| `desktop-1440` | Chromium | 1440×900 | | All tests except those tagged `@mobile-only`, `@nojs`, `@dark-only` or `@webkit-only` |
| `no-js` | Chromium | 390×844 | `javaScriptEnabled: false` | Tests tagged `@nojs` only |
| `dark` | Chromium | 390×844 | `colorScheme: "dark"` | Tests tagged `@dark` (they also run in the light projects) or `@dark-only` |
| `webkit-390` | WebKit | 390×844 | `isMobile`, `hasTouch` | Tests tagged `@webkit` or `@webkit-only` (cross-tab sync, theme, sheet, finder) |

Tags are implemented with `grep`/`grepInvert` in each project, never with runtime `test.skip`. Width sweeps (AC-MOB-01: 320, 360, 390, 768, 1024, 1440) loop over `page.setViewportSize` inside one test in `desktop-1440`.

### 3.2 `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "listening",
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/schemes/credit-guarantee-scheme-for-startups/",
        "http://localhost:4321/schemes/"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "aggregationMethod": "median-run",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": ".lighthouseci" }
  }
}
```

Lighthouse's default mobile emulation and simulated throttling are used; nothing in `settings` may change them. `serve-dist` must print a line containing `listening` when ready.

### 3.3 ESLint rules that enforce the contract

In addition to `typescript-eslint` strict-type-checked and `eslint-plugin-astro` recommended:
- `@typescript-eslint/no-explicit-any`: error; `@typescript-eslint/ban-ts-comment`: error (all directives).
- `no-restricted-syntax` / `no-restricted-properties`: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `Function` constructor, `dangerouslySetInnerHTML`, JSX `style` props, and `localStorage`/`sessionStorage` outside `src/stores/**` (SECURITY §5, ARCHITECTURE §6.2). The theme boot script in `Head.astro` is the one file with an override, and the override comment cites ADR 0005.
- `no-restricted-imports`: `tests/helpers/**` may not import from `src/**`; `src/lib/**` may not import `astro:*`, `preact` or DOM-only modules; `src/islands/**` may not import other islands.
- `linterOptions.reportUnusedDisableDirectives: "error"`. Any `eslint-disable` comment must name the rule and cite an ADR (`-- ADR-0005`); `ac-coverage.ts` greps for comments that do not (AC-OPS-06).

### 3.4 Ignore lists

`.prettierignore`:

```
*.md
templates/
reference/
public/
tests/fixtures/
docs/
dist/
.astro/
.lighthouseci/
playwright-report/
test-results/
package-lock.json
```

ESLint `ignores` (in `eslint.config.js`): `dist/**`, `.astro/**`, `reference/**`, `node_modules/**`, `.lighthouseci/**`, `playwright-report/**`, `test-results/**`, `public/**`.

`vercel.json` must be **JSON-equal** to SECURITY §2 (parsed objects deep-equal); Prettier may format it.

(`public/` is ignored because its files are byte-copies of `reference/`.)

## 4. Build checks (`scripts/verify-dist.ts`)

Runs after `astro build` and exits non-zero on the first failing check group, printing every failure in that group. Each check is a named function whose name starts with the AC id, and prints `AC-… ok` with a count on success. It parses HTML and XML with `node-html-parser` (ARCHITECTURE §2) — **no regular expressions over HTML**. PNG dimensions are read from the IHDR chunk (bytes 16–23).

| Check | What it does |
|---|---|
| `AC-DATA-01` | Loads every file in `src/data/` through the Zod schemas (the same schemas as `content.config.ts`) |
| `AC-DATA-03`, `AC-DATA-04` | `stacksWith`, update `schemeId`, roadmap `schemeIds`, `region` and document keys exist; ids, URLs, region slugs and glossary anchors are unique |
| `AC-ROUTE-01`, `-04`, `-05` | Page files exist exactly as in `url-map.json`; counts equal `golden.json` |
| `AC-SEO-01` … `AC-SEO-11`, `AC-SEO-13`, `AC-SEO-14` | Titles, descriptions, canonicals, h1 and heading order, robots meta, sitemap parity, robots.txt, JSON-LD, social tags and image sizes (PNG header read), breadcrumbs, internal links, link depth, `html-validate` |
| `AC-CONTENT-11`, `AC-CONTENT-12` | PDF byte-equal to `reference/`; footer statement, date and PDF link on every page |
| `AC-FUNC-26` | Glossary anchors exist for every term link |
| `AC-PERF-02`, `-03`, `-04` | JS budgets (§6), font files and preloads, HTML weight |
| `AC-SEC-02`, `AC-SEC-05` | CSP meta present; the hash of every inline executable `<script>` (not `application/ld+json`) and every inline `<style>` listed; no `'unsafe-inline'`/`'unsafe-eval'` for scripts; no `on*=` attributes, no `style=` attributes, external links have `rel="noopener"`; when `PUBLIC_ANALYTICS=on`, the analytics script tag appears exactly once per page, and never when `off` |
| `AC-OPS-03` | `engines.node` = `22.x`, `.nvmrc` = `22`, `verify` script order |

`.html-validate.json`:

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "no-inline-style": "error",
    "require-sri": "off",
    "no-trailing-whitespace": "off",
    "void-style": "off",
    "long-title": "off"
  }
}
```

`require-sri` is off because every script is same-origin; `long-title` is off because AC-SEO-01 owns title length. Any other rule change needs a proposal.

## 5. Test layout

```
tests/
├─ unit/
│  ├─ schema.test.ts           AC-DATA-01 (each file in fixtures/invalid/ is rejected with the expected path)
│  ├─ migration-parity.test.ts AC-DATA-02
│  ├─ counts.test.ts           AC-DATA-05 part 1 (no count literals in src/); part 2 is an e2e test in lists.spec.ts
│  ├─ status.test.ts           AC-DATA-06
│  ├─ slug.test.ts             AC-ROUTE-02 (url-map.json and slug-cases.json)
│  ├─ order.test.ts            AC-FUNC-04 (lib/order vs helpers/order over all 115 schemes)
│  ├─ filters.test.ts          AC-FUNC-01, AC-FUNC-02 (lib/filters vs helpers/predicate and golden.filters)
│  ├─ finder.test.ts           AC-FUNC-14 (lib/finder vs golden.finder)
│  ├─ similar.test.ts          AC-CONTENT-04 (lib/similar vs golden, 5 schemes)
│  ├─ seo.test.ts              title/description rules of ARCHITECTURE §8.1 for edge cases (> 70 chars, abbr = name)
│  ├─ stores.test.ts           AC-FUNC-18.3, AC-FUNC-20 (corrupt JSON, unknown ids, 4th compare)
│  ├─ contrast.test.ts         AC-A11Y-05
│  ├─ tokens.test.ts           AC-DES-01
│  ├─ deps.test.ts             AC-SEC-06 parts 1, 2, 4 (exact pins, allowlist and phases = ARCHITECTURE §2, lockfile present); part 3 is `npm run audit`, which needs the network and is quoted in reports and run in CI
│  ├─ tooling.test.ts          AC-OPS-05, AC-OPS-06, AC-OPS-07 (spawns tsc/astro check, eslint, prettier, knip; asserts exit 0)
│  ├─ fail-closed.test.ts      AC-OPS-01 (copies the repo to a temp dir, injects each fault, asserts the build fails)
│  └─ reproducible.test.ts     AC-OPS-02 (two clean builds into temp dirs, compares file hashes)
├─ e2e/
│  ├─ fixtures.ts              extended `test` with automatic guards (§5.1)
│  ├─ routes.spec.ts           AC-ROUTE-03, AC-ROUTE-06, AC-PERF-05, AC-SEC-01, AC-PRIV-01
│  ├─ nojs.spec.ts             AC-SEO-12, AC-FUNC-08 (@nojs)
│  ├─ scheme-page.spec.ts      AC-CONTENT-01..03, AC-FUNC-23..25
│  ├─ lists.spec.ts            AC-CONTENT-05..10
│  ├─ browse.spec.ts           AC-FUNC-01..09
│  ├─ search.spec.ts           AC-FUNC-10..12
│  ├─ finder.spec.ts           AC-FUNC-13..16
│  ├─ shortlist.spec.ts        AC-FUNC-17..19
│  ├─ compare.spec.ts          AC-FUNC-20..22
│  ├─ glossary.spec.ts         AC-FUNC-27
│  ├─ legacy.spec.ts           AC-FUNC-28 (every case in legacy-routes.json)
│  ├─ deadlines.spec.ts        AC-FUNC-29
│  ├─ theme.spec.ts            AC-FUNC-30 (@dark @webkit)
│  ├─ mobile.spec.ts           AC-MOB-01..04 (@mobile)
│  ├─ a11y.spec.ts             AC-A11Y-01..06 (@dark)
│  ├─ privacy.spec.ts          AC-PRIV-02
│  └─ visual.spec.ts           AC-DES-03 (after sign-off only)
├─ helpers/  predicate.ts  order.ts  templates.ts (the list of template URLs used by sweeps)
└─ fixtures/ golden.json  url-map.json  slug-cases.json  legacy-routes.json  search.json  invalid/*.json
```

### 5.1 Automatic guards (every e2e test)

`tests/e2e/fixtures.ts` extends Playwright's `test` so that every test, without opting in:
- records `securitypolicyviolation` events (through `addInitScript`) and fails if any occurred (AC-SEC-03);
- fails on any `console.error` or uncaught page error;
- fails if any request goes to an origin other than the test server, except `/_vercel/insights/*` when `PUBLIC_ANALYTICS=on` (AC-SEC-04);
- fails if `document.cookie` is not empty at the end (AC-PRIV-01);
- installs a fixed browser clock (`page.clock.install({ time: golden.json.buildDate })`) before every navigation, so live deadline labels and anything else date-dependent match the pinned build. Tests that need other dates (AC-FUNC-29) set the clock themselves.

Tests import `test` and `expect` from `./fixtures`, never from `@playwright/test` directly (ESLint `no-restricted-imports`).

### 5.2 Fixtures

- `golden.json`: `buildDate`, `totals`, `topics`, `sectors`, `stateCounts`, `filters` (URL query → expected count), `finder` (answers → `count`, `top5`), `similar` (5 scheme ids → the 4 similar ids, in order). Generated from the prototype on 18 Sep 2026 and **frozen**. If data changes, the owner regenerates it with a proposal.
- `url-map.json`: `schemes` (id → URL) and `regions` (code → URL).
- `slug-cases.json`: synthetic slug inputs and expected slugs (trimming, collisions, special characters).
- `legacy-routes.json`: legacy hashes → expected pathnames, plus hashes that must not navigate.
- `search.json`: `{ queries: [{ q, mustInclude: [ids] }], noMatch: [q] }`. Results may contain other ids.
- `invalid/*.json`: one invalid scheme record per file; `tests/fixtures/invalid/README.md` says which check rejects it (the schema or `validateDataset()`) and which field the error must name.

## 6. JavaScript budgets (AC-PERF-02)

Measured by `verify-dist` from `dist`, per page:
1. Collect the entry scripts: every `<script type="module" src>` and, for each `astro-island` without `client:visible`/`client:only`, its `component-url` and `renderer-url`.
2. Follow **static** `import` statements (including `import "./x.js"` side-effect imports) through `dist/_astro/*.js` to build the set of files loaded on first paint. Dynamic `import()` targets are excluded (they load on demand: Pagefind, the client data fetch).
3. Sum `gzip -9` sizes (Node `zlib.gzipSync(buf, { level: 9 })`) of the set.

| Page group | Budget (gzip) |
|---|---|
| Every page not listed below (home, scheme, states index, region, topic, sector, start-here, what's new, glossary, about, 404) | ≤ 25 KB |
| `/schemes/` | ≤ 60 KB |
| `/eligibility-finder/`, `/shortlist/`, `/compare/` | ≤ 60 KB |

`/data/schemes.json` is not JavaScript and is not counted; its gzip size is printed in the build log for the record.

## 7. Evidence and reporting

- Every claim in a phase report is backed by one of: the command and its **exit code** plus the relevant output lines (quoted, not paraphrased); a test title that ran and passed in the quoted output; a screenshot path under `docs/evidence/phase-NN/`; or a manual-check note using the steps in the AC.
- Output longer than 40 lines is saved to `docs/evidence/phase-NN/<name>.txt` and the report quotes the summary lines and the path.
- "Should pass", "will work", "looks correct" and "done" without evidence are not evidence. A criterion without evidence is reported as **UNVERIFIED** (AGENTS §3).
- Screenshots are named `{template}-{width}-{theme}.png`.

## 8. Continuous integration (only if D3 = Yes)

Actions are pinned to commit SHAs (resolved 18 Sep 2026). Updating a pin is a normal change with the new tag in the comment.

`.github/workflows/ci.yml`:

```yaml
name: ci
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 40
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium webkit
      - run: npm run verify
      - run: npm run audit
      - run: npm run links
      - run: npm run lhci
      - if: failure()
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: reports
          path: |
            playwright-report
            .lighthouseci
          retention-days: 14
```

`.github/workflows/daily-rebuild.yml` (rebuilds at 06:00 IST so passed deadlines close, AC-DATA-06):

```yaml
name: daily-rebuild
on:
  schedule:
    - cron: "30 0 * * *"
  workflow_dispatch:
permissions: {}
jobs:
  rebuild:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Trigger the Vercel deploy hook
        env:
          HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
        run: |
          test -n "$HOOK" || { echo "VERCEL_DEPLOY_HOOK_URL is not set"; exit 1; }
          curl -fsS -X POST "$HOOK" > /dev/null
```

GitHub pauses scheduled workflows after 60 days without repository activity; the owner re-enables it from the Actions tab if that happens.

If D3 = No, the workflows are not created, AC-OPS-08 is N/A, and the owner runs `npm run verify`, `npm run links` and `npm run lhci` locally before every push, pasting the summary into the commit or report.

## 9. Test matrix (summary)

| Area | Unit | Build check | E2E (projects) | Lighthouse | Manual / production |
|---|---|---|---|---|---|
| Data | DATA-01, 02, 05, 06 | DATA-01, 03, 04 | | | |
| Routes | ROUTE-02 | ROUTE-01, 04, 05 | ROUTE-03, 06 (390, 1440) | | ROUTE-03, 06 [P] |
| SEO | seo.test | SEO-01..11, 13, 14 | SEO-12 (no-js) | SEO = 1.00 | PROD-02, 03 |
| Content | | CONTENT-11, 12 | CONTENT-01..10 (390, 1440) | | CONTENT-11 [P] |
| Features | FUNC-01, 02, 04, 14, 18, 20 | FUNC-26 | FUNC-01..30 (390, 1440; some webkit) | | |
| Mobile | | | MOB-01..04 (mobile-320, 390, tablet-768, sweeps) | | MOB-05, PROD-04 |
| Accessibility | A11Y-05 | | A11Y-01..06 (390, 1440, dark) | a11y ≥ 0.95 | A11Y-07 |
| Performance | | PERF-02..04 | PERF-05 | PERF-01 | |
| Security | SEC-06 | SEC-02, 05 | SEC-01, 03, 04 (all) | best practices ≥ 0.95 | SEC-01 [P], SEC-07 |
| Privacy | | | PRIV-01, 02 | | PRIV-01 [P] |
| Operations | OPS-01, 02, 05..07 | OPS-03 | | | OPS-04, 08, PROD-05 |
| Design | DES-01 | | DES-03 | | DES-02 |
