# Founder's Field Guide — AI execution specification

This folder is the contract for rebuilding **founders-field-guide.vercel.app** as a production-grade static site, with AI agents writing most of the code. It is meant to be copied into the root of the new repository **before** any code exists.

Nothing here is code. The agents build the code from it, phase by phase, and prove every claim.

## What each file is for

| File | Question it answers | Who may change it |
|---|---|---|
| `SPEC.md` | What must the site do? (source of truth, open decisions D1–D4) | Owner |
| `ACCEPTANCE.md` | How do we know it does it? (111 checkable criteria, each with a proof method) | Owner |
| `SECURITY.md` | Headers, CSP, firewall, AI crawlers, supply chain, incident runbook | Owner |
| `ARCHITECTURE.md` | Locked stack, exact versions, folder structure, data schema, routes, client boundaries, SEO rules | Owner |
| `DESIGN.md` | Tokens, fonts, layout, the anatomy of every page | Owner |
| `TESTING.md` | Tools, commands, test layout, budgets, evidence rules, CI | Owner |
| `AGENTS.md` | How AI agents behave: the UNVERIFIED rule, forbidden shortcuts, stop conditions, git, conventions | Owner |
| `AUDIT.md` | How the reviewer AI attacks each phase, severities, exit rule, reviewer prompts | Owner |
| `PHASES.md` | The 15 phases, what each closes, and a copy-paste builder prompt for each | Owner |
| `CLAUDE.md`, `GEMINI.md` | One-line pointers so Claude Code loads `AGENTS.md` and Gemini CLI loads `AUDIT.md` | Owner |
| `templates/` | Phase report, audit report, ADR, proposal, manual check | Owner |
| `reference/` | Read-only inputs: legacy data, approved CSS, screenshots, prototype HTML, font files, the PDF | Owner |
| `tests/fixtures/` | Frozen golden values the tests must read: counts, URLs, filter results, finder results, search, invalid records | Owner |

If two documents disagree, this order wins: SPEC → ACCEPTANCE → SECURITY → ARCHITECTURE → DESIGN → TESTING → PHASES. Agents stop and report conflicts; they never pick.

## Lifecycle

```
SPEC → RECON → ARCHITECTURE LOCK → DATA CONTRACT → IMPLEMENT → TEST → ADVERSARIAL AUDIT → FIX → RE-AUDIT → SHIP
        (0)          (1)               (2)          (3–12, each audited)        (13)                 (14)
```

## How to start

1. **Decide D1–D4** in `SPEC.md` §3 (visual direction, AI crawlers, CI, analytics). Recommended: Editorial, Allow, Yes, On. Phase 0 cannot finish without them. D1 = Editorial needs no further design work; any other direction needs a design amendment first (DESIGN §1).
2. **Create a new GitHub repository** (or a new branch in the existing one) and copy this whole folder into its root. Commit it to `main` as `spec: v1.0`.
3. **Keep the current site live.** The existing single-page site stays on Vercel until Phase 14. Old `/#/…` links keep working after the switch (SPEC FR-17).
4. **Phase 0:** open Claude Code in the repository and paste the Phase 0 prompt from `PHASES.md` §4.
5. **After every phase:** open the reviewer (Gemini CLI, or a new Claude session) in a separate worktree and paste the prompt from `AUDIT.md` §6.1. Loop fix → re-audit until the audit says PASS. Then merge the phase branch yourself.
6. **Phase 14** is where you merge to `main`, configure the Vercel firewall, and connect Search Console. The agents check; you click.

## What you (the owner) do, by phase

| Phase | Your part |
|---|---|
| Before 0 | Fill in D1–D4. Copy the pack into the repo. |
| 0 | Push the `spike/phase-00` branch when asked, and paste the Vercel preview URL back. Approve or reject proposals for any failed assumption. |
| 1 | Review and merge ADRs 0001–0008. |
| 4, 5, 6 | Look at the screenshots next to the approved ones and sign off (AC-DES-02). |
| 11 | Do the screen-reader and notched-iPhone checks if the agent can't. |
| 12 | Approve visual baselines. If D3 = Yes: add the `VERCEL_DEPLOY_HOOK_URL` secret and push. |
| 13 | Run two independent reviewers; decide every P2 finding. |
| 14 | Merge, configure the firewall (SECURITY §3), 2FA and branch protection (SECURITY §6), Search Console, real-phone check, rollback rehearsal; after 7 days, record usage and switch Bot Protection to Challenge. |
| Every phase | Merge only after a clean audit. Never merge a report that has PASS without evidence. |

## The rules that matter most

- **UNVERIFIED rule** (AGENTS §3): nothing is "done" because code exists. Every criterion is PASS with quoted evidence from that session, or it is UNVERIFIED.
- **Forbidden shortcuts** (AGENTS §4): no editing the rules, no weakened tests, no new packages, no CSP workarounds, no invented facts, no server code.
- **Stop, don't guess** (AGENTS §5): conflicts, failed assumptions and missing decisions come back to you as BLOCKED notes with options.
- **Adversarial audit** (AUDIT.md): a second AI that may not touch the code tries to prove each phase wrong. The phase exits only with 0 P0 and 0 P1 findings.

## How this pack was checked (and what is still UNVERIFIED)

Checked on 18–19 Sep 2026, by computation rather than reading:
- All 115 records pass the Zod schema in ARCHITECTURE §4.1; each of the 8 invalid fixtures fails the check its README names.
- Every indexable title (36–70 characters) and description (70–160) produced by ARCHITECTURE §8.1 was generated from the data; all are unique.
- Every contrast pair in DESIGN §2.3 passes in both themes (lowest 3.17:1).
- The golden fixtures were recomputed from the legacy data by an independent reviewer using the SPEC §7 rules, and match.
- The pack itself went through the same loop it prescribes: an adversarial review found 44 problems across three rounds (8 of them blockers), and all were fixed.

**UNVERIFIED until Phase 0:** that the locked stack actually behaves as assumed (ARCHITECTURE §11, A1–A10), for example Astro's CSP hashing with Preact islands, Pagefind under that CSP, and social-image rendering with the font files. No application code has been written or run.

## Known limits of this pack

- The scheme data is as researched on 18 Sep 2026. Updating facts is a data change the owner makes with sources (AGENTS §6); it may require regenerating the golden fixtures.
- Vercel Hobby is for non-commercial use. If the guide becomes commercial, a paid plan is needed (SECURITY §7).
- Vercel firewall limits on Hobby can change; Phase 14 records what the dashboard shows on the day (SECURITY §3).
- Package versions were current on 18 Sep 2026. Phase 0 re-checks them; any change goes through an ADR.
