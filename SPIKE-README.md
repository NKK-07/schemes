# spike/phase-00 — throwaway branch, never merged

Minimal Astro project that exercises the assumptions in ARCHITECTURE §11 (A1–A10).
It installs the whole locked package set of ARCHITECTURE §2 at once (A6).
`installCommand` in vercel.json is `npm ci --ignore-scripts` so a Vercel preview build also tests A8.
Evidence from the local runs is in `docs-evidence/`; the Phase 0 report is on branch `phase/00-recon`.
