# Proposal 0001 — Hash the theme boot script explicitly in the CSP

| | |
|---|---|
| Author | builder |
| Date | 2026-09-19 |
| Changes | SECURITY §2.1; DESIGN §6.2; TESTING §4 (AC-SEC-02 check) |
| Triggered by | Phase 0, assumption A1 |
| Status | Open |

## Problem
SECURITY §2.1 says: "Astro adds a `sha256-…` hash for every inline script and style it emits (island hydration, the theme boot script in `Head.astro`)." Only the first half is true.

- Astro 7.3.3 hashes its own island-hydration scripts and processed scripts/styles, but **not `is:inline` scripts**. The theme boot script must be `is:inline` (it has to run before first paint; a bundled `<script>` becomes a deferred module).
- Evidence: `docs/evidence/phase-00/spike/29-A1-inline-hash-analysis.txt` (script `csp-inline-check.py`): with the config exactly as SECURITY §2.1, `dist/index.html` has the CSP meta tag at offset 441 and three inline scripts; the 203-byte boot script at offset 221 is **NOT LISTED**, the 316- and 4380-byte hydration scripts are listed. With proposal A applied, all are listed.
- The boot script still ran in the browser (`htmlHasJsClass: true`, zero violations, `15-browser-spike-A1-A2-A7.txt`) only because Astro emits it **before** the CSP `<meta>` tag, and a meta policy does not govern elements that precede it. Relying on that ordering is fragile, and AC-SEC-02.2 ("the hash of every inline executable `<script>` … listed") fails.

## Proposed change
SECURITY §2.1, in the `astro.config.mjs` block:

```js
scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"], hashes: [THEME_BOOT_HASH] },
```

and add below the block:

> The theme boot script is `is:inline`, which Astro does not hash. Its exact text lives in one module (`src/lib/theme-boot.ts`, exporting `THEME_BOOT` and `THEME_BOOT_HASH`, the base64 SHA-256 of the text). `astro.config.mjs` imports `THEME_BOOT_HASH` into `scriptDirective.hashes`; `Head.astro` renders the text. The AC-SEC-02 build check fails if any inline executable script's hash is missing, wherever it sits in the document.

DESIGN §6.2: replace "one inline script (hashed by the Astro CSP)" with "one inline script (`is:inline`, hashed through `scriptDirective.hashes`, SECURITY §2.1)".

How `Head.astro` renders the constant without `set:html` must be settled: an Astro `<script is:inline>` body cannot interpolate an expression. Two ways:
- **A (recommended):** the literal script text is written once in `Head.astro`; `astro.config.mjs` holds the literal hash string; a unit test (`AC-SEC-02 theme boot hash`) reads `Head.astro`, extracts the script, and asserts the hash equals the configured one; verify-dist also checks every page. One text, one hash, two independent checks.
- **B:** a build-time integration injects the script with `injectScript("head-inline", THEME_BOOT)` and adds the hash. Fewer hand-maintained values, but injected head-inline scripts may also be emitted before the meta tag and need the same check.

## Options
| Option | Consequence | Criteria affected |
|---|---|---|
| A. Literal hash in config + test (recommended) | Proven in the spike: with `hashes: ["sha256-D0X/RudTxbWCIEUFjAmwaX2l1yKdJadWf7FFW3+mpZE="]` all three inline scripts are listed and the browser shows zero violations (`17-A1-manual-hash-variant.txt`, `18-browser-spike-variant.txt`) | AC-SEC-02, AC-FUNC-30, AC-OPS-01 |
| B. `injectScript` integration | Not yet tested | same |
| C. External blocking `/theme-boot.js` | No hash needed, but one more render-blocking request on every first view | AC-PERF-01 risk |
| D. Leave it (rely on ordering) | Fails AC-SEC-02.2; breaks silently if Astro moves the meta tag | AC-SEC-02 |

## Recommendation
A.

## Impact
Phase 4 (theme boot script), Phase 9 (AC-SEC-02 check). No fixture changes.

---
Approval: the owner applies the change to the locked file(s), marks this proposal Approved, and merges. Until then, the current text applies.
