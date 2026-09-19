# DESIGN.md — visual contract

This file defines how the site **looks**: tokens, type, layout, and the anatomy of every template. `ACCEPTANCE.md` wins over this file. Where this file and `reference/design/site.css` disagree, **this file wins**, and §8 lists every known difference.

Agents may not edit this file. Visual changes go through `docs/proposals/`.

**Inputs (read-only)**
- `reference/design/site.css`: the approved stylesheet from the prototype. Port its rules; do not invent new ones.
- `reference/design/screens/*.png`: approved screenshots per template (390 px and 1440 px). These are the visual target for AC-DES-02.
- `reference/design/prototype/*.html`: rendered prototype pages. Use them as the markup reference and as the copy source listed in §9. Their inline scripts and `data-*` hooks are **not** the architecture (ARCHITECTURE §6 is).
- The design canvas the owner approved: `https://claude.ai/artifact/VJCSS2dQckEy9KrA9xQqU7` (private to the owner; the screenshots above are the same pages).

---

## 1. Visual direction (decision D1)

| D1 value | What happens |
|---|---|
| **Editorial** (recommended) | This file applies as written. Phase 4 can start. |
| A Civic Ledger · B File Cover · C Launchpad · a mix | The canvas shows these as single light-mode screens only. They are **not** specified enough to build. Before Phase 4 starts, the owner supplies a proposal amending §2 and §3 with the full light and dark token set, the font files, and screenshots of the 5 AC-DES-02 templates. **Agents must not derive tokens, colours or fonts from the mockups themselves.** Phase 4 is blocked until the amendment is approved. |

Component anatomy (§4), layout (§4.1), motion (§6) and print (§7) are the same for every direction. Only tokens and fonts change.

## 2. Tokens

### 2.1 Light (`:root`)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#EFEADF` | Page background |
| `--paper-2` | `#F8F5EE` | Cards, panels, inputs, tab bar |
| `--paper-3` | `#E6E0D2` | Tags ("where"), map tiles with 0 schemes, reason chips |
| `--ink` | `#1D1F2B` | Body text, headings |
| `--ink-2` | `#55546A` | Secondary text |
| `--ink-3` | `#62606C` | Placeholders, ticked checklist items |
| `--rule` | `#D6CFBF` | Hairlines, card borders (decorative) |
| `--rule-2` | `#BFB6A2` | Chip and button outlines (decorative; the label identifies the control) |
| `--field` | `#8A8272` | Borders of `input`, `select` and the search box (≥ 3:1, WCAG 1.4.11) |
| `--accent` | `#5B3FA0` | Links, primary buttons, focus ring, pressed chips |
| `--accent-ink` | `#FFFFFF` | Text on `--accent` |
| `--accent-soft` | `#E7E0F3` | Selected finder option, glossary target |
| `--accent-t1` | `#DCD4EC` | Map level 1 |
| `--accent-t2` | `#BDAEDD` | Map level 2 |
| `--accent-t3` | `#7358B3` | Map level 3 (text `--accent-ink`) |
| `--turmeric` | `#8F5A0C` | Dates, student tag, note rule |
| `--s-open` | `#26683F` | Status: open |
| `--s-calls` | `#2F5B91` | Status: calls |
| `--s-deadline` | `#A2410F` | Status: deadline, finder warnings |
| `--s-announced` | `#7A5C0C` | Status: announced |
| `--s-closed` | `#6A655E` | Status: closed |
| `--s-auto` | `#5B3FA0` | Status: automatic |
| `--shadow` | `0 1px 0 rgba(29,31,43,.04),0 6px 20px -12px rgba(29,31,43,.25)` | Search box, toast |
| `--radius` | `6px` | Cards |
| `--tabbar-h` | `0px` (below 980 px: `calc(62px + env(safe-area-inset-bottom,0px))`) | Bottom padding |
| `--backdrop` | `rgba(10,10,16,.45)` (same in dark) | Filter-sheet backdrop |
| `--tray-rule` | `rgba(255,255,255,.35)` (dark: `rgba(0,0,0,.35)`) | Outline of the non-primary buttons on the `--ink` compare tray |

`color-scheme: light`.

### 2.2 Dark

Applied by `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` **and** by `:root[data-theme="dark"] {…}`, with identical values:

| Token | Value |
|---|---|
| `--paper` | `#16151C` |
| `--paper-2` | `#201E28` |
| `--paper-3` | `#2A2733` |
| `--ink` | `#ECE6D8` |
| `--ink-2` | `#B3ADBE` |
| `--ink-3` | `#958FA0` |
| `--rule` | `#36323F` |
| `--rule-2` | `#4E4959` |
| `--field` | `#767086` |
| `--accent` | `#B7A2F2` |
| `--accent-ink` | `#17151D` |
| `--accent-soft` | `#2E2645` |
| `--accent-t1` | `#2C2640` |
| `--accent-t2` | `#463A6E` |
| `--accent-t3` | `#9582D4` |
| `--turmeric` | `#E3AA52` |
| `--s-open` | `#6DC495` |
| `--s-calls` | `#88B0E6` |
| `--s-deadline` | `#F29063` |
| `--s-announced` | `#D8B75E` |
| `--s-closed` | `#9C97A3` |
| `--s-auto` | `#B7A2F2` |
| `--shadow` | `0 1px 0 rgba(0,0,0,.2),0 10px 24px -14px rgba(0,0,0,.7)` |
| `--tray-rule` | `rgba(0,0,0,.35)` |

`color-scheme: dark`. Font and radius tokens are theme-independent: `--f-display: "Newsreader", Georgia, "Times New Roman", serif`, `--f-ui: "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`, `--f-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`.

### 2.3 Contrast pairs (checked by `tests/unit/contrast.test.ts`, AC-A11Y-05)

The test parses `src/styles/tokens.css` and checks, in **both** themes:

- **≥ 4.5:1 (text):** `ink`, `ink-2` and `ink-3` on `paper` and `paper-2`; `ink` and `ink-2` on `paper-3`; `accent` on `paper`, `paper-2` and `accent-soft`; `accent-ink` on `accent` and `accent-t3`; `ink` on `accent-t1` and `accent-t2`; `turmeric` on `paper` and `paper-2`; each `s-*` on `paper` and `paper-2`; `paper` on `ink` (tray, toast, popover).
- **≥ 3:1 (UI):** `field` on `paper` and `paper-2`; `accent` on `paper` and `paper-2` (focus ring, pressed chip).

Every pair above passes with the values in §2.1 and §2.2 (lowest: `field` on `paper`, light, 3.17:1). `rule` and `rule-2` are decorative and not tested.

## 3. Typography and fonts

### 3.1 Font files

Exactly these 9 files, copied byte-for-byte from `reference/fonts/` to `public/fonts/`, with `OFL-newsreader.txt` and `OFL-ibm-plex.txt` alongside. Each is a Latin + ₹ subset (≤ 24 KB).

| File | Family | Weight | Style |
|---|---|---|---|
| `newsreader-400.v1.woff2` | Newsreader | 400 | normal |
| `newsreader-400i.v1.woff2` | Newsreader | 400 | italic |
| `newsreader-500.v1.woff2` | Newsreader | 500 | normal |
| `plexsans-400.v1.woff2` | IBM Plex Sans | 400 | normal |
| `plexsans-500.v1.woff2` | IBM Plex Sans | 500 | normal |
| `plexsans-600.v1.woff2` | IBM Plex Sans | 600 | normal |
| `plexmono-400.v1.woff2` | IBM Plex Mono | 400 | normal |
| `plexmono-500.v1.woff2` | IBM Plex Mono | 500 | normal |
| `plexmono-600.v1.woff2` | IBM Plex Mono | 600 | normal |

- `src/styles/fonts.css` declares one `@font-face` per file with `font-display: swap` and `format("woff2")` only. There is no `unicode-range`.
- **Preload exactly 2** on every page: `newsreader-500.v1.woff2` and `plexsans-400.v1.woff2` (`<link rel="preload" as="font" type="font/woff2" crossorigin>`).
- The arrow `→` (U+2192) is not in these files. It appears only in scheme data and renders in the fallback font; this is accepted. UI chrome uses Lucide `arrow-right` icons, never the character.
- Weight 700 does not exist. Never use `font-weight: 600` on Newsreader or 700 anywhere (it would be synthesized).

### 3.2 Type scale

| Role | Family | Size | Weight | Line height | Other |
|---|---|---|---|---|---|
| Home `h1` | display | `clamp(36px, 5.6vw, 64px)` | 500 | 1.02 | `letter-spacing: -.015em`, max 18ch; `em` in italic 400, `--accent` |
| Scheme `h1` | display | `clamp(30px, 5vw, 52px)` | 500 | 1.05 | `letter-spacing: -.012em` |
| Page `h1` (all other templates) | display | `clamp(30px, 4.6vw, 46px)` | 500 | 1.06 | |
| Section `h2` | display | `clamp(24px, 3.2vw, 32px)` | 500 | 1.1 | |
| Scheme section `h2` | display | 25px | 500 | normal | |
| Card title | display | 21px | 500 | 1.2 | |
| Deck / lede | display | `clamp(18px, 2.1vw, 20.5px)` (lede `clamp(18.5px, 2.2vw, 21px)`) | 400 | 1.45–1.5 | `--ink-2` for deck |
| Body | ui | 16px | 400 | 1.55 | |
| Small / meta | ui | 14–14.5px | 400 | | `--ink-2` |
| Eyebrow / kicker / labels | mono | 11–12px | 500–600 | | uppercase, `letter-spacing: .1em–.14em` |
| Amounts and counts | mono | 13–14px | 500 | | `font-variant-numeric: tabular-nums` |

Headings use `text-wrap: balance`; paragraphs and list items use `text-wrap: pretty`. Sentence case everywhere.

## 4. Layout and components

### 4.1 Breakpoints and grid

| Name | Width | Changes |
|---|---|---|
| phone-s | ≤ 360 | Brand name 16px |
| phone | ≤ 520 | `.wrap` side padding 16px (otherwise 20px) |
| — | ≤ 680 | Card grids go to 1 column; scheme head stacks with the stamp first |
| — | ≤ 760 | Footer 2 columns; glossary 1 column |
| — | ≤ 900 | Hero, scheme grid and map layout go to 1 column; scheme stats 2 columns |
| **nav switch** | **< 980** | Bottom tab bar on, header nav off, filters become a bottom sheet |
| desktop | ≥ 980 | Header nav, filter sidebar 260px |
| wide | ≥ 1100 | Three-column card grids allowed |

- `.wrap` max width 1180px, centred.
- `main` padding `24px 0 64px`, plus `padding-bottom: var(--tabbar-h)` on `body`.
- Safe areas: header `padding-top: env(safe-area-inset-top)`, tab bar and sheet `padding-bottom: env(safe-area-inset-bottom)`, `viewport-fit=cover` in the viewport meta.

### 4.2 Page frame (every page)

1. Skip link "Skip to content" → `#main` (first focusable element).
2. **Header** (sticky, `--paper`, bottom rule): brand (32px `--accent` square with an italic "G" in Newsreader, then "Founder's Field Guide"), primary nav (≥ 980 px only): Schemes · Start here · Eligibility finder · States · What's new · Glossary. Tools on the right: search link (to `/schemes/#search`, which focuses the search input on arrival), shortlist link with count pill, theme toggle (`js-only`).
3. `<main id="main" tabindex="-1">`.
4. **Footer**: three columns. "About this guide" (the sentence "An independent guide, not an official government website.", then "Last checked {d Mon yyyy}.", then "Download the full directory (PDF, 83 pages)"), "Explore" (All schemes, Start here, Eligibility finder, State schemes, For students), "Reference" (What's new, Glossary, About & method, Your shortlist).
5. **Tab bar** (< 980 px): Home (`house`), Schemes (`list`), Finder (`compass`), States (`map`), Saved (`star`, with count pill). The current section has `aria-current="page"` and an accent top bar.
6. **Compare tray** island (AC-FUNC-21) and the toast region (`role="status"`).

### 4.3 Status stamp (`Stamp.astro`)

- Small stamp: mono 11px, 600, uppercase, `letter-spacing .12em`, 1.5px border in the status colour, radius 3px. Big stamp (scheme page): 14px, 3px border, rotated −5°, with the ink-texture mask from `site.css`.
- `data-s` = status key; colour from `--s-{status}`.
- **Text (exact, SPEC §8):** open "Open", calls "Opens in rounds", deadline "Closes {d Mon yyyy}", announced "Announced", closed "Closed", auto "Automatic". `statusNote` never appears in the stamp; it appears under the Status stat (§4.6) and in card meta.
- **Build time (`lib/status.ts`, AC-DATA-06):** if `status = deadline` and `deadline` 23:59:59 IST < build time, render status `closed` with note "Deadline passed on {d Mon yyyy}".
- **In the browser (`scripts/deadlines.ts`, AC-FUNC-29):** for stamps with `data-deadline`, compute `days = deadlineDate − todayDate`, both as calendar dates in `Asia/Kolkata`:

| `days` | Text | `data-s` |
|---|---|---|
| > 14 | unchanged ("Closes 30 Sep 2026") | deadline |
| 2 – 14 | "{days} days left" | deadline |
| 1 | "1 day left" | deadline |
| 0 | "Last day" | deadline |
| < 0 | "Deadline passed" | closed |

- Date format everywhere: `d Mon yyyy` (e.g. "30 Sep 2026"), from `lib/format.ts`, using `Intl.DateTimeFormat("en-IN", {day:"numeric", month:"short", year:"numeric", timeZone:"Asia/Kolkata"})`, with "Sept" normalized to "Sep".

### 4.4 Scheme card (`SchemeCard.astro`)

Order inside `<article class="entry">`:
1. Meta row: "Central · {body}" or "State · {body}" (mono 11.5px uppercase `--ink-2`; `body` cut before the first " (") on the left, small stamp on the right.
2. Title with a **stretched link** (class `stretched`; its `::after` covers the card) to the scheme URL. The heading level is a prop: `h2` where the cards sit directly under the page `h1` (`/schemes/`, region, topic, sector, shortlist), `h3` where they sit under a section `h2` (home).
3. Amount (mono 14px 500).
4. Summary, clamped to 3 lines.
5. Footer: tags on the left ("where" tag = `All India` or the region name, then the first 2 type labels, then "Student-friendly" in turmeric when `student`); on the right two 44×44 icon buttons, `js-only`: Save (`star`, filled when pressed) and Compare (`git-compare-arrows`), with `aria-pressed` and fixed accessible names "Save {abbr} to shortlist" and "Add {abbr} to compare". The names never change with the state; `aria-pressed` and the filled icon show it.

Closed cards show the closed stamp and use `--paper` instead of `--paper-2`. **No opacity** on closed cards.

Card grids: 2 columns, 3 on ≥ 1100 px where the template says so, 1 column ≤ 680 px.

### 4.5 Controls and icons

- **Buttons:** `.btn` 44px min height, radius 9px, `--rule-2` outline; `.btn.primary` filled `--accent`. Pressed toggle: accent text and border.
- **Chips:** pill, 1px `--rule-2`, pressed = filled accent. Min height 44px (< 980 px), 36px in the desktop filter sidebar only.
- **Tags:** 12.5px, radius 4px, not interactive.
- **Inputs and selects:** 16px text (AC-MOB-03), 44px min height, 1px `--field` border.
- **Segmented control** (tier tabs): pressed segment = `--ink` background, `--paper` text.
- **Icons:** Lucide, 20px (18px in buttons, 22px in the tab bar), `stroke-width: 2`, `aria-hidden="true"`. Names used: `search`, `star`, `git-compare-arrows`, `share-2`, `printer`, `moon`, `sun`, `external-link`, `house`, `list`, `compass`, `map`, `x`, `sliders-horizontal`, `arrow-left`, `arrow-right`, `check`, `trash-2`, `file-down`. No other icon set; no emoji.

### 4.6 Scheme page (`schemes/[slug].astro`, `states/[region]/[slug].astro`) — exact order (AC-CONTENT-01)

1. Breadcrumbs: Home / Schemes / {name} (central) or Home / States / {region} / {name} (state).
2. `<article data-pagefind-body data-pagefind-meta="id:{id}">`:
   1. Head: eyebrow "Central scheme · {body}" or "{region} scheme · {body}"; `h1` = name; lede = summary; badges (type labels, then "Needs DPIIT recognition" if `needsDpiit`, then "Student-friendly" if `student`); big stamp on the right (first on ≤ 680 px).
   2. Stats `dl` (5 columns; 2 on ≤ 900 px, first spans both): **Support** (= `amount`, display 22px) · **Stage** (stage labels joined by ", ") · **Sector** (sector labels) · **Effort to apply** (effort label; "Nothing to apply for" when status = `auto`) · **Status** (stamp text, then `statusNote` as a note line if present).
   3. Actions: "Official portal" primary link (`external-link` icon, `target="_blank" rel="noopener"`), then `js-only` buttons Save, Compare, Share, Print. The Save and Compare buttons show an icon and a fixed visible label ("Save", "Compare"); their accessible name is that label; the state is shown only by `aria-pressed` (accent colour, filled star).
   4. Two-column grid (`minmax(0,1fr) 310px`; 1 column ≤ 900 px). Main column, in order: **What you get** (benefits `ul`) · **Who can apply** (eligibility `ul`) · **How to apply** (steps `ol.steps`, numbered in the display face) · **Documents checklist** (only if `documents` is non-empty; checkboxes with JS, a plain list without JS) · **Last checked** line: "Last checked: {verifiedNote}. Terms change often — confirm on the official portal before applying." with the official link.
   5. Rail (`aside aria-label="Related schemes" data-pagefind-ignore`, so other schemes' names in it do not pollute search results), in order: **Stacks well with** (from `stacksWith` in data order; omitted if empty) · **More in {region}** (state schemes only: up to 5 other schemes of the same region, recommended order; omitted if none) · **Similar schemes** (SPEC §7.4) · **Browse related** (link chips to the first 3 matching topic pages in `topics.json` order, SPEC §7.6; omitted if none). Each list item is a mini-list entry: name (display 17px) and "{amount} · {All India | region}" (mono 12.5px).
3. Glossary terms: the first occurrence of each term in benefits, eligibility and steps is wrapped in `<a class="term" href="/glossary/#g-{slug}">` (AC-FUNC-26).

### 4.7 Region page (`states/[region]/index.astro`)

1. Breadcrumbs: Home / States / {name}.
2. Head: eyebrow "State" or "Union territory", plus " · Startup ranking 2026: {ranking}" when a ranking exists; `h1` "Startup schemes in {name}"; intro:
   - with schemes: "{n} {name} scheme(s) is/are listed below. They stack on top of every central scheme — and most need you to register on the {state|union territory}'s startup portal first."
   - with none: "No dedicated startup scheme is listed for {name} in this edition. Founders here can use every central scheme; the most useful ones are below."
3. The region's scheme cards (card titles are `h2` here), recommended order.
4. **Central schemes that also apply in {name}**: mini-list in 2 columns (1 column ≤ 680 px) of the first 12 central, top-tier, not-closed schemes in recommended order, with a link "All central schemes" to `/schemes/?level=C`.
5. **Other states**: the tile map with this region `aria-current="page"`, and a link "All states" to `/states/`.

**Tile map** (`TileMap.astro`): 10-column grid of region tiles at the `col,row` in `regions.json`; UTs are round. Level by the region's state-scheme count: 0 → level 0 (`--paper-3`), 1 → 1, 2 → 2, 3 → 3, ≥ 4 → 4. Tile label = code, with the count below ("–" for 0). Accessible name "{name}: {n} state scheme(s)". A legend follows the map.

### 4.8 All schemes (`/schemes/`)

- Head: eyebrow "All schemes", `h1` "Every scheme in the guide", deck "{n} central and state schemes. Search, filter by what you need, or narrow to the most useful ones." 
- Search box (`SearchBar.astro`), then the browse layout: filter sidebar (260px) + results.
- Results toolbar: tier segmented control (All · Top · Top + major), sort `select` (Recommended · Largest amount · Nearest deadline · Easiest · Newest), and a "Filters" button with the active count (< 980 px only).
- Result line (`aria-live="polite"`, mono 13px): "{N} schemes" + " · including {k} any-sector schemes" + " · searching all tiers" as applicable.
- Filter groups, in order: Level · State (select) · What you get · Stage · Sector · Only student-friendly (checkbox) · Hide closed & announced (checkbox) · Reset.
- **Bottom sheet (< 980 px):** fixed, 86vh max, radius 16px top, sticky head ("Filters" + close `x`) and sticky foot ("Reset" + primary "Show {N} schemes"), backdrop `var(--backdrop)`, slide-up 0.25s (none with reduced motion).
- Without JS: every card in recommended order, no filter controls (AC-FUNC-08).
- Empty state: dashed box, "No schemes match these filters." and a "Clear filters" button.

### 4.9 Eligibility finder

- Page head: eyebrow "Eligibility finder", `h1` "Find the schemes that fit you", deck "Six questions. Your answers stay on this device." Without JS: "The finder needs JavaScript. You can still browse every scheme or follow the roadmap." with links to `/schemes/` and `/start-here/`.
- Question screen: progress (6 segments, `aria-hidden`), eyebrow "Question {n} of 6", the question as an `h2` that receives focus when the question changes, the answer control, then "Back" (`arrow-left`; disabled on question 1) and "Next" (`arrow-right`; "See my schemes" on question 6).
- Question 1 is a `<select>` (visually hidden label "State or union territory") whose first option is "Not incorporated yet / anywhere" (value `""`), followed by every region by name (collator order, SPEC §7.1); it defaults to the first option. Questions 2–6 are option buttons (grid `minmax(210px,1fr)`, 52px min height, `aria-pressed`, optional second line in `small`). Choosing an option records it and moves to the next question. "Next" without an answer shows "Pick an answer to continue" under the options (`role="alert"`) and does not advance.
- The questions and options are the copy deck in §9.1.
- Results: eyebrow "Your matches", `h2` "{N} schemes worth a look" (focused), a summary line "{region name or "Central schemes only"} · {stage label} · {sector label}[ · Student] · Needs: {need label}", buttons "Change answers" and "Save all {N}" (`star`), a note when DPIIT = no — "Many central benefits need DPIIT recognition. It's free and quick — see how to get it." linking "see how to get it" to the page of the scheme whose id is `labels.json` → `dpiitSchemeId` — then one row per match: score (display 30px) with "MATCH" below, the scheme name (`h3`, linked), "{amount} · {All India | region} · {status label}", reason chips, and warning chips outlined in `--s-deadline`. With no matches: "No strong matches. Try a broader sector or stage."

### 4.10 Shortlist, compare, tray, toast

- Shortlist (`/shortlist/`): eyebrow "Your shortlist", `h1` "Saved schemes". With items: "{N} saved scheme(s) on this device. Print them for your CA, incubator or co-founder.", then buttons "Print or save as PDF" (primary, `printer`), "Compare first three" (`git-compare-arrows`), "Clear shortlist" (with `confirm("Remove all saved schemes?")`), then the cards in saved order. Empty: "Nothing saved yet. Tap the star on any scheme to save it here." with links "Browse schemes" and "Find my schemes" (primary, to the finder). Without JS: "Your shortlist needs JavaScript." and a link "Browse all schemes".
- Compare (`/compare/`): eyebrow "Compare", `h1` "Side by side". With items: "{N} of 3 selected. Scroll sideways on small screens.", then the table in a horizontally scrolling container (`min-width: 640px`), scheme names as column headings (linked), rows per SPEC §7.5 with mono uppercase row headers; Status uses the small stamp; DPIIT needed "Yes"/"No"; Students "Yes"/"—"; a Remove button per column. Empty: "Nothing to compare yet. Tap the compare icon on up to three schemes." and a "Browse schemes" link. Without JS: "Comparing needs JavaScript." and a link "Browse all schemes".
- Tray: `--ink` bar fixed above the tab bar, "Compare: {abbr1} · {abbr2}", a primary link "Compare {N}" to `/compare/` and a "Clear" button, 44px targets. Refusing a 4th scheme shows the toast "You can compare up to 3 — remove one first".
- Toast: pill, `--ink`, above the tray, auto-hide 2.5s, `role="status"`. The only messages: "Saved to your shortlist", "Removed from your shortlist", "Saved {N} schemes to your shortlist" (finder save-all), "Link copied", "You can compare up to 3 — remove one first".

### 4.11 Home

In order:
1. Masthead: kicker "India · Edition of September 2026"; `h1` "The Founder's Field Guide to Government Schemes"; deck "Every central and state scheme that can put money, tax relief, customers or lab space behind an Indian startup — with who qualifies, what to file, and how to apply."; ledger (mono) "{n} schemes · {central} central · {state} state & UT · {openOrRecurring} open or recurring · {student} student-friendly", where open or recurring = status ∈ {open, deadline, calls, auto}. All numbers computed from data.
2. Search box (submits to `/schemes/?q=`), then quick chips for the topics with `home: true`.
3. **Recently changed**: the 6 newest updates as a horizontal scroll-snap strip (month and year in turmeric mono, title, text), each linking to its scheme or `/states/`.
4. **The {nTop} most useful schemes**: all top-tier schemes as cards, recommended order, with a link "All {n} schemes".
5. **Browse by what you need**: 8 topic tiles (name, blurb, count).
6. **Browse by sector**: 8 sector tiles.
7. **What your state adds**: the tile map and legend, and the state list.
8. Two panels side by side (stacked ≤ 760 px): **Start here** (link to `/start-here/`) and **Find the schemes that fit you** (link to `/eligibility-finder/`).

### 4.12 Other templates

Copy for the page heads and static text of these templates comes from the prototype page named in §9.2.

- **Topic / sector:** breadcrumbs Home / Schemes / {short}; eyebrow "Topic" or "Sector"; `h1` and intro paragraphs from data; a result line "{N} scheme(s) · Filter these in the full list" (the link goes to the topic's `filter` query, or `/schemes/?sector={key}` for sectors); the cards (`h2`, 3 columns ≥ 1100 px). Sector pages then show "Any-sector schemes that also apply" as a 2-column mini-list (SPEC §7.6), with a link "All schemes" to `/schemes/`.
- **Start here:** jump chips (For founders · For students), two numbered roadmaps (italic display counters 01…), each step with link chips to its schemes.
- **What's new:** timeline, date column 110px (stacked ≤ 520 px), each item linking to its scheme or `/states/`.
- **Glossary:** 2-column `dl`, each entry `id="g-{slug}"`, `:target` highlight.
- **About:** prose (max 70ch), sections in this order: What it covers · How it's checked · Not an official website · Privacy · Downloads. The Privacy sentence about Vercel Web Analytics ("The site uses Vercel Web Analytics, which counts page views without cookies or cross-site tracking.") appears if and only if `PUBLIC_ANALYTICS=on` (ARCHITECTURE §9).
- **404:** `h1` "That page isn't in the guide", the prototype's intro, a search form to `/schemes/`, and the prototype's four links (Home, All schemes, States, Eligibility finder).

### 4.13 States index (`/states/`)

Breadcrumbs Home / States → eyebrow "State & UT schemes", `h1` "What your state adds on top", intro (prototype) → two columns (one ≤ 900 px): the tile map with its legend ("None listed", "1", "2", "3", "4+", "Circle = union territory") and `h2` "All states and union territories" with the state list (every region by name; each row "{n} scheme(s)" plus " · {ranking}" when one exists) → a note "Rankings are from the 5th States' Startup Ecosystem Ranking released by DPIIT in January 2026."

## 5. Social images (`/og/*.png`, 1200×630)

- Background `#EFEADF`, 64px padding, 8px `#5B3FA0` bar on the left edge.
- Top: "FOUNDER'S FIELD GUIDE" in IBM Plex Mono 600, 26px, `#55546A`.
- Middle: title in Newsreader 500, 64px (reduce to 52px if more than 2 lines), `#1D1F2B`, max 3 lines.
- Bottom: for schemes, `{amount}` in Plex Mono 500 30px `#5B3FA0` and "{All India | region} · {status label}" in Plex Sans 26px `#55546A`; for regions, "{n} state schemes + every central scheme"; default image: "Government schemes for Indian startups".
- Fonts: the same files as §3.1. Light theme only.

## 6. Interaction

### 6.1 Focus and motion
- Focus ring: `outline: 2px solid var(--accent); outline-offset: 2px` on `:focus-visible`. Card focus shows on the card (`:has()`).
- Motion only inside `@media (prefers-reduced-motion: no-preference)`: `main` rise 0.28s, sheet slide 0.25s. Nothing else animates.

### 6.2 Theme boot and toggle
- `Head.astro` contains one inline script (hashed by the Astro CSP) that runs before CSS paints: add class `js` to `<html>`, read `ffg:theme` (JSON), and set `data-theme` if it is `"light"` or `"dark"`. Wrapped in try/catch. It never writes.
- The toggle (`scripts/theme-toggle.ts`) writes through the `theme` store, sets `data-theme`, swaps the icon (`moon` in light, `sun` in dark) and sets the accessible name "Switch to dark theme" / "Switch to light theme".
- `<meta name="theme-color">` twice, with `media` light `#EFEADF` and dark `#16151C`.

### 6.3 JS-only UI
- Controls that need JS carry `class="js-only"` and are hidden by `html:not(.js) .js-only {display:none !important}`. Content that must disappear with JS carries `no-js`, hidden by `.js .no-js {display:none !important}`. These two rules live in `base.css` from Phase 3, and are the only `!important` rules besides `[hidden]` and print.

## 7. Print (`src/styles/print.css`)

Hide: header, tab bar, tray, filters, toolbar, search, toast, popover, footer, skip link, breadcrumbs, scheme actions, card actions, anything `.no-print`. Body white, black text, 12pt. Scheme grid one column. Cards and rail boxes `break-inside: avoid`. The big stamp drops its mask. Links print their text only.

## 8. Known differences from `reference/design/site.css` (must apply)

| # | Reference CSS | Required | Reason |
|---|---|---|---|
| 1 | `--ink-3: #6E6C7A` | `#62606C` | 4.28:1 on paper (fails AA) |
| 2 | `--s-closed: #76716A` | `#6A655E` | 4.03:1 (fails AA for 11px stamp text) |
| 3 | `--accent-t3: #8D75C4` light, `#7A66B8` dark | `#7358B3` light, `#9582D4` dark | Tile text 3.8:1 (fails AA) |
| 4 | Inputs bordered with `--rule-2` | New `--field` token | 1.7:1 (fails 1.4.11) |
| 5 | `.entry.is-closed{opacity:.75}` | No opacity; `--paper` background | Opacity lowers text contrast |
| 6 | Min heights 32px (`.crumbs a`), 36px (`.timeline a`, `.site-foot li a`), 40px (`.chip`, `.linkchip`, `.check`, `.tray .btn`) | 44px below 980 px | AC-MOB-02 |
| 7 | Stamp text from legacy labels ("Periodic calls", "Closing soon", "Open · rolling") | SPEC §8 labels only | AC-CONTENT-03 |
| 8 | `.docs .no-js-item::before{content:"☐ "}` | Remove; use a plain list | Glyph not in the fonts |
| 9 | `@font-face` URLs inside `site.css` | `src/styles/fonts.css` | ARCHITECTURE §7 |
| 10 | One global stylesheet | `tokens.css`, `fonts.css`, `base.css`, `print.css` + scoped component styles | ARCHITECTURE §7 |
| 11 | `.sheet-backdrop{background:rgba(10,10,16,.45)}` | `var(--backdrop)` | Colours only through tokens |
| 12 | `.tray .btn{border-color:rgba(255,255,255,.35)}` | `var(--tray-rule)` (dark value differs, because the tray is light in dark mode) | Colours only through tokens; visible outline in both themes |
| 13 | Finder Back/Next with `←`/`→` characters | Lucide `arrow-left` / `arrow-right` icons | Glyphs not in the fonts |

**Tap-target measurement (AC-MOB-02):** a stretched link (class `stretched`) is measured by its card's box; a checkbox or radio is measured by its `label` (the label row is ≥ 44px). Glossary terms and links inside running text (`p`, `li` prose) are exempt.

## 9. Copy sources

Every visible string comes from one of: the data files; this file; SPEC; or, for the static text of page heads and guide pages, the prototype pages in §9.2, copied verbatim. In copied text, every count that can be computed from data is computed (for example "115 schemes: 66 run by…" becomes `{n} schemes: {central} run by…`), and the month of checking comes from `lastVerified`. Status labels always follow SPEC §8, never the prototype.

**SPEC and this file override the prototype.** Known cases where the prototype must not be copied:
- The arrow character `→` in link text (for example "Open {abbr} →" on What's new): keep the words and use the Lucide `arrow-right` icon instead.
- Clipped amounts (for example on Start here link chips, "Subsidised space, labs and…"): amounts are shown in full (SPEC §8); the chip text wraps.
- Glossary term links outside scheme pages (What's new, Start here): glossary linking happens only on scheme pages (SPEC §7.8).
- Legacy status labels and effort labels: use SPEC §8 and ARCHITECTURE §4.1.
- Any typed count or date that data can produce (see above).

### 9.1 Finder copy deck

| # | Key | Question | Options: value — label — second line |
|---|---|---|---|
| 1 | `st` | Where is your startup based? | `""` — Not incorporated yet / anywhere; then each region: code — name |
| 2 | `stage` | What stage are you at? | `idea` — Idea or prototype — No revenue yet · `early` — Early revenue — First customers, small team · `growth` — Growing — Scaling up or raising bigger rounds |
| 3 | `sector` | Which sector fits best? | every sector key except `all`, in `labels.json` order — its label; then `all` — Something else / general |
| 4 | `student` | Are you a student or recent graduate? | `yes` — Yes — Include student schemes · `no` — No |
| 5 | `need` | What do you need most right now? | `grant` — Grant money — Non-dilutive funding · `loan` — A loan — Working capital or equipment · `equity` — Equity investment — VC or seed investment · `tax` — Tax & compliance relief — Lower taxes, fewer filings · `incubation` — Incubation & mentoring — Space, labs, mentors · `procurement` — Government as customer — Pilots, tenders, orders |
| 6 | `dpiit` | Do you have DPIIT startup recognition? | `yes` — Yes · `no` — No / not sure — We'll flag schemes that need it |

Need labels (reason chips and summary): grant "Grant", loan "Loan", equity "Equity", tax "Tax & compliance", incubation "Incubation", procurement "Govt customer". Stage and sector reason chips use the labels in `labels.json`. The other reason chips are "Student-friendly" and the region name; warnings are "Needs DPIIT recognition first" and "Not open yet" (SPEC §7.3).

### 9.2 Prototype pages used as copy sources (`reference/design/prototype/`)

| Template | File |
|---|---|
| Home | `index.html` |
| States index | `states.html` |
| Region | `states_karnataka.html` |
| Topic / sector | `topics_grants.html`, `sectors_agriculture-and-food.html` (intro text itself comes from `topics.json` / `sectors.json`) |
| Start here | `start-here.html` |
| Eligibility finder (page head, no-JS text) | `eligibility-finder.html` |
| What's new | `whats-new.html` |
| Glossary | `glossary.html` |
| About | `about.html` |
| Shortlist, compare (no-JS text) | `shortlist.html`, `compare.html` |
| 404 | `404.html` |
| Scheme page | `schemes_credit-guarantee-scheme-for-startups.html` |

