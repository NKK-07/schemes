# Proposal 0001 — Hash the theme boot script explicitly in the CSP

| | |
|---|---|
| Author | builder |
| Date | 2026-09-19 (revised after audit 1, finding A00-1-008) |
| Changes | SECURITY §2.1 (config block and the paragraph under it); DESIGN §6.2 (first bullet); TESTING §5 (one unit test added to the layout) |
| Triggered by | Phase 0, assumption A1 (FAILED as specified) |
| Status | Approved by the owner in chat, 20 Sep 2026; applied to the locked documents in branch proposals/0001-0004-approved |

## Problem
SECURITY §2.1 says Astro "adds a `sha256-…` hash for every inline script and style it emits (island hydration, the theme boot script in `Head.astro`)". The second half is false.

- Astro 7.3.3 hashes the scripts and styles it processes or bundles, including island hydration, but **not `is:inline` scripts**. The theme boot script has to be `is:inline`: a bundled `<script>` becomes a deferred module and would run after first paint (DESIGN §6.2, AC-FUNC-30).
- Evidence (`docs/evidence/phase-00/spike-v2/05-csp-security21.txt`, config exactly as SECURITY §2.1): every page reports the 203-byte boot script as not listed, for example `dist/index.html: meta=yes at 441, inline blocks=4, not listed=['script@221(203B)']`, `TOTAL inline blocks not listed: 5`.
- The script still ran in the browser (`06-browser-security21.txt`: `"htmlHasJsClass": true`, `"cspViolations": []`) only because Astro renders the CSP `<meta>` at its head-render position, after the author's own head content, and a meta policy does not govern elements that come before it. That is an accident of ordering, and AC-SEC-02.2 fails.

## Proposed change
SECURITY §2.1, `astro.config.mjs` block — replace the `scriptDirective` line with:

```js
scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"], hashes: ["sha256-<hash of the theme boot script>"] },
```

SECURITY §2.1 — replace the first bullet under the block with:

> Astro adds a `sha256-…` hash for every inline script and style it processes (for example island hydration). It does **not** hash `is:inline` scripts. The one `is:inline` script, the theme boot script (DESIGN §6.2), is written once, literally, in `Head.astro`, and its SHA-256 is written literally in `scriptDirective.hashes`. The unit test `AC-SEC-02 theme boot script hash matches the config` reads the script text from `Head.astro` and checks its hash against `astro.config.mjs`; the AC-SEC-02 build check separately verifies every inline script on every page, wherever it sits in the document. A change to the script changes the hash in the same commit.

DESIGN §6.2, first bullet — replace "one inline script (hashed by the Astro CSP)" with "one `is:inline` script (hashed through `scriptDirective.hashes`, SECURITY §2.1)".

TESTING §5 — add under `tests/unit/`: `theme-boot.test.ts   AC-SEC-02 (the boot script's hash equals the configured hash)`.

## Options
| Option | Consequence | Criteria affected |
|---|---|---|
| A. Literal script + literal hash + unit test + build check (recommended) | Tested: with the hash configured, `08-csp-committed.txt` reports `not listed=none` on all five pages, `TOTAL inline blocks not listed: 0`, and `09-browser-committed.txt` shows `"cspViolations": []` | AC-SEC-02, AC-FUNC-30, AC-OPS-01 |
| B. Inject the script from an integration (`injectScript("head-inline", …)`) and compute the hash in code | Fewer hand-kept values; not tested | same |
| C. External blocking `/theme-boot.js` | No hash, but one more render-blocking request on every first view | AC-PERF-01 risk |
| D. Keep relying on element order | Fails AC-SEC-02.2; breaks silently if Astro moves the meta tag | AC-SEC-02 |

## Recommendation
A.

## Impact
Phase 4 (writes the boot script), Phase 9 (AC-SEC-02 check). No fixture changes.

---
Approval: the owner applies the change to the locked file(s), marks this proposal Approved, and merges. Until then, the current text applies.
