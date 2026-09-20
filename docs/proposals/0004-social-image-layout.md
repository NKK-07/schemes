# Proposal 0004 — Fit the social-image layout to astro-og-canvas

| | |
|---|---|
| Author | builder |
| Date | 2026-09-19 (revised after audit 2, finding A00-2-002) |
| Changes | DESIGN §5 (replaced); ARCHITECTURE §3 (one line added under `src/`); ARCHITECTURE §8.4 (two sentences added); PHASES Phase 8 task 3 (replaced) |
| Triggered by | Audit 1 finding A00-1-012 (assumption A3 tested too narrowly) |
| Status | Approved by the owner in chat, 20 Sep 2026; applied to the locked documents in branch proposals/0001-0004-approved |

## Problem
DESIGN §5 asks for four text runs in three families: a mono label at the top, the title (64 px, dropping to 52 px after two lines, max 3 lines), the amount in mono in the accent colour, and "{where} · {status}" in sans. `astro-og-canvas` 0.13.2 (locked) draws only a `title` and a `description`, each with one font setting, plus an optional `logo` image, a background and a border (reviewer's reading of its types and source, audit 1 A00-1-012). It cannot measure how many lines a title will take before drawing it, and it has no line limit.

Font families must be named exactly as the files register them. A wrong name falls back silently to the first loaded font:
- `docs/evidence/phase-00/spike-v2/19-og-families.txt`: the build reports `Loaded 3 font families:` / `Newsreader Medium, IBM Plex Sans, IBM Plex Mono Medium`.
- `19-og-exact-mono.png` (description family `IBM Plex Mono Medium`) renders the description in mono; `19-og-wrong-mono.png` (family `IBM Plex Mono`) renders it in the Newsreader serif, with no error.

## Proposed change

**DESIGN §5** — replace the five bullets with:

> - 1200×630 PNG, drawn by `astro-og-canvas` with only the options it has: `bgGradient` `[[239,234,223]]` (`#EFEADF`), `padding` 64, `border` 8 px `[91,63,160]` (`#5B3FA0`) on `inline-start` (the left edge).
> - Top (`logo`): the image `src/assets/og-wordmark.png` — "FOUNDER'S FIELD GUIDE" in IBM Plex Mono 600, 26 px, letter-spacing .12em, `#55546A`, transparent background, 404×34 px — drawn at `size: [404]`. It is read at build time and is not published.
> - Middle (`title`): the page's `og:title` (ARCHITECTURE §8.1) in Newsreader 500 (`families: ["Newsreader Medium"]`), `#1D1F2B`, `lineHeight` 1.1; 64px, or 52px when the title is longer than 60 characters; max 3 lines: the build fails if a social-image title is longer than 100 characters.
> - Bottom (`description`): IBM Plex Sans 400 (`families: ["IBM Plex Sans"]`), 28px, `#55546A`. For schemes, "{amount} · {All India | region} · {status label}"; for regions, "{n} state schemes + every central scheme"; default image: "Government schemes for Indian startups".
> - Fonts: exactly `newsreader-500.v1.woff2` and `plexsans-400.v1.woff2` from `public/fonts/`, with the family names exactly `Newsreader Medium` and `IBM Plex Sans` (a wrong name falls back silently). Light theme only.

**ARCHITECTURE §3** — in the `src/` block, add this line directly above `│  ├─ content.config.ts`:

> `│  ├─ assets/og-wordmark.png     social-image wordmark (DESIGN §5); read by pages/og at build, never published`

**ARCHITECTURE §8.4** — add after the existing sentence:

> Layout, sizes and font family names exactly as DESIGN §5; the wordmark is `src/assets/og-wordmark.png`. The route throws at build, naming the page, when a title is longer than 100 characters.

**PHASES Phase 8 task 3** — replace with:

> 3. `src/pages/og/[...route].ts` with `astro-og-canvas` (DESIGN §5, including the exact font family names and the 100-character title limit): one image per scheme, per region, and the default. Add `src/assets/og-wordmark.png`, copied byte for byte from `docs/proposals/assets/0004-og-wordmark.png`.

### Every difference from the current DESIGN §5

| Current text | Proposed | Why |
|---|---|---|
| "Top: 'FOUNDER'S FIELD GUIDE' in IBM Plex Mono 600, 26px, `#55546A`" (text) | The same words, font, size and colour as an image (`logo`) | The package draws only two text runs |
| "reduce to 52px if more than 2 lines" | 52 px when the title is longer than 60 characters | The package cannot count lines before drawing. With the probes below, 60 characters is two lines at 64 px, and titles of 62–73 characters are two lines at 52 px |
| "max 3 lines" | Kept, and enforced: the build fails above 100 characters | The package has no line limit. At 52 px, 92- and 122-character synthetic titles both draw in 3 lines; the longest real scheme name is 73 characters and the longest region title 70 |
| "`{amount}` in Plex Mono 500 30px `#5B3FA0`" (its own run) | The amount starts the description, in Plex Sans 28px `#55546A` | Only one description run. The accent colour stays on the left bar only |
| "'{All India \| region} · {status label}' in Plex Sans 26px" | Same text after the amount, 28px | The description is now the only line under the title. It could stay at 26px if the owner prefers; the images below use 28px |
| "{n} state schemes + every central scheme" | **Unchanged** | See "Not changed" below |
| "Fonts: the same files as §3.1" | Only the two files the image uses | No mono text is drawn any more |

### Not changed by this proposal
The region line keeps its current wording, "{n} state schemes + every central scheme". With the reference data it reads "1 state schemes" on 28 regions' images and "0 state schemes" on one (`23-og-proposal-DH.png`, `23-og-proposal-RJ.png`). DESIGN §4 uses "{n} scheme(s)" for the same count. If the owner wants a different wording, it can be added to DESIGN §5 when approving; the builder does not write new copy (AGENTS §8).

### Effect on AC-SEO-09
Nothing new is published: the wordmark is read from `src/assets/` at build. In the spike, where the logo sits outside `public/`, `find dist -iname '*wordmark*' | wc -l` prints `0` (`23-og-proposal-0004.txt`). So every PNG under `dist/og/` stays a 1200×630 social image, as AC-SEO-09.2 expects.

## Evidence that it works
All from one run of `phase0-evidence.sh` at spike `c5920c9` (`docs/evidence/phase-00/spike-v2/23-og-proposal-0004.txt`, each step exit 0). Each image is 1200×630 (`True (1200, 630)`). The size column is printed by the run; the line count is the builder's visual check of each image.

| Image `23-og-proposal-…` | Title | Characters | Size | Lines |
|---|---|---|---|---|
| `cgss.png` | Credit Guarantee Scheme for Startups | 36 | 64 px | 2 |
| `sipp.png` | Startup IP Protection (SIPP): patent & trademark fee rebates (real name at the 60-character boundary) | 60 | 64 px | 2 |
| `DH.png` | Startup Schemes in Dadra & Nagar Haveli and Daman & Diu (2026) (real region title) | 62 | 52 px | 2 |
| `KL.png` | Startup Schemes in Kerala (2026): State Grants, Incentives & Policy | 67 | 52 px | 2 |
| `RJ.png` | Startup Schemes in Rajasthan (2026): State Grants, Incentives & Policy (70 characters is the longest region title; Jharkhand and Meghalaya tie) | 70 | 52 px | 2 |
| `iic.png` | Institution's Innovation Council & National Innovation and Startup Policy (longest real scheme name) | 73 | 52 px | 2 |
| `long.png` | Synthetic stress title, not a scheme | 92 | 52 px | 3 |
| `longer.png` | Synthetic stress title, not a scheme | 122 | 52 px | 3 |

Real titles come from `reference/data-source/` using the ARCHITECTURE §8.1 title rules. The scheme descriptions in the probes use each scheme's `amt` and the "Open" status label.

## Options
| Option | Consequence | Criteria affected |
|---|---|---|
| A. Adopt the layout above (recommended) | Works with the locked package (evidence above); loses the separate accent-coloured mono amount | AC-SEO-09 |
| B. Replace astro-og-canvas with satori + resvg | Full layout control; two new packages (ADR), TTF fonts needed (satori does not read woff2), a new spike | AC-SEO-09, ARCHITECTURE §2 |
| C. Keep DESIGN §5 as written | Cannot be built with the locked stack; Phase 8 stops | AC-SEO-09 |

## Recommendation
A.

## Impact
Phase 8 only: the OG route, `src/assets/og-wordmark.png`, and the 100-character build check. The candidate wordmark is `docs/proposals/assets/0004-og-wordmark.png`.

---
Approval: the owner applies the change to the locked file(s), marks this proposal Approved, and merges. Until then, the current text applies.
