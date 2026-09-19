# Phase 00 — Repository reconnaissance: builder report

| | |
|---|---|
| Branch / commit | `phase/00-recon` (report and evidence); spikes on `spike/phase-00` @ `5d8d829` (throwaway, never merged) |
| Builder | Claude (Cowork), acting as the builder under AGENTS.md |
| Date | 2026-09-19 |
| Environment | `node -v` = v22.23.2 (see §5), `npm -v` = 10.9.7, OS = Ubuntu 24.04.4 LTS, x86_64; browser for spikes = Chromium 141.0.7390.37 (preinstalled, launched through `executablePath`) |
| `.phase` | 00 |

## 1. Summary
Eight of the ten assumptions were verified locally, and two proposals come out of them (the theme boot script is not hashed by Astro; one locked package needs Node ≥ 22.22.3). A5, A9 and the Vercel half of A8 need a Vercel preview build, and the WebKit half of A7 needs a machine with WebKit; both are BLOCKED on one owner action (pushing the repository to GitHub). Phase 0 cannot exit until those are resolved and the proposals are decided.

## 2. Assumptions (ARCHITECTURE §11)

Phase 0 owns no acceptance criteria; its exit condition is A1–A10 each VERIFIED, or FAILED with an approved proposal (PHASES Phase 0).

| # | Assumption | Status | Evidence (all paths under `docs/evidence/phase-00/`) |
|---|---|---|---|
| A1 | `security.csp` works for static output with Preact islands; hashes island hydration inline scripts; `scriptDirective.resources` accepts `'self'` and `'wasm-unsafe-eval'` | **VERIFIED**, with a finding → proposal 0001 | `spike/29-A1-inline-hash-analysis.txt`: "script at offset 1603 (316 bytes): hash listed", "script at offset 1936 (4380 bytes): hash listed" (hydration scripts). Meta tag contains `script-src 'self' 'wasm-unsafe-eval' 'sha256-…'` (`spike/17-A1-manual-hash-variant.txt`). Browser: `"cspViolations": []`, island clicked `"islandCountAfterClick": "Saved: 1"` (`spike/23-browser-spike-final.txt`). **Finding:** the `is:inline` theme boot script is not hashed: "script at offset 221 (203 bytes): NOT LISTED", and it only runs because it precedes the meta tag at offset 441. SECURITY §2.1 says the opposite. Proposal 0001. |
| A2 | `astro-pagefind` 2.0.1 runs on Astro 7.3.3 + Pagefind 1.5.2 with `trailingSlash: "always"` | **VERIFIED** (Chromium) | `spike/14-build.txt`: "[pagefind] Pagefind indexed 3 pages", "exit=0". Browser search under the CSP: `"search:kerala": ["/"]`, `"search:prototype": ["/second/"]`, `"cspViolations": []` (`spike/23-browser-spike-final.txt`). Pagefind runs its WASM in a Web Worker; `'wasm-unsafe-eval'` is needed for its main-thread fallback: without it, `"error: … Refused to compile or instantiate WebAssembly module"`, with it `"results: /second/"` (`spike/26-pagefind-main-thread.txt`). |
| A3 | `astro-og-canvas` 0.13.2 renders on Node 22 with the reference font files | **VERIFIED** (local build; Vercel build is part of the BLOCKED preview) | `spike/19-A3-og-png.txt`: "signature ok: True", "width x height: (1200, 630)". Build log: "[astro-og-canvas] Loaded 2 font families: Newsreader Medium, IBM Plex Sans" (`spike/14-build.txt`). Image with ₹ rendered: `spike/19-A3-og-cgss.png`. |
| A4 | Sitemap `filter` and `serialize` behave as ARCHITECTURE §8.3 | **VERIFIED** | `spike/20-A4-sitemap.txt`: `sitemap-0.xml` lists `/` and `/second/` only (`/shortlist/` filtered out); each `<lastmod>2026-09-18T00:00:00.000Z</lastmod>`. Note in §7 item 4 on the timestamp format. |
| A5 | Vercel `trailingSlash` + `cleanUrls` + directory output give 308 for no-slash paths and 200 for assets | **BLOCKED** | Needs a Vercel preview build (BLOCKED P0-A). |
| A6 | The locked set installs with `npm ci`, no `--legacy-peer-deps` | **VERIFIED** (Node 22.23.2) | `spike/13-npm-ci.txt`: "added 864 packages in 13s", "exit=0". Peer ranges of the locked set: every in-set peer satisfied (`02-peer-check.txt`, "ok" lines); one engine range not met on Node 22.22.2 → proposal 0002. |
| A7 | `@nanostores/persistent` `listen: true` syncs across tabs in Chromium and WebKit | **Chromium VERIFIED; WebKit BLOCKED** | Chromium: `"crossTabMs": 18`, `"before": "Saved: 1", "after": "Saved: 2"` (`spike/23-browser-spike-final.txt`). WebKit is not installed in the builder's sandbox and the sandbox forbids `playwright install`; a GitHub Actions job on the spike branch checks it (BLOCKED P0-B). |
| A8 | `npm ci --ignore-scripts` then `npm run build` works locally and on Vercel | **Local VERIFIED; Vercel BLOCKED** | `spike/22-A8-ignore-scripts.txt`: "npm ci exit=0", "[pagefind] Pagefind indexed 3 pages", "build exit=0". The only install script in the tree is `esbuild@0.28.2 postinstall: node install.js` (`spike/11-install-scripts.txt`), and the build does not need it. Vercel half: BLOCKED P0-A (the spike's `vercel.json` uses `npm ci --ignore-scripts`). |
| A9 | Vercel serves `404.html` with status 404 and the `vercel.json` headers | **BLOCKED** | Needs a Vercel preview build (BLOCKED P0-A). The spike has `src/pages/404.astro` and `vercel.json` equal to SECURITY §2 except `installCommand` (see `spike/SPIKE-README.md`). |
| A10 | `import { z } from "astro/zod"` works in an Astro page, Vitest and `tsx` | **VERIFIED** | `spike/21-A10-astro-zod.txt`: Vitest "Test Files 1 passed (1)", "exit=0"; tsx "A10 tsx: true false", "exit=0"; the Astro page rendered `data-pagefind-meta="id:cgss"` from the parsed schema value. |

## 3. Commands run (in order)

| # | Command | Exit code | Output |
|---|---|---|---|
| 1 | Environment: `node -v`, `npm -v`, `git --version`, `uname`, `/etc/os-release` | 0 | `00-environment.txt` |
| 2 | `npm view <pkg>@<ver> version engines peerDependencies --json` × 30 | 0 × 30 | `01-npm-view.txt` ("exit=0" 30 times) |
| 3 | Peer/engine range check (`scripts/peers.cjs`) | 0 | `02-peer-check.txt`: "issues: 1" (the engine range, proposal 0002) |
| 4 | Data sanity (`scripts/totals.mjs`) | 0 | `03-data-sanity.txt`: schemes 115, central 66, state 49, student 49, regions 36, regionsWithSchemes 35 — all "MATCH" |
| 5 | Spike `npm install` (to create the lockfile) | 0 | `spike/10-npm-install.txt`: "added 855 packages" (see §7 item 5) |
| 6 | Spike `npm run build` (first) | 1 | `spike/12-build.txt`: "Failed to install either of [pagefind_extended, pagefind]" — the optional Pagefind binary was missing after `npm install` |
| 7 | Spike `rm -rf node_modules && npm ci` | 0 | `spike/13-npm-ci.txt`: "added 864 packages", `@pagefind/linux-x64` present |
| 8 | Spike `npm run build` | 0 | `spike/14-build.txt` |
| 9 | Spike browser checks (`browser-spike.mjs`, several runs) | 0 | `spike/15`, `16`, `18`, `23-*.txt` |
| 10 | Manual hash variant build | 0 | `spike/17-A1-manual-hash-variant.txt` |
| 11 | OG PNG check | 0 | `spike/19-A3-og-png.txt` |
| 12 | Sitemap output | 0 | `spike/20-A4-sitemap.txt` |
| 13 | Vitest + tsx + page (A10) | 0 / 0 | `spike/21-A10-astro-zod.txt` |
| 14 | `npm ci --ignore-scripts && npm run build` | 0 / 0 | `spike/22-A8-ignore-scripts.txt` |
| 15 | Console-404 source check | 0 | `spike/24-console-404-source.txt`: the only console error was the missing `/favicon.ico`; after adding it: "consoleErrors after adding /favicon.ico: [] cspViolations: []" |
| 16 | Negative controls without `'wasm-unsafe-eval'` | 0 | `spike/25-…txt` (worker path still works), `spike/26-pagefind-main-thread.txt` (main-thread fallback fails without it) |
| 17 | `npm audit --omit=dev --audit-level=high` (informational) | 0 | `spike/27-npm-audit-informational.txt`: "found 0 vulnerabilities" |
| 18 | Proposal 0003 variant build | 0 | `spike/28-proposal-0003-variant.txt`: no `WARN` line |
| 19 | Inline-script hash analysis, with and without the manual hash | 0 / 0 | `spike/29-A1-inline-hash-analysis.txt` |
| 20 | Peers outside the locked set (lockfile inspection) | 0 | `spike/30-non-set-peers.txt` |

## 4. Files
- Added on `phase/00-recon`: `.phase`, `docs/evidence/phase-00/**` (including copies of the spike sources and scripts), `docs/proposals/0001…0003`, this report.
- Added on `spike/phase-00` (never merged): the spike project at the branch root, `docs-evidence/`, `.github/workflows/spike-webkit.yml`.
- On `main` before the phase: `spec: v1.0` and `spec: owner decisions D1–D4` (recorded from the owner's chat answers on 19 Sep 2026).
- Changed / deleted: none.

## 5. Deviations from the spec
- The builder's Node is 22.23.2, installed from the npm package `node-linux-x64` because nodejs.org is blocked by the sandbox proxy; the system Node (22.22.2) does not satisfy `eslint-plugin-astro`'s engine range. This is within "22.x". Proposal 0002 makes the minimum explicit.
- Browser checks used the preinstalled Chromium 141 through `executablePath`, not the Chromium build bundled with Playwright 1.63 (the sandbox forbids `playwright install`). CI will use Playwright's own browsers.

## 6. Stop notes

```
BLOCKED P0-A: A5, A9 and the Vercel half of A8 (and A3 on Vercel)
Why: they can only be observed on a Vercel build (ARCHITECTURE §11). The builder may not deploy (AGENTS F-19) and has no access to the owner's GitHub or Vercel.
Options: A) the owner pushes this repository to a new GitHub repo and imports it into a NEW Vercel project; the spike branch builds as a preview; the builder checks it with curl / B) accept these assumptions unverified until Phase 14 (risk: a URL or header problem found at launch) / C) skip Vercel-specific checks and trust the documentation
Recommendation: A — it takes about 10 minutes and also unblocks P0-B.
Needs: owner action (steps below)
```

```
BLOCKED P0-B: A7 in WebKit
Why: WebKit is not installed in the builder's sandbox and installing browsers there is not allowed. Chromium passed (18 ms).
Options: A) push the spike branch (same action as P0-A); the workflow .github/workflows/spike-webkit.yml installs WebKit on GitHub Actions and fails unless both browsers sync within 1 s with no CSP violations / B) run `npm ci && npx playwright install webkit chromium && npm run build && npx astro preview & node webkit-check.mjs` on the owner's computer / C) accept Chromium-only evidence
Recommendation: A.
Needs: owner action
```

Owner steps for both (one push):
1. Unzip the repository and open a terminal in it.
2. Create a new, empty GitHub repository (for example `founders-field-guide-v2`).
3. `git remote add origin <its URL>` then `git push -u origin main phase/00-recon spike/phase-00`.
4. In Vercel: **Add New → Project**, import the new repository as a **new project** (not the live `founders-field-guide` project). Its first production build of `main` will fail because `main` has no app yet; that is expected and harmless.
5. Open the new project's **Deployments** tab, open the deployment for branch `spike/phase-00`, and use **Share** to copy a shareable link (preview deployments are usually behind Vercel login). Send the builder that link.
6. In GitHub, open **Actions → spike-webkit** for the push and send a screenshot of the result (or the last lines of the "Run" step).

The builder will then run the A5/A9 curl checks against the preview link and record everything in this report.

## 7. Ambiguities and contradictions found (PHASES Phase 0 task 6)
1. **SECURITY §2.1 vs Astro behaviour** — the theme boot script is not hashed automatically (A1). Proposal 0001.
2. **Node minimum** — the pack says ≥ 22.12 / "22.x"; `eslint-plugin-astro@3.2.1` needs ≥ 22.22.3. Proposal 0002.
3. **Build warning** — Astro prints a Shiki/CSP warning on every build; harmless but noisy. Proposal 0003.
4. **Sitemap `lastmod` format** — the sitemap emits `2026-09-18T00:00:00.000Z` where AC-SEO-06.2 says "`lastmod` = `lastVerified`" (`2026-09-18`). Reading it as "the same calendar date" is the only workable interpretation; the Phase 8 check will compare dates, and the owner may want to state that in ACCEPTANCE.
5. **Lockfile generation** — a fresh `npm install` produced a lockfile but did not install the optional `@pagefind/linux-x64` binary (855 packages; the first build failed), while `npm ci` from the same lockfile installed it (864 packages). The lockfile itself is correct. PHASES Phase 1 already says "generate with `npm install` once, then use `npm ci`"; Phase 1 must actually delete `node_modules` and run `npm ci` before building.
6. **Where the CSP meta tag sits** — Astro emits it after the first inline head script (offset 441 vs 221). Anything before it is not governed by the meta policy; the AC-SEC-02 check must therefore check every inline script regardless of position (covered by proposal 0001).
7. **Favicons and the e2e console guard** — a missing `/favicon.ico` produces a console error, which TESTING §5.1's guard turns into a test failure. Phase 3 adds the icons from `reference/icons/` before any e2e test runs; no change needed, noted for Phase 1/3 ordering.
8. **D1** — the owner chose "Editorial, refined". The refinements are not yet specified; DESIGN §1 requires an approved amendment before Phase 4. Not blocking Phases 1–3.

## 8. UNVERIFIED items
| Claim | Why unverified | What would verify it |
|---|---|---|
| A5, A9, Vercel half of A8, A3 on Vercel | No Vercel build | BLOCKED P0-A steps |
| A7 in WebKit | No WebKit in sandbox | BLOCKED P0-B (Actions job) |
| Behaviour with Playwright 1.63's bundled Chromium (spikes used Chromium 141) | Sandbox rule | First CI run (D3 = Yes) |

## 9. For the reviewer
- Start with `spike/29-A1-inline-hash-analysis.txt` and proposal 0001: the claim that the boot script "runs anyway" depends on element order.
- `spike/26-pagefind-main-thread.txt` is the evidence that `'wasm-unsafe-eval'` is still needed.
- `02-peer-check.txt` lists peers as "n/a" when the peer is not in the locked set. `spike/30-non-set-peers.txt` shows these are either optional peers that are not installed (`@astrojs/markdown-remark`, `eslint-plugin-jsx-a11y`) or ordinary transitive dependencies (`vite` 8.3.0, `preact-render-to-string` 6.7.0, `playwright-core` 1.63.0, `jiti`, `@typescript-eslint/parser`). Please re-check.
- The spike's `vercel.json` deliberately differs from SECURITY §2 in `installCommand` (to test A8 on Vercel).

## 10. Audit responses
(Filled after the audit.)

## 11. Owner sign-off
(Owner.)
