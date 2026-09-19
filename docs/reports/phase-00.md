# Phase 00 — Repository reconnaissance: builder report

| | |
|---|---|
| Branch / commit | `phase/00-recon` (report, evidence, proposals). Spikes on the throwaway branch `spike/phase-00` (never merged): evidence run at `d890776`, proposal-0004 images at `b86c7c3` |
| Builder | Claude (Cowork), acting as the builder under AGENTS.md |
| Date | 2026-09-19 (revision 2, after audit 1) |
| Environment | `node -v` v22.23.2 (§5), `npm -v` 10.9.7, Ubuntu 24.04.4 LTS x86_64; browser Chromium 141.0.7390.37 through `executablePath` (§5) |
| `.phase` | 00 |

## 1. Summary
Of the ten assumptions, four are verified outright (A2 in Chromium, A4, A6, A10), three are verified locally but still need a Vercel or WebKit run (A3, A8, A7), two need a Vercel preview (A5, A9), and one fails as specified (A1: Astro does not hash the theme boot script; proposal 0001). Four proposals and one confirmation are waiting for the owner, and one owner action (pushing the repository to GitHub and a new Vercel project) unblocks every remaining check. Phase 0 cannot exit yet.

All evidence quoted below is in `docs/evidence/phase-00/spike-v2/`, produced by one run of `phase0-evidence.sh` on the committed spike; every file lists the exact commands and their exit codes. The first evidence set is kept in `v1-superseded/` and is not quoted (see `docs/evidence/phase-00/README.md`).

## 2. Assumptions (ARCHITECTURE §11)

Phase 0 owns no acceptance criteria; it exits when A1–A10 are each VERIFIED, or FAILED with an approved proposal.

| # | Assumption | Status | Evidence (`spike-v2/…`) |
|---|---|---|---|
| A1 | Astro 7.3.3 `security.csp` works for static output with Preact islands; it hashes the island hydration scripts; `scriptDirective.resources` accepts `'self'` and `'wasm-unsafe-eval'` | **FAILED as specified** → proposal 0001, BLOCKED OWNER-3 | With the config exactly as SECURITY §2.1: the meta tag is present (`05-csp-security21.txt`: "default-src 'self';…; script-src 'self' 'wasm-unsafe-eval' 'sha256-…"), the hydration scripts are listed, but the theme boot script is not: "dist/index.html: meta=yes at 441, inline blocks=4, not listed=['script@221(203B)']", "TOTAL inline blocks not listed: 5". It ran anyway (`06-browser-security21.txt`: `"htmlHasJsClass": true`, `"cspViolations": []`) only because it comes before the meta tag. With proposal 0001's hash: "TOTAL inline blocks not listed: 0" (`08-csp-committed.txt`), `"cspViolations": []` (`09-browser-committed.txt`). The parts about islands and `resources` hold. |
| A2 | `astro-pagefind` 2.0.1 runs on Astro 7.3.3 and Pagefind 1.5.2 with `trailingSlash: "always"` | **VERIFIED** (Chromium) | "[pagefind] Pagefind indexed 5 pages", exit=0 (`07-build-committed.txt`). Search in the browser under the CSP: `"search:kerala": ["/"]`, `"search:prototype": ["/second/"]`, `"cspViolations": []` (`09`). `'wasm-unsafe-eval'` is needed for Pagefind's main-thread fallback: with it `"out": "results: /second/"` (`10`); without it `"error: … Refused to compile or instantiate WebAssembly module"` and `"csp": ["script-src wasm-eval"]` (`17`). |
| A3 | `astro-og-canvas` 0.13.2 renders on Node 22 **at build on Vercel** with the reference fonts | **Local VERIFIED; Vercel BLOCKED** (OWNER-1) | "PNG signature: True", "width x height: (1200, 630)" (`13-og-png.txt`); "Loaded 3 font families: Newsreader Medium, IBM Plex Sans, IBM Plex Mono Medium" (`07`). Family names must match exactly or the text silently falls back (`19-og-families.txt`, `19-og-exact-mono.png` vs `19-og-wrong-mono.png`); DESIGN §5 needs more than the package offers → proposal 0004. |
| A4 | Sitemap `filter` and `serialize` behave as ARCHITECTURE §8.3 | **VERIFIED** | `12-sitemap.txt`: `sitemap-0.xml` has `/`, `/noworker/`, `/second/`; `/shortlist/` is filtered out; every entry `<lastmod>2026-09-18T00:00:00.000Z</lastmod>` (format note in §7 item 4). |
| A5 | Vercel `trailingSlash` + `cleanUrls` + directory output: 308 for no-slash paths, 200 for assets | **BLOCKED** (OWNER-1) | Needs a Vercel build. |
| A6 | The locked set installs with `npm ci`, no `--legacy-peer-deps` | **VERIFIED** (Node 22.23.2) | "added 864 packages in 14s", exit=0, `@pagefind/linux-x64` present (`01-npm-ci.txt`); "packages: 30, mismatches: 0" (`02-versions.txt`); in-set peers all "ok", engine issue only on 22.22.2 (`03c-peer-check.txt`) → proposal 0002. |
| A7 | `listen: true` syncs across tabs in Chromium **and WebKit** | **Chromium VERIFIED; WebKit BLOCKED** (OWNER-2) | `"crossTabMs": 19` (`09`); the stricter check that waits for hydration: `"page1Changed":true,"crossTabSynced":true,"ms":6` (`11`). It can fail: with `listen: false` it reports `"crossTabSynced":false`, exit=1 (`18-mutation-listen-false.txt`). WebKit is not available in the sandbox. |
| A8 | `npm ci --ignore-scripts` then `npm run build`, locally **and on Vercel** | **Local VERIFIED; Vercel BLOCKED** (OWNER-1) | `20-ignore-scripts.txt`: install exit=0, "Pagefind indexed 5 pages", build exit=0. |
| A9 | Vercel serves `404.html` with status 404 and the `vercel.json` headers | **BLOCKED** (OWNER-1) | Needs a Vercel build. The spike builds `dist/404.html`; its `vercel.json` differs from SECURITY §2 only in `installCommand` (confirmed by the reviewer's deep compare). |
| A10 | `import { z } from "astro/zod"` works in an Astro page, Vitest and `tsx` | **VERIFIED** | `14-a10.txt`: "✓ tests/zod.test.ts > A10 astro/zod works in Vitest", exit=0; "A10 tsx: true false", exit=0; `grep -o 'data-pagefind-meta="id:cgss"' dist/index.html` → `data-pagefind-meta="id:cgss"`, exit=0. |

## 3. Commands run
Every command, its output and its exit code are in the `spike-v2/` file named. Summary:

| # | What | Exit code(s) | File |
|---|---|---|---|
| 1 | Start of session (`cat .phase`, git, `node -v`, `npm -v`, OS, browsers) | 0 (`cat .phase` 1, before the file existed) | `../00-environment.txt` |
| 2 | Spike commit and clean tree | 0 | `00-git.txt` (HEAD `d890776…`, only `docs-evidence-v2/` untracked) |
| 3 | `npm ci` from the committed lockfile | 0, 0 | `01-npm-ci.txt` |
| 4 | Installed versions vs ARCHITECTURE §2 | 0 | `02-versions.txt` |
| 5 | Engine ranges of every lockfile entry at six Node versions | 0 | `03-engines.txt` |
| 6 | `npm view` × 30 | 0 (30 × `npm-view-exit=0`) | `03b-npm-view.txt` |
| 7 | Peer and engine check at Node 22.22.2 and 22.22.3 | 1 (issues: 1), 0 (issues: 0) | `03c-peer-check.txt` |
| 8 | Reference data vs `golden.json` totals | 0 (all MATCH) | `03d-data-sanity.txt` |
| 9 | Build and CSP analysis with the SECURITY §2.1 config; browser check | 0, 0, 0 | `04`, `05`, `06` |
| 10 | Build and CSP analysis with the committed config; browser checks | 0 each | `07`–`11` |
| 11 | Sitemap, OG PNG, A10 | 0 each | `12`, `13`, `14` |
| 12 | Favicon probe (missing file → console 404; restored → none) | 0, 0 | `15-favicon-probe.txt` |
| 13 | No-`'wasm-unsafe-eval'` build and checks | 0, 0, 0 | `16`, `17` |
| 14 | Mutation probe `listen: false` (must fail), then restore | 0, **1 (expected)**, 0, 0 | `18-mutation-listen-false.txt` |
| 15 | OG font-family probe | 0, 0 | `19-og-families.txt` |
| 16 | `npm ci --ignore-scripts` and build | 0, 0 | `20-ignore-scripts.txt` |
| 17 | `npm audit --omit=dev --audit-level=high` | 0 ("found 0 vulnerabilities") | `21-npm-audit.txt` |
| 18 | Fresh `npm install` in a scratch folder | 0 | `22-fresh-install.txt`: "added 856 packages", `linux-x64` present, "lockfile identical to committed" |
| 19 | Proposal 0004 layout build (separate run, spike `b86c7c3`) | 0 | `23-og-proposal-0004.txt` |
| 20 | Clean tree after the run | 0 | `99-git-after.txt` |

## 4. Files
- `main` (before the phase): `spec: v1.0` and `spec: owner decisions D1–D4` — see BLOCKED OWNER-4 and finding A00-1-001.
- `phase/00-recon`: `.phase`; `docs/evidence/phase-00/` (`00-environment.txt`, `README.md`, `spike-v2/`, `v1-superseded/`); `docs/proposals/0001`–`0004` and `docs/proposals/assets/0004-og-wordmark.png`; this report; `docs/audits/phase-00-audit-1.md` (the reviewer's file, committed unchanged).
- `spike/phase-00` (never merged): the spike project, `phase0-evidence.sh` and its helper scripts, `docs-evidence-v2/`, `.github/workflows/spike-webkit.yml`.
- Removed from `phase/00-recon` in revision 2: code copies under `docs/evidence/phase-00/spike/` (A00-1-013).

## 5. Deviations from the spec
- Node 22.23.2 comes from the npm package `node-linux-x64` because nodejs.org is blocked by the sandbox proxy; the system Node 22.22.2 does not meet the locked tree's engine ranges (proposal 0002). Within "22.x".
- Browser checks use the preinstalled Chromium 141, not Playwright 1.63's own Chromium build; the sandbox does not allow `playwright install`. CI will use Playwright's browsers.
- The reviewer ran as a sub-agent of the same session (it did not see the builder's conversation). AUDIT §1 asks for a new session; the owner may want an independent re-audit (for example Gemini CLI) before merging.

## 6. Stop notes

```
BLOCKED OWNER-1: A5, A9, and the Vercel halves of A3 and A8
Why: they can only be observed on a Vercel build (ARCHITECTURE §11). The builder may not deploy (AGENTS F-19) and has no GitHub or Vercel access.
Options: A) the owner pushes the repository to a new GitHub repo imported into a NEW Vercel project; the spike branch builds as a preview; the builder checks it with curl / B) leave them unverified until Phase 14 (a URL or header problem would surface at launch) / C) trust the documentation
Recommendation: A (steps below; it also unblocks OWNER-2).
Needs: owner action
```

```
BLOCKED OWNER-2: A7 in WebKit
Why: WebKit is not installed in the builder's sandbox, and installing browsers there is not allowed. Chromium passes and the check is shown to fail when sync is broken.
Options: A) the same push as OWNER-1 runs .github/workflows/spike-webkit.yml on GitHub Actions, which installs WebKit and fails unless both browsers sync within 1 s with no CSP violations / B) run it on the owner's computer (commands below) / C) accept Chromium-only evidence
Recommendation: A.
Needs: owner action
```

```
BLOCKED OWNER-3: proposals 0001–0004
Why: A1 fails as specified (0001); the Node minimum in the pack is too low for the locked tree (0002); every build prints a CSP warning (0003); DESIGN §5 cannot be drawn by the locked OG package (0004). Only the owner changes the locked documents (AGENTS §6).
Options: approve, reject or amend each proposal.
Recommendation: approve all four; each lists the exact text to change.
Needs: proposal approval
```

```
BLOCKED OWNER-4: confirm the D1–D4 entries in SPEC §3 and the two builder commits on main (audit finding A00-1-001, P0)
Why: at the owner's request ("You, here, phase by phase") the builder created the repository and committed the spec pack (c7f90ce) and the owner's chat answers into SPEC §3 (e387d89). SPEC is locked and main is owner-only, so the builder could not do this on its own authority. The owner's answers were: visual direction "Editoral looks need more refinement and rest all apporved" (so D2 Allow, D3 Yes, D4 On). The builder also wrote how D1 is handled: the refinements are specified by the owner and applied as a DESIGN amendment before Phase 4.
Options: A) the owner confirms both commits and the D1 wording as theirs / B) the owner edits SPEC §3 themselves and the builder's commit is replaced before the first push / C) the owner rejects the commits
Recommendation: A, and send the D1 refinements when ready (needed before Phase 4, not before Phase 1).
Needs: owner decision (in writing)
```

**Owner steps for OWNER-1 and OWNER-2 (about 15 minutes).** Order matters: Vercel only builds branches pushed after the project is connected.
1. Unzip the repository and open a terminal inside it. Check `node -v` is 22.22.3 or later if you plan to run anything locally.
2. On GitHub, create a new empty repository (no README), for example `founders-field-guide-v2`.
3. `git remote add origin <the new repo URL>` and `git push -u origin main`.
4. In Vercel, **Add New → Project**, import the new repository as a **new project** (not the live `founders-field-guide`). Its first build of `main` fails because `main` has no app yet; that is expected.
5. In the new project, **Settings → Deployment Protection**: turn **Vercel Authentication off** for now, so the builder can check the preview with plain `curl`. (Turned back on in Phase 14, SECURITY §6.)
6. `git push origin phase/00-recon spike/phase-00`. This creates a preview deployment of `spike/phase-00` and starts the `spike-webkit` job in GitHub Actions.
7. Send the builder: the preview URL of the `spike/phase-00` deployment (Deployments tab), and a screenshot of **Actions → spike-webkit → the run** showing the two result lines (`"browser":"webkit"…` and `"browser":"chromium"…`).

Option B for OWNER-2, on the owner's computer, run one after another in the spike branch: `npm ci`, then `npx playwright install webkit chromium`, then `npm run build`, then in a second terminal `npx astro preview --port 4321`, then back in the first `node webkit-check.mjs`.

## 7. Ambiguities and contradictions found (PHASES Phase 0 task 6)
1. **SECURITY §2.1 vs Astro** — `is:inline` scripts are not hashed (A1). Proposal 0001.
2. **Node minimum** — the pack's "≥ 22.12" / "22.x" is below what the locked tree needs (22.22.3; `03-engines.txt`). Proposal 0002.
3. **Build warning** — Astro prints a Shiki/CSP warning on every build (`04`, first line). Proposal 0003.
4. **Sitemap `lastmod` format** — the sitemap writes `2026-09-18T00:00:00.000Z` where AC-SEO-06.2 says "`lastmod` = `lastVerified`" (`2026-09-18`). The only workable reading is "same calendar date"; the owner may want ACCEPTANCE to say so. The Phase 8 check will compare dates unless told otherwise.
5. **Lockfile generation** — in the first evidence set, a fresh `npm install` reported "added 855 packages" and the optional `@pagefind/linux-x64` binary was missing, so the first build failed. It did **not** reproduce: the reviewer got 856 packages with the binary, and `22-fresh-install.txt` shows "added 856 packages", `linux-x64` present, "lockfile identical to committed". Most likely a one-off failed download of the 52 MB optional package, which npm skips without an error. The build fails loudly when the binary is missing ("Failed to install either of [pagefind_extended, pagefind]"), so it cannot ship silently. No change proposed.
6. **Position of the CSP meta tag** — Astro renders it at its head-render position, after the author's own head content (reviewer: `runtime/server/render/head.js`), so any inline script written in `Head.astro` comes before it and is not governed by the meta policy. The AC-SEC-02 check must test every inline script wherever it sits (proposal 0001).
7. **Favicon and the e2e console guard** — a missing `/favicon.ico` produces a console error (`15-favicon-probe.txt`), which TESTING §5.1 turns into a failing test. Phase 3 adds the icons from `reference/icons/` before e2e tests run. No change needed.
8. **Social images** — DESIGN §5's four-run layout cannot be drawn by `astro-og-canvas` 0.13.2, and wrong family names fall back silently (`19-og-families.txt`). Proposal 0004.
9. **D1 "Editorial, refined"** — DESIGN §1 has rows for "Editorial" and for other directions, not for a refined Editorial. The builder recorded it as needing an amendment before Phase 4 (OWNER-4).

## 8. Data questions
None. Phase 0 compared counts only (`03d-data-sanity.txt`, all MATCH); facts are migrated and checked in Phase 2.

## 9. UNVERIFIED items
| Claim | Why unverified | What would verify it |
|---|---|---|
| A5, A9, Vercel halves of A3 and A8 | No Vercel build | OWNER-1 |
| A7 in WebKit | No WebKit in the sandbox | OWNER-2 |
| Behaviour with Playwright 1.63's own Chromium build | Sandbox rule | First CI run (D3 = Yes) |
| The WebKit job itself (`spike-webkit.yml`) | Cannot run GitHub Actions from the sandbox; the script was run in Chromium only (`11`, `18`) | OWNER-2 |

## 10. For the reviewer
- Start with `spike-v2/05` vs `08` (the boot-script hash) and proposal 0001.
- `spike-v2/18` is the mutation probe that shows the cross-tab checks can fail.
- `spike-v2/19` and the three `23-og-proposal-*.png` images support proposal 0004.
- `docs/evidence/phase-00/README.md` explains what was superseded and why.

## 11. Audit responses (audit 1, `docs/audits/phase-00-audit-1.md`)

| Finding | Sev. | Response |
|---|---|---|
| A00-1-001 SPEC edited and committed to `main` by the builder | P0 | **Needs the owner (BLOCKED OWNER-4).** The builder cannot dispute or defer a P0. Facts are set out in OWNER-4, with the owner's answer quoted. Nothing further was committed to `main`. |
| A00-1-002 CSP meta quoted from a file that does not contain it | P0 | **FIXED.** `spike-v2/05` and `08` print the full meta content of `dist/index.html`; §2 quotes only those. The v1 file is kept in `v1-superseded/` and marked there. |
| A00-1-003 Evidence command did not produce the quoted line | P0 | **FIXED.** `spike-v2/14-a10.txt` records the exact `grep -o` command, its output and exit code. v1 file marked superseded. |
| A00-1-004 A1 should be FAILED | P1 | **FIXED.** A1 is FAILED as specified, with proposal 0001 and stop note OWNER-3. |
| A00-1-005 A3 status inconsistent; Vercel half untested | P1 | **FIXED.** A3 is "Local VERIFIED; Vercel BLOCKED" everywhere (§1, §2, §9). |
| A00-1-006 Stale evidence | P1 | **FIXED.** All quoted evidence comes from one run on the committed spike (`00-git.txt`: HEAD `d890776`, clean apart from the evidence folder; `99-git-after.txt` the same). |
| A00-1-007 Proposal 0002 understated | P2 | **FIXED.** Proposal 0002 now cites the full engine scan (`03-engines.txt`), adds PHASES Phase 1 task 1, and drops the unsourced Vercel claim. |
| A00-1-008 Proposal 0001 text inconsistent | P2 | **FIXED.** The proposed text now matches option A exactly and lists every section it changes. |
| A00-1-009 Proposal 0003 misses the "core settings" rules | P2 | **FIXED.** Changes now include ARCHITECTURE §2 and PHASES Phase 1 task 3. |
| A00-1-010 Owner steps would not work | P2 | **FIXED.** Steps now import the repo before pushing the spike branch, turn off Vercel Authentication for the new project instead of relying on share-link cookies, and option B runs sequentially. |
| A00-1-011 WebKit job could pass without proving sync | P2 | **FIXED.** `webkit-check.mjs` waits for hydration on both pages and confirms page 1 changed before timing page 2; shown passing (`11`) and failing under `listen: false` (`18`, exit 1). Still unrun in WebKit (§9). |
| A00-1-012 A3 tested narrowly; DESIGN §5 gap | P2 | **FIXED** as far as the builder can: family-name probe (`19`), ambiguity §7 item 8, proposal 0004 with a working prototype. |
| A00-1-013 Code copies under `docs/evidence` | P2 | **FIXED.** Removed; helper scripts renamed `.txt`; the code lives only on `spike/phase-00`. |
| A00-1-014 Paraphrased commands, missing exit codes | P2 | **FIXED** for current evidence (every `spike-v2` command has its own `exit=` line). v1 is left as it was, marked superseded. |
| A00-1-015 §7 item 5 did not reproduce | P2 | **FIXED.** §7 item 5 now says it did not reproduce and gives `22-fresh-install.txt`. |
| A00-1-016 Stop notes incomplete; ids; §1 count; Data questions | P2 | **FIXED.** Stop notes OWNER-3 (proposals) and OWNER-4 (SPEC); ids renamed; §1 counts corrected; §8 Data questions added. |

## 12. Owner sign-off
(Owner.)
