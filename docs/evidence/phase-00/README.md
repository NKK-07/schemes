# Phase 0 evidence

| Folder / file | What it is | Status |
|---|---|---|
| `00-environment.txt` | Start-of-session record (`cat .phase`, git, Node, npm, OS, browsers) | Current |
| `spike-v2/` | **All Phase 0 claims**, produced by one run of `phase0-evidence.sh` on branch `spike/phase-00` at commit `d890776` (the script and every file it runs are in that commit). Each file lists the exact commands, each followed by `exit=<code>`. PNG files are images the run produced. | **Current — the report quotes only this** |
| `spike-v2/23-og-proposal-*` | Social-image layout for proposal 0004, built separately at spike commit `b86c7c3`; the command and exit code are in `23-og-proposal-0004.txt` | Current |
| `v1-superseded/` | The first evidence set (before audit 1) | Superseded: see below |

Why v1 is superseded (audit `docs/audits/phase-00-audit-1.md`):
- some files paraphrase the command that ran, and one (`spike/21-A10-astro-zod.txt`) shows a command (`grep -c "Demo"`) that did not produce the line under it (A00-1-003);
- several files were produced before later changes to the spike, so their output no longer matches the committed spike (A00-1-006);
- exit codes are missing from several files (A00-1-014);
- the spike sources copied here as code would have been picked up by Phase 1's type-check and lint (A00-1-013); they were removed, and the two helper scripts were renamed to `.txt`.

v1 is kept, unmodified apart from the moves and renames above, so the audit trail stays complete. Do not quote it.

The spike code itself lives only on the throwaway branch `spike/phase-00`.
