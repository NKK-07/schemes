# SPEC.md — Founder's Field Guide (production site)

| | |
|---|---|
| Version | 1.0 |
| Date | 18 Sep 2026 |
| Owner | The repository owner (the only person who may change this file) |
| Status | **Approved for Phase 0 once the open decisions in §3 are filled in** |

`SPEC.md` and `ACCEPTANCE.md` are the source of truth for **what** the site does. `ARCHITECTURE.md`, `DESIGN.md`, `SECURITY.md` and `TESTING.md` define **how**. `AGENTS.md` defines how AI agents behave. If documents conflict, this order wins: SPEC → ACCEPTANCE → SECURITY → ARCHITECTURE → DESIGN → TESTING → PHASES. An agent that finds a conflict **stops and reports it**. It does not pick one.

Agents may not edit this file. To change a requirement, write a proposal in `docs/proposals/` (template in `templates/proposal.md`) and wait for the owner.

---

## 1. Product

An independent, searchable guide to central and state government schemes for startups in India. It is aimed at founders, would-be founders and students who need to know **what they can get, whether they qualify, what to file, and where to apply**.

The site is **static**. It has no accounts, no server-side code, no database and no forms. Per-visitor state (shortlist, compare, checklist ticks, finder answers, theme) lives only in the visitor's browser.

## 2. Scope

**In scope**
- 115 schemes (66 central, 49 state/UT), 36 states and union territories, 8 topics and 8 sectors, as defined by the data in `reference/data-source/` after migration to `src/data/`.
- The pages in §5, the features in §4 and the qualities in §6.
- Student-focused schemes, included and tagged.

**Out of scope (non-goals).** Do not build these, and do not add stubs for them.
- User accounts, login, email capture, newsletters, contact or feedback forms, comments.
- Server-side rendering, API routes, serverless or edge functions, middleware.
- A CMS, admin UI, or runtime data fetching from third parties.
- Languages other than English (`en-IN`).
- Schemes reserved for specific founder groups (a content-scope decision for this edition).
- Ads, third-party trackers, cookies, social embeds, iframes, chat widgets.
- A service worker or offline mode.

## 3. Open decisions

**The owner fills these in before Phase 0 can exit.** Agents must not choose them.

Recorded on 19 Sep 2026 from the owner's answers in chat.

| ID | Decision | Options | Recommended | **Owner's decision** |
|---|---|---|---|---|
| D1 | Visual direction | Editorial (current) · A Civic Ledger · B File Cover · C Launchpad · mix (describe) | Editorial | **Editorial, refined.** The owner wants the Editorial look refined. The refinements are specified by the owner and applied as a DESIGN.md amendment (proposal) approved **before Phase 4 starts** (DESIGN §1). Phases 0–3 do not depend on it. |
| D2 | AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) | Allow · Block (robots.txt + Vercel AI Bots ruleset) | Allow | **Allow** |
| D3 | GitHub Actions: tests on every push + daily rebuild at 06:00 IST | Yes · No | Yes | **Yes** |
| D4 | Vercel Web Analytics (cookie-free) | On · Off | On | **On** |

Consequences are defined in `ARCHITECTURE.md` §9 (D3, D4), `SECURITY.md` §4 (D2) and `DESIGN.md` §1 (D1).

## 4. Functional requirements

Each requirement is proven by the acceptance criteria listed next to it (`ACCEPTANCE.md`).

| ID | Requirement | Proven by |
|---|---|---|
| FR-01 | Every scheme has exactly one dedicated, indexable page containing: name, running body, status, maximum support, stage, sector, effort, summary, benefits, eligibility, numbered steps, documents checklist (if any), official link, "last checked" line, "stacks well with" (if any), similar schemes, and (for state schemes) more schemes in that state (if any). | AC-ROUTE-01..03, AC-SEO-01..12, AC-CONTENT-01..04 |
| FR-02 | Every state and union territory (36) has a page listing its schemes (possibly zero), its 2026 ranking if any, the top central schemes that also apply, and a tile map linking to all regions. | AC-ROUTE-04, AC-CONTENT-05 |
| FR-03 | 8 topic pages (by what you get) and 8 sector pages list matching schemes using the rules in §7. | AC-ROUTE-05, AC-CONTENT-06 |
| FR-04 | The home page has: masthead with live counts, search box, topic quick links, the 6 most recent updates, the top-tier schemes, topic tiles, sector tiles, a state map, and links to Start here and the eligibility finder. | AC-CONTENT-07 |
| FR-05 | `/schemes/` lists **all** schemes in server HTML. With JavaScript it adds: tier tabs (All / Top / Top + major), facet filters (level, state, what you get, stage, sector, student-only, hide closed/announced), sort (5 orders, §7.1), a live result count, an empty state, and URL query state that round-trips. On phones the filters open in a bottom sheet. | AC-FUNC-01..09 |
| FR-06 | Search: typing in the search box narrows `/schemes/` to matching schemes (full-text via Pagefind over scheme pages), combined with the active filters. The search boxes on the home page and the 404 page submit to `/schemes/?q=`; the header search link goes to `/schemes/#search` and focuses the search box. | AC-FUNC-10..12 |
| FR-07 | The eligibility finder asks 6 questions (§7.3), one per screen, with back and next. It shows up to 20 ranked matches with reasons and warnings, and lets the visitor save all matches to the shortlist. Answers persist on the device. | AC-FUNC-13..16 |
| FR-08 | Shortlist: save or unsave from any scheme card or scheme page; a count in the header and tab bar; a `/shortlist/` page with the saved schemes, print, "compare first three" and clear. | AC-FUNC-17..19 |
| FR-09 | Compare: add up to 3 schemes, a tray showing the selection on every page except `/compare/`, and a `/compare/` page with the side-by-side table in §7.5. | AC-FUNC-20..22 |
| FR-10 | Documents checklist: ticks on a scheme page persist per scheme, on this device. | AC-FUNC-23 |
| FR-11 | Share (Web Share API, falling back to copy link, falling back to a prompt) and Print on scheme pages. Print output hides navigation and controls. | AC-FUNC-24, AC-FUNC-25 |
| FR-12 | Glossary page with every term and an anchor per term. The first occurrence of each glossary term in scheme text links to its anchor (rules in §7.8); with JavaScript the link opens an in-place definition popover. | AC-FUNC-26, AC-FUNC-27 |
| FR-13 | "What's new" timeline of dated updates, each linking to its scheme (or to `/states/`). | AC-CONTENT-08 |
| FR-14 | "Start here" roadmap: a founders track (10 steps) and a students track (6 steps), each step linking to its schemes. | AC-CONTENT-09 |
| FR-15 | The About page covers scope, method, not-official disclaimer, privacy (including analytics if D4 = On) and the PDF download. | AC-CONTENT-10 |
| FR-16 | The full-directory PDF is downloadable at `/founders-field-guide-sep-2026.pdf` from the footer and the About page. | AC-CONTENT-11 |
| FR-17 | Links from the old single-page site (`/#/s/<id>`, `/#/map/<code>`, `/#/browse`, `/#/start`, `/#/quiz`, `/#/updates`, `/#/glossary`, `/#/shortlist`, `/#/compare`) redirect client-side to the new URLs, exactly as the table in §7.7. | AC-FUNC-28 |
| FR-18 | Deadline freshness: a scheme whose deadline has passed at build time renders as Closed. In the browser, status stamps with deadlines switch to the live labels in §8 ("{N} days left", "1 day left", "Last day", "Deadline passed"), computed from the visitor's clock in IST, as DESIGN §4.3 specifies. | AC-DATA-06, AC-FUNC-29 |
| FR-19 | Theme: follows the OS by default; a toggle switches light/dark and is remembered; there is no flash of the wrong theme on load. | AC-FUNC-30 |
| FR-20 | Unknown URLs return HTTP 404 with a page offering search and main links. | AC-ROUTE-06 |

## 5. Page inventory and URL rules

Counts are **derived from data at build time**. They must never be hard-coded. The totals below are the expected values for the current data (`tests/fixtures/golden.json`).

| Pattern | Count (current data) | Indexed |
|---|---|---|
| `/` | 1 | yes |
| `/schemes/` | 1 | yes |
| `/schemes/{schemeSlug}/` (central schemes) | 66 | yes |
| `/states/` | 1 | yes |
| `/states/{regionSlug}/` | 36 | yes |
| `/states/{regionSlug}/{schemeSlug}/` (state schemes) | 49 | yes |
| `/topics/{topicSlug}/` | 8 | yes |
| `/sectors/{sectorSlug}/` | 8 | yes |
| `/start-here/`, `/eligibility-finder/`, `/whats-new/`, `/glossary/`, `/about/` | 5 | yes |
| `/shortlist/`, `/compare/` | 2 | **no** (`noindex,follow`) |
| `/404.html` (served for unknown paths) | 1 | **no** |
| **Indexable total** | **175** | |

Rules:
- Every page URL ends in `/`. Requests without the slash get a 308 redirect to it.
- Slugs follow `ARCHITECTURE.md` §5 exactly, and the resulting URLs must equal `tests/fixtures/url-map.json`. **URLs are permanent once shipped.** Changing one is a spec change and needs a redirect.
- The canonical origin is `SITE_URL`, else `https://${VERCEL_PROJECT_PRODUCTION_URL}`, else `https://founders-field-guide.vercel.app`.

## 6. Non-functional requirements

| ID | Area | Requirement | Proven by |
|---|---|---|---|
| NFR-SEO | Indexing | Every indexable page has a unique title and description, a self-referencing canonical, one `h1`, Open Graph and Twitter tags with a 1200×630 image, valid JSON-LD (§ARCHITECTURE 8), and appears in the sitemap exactly once. Non-indexable pages are `noindex` and absent from the sitemap. All core content is present in the HTML without JavaScript. | AC-SEO-* |
| NFR-PERF | Speed | Lighthouse mobile (default throttling) on home, one scheme page and `/schemes/`: Performance ≥ 90, LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 200 ms. JavaScript budgets per `TESTING.md` §6. | AC-PERF-* |
| NFR-MOB | Mobile | No horizontal scrolling at 320, 360, 390, 768, 1024 or 1440 px. Interactive targets ≥ 44×44 CSS px (inline text links excepted). Form controls ≥ 16 px text. Bottom tab bar below 980 px. Safe-area insets respected. | AC-MOB-* |
| NFR-A11Y | Accessibility | WCAG 2.2 AA. Zero axe violations of impact serious or critical on any template, in light and dark. Full keyboard operation with visible focus. The bottom sheet and popover manage focus. Honours `prefers-reduced-motion`. | AC-A11Y-* |
| NFR-SEC | Security | Headers and CSP exactly as `SECURITY.md`. Zero CSP violations in end-to-end runs. No third-party origins requested (except as allowed by D4, which is same-origin anyway). | AC-SEC-* |
| NFR-PRIV | Privacy | No cookies set by the site. localStorage keys only with the prefix `ffg:`. No personal data leaves the browser. | AC-PRIV-* |
| NFR-REL | Reliability | The build fails (non-zero exit) on invalid data, broken internal links, duplicate URLs, missing required SEO fields, or a CSP/hash mismatch. A failed build never replaces the live site. | AC-DATA-*, AC-OPS-* |
| NFR-COST | Cost | Runs on Vercel Hobby at ₹0. No paid services. | AC-OPS-04 |
| NFR-MAINT | Maintainability | TypeScript strict, lint and format clean, no unused exports or dependencies (knip), and only the dependencies in `ARCHITECTURE.md` §2. | AC-OPS-05..07 |

## 7. Behaviour rules (exact — do not reinterpret)

### 7.1 Ordering
- **Tier rank:** top = 0, major = 1, more = 2.
- **Status rank:** deadline = 0, open = 1, auto = 1, calls = 2, announced = 3, closed = 4.
- **Recommended order:** tier rank ↑, status rank ↑, `amountLakh` ↓, name ↑.
- **Name order** everywhere in this spec means `new Intl.Collator("en").compare(a.name, b.name)`.
- **Other sorts on `/schemes/`:**
  - Largest amount: `amountLakh` ↓, then recommended.
  - Nearest deadline: status rank ↑, then recommended.
  - Easiest: effort ↑, then status rank ↑, then recommended.
  - Newest: `addedOn` ↓, then recommended.
- When a search query is active and sort = recommended, search relevance comes first (Pagefind result order), then recommended.

### 7.2 Filters (`/schemes/`)
- Within a facet the choices are OR'd; across facets they are AND'd.
- **What you get** matches if any of the scheme's types is selected.
- **Stage** works the same way on stages.
- **Sector** matches if the scheme lists the sector **or lists `all`**. The result line says "including N any-sector schemes" when N > 0.
- **Level:** All / Central / State & UT.
- **State** (one region): shows central schemes plus that region's schemes. If Level = State & UT, it shows only that region's schemes.
- **Student-only:** `student = true`.
- **Hide closed & announced:** status ∈ {open, deadline, calls, auto}.
- **Tiers:** All = all tiers; Top = tier top; Top + major = tiers top and major. An active search query ignores the tier tab and searches all tiers; the result line says so.
- **URL state:** `q`, `tier` (top|major), `level` (C|S), `st`, `type` / `stage` / `sector` (comma lists), `student=1`, `open=1`, `sort` (amt|deadline|ease|new). Defaults are omitted. Unknown values are ignored. Use `history.replaceState` (no new history entries).
- Expected counts for fixtures are in `tests/fixtures/golden.json` → `filters`.

### 7.3 Eligibility finder
The questions, in order, have these answer values:
1. Region: `""` (not incorporated / central only) or a region code.
2. Stage: `idea | early | growth`.
3. Sector: any sector key, or `all` ("Something else / general").
4. Student: `yes | no`.
5. Need:
   - `grant` → grant, challenge, fellowship, subsidy
   - `loan` → loan, guarantee
   - `equity` → equity
   - `tax` → tax, compliance, ipr
   - `incubation` → incubation, support, infrastructure, fellowship, compute
   - `procurement` → procurement, challenge
6. DPIIT recognition: `yes | no`.

**Scoring** per scheme. Excluded: state schemes of other regions, and closed schemes.

| Condition | Points |
|---|---|
| Stage matches | +3 (else −3) |
| Sector matches (sector ≠ `all`) | +4. Else, if the scheme lists `all`: +1.5. Else, if the answer ≠ `all`: −4 |
| Any type in the chosen need group | +4 |
| Student = yes and the scheme is student-friendly | +2.5 |
| Student = no, student-friendly scheme, and all its types ∈ {challenge, infrastructure} | −3 |
| State scheme (of the chosen region) | +2 |
| DPIIT = no and the scheme needs DPIIT | −1, with warning "Needs DPIIT recognition first" |
| Status = announced | −2, with warning "Not open yet" |
| Tier | top +1.6 · major +0.8 · more +0 |

- Keep schemes scoring above 2. Sort by score ↓, then id ↑. Show the top 20.
- Match % = max(35, round(score / topScore × 100)).
- Reasons shown: stage label, sector label (when it matched), need label (when it matched), "Student-friendly" (when it applied), region name (state schemes).
- Golden outputs are in `tests/fixtures/golden.json` → `finder`.

### 7.4 Similar schemes (scheme page)
- Candidates: all other schemes not in this scheme's `stacksWith`.
- Score:
  - +3 per shared specific sector (not `all`)
  - +2 per shared type
  - +1 per shared stage
  - If both are state schemes: +2 same region, else −1.5
  - −2 if the candidate is closed
  - −0.5 × candidate tier rank
- Top 4 by score ↓, then name ↑ (the collator in §7.1).

### 7.5 Compare table rows (in order)
Support · Status · Run by · Where · What you get · Stage · Sector · Effort · DPIIT needed · Students · Key benefits (first 3) · Who can apply (first 2) · First step · Remove button.

### 7.6 Topic and sector membership
- **Topics.** A scheme matches if any of its types is in the topic's type list:
  - grants: grant, fellowship, challenge
  - loans-and-credit-guarantees: loan, guarantee
  - equity-funding: equity
  - tax-and-compliance: tax, compliance
  - patents-and-ip: ipr
  - selling-to-government: procurement
  - incubation-and-mentoring: incubation, support, infrastructure, compute
  - students: `student = true` (rather than a type list)
- **Sector pages** list, as cards in recommended order, the schemes whose sectors include the key (**not** `all`). Below them, a separate mini-list "Any-sector schemes that also apply" shows the first 8, in recommended order, of the schemes with `all` in their sectors, tier `top`, status not `closed`, and not already in the main list. Card counts (golden `sectors`, AC-ROUTE-05) count the main list only.
- Copy for topics and sectors is in `reference/data-source/pages.mjs` and must be used verbatim.

### 7.7 Legacy routes (old single-page links)
Only on `/`, only when `location.hash` starts with `#/`. Test cases: `tests/fixtures/legacy-routes.json`.

| Hash | Goes to |
|---|---|
| `#/s/{id}` with a known scheme id | that scheme's URL |
| `#/map/{code}` with a known region code (any letter case) | that region's URL |
| `#/map` or `#/map/` | `/states/` |
| `#/browse` | `/schemes/` |
| `#/start` | `/start-here/` |
| `#/quiz` | `/eligibility-finder/` |
| `#/updates` | `/whats-new/` |
| `#/glossary` | `/glossary/` |
| `#/shortlist` | `/shortlist/` |
| `#/compare` | `/compare/` |
| anything else starting with `#/` | `/` (the hash is dropped) |

Hashes that do not start with `#/` (for example `#main`) are left alone.

### 7.8 Glossary linking
- Terms: every term in `glossary.json`. Anchor id: `g-` + `slugify(term)` (ARCHITECTURE §5).
- Text scanned on a scheme page, in this order: benefits, eligibility, steps. Not the name, summary, amount or anything else.
- A match is the exact term (case-sensitive) where the character before is the start of the text or not `[A-Za-z0-9-]`, and the character after is not `[A-Za-z0-9]`. When terms overlap at the same position, the longest term wins.
- Each term is linked once per page: its first match in scan order.

## 8. Content rules
- **Facts come only from data files.** Agents must never invent, round, "improve" or update amounts, dates, eligibility or links. A suspected factual error goes in the phase report under "Data questions".
- **Every page footer** states: "An independent guide, not an official government website," the last-checked date, and the PDF link.
- **Status vocabulary** (exact labels) in server-rendered HTML: Open · Opens in rounds · Closes {d Mon yyyy} · Announced · Closed · Automatic. In the browser only, a deadline stamp may be replaced by one of the live labels "{N} days left" · "1 day left" · "Last day" · "Deadline passed" (DESIGN §4.3).
- **Amounts** are shown exactly as the `amount` text in the data.
- **No placeholder text, lorem ipsum, "coming soon" sections or fake data** anywhere in shipped pages.
- **Copy style:** plain English, second person, sentence case headings; no emoji.

## 9. Global definition of done

A phase, or the project, is done only when all of these are true:
1. Every acceptance criterion assigned to it is **PASS with evidence**, or explicitly accepted by the owner as UNVERIFIED or N/A in writing.
2. `npm run verify` exits 0. It runs typecheck, lint, unit tests, build with dist verification, and end-to-end tests for the phase.
3. The adversarial audit (`AUDIT.md`) reports 0 P0 and 0 P1 findings.
4. The phase report (`templates/phase-report.md`) is committed in `docs/reports/`.
5. No item from `AGENTS.md` §4 (forbidden shortcuts) appears in the diff.
