# Phase 0 evidence

| Folder / file | What it is | Status |
|---|---|---|
| `00-session-start.txt` | The AGENTS §1 start-of-session commands (`cat .phase`, `git status --short`, `git log --oneline -5`, `node -v`, plus `npm -v`, the spike's HEAD, `git --version` and the preinstalled browsers: Chromium only, no WebKit), recorded during revision 3 with each command and its `exit=` line. The working tree it shows has the revision-3 evidence changes in progress. | Current |
| `spike-v2/` | **All Phase 0 claims**, produced by one run of `phase0-evidence.sh` on branch `spike/phase-00` at commit `c5920c9` (the script and every file it runs are in that commit; the output is committed there as `49e58d3` and copied here byte for byte). Each file lists the exact commands, each followed by `exit=<code>`. PNG files are images the run produced. | **Current — the report quotes only this** |
| `spike-v2/00-environment.txt` | The environment: the env file that puts Node 22.23.2 first on `PATH`, `which node`, `node -v`, `npm -v`, architecture, OS and the Chromium version | Current |
| `spike-v2/23-og-proposal-*` | The proposal 0004 layout, built by the same run (`07` builds it; `23-og-proposal-0004.txt` lists the title lengths and sizes, checks each PNG and copies it) | Current |
| `v1-superseded/` | The first evidence set (before audit 1), and the first start-of-session record (`00-environment.txt`, which paraphrased one command and had only one exit code) | Superseded: see below |

`00-git.txt` shows the committed evidence files as deleted or modified: the script empties `docs-evidence-v2/` before it starts, and that folder is committed on the spike branch. No other file in the spike was changed (`00-git.txt`, `99-git-after.txt`).

Why v1 is superseded (audits `docs/audits/phase-00-audit-1.md` and `-2.md`):
- some files paraphrase the command that ran, and one (`spike/21-A10-astro-zod.txt`) shows a command (`grep -c "Demo"`) that did not produce the line under it (A00-1-003);
- several files were produced before later changes to the spike, so their output no longer matches the committed spike (A00-1-006);
- exit codes are missing from several files (A00-1-014);
- the spike sources copied here as code would have been picked up by Phase 1's type-check and lint (A00-1-013); they were removed, and the two helper scripts were renamed to `.txt`.

The first `spike-v2` run (spike `d890776`, used by report revision 2) was replaced by the run at `c5920c9`. The script gained the environment and proposal 0004 steps, and the proposal 0004 prototype gained real-title probes. The earlier run is still in the spike branch history (`0a3c73e`).

v1 is kept, unmodified apart from the moves and renames above, so the audit trail stays complete. Do not quote it.

The spike code itself lives only on the throwaway branch `spike/phase-00`.
