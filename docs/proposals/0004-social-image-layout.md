# Proposal 0004 — Fit the social-image layout to astro-og-canvas

| | |
|---|---|
| Author | builder |
| Date | 2026-09-19 |
| Changes | DESIGN §5; ARCHITECTURE §8.4 (one sentence); new file `public/og/wordmark.png` in the Phase 8 file list (PHASES Phase 8 task 3) |
| Triggered by | Audit 1 finding A00-1-012 (assumption A3 tested too narrowly) |
| Status | Open |

## Problem
DESIGN §5 asks for four text runs in three families: a mono label at the top, the title (64 px, dropping to 52 px after two lines), the amount in mono in the accent colour, and "{where} · {status}" in sans. `astro-og-canvas` 0.13.2 (locked) draws only a `title` and a `description`, each with one font setting, plus an optional `logo` image, background and border (reviewer's reading of its types and source, audit 1 A00-1-012).

Font families must be named exactly as the files register them. A wrong name falls back silently to the first loaded font:
- `docs/evidence/phase-00/spike-v2/19-og-families.txt`: the build reports `Loaded 3 font families: Newsreader Medium, IBM Plex Sans, IBM Plex Mono Medium`.
- `19-og-exact-mono.png` (description family `IBM Plex Mono Medium`) renders the description in mono; `19-og-wrong-mono.png` (family `IBM Plex Mono`) renders it in the Newsreader serif, with no error.

## Proposed change
Replace DESIGN §5 with:

> - 1200×630 PNG, drawn by `astro-og-canvas` with only the options it has: `bgGradient` `[[239,234,223]]` (`#EFEADF`), `padding` 64, `border` 8 px `[91,63,160]` (`#5B3FA0`) on `inline-start`.
> - `logo`: `public/og/wordmark.png`, the words "FOUNDER'S FIELD GUIDE" in IBM Plex Mono 600, 26 px, letter-spacing .12em, `#55546A`, transparent background, 404×34 px, `size: [404]`. (Candidate file: `docs/proposals/assets/0004-og-wordmark.png`.)
> - `title`: Newsreader 500 (`families: ["Newsreader Medium"]`), 64 px, or 52 px when the title is longer than 60 characters; `#1D1F2B`; `lineHeight` 1.1.
> - `description`: IBM Plex Sans 400 (`families: ["IBM Plex Sans"]`), 28 px, `#55546A`. Text: schemes "{amount} · {All India | region} · {status label}"; regions "{n} state scheme(s) + every central scheme"; default "Government schemes for Indian startups".
> - `fonts`: exactly `newsreader-500.v1.woff2` and `plexsans-400.v1.woff2` from `public/fonts/`. Family names must be exactly `Newsreader Medium` and `IBM Plex Sans` (a wrong name falls back silently). The Phase 8 report includes the three sample images below from the real build.
> - Light theme only.

ARCHITECTURE §8.4: add "Layout and font names exactly as DESIGN §5; the wordmark image is `public/og/wordmark.png`."

## Evidence that it works
Built in the spike (`spike-v2/23-og-proposal-0004.txt`, exit 0): `23-og-proposal-cgss.png`, `23-og-proposal-long.png` (a title longer than 60 characters, drawn at 52 px) and `23-og-proposal-region.png`, each 1200×630.

## Options
| Option | Consequence | Criteria affected |
|---|---|---|
| A. Simplify DESIGN §5 to title + description + wordmark logo (recommended) | Works with the locked package; loses the separate accent-coloured mono amount | AC-SEO-09 |
| B. Replace astro-og-canvas with satori + resvg | Full layout control; two new packages (ADR), TTF fonts needed (satori does not read woff2), new spike | AC-SEO-09, ARCHITECTURE §2 |
| C. Keep DESIGN §5 as written | Cannot be built with the locked stack; Phase 8 would stop | AC-SEO-09 |

## Recommendation
A.

## Impact
Phase 8 only. The wordmark file is added to `public/og/` from `docs/proposals/assets/` when this is approved.

---
Approval: the owner applies the change to the locked file(s), marks this proposal Approved, and merges. Until then, the current text applies.
