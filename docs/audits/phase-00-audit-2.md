# Phase 00 — audit 2

| | |
|---|---|
| Commit audited | `61abbe1` (branch `phase/00-recon`, detached in `/home/claude/reaudit-00`). New commits `b2c3ae4..61abbe1` (`9189480`, `61abbe1`). Spike re-run at `b86c7c3` (branch `spike/phase-00`, detached in `/home/claude/reaudit-00-spike`). New spike commits `5d8d829..b86c7c3` (`23881f9`, `14bf235`, `32abe25`, `d890776`, `0a3c73e`, `b86c7c3`) |
| Reviewer | Claude Opus 5 (`claude-opus-5`), run as a sub-agent. The limit on independence from audit 1 still applies (§7 O-1) |
| Date | 2026-09-19 |
| Worktree clean at end | `git -C /home/claude/reaudit-00-spike status --short` → *(no output)*; `git -C /home/claude/reaudit-00 status --short` → `?? docs/audits/phase-00-audit-2.md` (this file only). Both quoted in §8 |
| Previous audit | `docs/audits/phase-00-audit-1.md` (audited `b2c3ae4` and spike `5d8d829`) |

Reviewer environment: `node -v` v22.23.2 (from `source /home/claude/ffg-env.sh`), `npm -v` 10.9.7, git 2.43.0, `Linux 6.18.44-fc-v37 x86_64`, Ubuntu 24.04.4 LTS. `npm config get legacy-peer-deps engine-strict ignore-scripts` → `false` / `false` / `false`; there is no `~/.npmrc` and the spike has no `.npmrc`. Chromium 141.0.7390.37 was launched through `executablePath: "/opt/pw-browsers/chromium"`. There is no WebKit, and I have no Vercel or GitHub access. The preview server ran on port 4321. At the end no process matched `astro preview`, `ss -ltnp` showed no listener on 4321, and `curl http://localhost:4321/` returned `000`.

My own scripts are in the session scratchpad (`…/scratchpad/ra2/`), not in the repository:
- `versions.mjs` reads the ARCHITECTURE §2 table from the phase branch and checks the version and dep/dev kind in `package.json`, the installed version, and any extra packages.
- `inline-hash.mjs` parses every `dist/**/*.html` with `node-html-parser` (no regex over HTML). It hashes every inline `<script>` (not `src=`, not JSON-LD) and `<style>`, checks each hash against the CSP meta, and reports whether each block comes before or after the meta.
- `browser.mjs` checks A1, A7 and A2 in Chromium. It waits for hydration and confirms that page 1 changed before timing page 2. It runs the search queries `kerala`, `prototype`, `guarantee` and `zzznomatch`, uses a positive CSP control (an inline script injected after load on a separate page), and records console errors, off-origin requests and HTTP errors. It exits 1 on any failure.
- `wordmark.mjs` renders the proposal 0004 wordmark text in Chromium from `reference/fonts/plexmono-{600,500}.v1.woff2`.

## 1. Reproduction

| Command | Exit code | Summary lines (quoted) |
|---|---|---|
| `npm ci` on the report branch (`/home/claude/reaudit-00`) | 1 | `npm error code EUSAGE` / "The `npm ci` command can only install with an existing package-lock.json". Phase 0 has no `package.json` and no app, so this does not apply |
| `npm run verify` on the report branch | 254 | `npm error enoent Could not read package.json`. There is no `verify` script in Phase 0 |
| `./phase0-evidence.sh` (the builder's script, run by me on the spike at `b86c7c3`, which wrote over `docs-evidence-v2/`) | 0 | `evidence written to docs-evidence-v2`, 2 m 45 s. Compared with the committed files using `git diff HEAD` (next row) |
| `git diff HEAD -- docs-evidence-v2/` after my run | — | **Byte-identical** to the committed evidence: `02`, `03`, `03b`, `03c`, `03d`, `05`, `08`, `10`, `12`, `13-og-png.txt`, **`13-og-default-families.png`**, `14`, `15`, `17`, **`19-og-exact-mono.png`**, **`19-og-wrong-mono.png`**, `21`, `22`. Differences in the other files: timestamps, durations, Pagefind cache-busters, the working-directory path, `crossTabMs` 17→20 (`06`), `ms` 6→7 (`11`), `added 864 packages in 14s`→`15s`, and the git state in `00`/`99`. After normalising times and paths, `04` and `07` differ only by three added lines (`├─ /og-proposal/schemes/cgss.png/`, `…/long.png/`, `…/regions/KL.png/`), which are the routes added in `b86c7c3` after the builder's run at `d890776`. The script's `rm -rf` deleted the four `23-og-proposal-*` files, because no script produces them (A00-1-014) |
| `npx astro build` (spike `b86c7c3`, committed config), then `cmp dist/og-proposal/{schemes/cgss,schemes/long,regions/KL}.png` against the committed `23-og-proposal-{cgss,long,region}.png` | 0 / 0 ×3 | `cgss: identical`, `long: identical`, `region: identical`. The build printed no `WARN` line |
| `node versions.mjs` (reviewer) | 0 | `rows in ARCHITECTURE §2: 30; declared in package.json: 30; extra declared: []; mismatches: 0`. `cmp` shows the spike's `ARCHITECTURE.md` is identical to the phase branch's |
| `npm ls --depth=0` | 0 | All 30 packages at the §2 versions, plus `@img/sharp-wasm32@0.35.4 extraneous` (as in audit 1, O-2) |
| `npm ls --all` | 0 | 0 lines with `invalid` or `missing`; the only extraneous package is `@img/sharp-wasm32` |
| `node inline-hash.mjs` on the committed-config build | 0 | `pages=5 noMeta=0 inlineBlocks=11 notListed=0`. Every page has `script@…(203B,before meta) listed` |
| `npx astro build --config astro.config.security21.mjs` + `node inline-hash.mjs` | 0 / 0 | `[WARN] [config] Shiki syntax highlighting uses inline styles …`; `Pagefind indexed 5 pages`. Result: `pages=5 noMeta=0 inlineBlocks=11 notListed=5`, and every page has `script@…(203B,before meta) NOT LISTED`. Hydration scripts `316B` and `4380B` and the 59-byte style are `listed`. The config block matches SECURITY §2.1 (a text compare with whitespace and commas removed) |
| `node browser.mjs` with the SECURITY §2.1 build | 0 | `"A1":{"jsClass":true,"metaInDom":true,"islands":1}`; `"A7":{…"page1Changed":true,"synced":true,"ms":6,"stored":"[\"id-0\"]"}`; `"A2":{"kerala":["/"],"prototype":["/second/"],"guarantee":["/"],"zzznomatch":[]}`; `"violations":[]`; `"control":{"ran":false,"violations":["script-src-elem\|inline\|enforce"]}`; `consoleErrors`, `offOrigin` and `httpErrors` all `[]`; `REVIEWER-BROWSER PASS` |
| `node noworker-check.mjs` with the SECURITY §2.1 build | 0 | `"out": "results: /second/"`, `"csp": []` |
| `node browser.mjs` with the committed-config build | 0 | The same as above, with `"ms":9`; `REVIEWER-BROWSER PASS` |
| `BROWSERS=chromium CHROMIUM_PATH=/opt/pw-browsers/chromium node webkit-check.mjs` (committed build) | 0 | `"page1Changed":true,"crossTabSynced":true,"ms":6,"before2":"Saved: 0","after2":"Saved: 1","cspViolations":[]` |
| `npm ci --engine-strict --ignore-scripts` with Node v22.22.2 (`/opt/node22/bin`) on a scratch copy of `package.json` and the lockfile | 1 | `npm error notsup Not compatible with your version of node/npm: astro-eslint-parser@3.1.0` / `Required: {"node":"^22.22.3 \|\| ^24.16.0 \|\| >=26.3.0"}` |
| Deep JSON compare of the spike `vercel.json` with the SECURITY §2 block | 0 | `differences: 1 [ '$.installCommand: "npm ci" vs "npm ci --ignore-scripts"' ]` |
| `git diff --quiet 5d8d829 b86c7c3 -- vercel.json .github .gitignore package.json package-lock.json` | 0 | Unchanged since audit 1, so audit 1's action-pin check (P-11) still applies. I did not re-run `git ls-remote` |

## 2. Criteria

Phase 0 owns no acceptance criteria (PHASES §3 `"0": []`). The audited items are assumptions A1–A10 (ARCHITECTURE §11, as exercised by PHASES Phase 0 task 4), every claim in report §1–§3 and §7, and the proposals.

### 2.1 Assumptions (report §2)

| Item | Builder status | Reviewer status | Evidence | Severity if not CONFIRMED |
|---|---|---|---|---|
| A1 | FAILED as specified → proposal 0001, BLOCKED OWNER-3 | **CONFIRMED (FAILED is correct)** | §2.1 build: `notListed=5`, the 203-byte boot script on every page. It still runs only because it comes before the meta (`jsClass:true`, `violations:[]`). The positive control is blocked. With the 0001 hash: `notListed=0`, and the browser passes. Quoted lines in report §2 A1 match `05:4`, `05:5`, `05:9`, `06`, `08:9` and `09` exactly | — (the Phase 0 exit waits for OWNER-3) |
| A2 | VERIFIED (Chromium) | **CONFIRMED** in Chromium with both configs | `kerala` → `["/"]`, `prototype` → `["/second/"]`, `zzznomatch` → `[]`, no violations. Main thread: `results: /second/` with `'wasm-unsafe-eval'`. My run of `17` without it is byte-identical to the committed file (`Refused to compile or instantiate WebAssembly module`, `"script-src wasm-eval"`) | — |
| A3 | Local VERIFIED; Vercel BLOCKED (OWNER-1) | Local: **CONFIRMED**. Vercel: NOT CHECKED (BLOCKED) | `13` is byte-identical, 1200×630. The family-name probe (`19`) is byte-identical to my run. By eye, `19-og-exact-mono.png` shows the description in mono and `19-og-wrong-mono.png` shows it in the Newsreader serif | — |
| A4 | VERIFIED | **CONFIRMED** | `12-sitemap.txt` is byte-identical in my run: `/`, `/noworker/`, `/second/`, each `<lastmod>2026-09-18T00:00:00.000Z</lastmod>` | — |
| A5 | BLOCKED (OWNER-1) | NOT CHECKED (BLOCKED; I cannot deploy) | Precondition: `vercel.json` has 1 difference from SECURITY §2 (`installCommand`) | owner steps: A00-2-003 |
| A6 | VERIFIED (Node 22.23.2) | **CONFIRMED** | `npm ci` exit 0 (`added 864 packages`); `legacy-peer-deps=false`; `npm ls --all` exit 0 with no invalid peers; 30/30 versions | — |
| A7 | Chromium VERIFIED; WebKit BLOCKED (OWNER-2) | Chromium: **CONFIRMED**. WebKit: NOT CHECKED (not installed) | `synced:true` in 6 ms and 9 ms (reviewer), 7 ms (`webkit-check.mjs`). Mutation probe P-2 (`listen: false`): both my script and `webkit-check.mjs` fail (exit 1) | — |
| A8 | Local VERIFIED; Vercel BLOCKED | Local: **CONFIRMED**. Vercel: NOT CHECKED | In my run, `20` has `added 864 packages`, exit 0, then `Pagefind indexed 5 pages` and `[build] Complete!`, exit 0 | — |
| A9 | BLOCKED (OWNER-1) | NOT CHECKED (BLOCKED) | Precondition as for A5 | — |
| A10 | VERIFIED | **CONFIRMED** | `14-a10.txt` is byte-identical in my run: `✓ tests/zod.test.ts > A10 astro/zod works in Vitest`, `A10 tsx: true false`, and `grep -o …` → `data-pagefind-meta="id:cgss"`, each with exit 0 | — |

### 2.2 Report §1, §3 and §7

| Claim | Status | Note |
|---|---|---|
| §1 counts (4 verified, 3 local, 2 Vercel, 1 failed) | CONFIRMED | They match §2 |
| §1 "every file lists the exact commands and their exit codes" (also stated in the evidence README) | **NOT MET** for `23-og-proposal-0004.txt` | A00-1-014 |
| §3 rows 2–18 and 20 | CONFIRMED | My re-run matches the recorded exit codes, including row 14 (`0, 1, 0, 0`) and row 7 (`1`, `0`) |
| §3 row 1 (`00-environment.txt`, "0") | UNPROVEN | The file records an exit code only for `cat .phase`. Line 26 is a paraphrase (`$ source env (Node 22.23.2 from npm package …)`) (A00-1-014) |
| §3 row 19 (proposal 0004 build) | CONFIRMED (behaviour); command not recorded | The images reproduce byte-identically. The recorded "command" is a description with an unrecorded output filter (A00-1-014) |
| §7 items 1–9 | CONFIRMED | Item 6 matches my `inline-hash.mjs`: the boot script comes `before meta` on every page. Item 5 now says the problem did not reproduce, and `22` reproduces (`added 856 packages`, `linux-x64`, `lockfile identical to committed`) |

### 2.3 Proposals against the locked text

| Proposal | Target text checked | Result |
|---|---|---|
| 0001 | SECURITY §2.1: the `scriptDirective` line and the first bullet; DESIGN §6.2: "one inline script (hashed by the Astro CSP)"; TESTING §5: the `tests/unit/` list | Each "replace" target exists verbatim. The hash is a placeholder, which is acceptable because DESIGN §6.2 does not fix the literal script. The text is consistent with Option A. Evidence: `05`, `08`, `09` |
| 0002 | ARCHITECTURE §2 line 26; PHASES line 103 (Phase 0 task 2); PHASES line 148 (Phase 1 task 1); ACCEPTANCE AC-OPS-03.1 (line 507) | Targets are correct. **TESTING §4 line 154** (`AC-OPS-03` check: "`engines.node` = `22.x`") is missing (A00-2-001) |
| 0003 | ARCHITECTURE §5 "Astro config:" line; ARCHITECTURE §2 line 63; PHASES line 150 | Targets are correct. ARCHITECTURE §2 has no list of settings to "add to", so no exact new text is given for it (§7 O-5) |
| 0004 | DESIGN §5 (5 bullets); ARCHITECTURE §8.4; PHASES Phase 8 task 3 | The replacement drops "max 3 lines" and changes "state schemes" to "state scheme(s)" without saying so. It adds `public/og/wordmark.png`, which ARCHITECTURE §3 ("Folder structure (exact)") does not allow, and §3 is not listed. PHASES Phase 8 task 3 is listed with no text (A00-2-002) |

## 3. Findings

New findings from this round. Findings from audit 1 that are still open are in §6.

### A00-2-001 — Proposal 0002 does not change the TESTING §4 build check that pins `engines.node` to `22.x`
- **Violates:** `templates/proposal.md` (Proposed change: "The exact new text … Nothing vague"; Impact: "documents that must change"); AGENTS §5 item 1 (the documents would conflict after approval)
- **Severity:** P2
- **Status:** NOT MET (completeness)
- **Evidence:**
  - `grep -rn -E '22\.x|22\.12|Node 22|22\.22' --include=*.md .` (locked files) returns `TESTING.md:154:| \`AC-OPS-03\` | \`engines.node\` = \`22.x\`, \`.nvmrc\` = \`22\`, \`verify\` script order |`.
  - Proposal 0002 `Changes` (line 7) lists "ARCHITECTURE §2 (Node line); PHASES Phase 0 task 2; PHASES Phase 1 task 1; ACCEPTANCE AC-OPS-03.1". TESTING is not listed.
  - If the proposal is approved as written, AC-OPS-03.1 would say `>=22.22.3 <23`, while the verify-dist check that Phase 1 must implement (TESTING §4) would still say `22.x`.
  - Everything else in the proposal checks out against `03-engines.txt` (byte-identical in my run) and my engine-strict probe on 22.22.2 (`notsup … astro-eslint-parser@3.1.0`, exit 1).
- **Resolved when:** proposal 0002 lists TESTING §4 (the `AC-OPS-03` row) and gives its new text.

### A00-2-002 — Proposal 0004 changes more locked text than it declares
- **Violates:** `templates/proposal.md` ("The exact new text … Nothing vague"; Impact); ARCHITECTURE §3 ("Folder structure (exact)"); AGENTS §8 (copy is quoted, not rewritten)
- **Severity:** P2
- **Status:** NOT MET (completeness and accuracy)
- **Evidence:**
  - **Folder structure.** The proposal adds `public/og/wordmark.png` (lines 22 and 44). ARCHITECTURE §3 lists `public/` exactly (`ARCHITECTURE.md` lines 97–100: the PDF, `fonts/…`, `favicon.*`, `icons/(…)`, `manifest.webmanifest`), and it has no `og/`. ARCHITECTURE §3 is not in `Changes`.
  - **Phase 8.** `Changes` lists "new file `public/og/wordmark.png` in the Phase 8 file list (PHASES Phase 8 task 3)", but "Proposed change" gives text only for DESIGN §5 and ARCHITECTURE §8.4. PHASES line 408 has no proposed text. This is the same kind of gap as A00-1-008.
  - **Silent changes inside the DESIGN §5 replacement.** Current `DESIGN.md:291` says "reduce to 52px if more than 2 lines … max 3 lines". The replacement uses "52 px when the title is longer than 60 characters" and removes "max 3 lines". Current `DESIGN.md:292` says "{n} state schemes + every central scheme". The replacement says "{n} state scheme(s) + every central scheme". Problem and Options mention neither change. Options mention only the loss of the mono amount.
  - **AC-SEO-09.2 interaction.** Under the proposal, `dist/og/` would contain a 404×34 PNG next to the 1200×630 images. AC-SEO-09.2 ("The image file exists in `dist` and is 1200×630 PNG") is fine only if the Phase 8 check reads the images that pages reference, not every PNG under `/og/`. The proposal does not say which.
  - The layout itself is supported. The three `23-*` images reproduce byte-identically. The wordmark PNG is 404×34, its only opaque colour is `#55546A`, and 10919 of 13736 pixels are fully transparent. My Chromium render in Plex Mono 600 at 26 px with `.12em` letter-spacing has almost the same amount of ink (2352 against 2333; Plex Mono 500 gives 2090), so the "600" claim is consistent (§7 O-7).
- **Resolved when:** the proposal lists ARCHITECTURE §3 and gives exact text for it and for PHASES Phase 8 task 3, either restores or explicitly proposes the "max 3 lines" and "state schemes" changes, and says how the AC-SEO-09 check treats `/og/wordmark.png`.

### A00-2-003 — Owner steps (OWNER-1) conflict with OWNER-4, omit the Vercel build log, and rest on an unverified claim; OWNER-4 overstates what the owner asked for
- **Violates:** AGENTS §5 (options "with the consequence of each"); PHASES Phase 0 task 4 ("check the preview URL with `curl -sI` … **and read the build log**"); AGENTS §3 (no unverified claims)
- **Severity:** P2
- **Status:** NOT MET for items 1, 2 and 4 (read from the text). PLAUSIBLE for item 3 (I have no Vercel access)
- **Evidence:**
  1. **Order of the stop notes.** OWNER-4 Option B is "the owner edits SPEC §3 themselves and the builder's commit is replaced **before the first push**" (report line 99). The recommended OWNER-1 steps push `main` at step 3 (`git push -u origin main`, line 107). They do not mention OWNER-4 or say to decide it first. `main` still contains `c7f90ce` and `e387d89` (`git log main`). An owner who follows OWNER-1 first loses Option B unless pushed history is rewritten.
  2. **Build log.** Step 7 (line 111) asks the owner to send only the preview URL and an Actions screenshot. PHASES task 4 requires reading the build log. Proposal 0002 line 32 says "the Vercel build log records the exact version used, and the Phase 0 preview check (BLOCKED OWNER-1) records it". The builder has no Vercel access, so nothing in the steps delivers the Node version, the `installCommand` actually used (the Vercel half of A8), or astro-og-canvas's build output (the Vercel half of A3).
  3. **Unverified prediction.** Step 4 says "Its first build of `main` fails because `main` has no app yet; that is expected." No evidence is given. `main` has no `package.json` and no `vercel.json`. If Vercel treats it as a static project and deploys the repository root, the whole spec pack (including `reference/` and the prototype pages) is published at the new project's production URL. Step 5 then turns Deployment Protection off for all deployments, and step 6 also deploys `phase/00-recon`, which has no app. The steps do not say whether the GitHub repository should be private.
  4. **OWNER-4 wording.** It says "at the owner's request (\"You, here, phase by phase\") the builder created the repository and committed the spec pack … and the owner's chat answers into SPEC §3". According to the report's own framing, that answer is the owner's choice of builder. The quote does not ask for commits to `main` or edits to SPEC. The owner is asked to confirm on the basis of this framing. The rest of OWNER-4 is candid ("the builder could not do this on its own authority").
  - Audit 1's A00-1-010 defects are fixed (§6).
- **Resolved when:** the steps say to decide OWNER-4 before the first push, ask the owner for the Vercel build log (or the specific lines needed), and either source the step-4 prediction or state what happens if `main` deploys (with the repository's visibility). OWNER-4 describes the quote as the answer it was, or the owner confirms the wording.

### A00-2-004 — The builder committed a file under `docs/audits/`
- **Violates:** AGENTS §1 (the builder's "May change" list does not include `docs/audits/`); AGENTS §10 ("You never edit `docs/audits/`"); PHASES §2.2 ("Do not edit docs/audits/")
- **Severity:** P2. None of F-01 to F-26 names `docs/audits/`, and the builder states the commit openly (report §4), so this is not P1.
- **Status:** VIOLATION (process), must be decided
- **Evidence:**
  - `git log --format='%h %s' -- docs/audits/` → `9189480 phase-00: revision 2 after audit 1 …`, authored by `Claude (builder)`. Its message says "Reviewer's audit 1 committed unchanged under docs/audits/".
  - I cannot check "unchanged". The reviewer's worktree `/home/claude/audit-00` no longer exists (`ls: cannot access '/home/claude/audit-00/docs/audits'`). The only other copy is in the builder's own working copy. The committed file is internally consistent: 16 findings, and "Open P0: 3 · Open P1: 3 · Open P2: 10" matches the severities.
  - AUDIT §1 lets the reviewer create only its own report and does not say who commits it. The same question will arise for this file.
- **Resolved when:** the owner decides who commits audit files (and confirms or replaces the committed `phase-00-audit-1.md`), or accepts this in writing.

## 4. Forbidden-shortcut scan

The phase-branch commands ran in `/home/claude/reaudit-00` at `61abbe1`. The spike commands ran in `/home/claude/reaudit-00-spike` at `b86c7c3`.

| Search | Result | Judgement |
|---|---|---|
| `git diff --name-only main...HEAD \| grep -E '^(SPEC\|ACCEPTANCE\|ARCHITECTURE\|DESIGN\|SECURITY\|TESTING\|AGENTS\|AUDIT\|PHASES\|README\|CLAUDE\|GEMINI)\.md$\|^(reference\|templates\|tests/fixtures)/'` | no output, exit 1 | F-01 is clean on the phase branch |
| The same grep on `git diff --name-only b2c3ae4 61abbe1` | exit 1 | The new commits touch no locked file |
| The same grep on the spike, `main...HEAD` and `5d8d829 b86c7c3` | exit 1 / exit 1 | F-01 is clean on the spike branch |
| `git log main`; `git reflog show main`, `phase/00-recon` and `spike/phase-00`; `git merge-base --is-ancestor` | `main` is still `e387d89` (nothing new since audit 1). Both branch reflogs show only `commit:` entries. `b2c3ae4` is an ancestor of `61abbe1`, and `5d8d829` is an ancestor of `b86c7c3`. `git remote -v` prints nothing | F-19 is clean in the new commits: no commits to `main`, no rewritten history, nothing pushed. The earlier `main` commits are A00-1-001 |
| `git diff --name-only main...HEAD` (grouped) | `.phase`; `docs/audits/phase-00-audit-1.md`; `docs/evidence/phase-00/{00-environment.txt, README.md, spike-v2/… (34), v1-superseded/… (27)}`; `docs/proposals/0001–0004`, `docs/proposals/assets/0004-og-wordmark.png`; `docs/reports/phase-00.md` | In Phase 0 scope, except `docs/audits/` (A00-2-004) |
| `git ls-tree -r --name-only 61abbe1 \| grep -iE '\.(mjs\|cjs\|js\|ts\|tsx\|astro\|py\|sh)$'` | only `reference/data-source/*.mjs` (from `main`) | No code on the phase branch. A00-1-013 is fixed |
| `grep -rnE '\.(skip\|only\|fixme)\(\|test\.fail\(\|retries:' tests/` | exit 1 (no hits). There is no `playwright.config.ts` | — |
| The `src/` searches of AUDIT §3.4 | `ls: cannot access 'src'` | There is no `src/` on the phase branch |
| `git diff main...HEAD -- package.json package-lock.json` | 0 lines | Nothing was installed on the report branch |
| `git ls-tree -r --name-only {61abbe1,b86c7c3} \| grep -E '(^\|/)(dist\|node_modules\|\.lighthouseci\|playwright-report\|test-results)/\|(^\|/)\.env'` | exit 1 on both | F-18 is clean |
| New spike files: grep for `innerHTML\|…\|unsafe-inline\|unsafe-eval\|\|\| true\|continue-on-error\|--force\|--legacy-peer-deps\|https?://\|catch {}` | `'wasm-unsafe-eval'` in the §2.1 and no-wasm configs (allowed); `site: "https://founders-field-guide.vercel.app"`; `http://localhost:…`; `check-versions.mjs:8 … catch {}` | No violation. The empty catch leaves `got = "MISSING"`, which counts as a mismatch, so it does not swallow a failure. This is throwaway spike code |
| Banned report phrases (AGENTS §3) in the report, the proposals and the evidence README | one hit: README line 16 "so the audit trail stays complete" | Not a claim that a requirement is met |

## 5. Adversarial probes

AUDIT §7 row 0: re-run A1, A2 and A7 on the spike branch, and check `npm ls` against ARCHITECTURE §2. Every mutation was made in `/home/claude/reaudit-00-spike` and reverted. At the end the worktree was restored with `git checkout -- . && git clean -fdx`, which also removed `node_modules/` and `dist/`.

| Probe | How | Result |
|---|---|---|
| P-0 `npm ls` vs ARCHITECTURE §2 | `npm ci` (inside the script), `npm ls --depth=0` / `--all`, `versions.mjs` | 30/30 at the exact version and the right dep/dev kind; no extra packages; `@img/sharp-wasm32` extraneous |
| P-1 A1 with the exact SECURITY §2.1 config | `astro.config.security21.mjs` (text-equal to §2.1), `inline-hash.mjs`, `browser.mjs` | The boot script is `NOT LISTED` on 5/5 pages and comes before the meta. Hydration scripts are listed. Zero violations |
| P-1b Positive CSP control | Inline script injected after load, in both configs | `ran:false` and one `script-src-elem\|inline\|enforce` violation, so the listener and the meta policy are live |
| P-2 A7 sensitivity | `listen: true` → `listen: false`, rebuilt, both checks run, `git checkout -- src/stores/shortlist.ts` | Reviewer: `"synced":false`, `REVIEWER-BROWSER FAIL`, exit 1. `webkit-check.mjs`: `"crossTabSynced":false`, exit 1. After the revert: `3:  listen: true,` |
| P-3 Evidence reproducibility | The builder's `phase0-evidence.sh`, then `git diff HEAD` | 18 files byte-identical, including 3 PNGs. The rest differ only by timing, path or git state, plus the 3 `og-proposal` route lines added in `b86c7c3` |
| P-4 Proposal 0004 images | `npx astro build`, then `cmp` | 3/3 byte-identical |
| P-5 Engine-strict on 22.22.2 | Scratch copy; `/opt/node22/bin` first on PATH | exit 1, `astro-eslint-parser@3.1.0` `notsup` |
| P-6 Wordmark claims | Pixel decode; Chromium render with Plex Mono 600 and 500 | 404×34; one opaque colour, `#55546A`; ink 2333 against my 600 render's 2352 and my 500 render's 2090; glyph span 393 px against my 386 px (see O-7) |
| P-7 vercel.json | Deep JSON compare with SECURITY §2 | 1 difference (`installCommand`) |

Not checked: WebKit (not installed; installing it is not allowed); anything on Vercel (A5, A9, and the Vercel halves of A3 and A8); GitHub Actions (the workflow is unchanged since audit 1 P-11); Playwright 1.63's bundled Chromium.

## 6. Previous findings (re-audit only)

| Finding | Builder response | Verified? | Evidence |
|---|---|---|---|
| A00-1-001 (P0) SPEC edited and committed to `main` by the builder | Needs the owner (OWNER-4) | **OPEN** | `main` is unchanged (`e387d89`, `c7f90ce`, both authored by `Claude (builder)`). The repository contains no written owner confirmation, and report §12 "Owner sign-off" is empty. The owner's chat answers are quoted in OWNER-4, but I cannot verify the chat, so the confirmation is pending. Only the owner can close or downgrade this finding (AUDIT §5) |
| A00-1-002 (P0) CSP meta quoted from a file without it | FIXED | **Yes** | Report §2 A1 now quotes `05:4` (full meta content), `05:5`, `05:9` and `08:9`. The lines match exactly, and my run reproduces `05` and `08` byte for byte. The v1 file is kept in `v1-superseded/` (100% rename) and is no longer quoted |
| A00-1-003 (P0) Command could not produce the quoted line | FIXED | **Yes** | `14-a10.txt:9` is `$ grep -o 'data-pagefind-meta="id:cgss"' dist/index.html`, followed by the line and `exit=0`. My run reproduces it byte for byte |
| A00-1-004 (P1) A1 should be FAILED | FIXED | **Yes** | A1 is "FAILED as specified → proposal 0001, BLOCKED OWNER-3" (report line 22). OWNER-3 has "Needs: proposal approval". Probe P-1 confirms that FAILED is right |
| A00-1-005 (P1) A3 status inconsistent | FIXED | **Yes** | A3 is "Local VERIFIED; Vercel BLOCKED" in §2 line 24. §1 counts A3 as "verified locally but still need a Vercel … run", and §9 lists the "Vercel halves of A3 and A8". The assumption's wording drops "(canvaskit-wasm)" and adds "with the reference fonts", which does not mislead |
| A00-1-006 (P1) Stale evidence | FIXED | **Yes** | `00-git.txt`: HEAD `d890776`, only `docs-evidence-v2/` untracked. My run at `b86c7c3` reproduces every scripted file (P-3). The only commit after `d890776` that touches code adds the `og-proposal` route, which changes only the build route list |
| A00-1-007 (P2) Proposal 0002 understated | FIXED | **Yes**, against its resolution condition | The Problem cites the full scan (`03-engines.txt`: 16 / 4 / 3 / 3 / 1 / 1), including `undici@8.10.2`. PHASES Phase 1 task 1 is added. The Vercel claim is removed. A further omission (TESTING §4) is new finding A00-2-001 |
| A00-1-008 (P2) Proposal 0001 inconsistent | FIXED | **Yes** | One option (A); no `theme-boot.ts` module; `Changes` lists SECURITY §2.1, DESIGN §6.2 and TESTING §5, each with text. Targets verified in §2.3 |
| A00-1-009 (P2) Proposal 0003 misses "core settings" | FIXED | **Yes** | `Changes` lists ARCHITECTURE §2 and PHASES Phase 1 task 3 (see O-5 on wording) |
| A00-1-010 (P2) Owner steps would not work | FIXED | **Yes**, for the three defects found | Option B now runs one step after another in two terminals. The Vercel import (step 4) comes before the branch push (step 6). Share-link cookies are replaced by turning Vercel Authentication off (SECURITY §6 turns it back on in Phase 14). New defects in the same steps: A00-2-003 |
| A00-1-011 (P2) WebKit job could pass without sync | FIXED | **Yes** | `webkit-check.mjs:6` waits for `astro-island` without `[ssr]` on both pages. `:20` confirms page 1 changed before timing page 2. Probe P-2 makes it exit 1. It is still not run in WebKit (BLOCKED OWNER-2) |
| A00-1-012 (P2) A3 tested narrowly | FIXED | **Yes** | §7 item 8, `19-og-families.txt` and its PNGs (byte-identical in my run), and proposal 0004 (with its own gaps: A00-2-002) |
| A00-1-013 (P2) Code copies under `docs/evidence` | FIXED | **Yes** | `docs/evidence/phase-00/spike/**` is deleted, and the helpers are now `v1-superseded/scripts/*.txt`. There is no code file on the phase branch (§4) |
| A00-1-014 (P2) Paraphrased commands, missing exit codes | FIXED "for current evidence" | **No, not fully. Still OPEN (P2)** | The script-produced files are fixed (`run()` records `$ <exact command>` and `exit=<code>` with `pipefail`). Two current files still fail TESTING §7. (1) `spike-v2/23-og-proposal-0004.txt:1` is `$ npx astro build (spike with src/pages/og-proposal, the proposal 0004 layout)`, which is a description, not a command. Its output is filtered by a command that is not recorded: a plain `npx astro build` also prints `[types]`, `[vite]` and `/og/schemes/cgss.png/` lines, as `07` shows. No script produces the file, and `phase0-evidence.sh` deletes it. (2) `00-environment.txt` (README: "Current"; report §3 row 1: exit "0") records an exit code only for `cat .phase`, and line 26 is `$ source env (Node 22.23.2 from npm package node-linux-x64 …)`. Report §1 and the evidence README both say every file lists the exact commands and their exit codes. **Resolved when** both files record the real commands and exit codes, or the two statements are corrected |
| A00-1-015 (P2) §7 item 5 did not reproduce | FIXED | **Yes** | §7 item 5 now says it did not reproduce. My run of `22-fresh-install.txt` is byte-identical (`added 856 packages in 1m`, `linux-x64`, `lockfile identical to committed`) |
| A00-1-016 (P2) Stop notes and report accuracy | FIXED | **Partly. Still OPEN (P2)** | Fixed: OWNER-3 and OWNER-4 exist with the right "Needs"; the ids no longer look like severities; §1 counts match §2; there is a Data questions section (§8). Not fixed: (a) the Builder field is still "Claude (Cowork), acting as the builder under AGENTS.md", while the template asks for "tool and model, as reported by the tool". This bullet was part of the finding's evidence. (b) OWNER-3's "Options: approve, reject or amend each proposal" gives no consequence for each option (AGENTS §5), for example that rejecting 0001 leaves A1 FAILED with no approved proposal, so Phase 0 cannot exit. **Resolved when** both are corrected |

## 7. Observations (not findings)

- **O-1 Reviewer independence (unchanged).** This audit again ran as a sub-agent. The session id in every builder commit trailer (`session_019PodNsSh9D2kStA8ALZJU9`) is the session this reviewer runs in, and my scratchpad directory holds the builder's own files (for example `astro.config.variant.mjs` and `node-linux-x64-22.23.2.tgz`). I did not see the builder's conversation. The repository's `CLAUDE.md` tells any Claude session "You are the BUILDER". I followed AUDIT.md as instructed. Report §5 discloses this limit. An independent exit audit (Gemini CLI or a fresh session) is still advisable.
- **O-2 Exit codes that do not mean pass or fail.** `browser-spike.mjs` and `noworker-check.mjs` always exit 0. For example, `18:13` is `exit=0` although the output says `"crossTabMs": "no sync within 1000 ms"`, and `17:25` is `exit=0` on an `error: …` result. Their pass/fail meaning is in the quoted values, which the report quotes correctly. Only `webkit-check.mjs` and `check-versions.mjs` signal failure through their exit code.
- **O-3 The default OG image uses a fallback title family.** `src/pages/og/[...route].ts:4` asks for the family `"Newsreader"`, but the registered name is `Newsreader Medium`. So `13-og-default-families.png` renders its title through the silent fallback that proposal 0004 describes. The fallback happens to be the right font because it is loaded first. The report does not claim otherwise.
- **O-4 Evidence commit versus audited spike commit.** The evidence ran at `d890776`. `b86c7c3` adds only `og-proposal` routes and an asset, and my run at `b86c7c3` shows no substantive change (P-3).
- **O-5 Proposal 0003 wording.** ARCHITECTURE §2 line 63 says "only the core settings and `security.csp`" and has no list. The proposal's "add … to the list of core settings" in effect changes only PHASES Phase 1 task 3. That is workable, but the ARCHITECTURE §2 change is not exact text.
- **O-6 Sample text in the proposal 0004 images.** `schemes/long` uses "Pradhan Mantri Formalisation of Micro Food Processing Enterprises (PMFME)" and "35% capital subsidy up to ₹10 lakh". The reference data has `name:"PM Formalisation of Micro Food Processing Enterprises"` (54 characters, which the proposed rule would draw at 64 px) and `amt:"35% subsidy, up to ₹10 lakh"`. The sample title has 73 characters, the same length as the longest real name ("Institution's Innovation Council & National Innovation and Startup Policy"), so it is a fair length test. The images do not ship. Four real names are over 60 characters.
- **O-7 The wordmark's origin is not recorded.** No command in the spike or the evidence produces `og-assets/wordmark.png`. Its PNG chunks (`IHDR`, `IDAT`, `IEND` only) differ from the canvaskit outputs (which have `sBIT` and `sRGB`). My render supports the claimed weight, size and colour. Its glyph span is about 7 px narrower, so the letter-spacing or the renderer differed slightly. Phase 8 should regenerate the file with a recorded command if 0004 is approved.
- **O-8 Carried from audit 1.** O-2 (`@img/sharp-wasm32` extraneous), O-5 (the meta is rendered after all author head content, which my `before meta` results confirm), O-7 (worker path), O-10 (spike `.gitignore`: unchanged) and O-11 (astro-og-canvas's remote font default) still apply.
- **O-9 Escalation clock.** This is round 2 with an open P0. AUDIT §5 requires escalation to the owner after the third round with open P0/P1. A00-1-001 can only be closed by the owner.

## 8. Result

Final worktree status, run at the end of the audit:

```
$ git -C /home/claude/reaudit-00-spike status --short
$ git -C /home/claude/reaudit-00 status --short
?? docs/audits/phase-00-audit-2.md
```

The spike worktree was restored with `git checkout -- . && git clean -fdx`. `node_modules/`, `dist/` and my regenerated `docs-evidence-v2/` are gone, and `diff -r` shows that its `docs-evidence-v2/` is again identical to `docs/evidence/phase-00/spike-v2/`. No preview server is running. The only new path in the report worktree is this file.

Open findings:
- P0: A00-1-001.
- P2: A00-1-014, A00-1-016, A00-2-001, A00-2-002, A00-2-003, A00-2-004.

**Phase 0's own exit, independent of this audit.** Phase 0 still cannot exit:
- OWNER-1 and OWNER-2 are pending: A5, A9, the Vercel halves of A3 and A8, and A7 in WebKit.
- OWNER-3 is pending: A1 is FAILED and needs an approved proposal 0001.
- OWNER-4 is pending: A00-1-001.

The report represents all of these as BLOCKED correctly, apart from the stop-note defects in A00-2-003 and A00-1-016.

Open P0: 1 · Open P1: 0 · Open P2: 6 — **FAIL** against AUDIT §5.
