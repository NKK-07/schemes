# spike/phase-00 — throwaway branch, never merged

Minimal Astro project that exercises the assumptions in ARCHITECTURE §11 (A1–A10).
It installs the whole locked package set of ARCHITECTURE §2 at once (A6).
`installCommand` in vercel.json is `npm ci --ignore-scripts` so a Vercel preview build also tests A8.
Evidence from the local runs is in `docs-evidence/`; the Phase 0 report is on branch `phase/00-recon`.

`.github/workflows/spike-webkit.yml` runs `webkit-check.mjs` on GitHub Actions when this branch is pushed:
it installs WebKit (not available in the builder's sandbox) and checks A7 (cross-tab sync) and CSP
violations in WebKit and Chromium. The job fails if either browser does not sync within 1 s or reports a CSP violation.
