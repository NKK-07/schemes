# Phase 00 — Repository reconnaissance: builder report

| | |
|---|---|
| Branch / commit | `phase/00-recon` (report, evidence, proposals). Spikes on the throwaway branch `spike/phase-00` (never merged): evidence run at `c5920c9`, its output committed as `49e58d3` |
| Builder | Claude, model `claude-opus-5` as configured for this session (the serving model can differ), running in Claude Cowork and acting as the builder under AGENTS.md |
| Date | 2026-09-19 (revision 3, after audit 2) |
| Environment | `node -v` v22.23.2, `npm -v` 10.9.7, Ubuntu 24.04.4 LTS x86_64, git 2.43.0; browser Chromium 141.0.7390.37 through `executablePath` (`spike-v2/00-environment.txt`, `00-session-start.txt`; §5) |
| `.phase` | 00 |

## 1. Summary
Of the ten assumptions, four are verified outright (A2 in Chromium, A4, A6, A10), three are verified locally but still need a Vercel or WebKit run (A3, A8, A7), two need a Vercel preview (A5, A9), and one fails as specified (A1: Astro does not hash the theme boot script; proposal 0001). The owner is asked for four proposal decisions, two confirmations (OWNER-4, OWNER-5) and one push to GitHub and Vercel that unblocks every remaining check. Phase 0 cannot exit yet: audit 2 left one P0 (A00-1-001) that only the owner can close.

All evidence quoted below is in `docs/evidence/phase-00/spike-v2/`, produced by one run of `phase0-evidence.sh` on the committed spike (`c5920c9`); every file lists the exact commands, each followed by its exit code. Earlier evidence is kept in `v1-superseded/` and is not quoted (see `docs/evidence/phase-00/README.md`).

## 2. Assumptions (ARCHITECTURE §11)

Phase 0 owns no acceptance criteria; it exits when A1–A10 are each VERIFIED, or FAILED with an approved proposal.

| # | Assumption | Status | Evidence (`spike-v2/…`) |
|---|---|---|---|
| A1 | Astro 7.3.3 `security.csp` works for static output with Preact islands; it hashes the island hydration scripts; `scriptDirective.resources` accepts `'self'` and `'wasm-unsafe-eval'` | **FAILED as specified** → proposal 0001, BLOCKED OWNER-3 | With the config exactly as SECURITY §2.1 the meta tag is present and lists the hydration scripts, but not the theme boot script: "dist/index.html: meta=yes at 441, inline blocks=4, not listed=['script@221(203B)']", "TOTAL inline blocks not listed: 5" (`05-csp-security21.txt`). It ran anyway (`06-browser-security21.txt`: `"htmlHasJsClass": true`, `"cspViolations": []`) only because it comes before the meta tag. With proposal 0001's hash: "dist/index.html: meta=yes at 441, inline blocks=4, not listed=none", "TOTAL inline blocks not listed: 0" (`08-csp-committed.txt`), `"cspViolations": []` (`09-browser-committed.txt`). The parts about islands and `resources` hold. |
| A2 | `astro-pagefind` 2.0.1 runs on Astro 7.3.3 and Pagefind 1.5.2 with `trailingSlash: "always"` | **VERIFIED** (Chromium) | "[pagefind] Pagefind indexed 5 pages", exit=0 (`07-build-committed.txt`). Search in the browser under the CSP: `"search:kerala": ["/"]`, `"search:prototype": ["/second/"]`, `"cspViolations": []` (`09`). `'wasm-unsafe-eval'` is needed for Pagefind's main-thread fallback: with it `"out": "results: /second/"` (`10`); without it the fallback fails with "Refused to compile or instantiate WebAssembly module" and the CSP report `"script-src wasm-eval"` (`17`). |
| A3 | `astro-og-canvas` 0.13.2 renders on Node 22 **at build on Vercel** with the reference fonts | **Local VERIFIED; Vercel BLOCKED** (OWNER-1) | "PNG signature: True", "width x height: (1200, 630)" (`13-og-png.txt`); "[astro-og-canvas] Loaded 3 font families:" / "Newsreader Medium, IBM Plex Sans, IBM Plex Mono Medium" (`07`). Family names must match exactly or the text silently falls back (`19-og-families.txt`, `19-og-exact-mono.png` vs `19-og-wrong-mono.png`). DESIGN §5 needs more than the package offers → proposal 0004, with eight probe images (`23-og-proposal-*`). |
| A4 | Sitemap `filter` and `serialize` behave as ARCHITECTURE §8.3 | **VERIFIED** | `12-sitemap.txt`: `sitemap-0.xml` has `/`, `/noworker/`, `/second/`; `/shortlist/` is filtered out; every entry has `<lastmod>2026-09-18T00:00:00.000Z</lastmod>` (format note in §7 item 4). |
| A5 | Vercel `trailingSlash` + `cleanUrls` + directory output: 308 for no-slash paths, 200 for assets | **BLOCKED** (OWNER-1) | Needs a Vercel build. |
| A6 | The locked set installs with `npm ci`, no `--legacy-peer-deps` | **VERIFIED** (Node 22.23.2) | "added 864 packages in 19s", exit=0, `linux-x64` listed under `node_modules/@pagefind` (`01-npm-ci.txt`); "packages: 30, mismatches: 0" (`02-versions.txt`); in-set peers all "ok", the only engine issue is at 22.22.2 (`03c-peer-check.txt`: "issues: 1", exit=1; at 22.22.3 "issues: 0", exit=0) → proposal 0002. |
| A7 | `listen: true` syncs across tabs in Chromium **and WebKit** | **Chromium VERIFIED; WebKit BLOCKED** (OWNER-2) | `"crossTabMs": 16` (`09`); the stricter check that waits for hydration: `"page1Changed":true,"crossTabSynced":true,"ms":6` (`11`). It can fail: with `listen: false` it reports `"crossTabSynced":false`, exit=1 (`18-mutation-listen-false.txt`). WebKit is not installed in the sandbox (`00-session-start.txt`: `/opt/pw-browsers` has Chromium only). |
| A8 | `npm ci --ignore-scripts` then `npm run build`, locally **and on Vercel** | **Local VERIFIED; Vercel BLOCKED** (OWNER-1) | `20-ignore-scripts.txt`: install exit=0, "Pagefind indexed 5 pages", build exit=0. |
| A9 | Vercel serves `404.html` with status 404 and the `vercel.json` headers | **BLOCKED** (OWNER-1) | Needs a Vercel build. The spike builds `dist/404.html`; its `vercel.json` differs from SECURITY §2 only in `installCommand` (confirmed by the reviewer, audit 2 §2). |
| A10 | `import { z } from "astro/zod"` works in an Astro page, Vitest and `tsx` | **VERIFIED** | `14-a10.txt`: "✓ tests/zod.test.ts > A10 astro/zod works in Vitest", exit=0; "A10 tsx: true false", exit=0; `grep -o 'data-pagefind-meta="id:cgss"' dist/index.html` → `data-pagefind-meta="id:cgss"`, exit=0. |

## 3. Commands run
Every command, its output and its exit code are in the file named. Summary:

| # | What | Exit code(s) | File |
|---|---|---|---|
| 1 | Start of session (AGENTS §1): `cat .phase`, `git status --short`, `git log --oneline -5`, `node -v`, `npm -v`, spike HEAD, `git --version`, browsers | 0 each | `../00-session-start.txt` |
| 2 | Spike commit and tree | 0 | `00-git.txt` (HEAD `c5920c9…`; only `docs-evidence-v2/` entries, see the evidence README) |
| 3 | Environment | 0 | `00-environment.txt` |
| 4 | `npm ci` from the committed lockfile | 0, 0 | `01-npm-ci.txt` |
| 5 | Installed versions vs ARCHITECTURE §2 | 0 | `02-versions.txt` |
| 6 | Engine ranges of every lockfile entry at six Node versions | 0 | `03-engines.txt` |
| 7 | `npm view` × 30 | 0 (30 × `npm-view-exit=0`) | `03b-npm-view.txt` |
| 8 | Peer and engine check at Node 22.22.2 and 22.22.3 | 1 (issues: 1), 0 (issues: 0) | `03c-peer-check.txt` |
| 9 | Reference data vs `golden.json` totals | 0 (all MATCH) | `03d-data-sanity.txt` |
| 10 | Build and CSP analysis with the SECURITY §2.1 config; browser check | 0, 0, 0 | `04`, `05`, `06` |
| 11 | Build and CSP analysis with the committed config; proposal 0004 images; browser checks | 0 each | `07`, `08`, `23-og-proposal-0004.txt`, `09`–`11` |
| 12 | Sitemap, OG PNG, A10 | 0 each | `12`, `13`, `14` |
| 13 | Favicon probe (missing file → console 404; restored → none) | 0, 0 | `15-favicon-probe.txt` |
| 14 | No-`'wasm-unsafe-eval'` build and checks | 0, 0, 0 | `16`, `17` |
| 15 | Mutation probe `listen: false` (must fail), then restore | 0, **1 (expected)**, 0, 0 | `18-mutation-listen-false.txt` |
| 16 | OG font-family probe | 0, 0 | `19-og-families.txt` |
| 17 | `npm ci --ignore-scripts` and build | 0, 0 | `20-ignore-scripts.txt` |
| 18 | `npm audit --omit=dev --audit-level=high` | 0 ("found 0 vulnerabilities") | `21-npm-audit.txt` |
| 19 | Fresh `npm install` in a scratch folder | 0 | `22-fresh-install.txt`: "added 856 packages in 1m", `linux-x64` present, "lockfile identical to committed" |
| 20 | Tree after the run | 0 | `99-git-after.txt` (only `docs-evidence-v2/` entries) |

## 4. Files
- `main` (before the phase): `spec: v1.0` and `spec: owner decisions D1–D4` — see BLOCKED OWNER-4 and finding A00-1-001. Unchanged since audit 1.
- `phase/00-recon`: `.phase`; `docs/evidence/phase-00/` (`00-session-start.txt`, `README.md`, `spike-v2/`, `v1-superseded/`); `docs/proposals/0001`–`0004` and `docs/proposals/assets/0004-og-wordmark.png`; this report; `docs/audits/phase-00-audit-1.md` and `-2.md` (the reviewer's files, committed by the builder, see OWNER-5).
- `spike/phase-00` (never merged): the spike project, `phase0-evidence.sh` and its helper scripts, `docs-evidence-v2/`, `.github/workflows/spike-webkit.yml`. Revision 3 added: the environment and proposal 0004 steps in the evidence script, real-title probes in the proposal 0004 prototype, and `node -v` at the start of the spike's `build` script (so the Vercel build log shows the Node version).
- Moved in revision 3: `docs/evidence/phase-00/00-environment.txt` → `v1-superseded/00-environment.txt`. The `spike-v2/` files were replaced by the new run.

## 5. Deviations from the spec
- Node 22.23.2 comes from the npm package `node-linux-x64` because nodejs.org is blocked by the sandbox proxy; the system Node 22.22.2 does not meet the locked tree's engine ranges (proposal 0002). Within "22.x".
- Browser checks use the preinstalled Chromium 141, not Playwright 1.63's own Chromium build; the sandbox does not allow `playwright install`. CI will use Playwright's browsers.
- The reviewer ran as a sub-agent of the same session (it did not see the builder's conversation). AUDIT §1 asks for a new session; the owner may want an independent re-audit (for example Gemini CLI) before merging.

## 6. Stop notes

```
BLOCKED OWNER-1: A5, A9, and the Vercel halves of A3 and A8
Why: they can only be observed on a Vercel build (ARCHITECTURE §11). The builder may not deploy (AGENTS F-19) and has no GitHub or Vercel access. PHASES Phase 0 task 4 also needs the build log.
Options: A) the owner pushes the repository to a new private GitHub repository, imports it into a NEW Vercel project and sends the preview URL and build log; the builder checks the preview with curl / B) leave them unverified until the first phase that has a preview of the real app (a URL or header problem would surface later) / C) trust the documentation (no evidence; not recommended)
Recommendation: A (steps below; it also unblocks OWNER-2).
Needs: owner action
```

```
BLOCKED OWNER-2: A7 in WebKit
Why: WebKit is not installed in the builder's sandbox, and installing browsers there is not allowed. Chromium passes and the check is shown to fail when sync is broken (spike-v2/18).
Options: A) the same push as OWNER-1 runs .github/workflows/spike-webkit.yml on GitHub Actions, which installs WebKit and fails unless both browsers sync within 1 s with no CSP violations / B) run it on the owner's computer (commands below) / C) accept Chromium-only evidence (a Safari-only sync bug would reach users)
Recommendation: A.
Needs: owner action
```

```
BLOCKED OWNER-3: proposals 0001–0004
Why: A1 fails as specified (0001); the Node minimum in the pack is too low for the locked tree (0002); every build prints a CSP warning (0003); DESIGN §5 cannot be drawn by the locked OG package (0004). Only the owner changes the locked documents (AGENTS §6).
Options: A) approve all four: the owner applies the texts; Phase 0 can exit once OWNER-1, -2, -4 and -5 are done and a re-audit is clean
         B) reject one or more: 0001 → A1 stays FAILED with no approved proposal, so Phase 0 cannot exit and the AC-SEC-02 check (every inline script hashed) cannot pass; 0002 → Phase 1 writes engines.node "22.x", and npm ci stops with notsup on Node 22.12–22.22.2 (engine-strict); 0003 → every build prints the Shiki CSP warning, nothing fails; 0004 → Phase 8 stops at task 3, because DESIGN §5 cannot be drawn by the locked package
         C) amend any of them: the builder revises the proposal and the reviewer re-audits it
Recommendation: A; each proposal lists the exact text to change.
Needs: proposal approval
```

```
BLOCKED OWNER-4: confirm the D1–D4 entries in SPEC §3 and the two builder commits on main (audit finding A00-1-001, P0)
Why: the owner chose the builder ("You, here, phase by phase") and the pace ("Stop after each phase"). The owner did not ask for commits to main or for edits to SPEC. To hand over a repository, the builder created it, committed the spec pack as delivered (c7f90ce), and wrote the owner's answer on the owner decisions into SPEC §3 (e387d89). The answer was: "Editoral looks need more refinement and rest all apporved". The builder recorded it as D1 Editorial (refined), with the refinements to be specified by the owner and applied as a DESIGN amendment before Phase 4, and D2 Allow, D3 Yes, D4 On (the values proposed in the question). SPEC is locked and main is owner-only (AGENTS F-01, F-19), so the builder could not do this on its own authority.
Options: A) the owner confirms both commits and the D1–D4 wording as theirs: finding closed; nothing else changes / B) the owner edits SPEC §3 themselves, and the builder's commit is replaced before the first push: needs the answer before step 3 of the owner steps / C) the owner rejects the commits: main is rebuilt from the delivered spec pack with SPEC §3 left blank (the builder prepares it on a branch, the owner makes it main), and Phase 0 waits for the owner's own D1–D4
Recommendation: A, and send the D1 refinements when ready (needed before Phase 4, not before Phase 1).
Needs: owner decision (in writing)
```

```
BLOCKED OWNER-5: who commits the reviewer's audit files (audit finding A00-2-004)
Why: AUDIT §1 lets the reviewer create only its own report; AGENTS §10 says the builder never edits docs/audits/; no document says who commits the file. The builder committed audit 1 (9189480) and audit 2 (this revision) byte for byte. Audit 2's SHA-256 is 167b804f…d7921e in the reviewer's worktree and in the committed copy. Audit 1's committed copy is cd35f833…de23cc; the reviewer's original worktree was removed before audit 2, so that copy can no longer be compared.
Options: A) the builder commits the reviewer's file unchanged and records its checksum from the reviewer's worktree in the report: no extra work for the owner; the checksum is the only proof it is unchanged / B) the owner commits each audit file: an extra owner step after every audit / C) the reviewer commits on its own branch: needs a change to AUDIT §1 (a proposal)
Recommendation: A, and the owner confirms audit 1 as committed.
Needs: owner decision
```

**Owner steps for OWNER-1 and OWNER-2 (about 15 minutes).** Order matters: decide OWNER-4 first, and Vercel only builds branches pushed after the project is connected.
1. Answer OWNER-4 and OWNER-5. If you choose OWNER-4 option B, stop here: the builder replaces the SPEC commit before anything is pushed.
2. Unzip the repository and open a terminal inside it. If you plan to run anything locally, check that `node -v` is 22.22.3 or later.
3. On GitHub, create a new **private**, empty repository (no README), for example `founders-field-guide-v2`. Then run `git remote add origin <the new repository URL>` and `git push -u origin main`.
4. In Vercel, choose **Add New → Project** and import the new repository as a **new project** (not the live `founders-field-guide`). What Vercel does with `main` is not known in advance: `main` has no `package.json` and no `vercel.json`, so the first build may fail, or Vercel may publish the files on `main` (the spec documents, the reference data, the prototype pages and the PDF) at the new project's production address. Nothing there is secret. The prototype pages carry the same content as the live guide, and Phase 1 replaces all of it with the app. If you do not want that published even briefly, stop after step 3 and choose OWNER-1 option B.
5. In the new project, go to **Settings → Deployment Protection** and turn **Vercel Authentication off**, so the builder can check the preview with plain `curl`. Preview deployments are then public at their long random addresses. It must be back on by Phase 14 (SECURITY §6), and you can turn it back on any time after the builder's check.
6. Run `git push origin phase/00-recon spike/phase-00`. This creates a preview deployment of `spike/phase-00` and starts the `spike-webkit` job in GitHub Actions.
7. Send the builder three things:
   - the preview URL of the `spike/phase-00` deployment (from the Deployments tab);
   - its build log: open that deployment, then **Build Logs**, and copy all the text (the builder needs the `node -v` line, the install command, "Loaded 3 font families" and "Pagefind indexed");
   - a screenshot of **Actions → spike-webkit → the run**, showing the two result lines (`"browser":"webkit"…` and `"browser":"chromium"…`).

Option B for OWNER-2 is to run these on the owner's computer, one after another, in the spike branch: `npm ci`, then `npx playwright install webkit chromium`, then `npm run build`. Then run `npx astro preview --port 4321` in a second terminal, and `node webkit-check.mjs` back in the first.

## 7. Ambiguities and contradictions found (PHASES Phase 0 task 6)
1. **SECURITY §2.1 vs Astro** — `is:inline` scripts are not hashed (A1). Proposal 0001.
2. **Node minimum** — the pack's "≥ 22.12" / "22.x" is below what the locked tree needs (22.22.3; `03-engines.txt`). Proposal 0002, which now also covers TESTING §4.
3. **Build warning** — Astro prints a Shiki/CSP warning on every build (`04`, first `[WARN]` line). Proposal 0003.
4. **Sitemap `lastmod` format** — the sitemap writes `2026-09-18T00:00:00.000Z` where AC-SEO-06.2 says "`lastmod` = `lastVerified`" (`2026-09-18`). The only workable reading is "same calendar date"; the owner may want ACCEPTANCE to say so. The Phase 8 check will compare dates unless told otherwise.
5. **Lockfile generation** — in the first evidence set, a fresh `npm install` reported "added 855 packages" and the optional `@pagefind/linux-x64` binary was missing, so the first build failed. It did **not** reproduce: the reviewer got 856 packages with the binary, and `22-fresh-install.txt` shows "added 856 packages in 1m", `linux-x64` present, "lockfile identical to committed". The most likely cause is a one-off failed download of the 52 MB optional package, which npm skips without an error. The build fails loudly when the binary is missing ("Failed to install either of [pagefind_extended, pagefind]"), so the problem cannot ship silently. No change proposed.
6. **Position of the CSP meta tag** — Astro renders it at its head-render position, after the author's own head content (reviewer: `runtime/server/render/head.js`), so any inline script written in `Head.astro` comes before it and is not governed by the meta policy. The AC-SEC-02 check must test every inline script wherever it sits (proposal 0001).
7. **Favicon and the e2e console guard** — a missing `/favicon.ico` produces a console error (`15-favicon-probe.txt`), which TESTING §5.1 turns into a failing test. Phase 3 adds the icons from `reference/icons/` before e2e tests run. No change needed.
8. **Social images** — DESIGN §5's four-run layout cannot be drawn by `astro-og-canvas` 0.13.2, and wrong family names fall back silently (`19-og-families.txt`). Proposal 0004.
9. **D1 "Editorial, refined"** — DESIGN §1 has rows for "Editorial" and for other directions, not for a refined Editorial. The builder recorded it as needing an amendment before Phase 4 (OWNER-4).
10. **Region line on social images** — DESIGN §5's "{n} state schemes + every central scheme" reads "1 state schemes" for 28 regions and "0 state schemes" for one (`23-og-proposal-DH.png`); DESIGN §4 uses "{n} scheme(s)". Proposal 0004 leaves the wording unchanged and flags it for the owner.
11. **Who commits audit files** — no document says (OWNER-5).

## 8. Data questions
None. Phase 0 compared counts only (`03d-data-sanity.txt`, all MATCH); facts are migrated and checked in Phase 2.

## 9. UNVERIFIED items
| Claim | Why unverified | What would verify it |
|---|---|---|
| A5, A9, Vercel halves of A3 and A8 | No Vercel build | OWNER-1 |
| A7 in WebKit | No WebKit in the sandbox | OWNER-2 |
| What Vercel does with `main` before the app exists | No Vercel access | OWNER-1 step 4 (the owner sees it) |
| Behaviour with Playwright 1.63's own Chromium build | Sandbox rule | First CI run (D3 = Yes) |
| The WebKit job itself (`spike-webkit.yml`) | Cannot run GitHub Actions from the sandbox; the script was run in Chromium only (`11`, `18`) | OWNER-2 |
| Line counts in the proposal 0004 images | Visual check by the builder, not measured | Phase 8 report images, or the reviewer's own look |

## 10. For the reviewer
- New since audit 2: spike `b86c7c3..49e58d3` (script, prototype probes, `build` prints `node -v`, the new evidence run); phase `61abbe1..HEAD` (this report, proposals 0002 and 0004, the evidence README, `00-session-start.txt`, `spike-v2/` replaced, `docs/audits/phase-00-audit-2.md`).
- Proposal 0004 now has a table of every difference from DESIGN §5 and puts the wordmark in `src/assets/` (not published).
- Stop notes: OWNER-1 steps start with OWNER-4; OWNER-3 gives a consequence for each option; OWNER-5 is new.
- Re-audit (audit 3) is requested once the owner has answered OWNER-1 to OWNER-5. The phase cannot exit before then, and audit 3 has to check the Vercel and WebKit results anyway. AUDIT §5's three-round escalation is met in substance: the one open P0 is already with the owner.

## 11. Audit responses

### Audit 1 (`docs/audits/phase-00-audit-1.md`)

Every FIXED item below is in commit `9189480` on `phase/00-recon` (revision 2), with fresh evidence from the spike at `d890776`. Revision 3 re-ran all evidence at `c5920c9`, and the quotes in §2 come from that run.

| Finding | Sev. | Response |
|---|---|---|
| A00-1-001 SPEC edited and committed to `main` by the builder | P0 | **Needs the owner (BLOCKED OWNER-4).** The builder cannot dispute or defer a P0. The facts are in OWNER-4, with the owner's answer quoted. Nothing further was committed to `main`. |
| A00-1-002 CSP meta quoted from a file that does not contain it | P0 | **FIXED.** `spike-v2/05` and `08` print the meta result for every page; §2 quotes only those. |
| A00-1-003 Evidence command did not produce the quoted line | P0 | **FIXED.** `spike-v2/14-a10.txt` records the exact `grep -o` command, its output and exit code. |
| A00-1-004 A1 should be FAILED | P1 | **FIXED.** A1 is FAILED as specified, with proposal 0001 and stop note OWNER-3. |
| A00-1-005 A3 status inconsistent; Vercel half untested | P1 | **FIXED.** A3 is "Local VERIFIED; Vercel BLOCKED" everywhere (§1, §2, §9). |
| A00-1-006 Stale evidence | P1 | **FIXED.** All quoted evidence comes from one run on the committed spike. |
| A00-1-007 to -013, -015 | P2 | **FIXED** in revision 2 (confirmed by audit 2 §6). |
| A00-1-014 Paraphrased commands, missing exit codes | P2 | Partly fixed in revision 2; completed in revision 3 (see audit 2 below). |
| A00-1-016 Stop notes incomplete; ids; §1 count; Data questions | P2 | Partly fixed in revision 2; completed in revision 3 (see audit 2 below). |

### Audit 2 (`docs/audits/phase-00-audit-2.md`: open P0 1, P1 0, P2 6)

Every FIXED item below is in commit `4125665` on `phase/00-recon` (revision 3), with fresh evidence from the spike at `c5920c9` (output committed as `49e58d3`).

| Finding | Sev. | Response |
|---|---|---|
| A00-1-001 (still open) | P0 | **Needs the owner (BLOCKED OWNER-4).** The OWNER-4 wording is corrected as asked in A00-2-003 item 4. |
| A00-1-014 Two evidence files still paraphrase | P2 | **FIXED.** `23-og-proposal-0004.txt` is now written by `phase0-evidence.sh` itself. It records the `grep` of the build output, the title lengths and sizes, a PNG check and copy for each of the eight images, and `find dist -iname '*wordmark*' \| wc -l` → `0`, each with `exit=0`. The script no longer deletes files it cannot recreate. The paraphrased `00-environment.txt` moved to `v1-superseded/`. It is replaced by `spike-v2/00-environment.txt` and `00-session-start.txt`, which record exact commands with one `exit=` line each. |
| A00-1-016 Builder field; OWNER-3 consequences | P2 | **FIXED.** The Builder field names the configured model. OWNER-3 gives the consequence of each option, including each rejection. |
| A00-2-001 Proposal 0002 misses TESTING §4 | P2 | **FIXED.** Proposal 0002 lists TESTING §4 and gives the new `AC-OPS-03` row. A grep of the locked files for Node versions finds no other place to change. |
| A00-2-002 Proposal 0004 changes more than it declares | P2 | **FIXED.** The wordmark moves to `src/assets/og-wordmark.png`, which is not published; exact text is given for ARCHITECTURE §3, §8.4 and PHASES Phase 8 task 3. A table lists every difference from DESIGN §5. "Max 3 lines" is kept and enforced by a 100-character build limit, supported by eight probe images, six of them real titles. "State schemes" is unchanged and flagged. The AC-SEO-09 effect is stated. |
| A00-2-003 Owner steps and OWNER-4 wording | P2 | **FIXED.** Step 1 is now OWNER-4 and OWNER-5, before any push. The repository is private. Step 4 says what Vercel may do with `main`, with no prediction, and gives a way out. Step 7 asks for the build log; the spike's `build` script now prints `node -v`. OWNER-4 quotes the answer as the owner's choice of builder, and says the owner did not ask for commits to `main`. |
| A00-2-004 Builder committed an audit file | P2 | **Needs the owner (BLOCKED OWNER-5).** Audit 2 was committed byte for byte (SHA-256 `167b804fe40d51fc9f3776e1f9d510e7cc0adb86b68c8ce54882bdd656d7921e` in the reviewer's worktree and in the commit). |

## 12. Owner sign-off
(Owner.)
