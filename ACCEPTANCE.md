# ACCEPTANCE.md — executable acceptance criteria

Every requirement in `SPEC.md` is proven here. Each criterion has an ID, checkable conditions, a verification method and the evidence a report must show. **Agents may not edit this file.** Changes go through `docs/proposals/`.

## How to read an entry

```
### AC-XXX-NN — Title                     [methods]
Requirement: FR/NFR ids
Criteria: numbered, each true/false with no judgement needed
Verify:   where the proof lives
Evidence: what the phase report must quote
```

**Verification methods**

| Tag | Method | Rule |
|---|---|---|
| **[T]** | Automated test | A Vitest or Playwright test whose title **starts with the AC id**, e.g. `test("AC-FUNC-01 …")`. |
| **[B]** | Build check | A check in `scripts/verify-dist.ts` named `AC-…` that runs on every `npm run build` and fails the build. |
| **[L]** | Lighthouse CI | An assertion in `lighthouserc.json`. |
| **[M]** | Manual | Numbered steps plus a screenshot or recording saved under `docs/evidence/`. |
| **[P]** | Production | A command run against the live URL, with output pasted in the report. |

`scripts/ac-coverage.ts` (run in `npm run verify`) fails if any [T] or [B] criterion allocated to the current phase (the number in `.phase`) or an earlier one, per `PHASES.md` §3, has no matching test or check. From Phase 12 on, that is every [T] and [B] criterion.

Golden values are in `tests/fixtures/` (`golden.json`, `url-map.json`, `slug-cases.json`, `legacy-routes.json`, `search.json`, `invalid/`). Tests must **read** these files. They must never copy numbers into test code.

---

## A. Data contract

### AC-DATA-01 — Schema rejects invalid records [T][B]
Requirement: NFR-REL
Criteria:
1. `src/lib/schema.ts` defines the Zod schemas for schemes, regions, updates, glossary, documents, topics, sectors, roadmap, rankings and labels, exactly as in `ARCHITECTURE.md` §4; `src/content.config.ts` uses the scheme schema for the `schemes` collection.
2. Each fixture in `tests/fixtures/invalid/*.json` fails validation with a message naming the bad field. The fixtures are: missing name, unknown type, state scheme without region, deadline status without date, non-https URL, unknown `stacksWith` id, unknown document key, duplicate id.
3. `npm run build` with any invalid fixture copied into `src/data/` exits non-zero.
Verify: `tests/unit/schema.test.ts` (fixtures 01–05 against the schema, 06–08 through `validateDataset()`, as `tests/fixtures/invalid/README.md` lists), plus a build check that runs every data file through the schemas and `validateDataset()`.
Evidence: test output listing all 8 invalid fixtures rejected, and the exit code of the negative build.

### AC-DATA-02 — Migration preserves every fact [T]
Requirement: SPEC §8
Criteria:
1. `src/data/schemes/*.json` holds exactly the 115 records from `reference/data-source/` (66 central, 49 state).
2. For every record, every field mapped in `ARCHITECTURE.md` §4.3 is equal to the legacy value (strings byte-equal, arrays equal in order).
3. The same holds for regions (36), updates, glossary terms, documents, topics and sectors.
Verify: `tests/unit/migration-parity.test.ts`, which imports the legacy `.mjs` files directly.
Evidence: test output showing per-collection counts and "0 differences".

### AC-DATA-03 — Referential integrity [B]
Criteria:
1. Every `stacksWith` id exists.
2. Every `documents` key exists.
3. Every state scheme's region exists.
4. Every update's `schemeId` (if set) exists, and `labels.json` → `dpiitSchemeId` exists.
5. Every roadmap step's scheme ids exist.
Evidence: build log line `AC-DATA-03 ok (n references)`.

### AC-DATA-04 — Unique identities [B]
Criteria:
1. Scheme ids are unique.
2. Scheme URLs are unique.
3. Region slugs are unique.
4. Glossary anchors are unique.
Evidence: build log line.

### AC-DATA-05 — Counts derive from data [T]
Criteria:
1. No source file under `src/` contains the literals `115`, `66`, `49`, `36` or `175` used as counts. A lint rule or grep in `ac-coverage` enforces this.
2. The rendered home masthead counts (schemes, central, state & UT, student-friendly) equal `golden.json.totals` (an e2e test in `lists.spec.ts`).
Evidence: grep output (empty) and the test result.

### AC-DATA-06 — Past deadlines close at build [T]
Criteria:
1. A scheme with `status: deadline` whose deadline (23:59:59 IST) is before the build time renders with status Closed and note "Deadline passed on {date}".
2. Proven with an injected clock, without changing data.
Verify: `tests/unit/status.test.ts`.

---

## B. Routes

### AC-ROUTE-01 — One page per scheme at the locked URL [B]
Requirement: FR-01
Criteria:
1. For each scheme id in `url-map.json`, `dist{url}index.html` exists.
2. There are no other files under `dist/schemes/*/` or `dist/states/*/*/`.
3. The count equals `golden.totals.schemes`.
Evidence: `AC-ROUTE-01 ok 115/115`.

### AC-ROUTE-02 — Slug algorithm is exact [T]
Criteria: `lib/slug.ts` reproduces every URL in `url-map.json` from the data (including overrides), and every case in `slug-cases.json` (64-character trimming, collision suffixes, ₹, &, apostrophes, accents).
Verify: `tests/unit/slug.test.ts`.

### AC-ROUTE-03 — Trailing slash policy [T][P]
Criteria:
1. All internal `href`s to pages end in `/`.
2. On a production-like server, `/schemes/{slug}` (no slash) returns 308 to `/schemes/{slug}/`, and asset paths with extensions are not redirected.
Verify: build check for (1); a Playwright test against `scripts/serve-dist.ts` for (2); [P] for production.

### AC-ROUTE-04 — All 36 regions have pages [B]
Criteria: `dist/states/{slug}/index.html` exists for every region in `url-map.json.regions`, including regions with zero schemes (currently Lakshadweep).

### AC-ROUTE-05 — Topic and sector pages [B]
Criteria: 8 topic pages and 8 sector pages exist. Their card counts equal `golden.topics` and `golden.sectors`.

### AC-ROUTE-06 — 404 [T][P]
Criteria:
1. `dist/404.html` exists, is `noindex`, and contains a search form posting to `/schemes/`.
2. An unknown path returns HTTP 404 (locally via `serve-dist`; in production via curl).

---

## C. Search engine indexing

The build check `AC-SEO-*` runs over every HTML file in `dist/`. "Indexable" means every page in SPEC §5 marked yes.

### AC-SEO-01 — Titles [B]
Criteria:
1. Every page has exactly one non-empty `<title>` with no leading or trailing whitespace.
2. On indexable pages, titles are unique and 10–70 characters long (ARCHITECTURE §8.1 guarantees this for every scheme).

### AC-SEO-02 — Descriptions [B]
Criteria: every page has exactly one non-empty `meta[name=description]`. On indexable pages, descriptions are unique and 70–160 characters long.

### AC-SEO-03 — Canonical [B]
Criteria: every indexable page has exactly one `link[rel=canonical]`, absolute, equal to the canonical origin + the page's own path. Non-indexable pages (`/shortlist/`, `/compare/`, 404) have none.

### AC-SEO-04 — One h1 [B]
Criteria: exactly one `<h1>` per page. Headings don't skip levels (h1 → h3 without an h2 fails).

### AC-SEO-05 — Robots meta [B]
Criteria:
1. Indexable pages have `index,follow,max-image-preview:large,max-snippet:-1`.
2. Shortlist, compare and 404 have `noindex,follow`.

### AC-SEO-06 — Sitemap parity [B]
Criteria:
1. `dist/sitemap-index.xml` (or `sitemap.xml`) lists **exactly** the indexable set: no extras, no omissions, no duplicates.
2. Each entry has `lastmod` = `lastVerified`.
3. The count equals `golden.totals.indexablePages`.

### AC-SEO-07 — robots.txt [B][P]
Criteria:
1. `dist/robots.txt` equals the base file in SECURITY §4 byte for byte (with the canonical origin in the `Sitemap` line). It disallows nothing for `User-agent: *`.
2. If D2 = Block, it adds one `Disallow: /` group for each AI user agent listed in SECURITY §4, in that order, and nothing else.

### AC-SEO-08 — Structured data [B]
Criteria:
1. Every JSON-LD block parses as JSON.
2. Types per ARCHITECTURE §8.2 are present per template.
3. Required properties are present (name, url, provider name and areaServed for `GovernmentService`; `itemListElement` for lists; breadcrumb items with absolute URLs).
4. The JSON-LD is generated through `schema-dts`-typed builders, so a type error fails `astro check`.

### AC-SEO-09 — Social cards [B]
Criteria:
1. On every indexable page, `og:title`, `og:description`, `og:url` (= canonical), `og:image` (absolute), `og:image:width=1200`, `og:image:height=630`, `og:image:alt` and `twitter:card=summary_large_image` are all present. Non-indexable pages have none of the `og:*` or `twitter:*` tags.
2. The image file exists in `dist` and is 1200×630 PNG.
3. Every scheme page and every region page has its own image.

### AC-SEO-10 — Breadcrumbs [B]
Criteria:
1. Scheme, region, topic and sector pages render a visible breadcrumb `nav[aria-label=Breadcrumb]`.
2. It matches the page's `BreadcrumbList` JSON-LD item for item.

### AC-SEO-11 — No broken internal links [B]
Criteria: every internal `href` or `src` in `dist` resolves to a file, except paths under `/_vercel/insights/`, which Vercel serves in production when D4 = On. `linkinator` in CI also reports 0 broken internal links (with the same exception).

### AC-SEO-14 — Valid HTML [B]
Criteria: `html-validate` with `.html-validate.json` (TESTING §4) reports 0 errors over every HTML file in `dist`.
Evidence: `AC-SEO-14 ok {n} files`.

### AC-SEO-12 — Content without JavaScript [T]
Criteria: in the Playwright project `no-js` (JavaScript disabled):
1. Home, `/schemes/`, one central scheme page, one state scheme page, one region page and one topic page render their `h1`, all scheme cards or sections, the official link and the steps.
2. No element promises interaction that can't work: filter, sort and save controls are hidden without JS.

### AC-SEO-13 — Internal linking depth [B]
Criteria: every indexable page is reachable from `/` within 3 link hops, computed from `dist` HTML.

---

## D. Content

### AC-CONTENT-01 — Scheme page anatomy [T]
Criteria: for 3 sample schemes (one central, one state, one with status deadline), the page contains every element listed in FR-01, in the order specified in DESIGN §4.6.

### AC-CONTENT-02 — Facts rendered verbatim [T]
Criteria: for every scheme, the rendered page contains its `amount`, name, every benefit, every eligibility line, every step and the official URL, verbatim. Glossary links may wrap terms, but the text content stays equal.

### AC-CONTENT-03 — Status vocabulary [T]
Criteria: in the server-rendered HTML (the `no-js` project, or `dist` files), every status stamp's text is exactly the SPEC §8 label for its status. Live deadline labels are covered by AC-FUNC-29.

### AC-CONTENT-04 — Related lists follow the rules [T]
Criteria: "Similar schemes" for 5 fixture schemes equal the output of SPEC §7.4. "Stacks well with" equals the data.

### AC-CONTENT-05 — Region pages [T]
Criteria:
1. The count of state schemes equals `golden.stateCounts[code]`.
2. The ranking label appears when a ranking exists.
3. The zero-scheme region shows the fallback copy and the central list.

### AC-CONTENT-06 — Topic and sector pages [T]
Criteria:
1. The intro copy equals `pages.mjs`.
2. The list follows SPEC §7.6, in recommended order.

### AC-CONTENT-07 — Home page [T]
Criteria: FR-04 elements are present; the top-tier count equals `golden.filters["tier=top"]`; exactly 6 updates are shown, newest first.

### AC-CONTENT-08 — What's new [T]
Criteria: all updates, newest first, each with a working link.

### AC-CONTENT-09 — Start here [T]
Criteria: 10 founder steps and 6 student steps in data order; the chips link to the right schemes.

### AC-CONTENT-10 — About [T][P]
Criteria: contains the sections of DESIGN §4.12 (scope, method, not-official statement, privacy statement, PDF link). The analytics sentence is present if and only if `PUBLIC_ANALYTICS=on`; the e2e suite runs on `build:test` (`off`) and expects it absent; when D4 = On, the Phase 14 [P] check confirms it on production.

### AC-CONTENT-11 — PDF [B][P]
Criteria: `dist/founders-field-guide-sep-2026.pdf` exists, is byte-equal to `reference/founders-field-guide-sep-2026.pdf`, and is served as `application/pdf`.

### AC-CONTENT-12 — Disclaimer and footer on every page [B]
Criteria: every HTML page's footer contains the not-official statement, the last-checked date and the PDF link.

---

## E. Features

Every test in this section runs in the Playwright projects `mobile-390` and `desktop-1440` unless it says otherwise.

### AC-FUNC-01 — Filter results equal the rules [T]
Criteria: for every key in `golden.filters`, loading `/schemes/?{key}` shows exactly that many visible cards, and the result line states that number.

### AC-FUNC-02 — Facet logic [T]
Criteria: OR within a facet and AND across facets. The sector filter includes any-sector schemes and the result line reports how many. Proven with 3 combinations checked against the reference predicate in `tests/helpers/predicate.ts`, which implements SPEC §7.2.

### AC-FUNC-03 — Tier tabs [T]
Criteria:
1. Top shows `golden.filters["tier=top"]` cards; Top + major shows `golden.filters["tier=major"]`; All shows every card.
2. An active search ignores tiers, and the result line says so.

### AC-FUNC-04 — Sorts [T]
Criteria: each of the 5 sorts produces the SPEC §7.1 order, compared against `tests/helpers/order.ts` for the full list.

### AC-FUNC-05 — URL state round-trips [T]
Criteria:
1. Applying filters updates the query string with canonical encoding.
2. Reloading reproduces the same visible set and control states.
3. No history entries are added.

### AC-FUNC-06 — Empty state [T]
Criteria: a combination with 0 results shows the empty message and a working "Clear filters" button.

### AC-FUNC-07 — Filter sheet on phones [T]
Criteria, below 980 px:
1. The Filters button opens a bottom sheet.
2. Focus moves into the sheet.
3. Tab cycles within the sheet.
4. Esc, the close button, the backdrop and "Show N schemes" all close it.
5. Focus returns to the Filters button.
6. The body doesn't scroll behind the open sheet.
7. The button shows the active-filter count.

### AC-FUNC-08 — Filters without JS [T]
Criteria: in `no-js`, all cards are visible and no filter controls are shown.

### AC-FUNC-09 — Result line is announced [T]
Criteria: the result line is in an `aria-live="polite"` region and updates on each change.

### AC-FUNC-10 — Search finds schemes [T]
Criteria:
1. The queries in `tests/fixtures/search.json` return result sets containing the listed ids (for example, "kerala" contains `kl-grants`, `kl-seed`, `kl-iedc`; "patent" contains `sipp`; "prototype grant" contains `prayas`).
2. Queries with no match show the empty state.

### AC-FUNC-11 — Search entry points [T]
Criteria:
1. The home and 404 search forms submit to `/schemes/?q=…` and the query is applied on arrival.
2. The header search link focuses the search box on `/schemes/`.

### AC-FUNC-12 — Search is lazy [T]
Criteria:
1. No Pagefind file is requested until the search input is focused or a `q` parameter is present.
2. Verified by network log.

### AC-FUNC-13 — Finder flow [T]
Criteria:
1. 6 questions in order, with back and next.
2. Next without an answer shows "Pick an answer to continue" and doesn't advance.
3. Progress shows N of 6.

### AC-FUNC-14 — Finder results equal the algorithm [T]
Criteria: for each scenario in `golden.finder`, after answering:
1. The result count equals `count`.
2. The first 5 result ids equal `top5`, in order.
3. The match % values follow SPEC §7.3.

### AC-FUNC-15 — Finder persistence [T]
Criteria: answers persist (`ffg:quiz`). Revisiting with complete answers opens on results. "Change answers" restarts at question 1 with the previous answers selected.

### AC-FUNC-16 — Finder save-all [T]
Criteria: "Save all" adds every result id to the shortlist without duplicates, and the header count updates.

### AC-FUNC-17 — Shortlist toggles everywhere [T]
Criteria: the save controls on cards (home, `/schemes/`, region, topic pages) and on scheme pages toggle membership. `aria-pressed` reflects the state. The accessible name does not change with the state and contains the visible label, if there is one (WCAG 2.5.3; names in DESIGN §4.4 and §4.6). The count updates in the header and the tab bar.

### AC-FUNC-18 — Shortlist persists and syncs [T]
Criteria:
1. It survives a reload.
2. A change in one tab reflects in another open tab within 1 s.
3. Invalid stored JSON or unknown ids are ignored without error.

### AC-FUNC-19 — Shortlist page [T]
Criteria:
1. It lists saved schemes in saved order.
2. Print shows only the list.
3. "Compare first three" sets compare to the first 3 and opens `/compare/`.
4. Clear asks for confirmation, then empties.

### AC-FUNC-20 — Compare limit [T]
Criteria: a 4th add is refused with the message "You can compare up to 3 — remove one first", and the state is unchanged.

### AC-FUNC-21 — Compare tray [T]
Criteria: the tray is visible on all pages except `/compare/` whenever 1–3 schemes are selected. It shows abbreviations, sits above the tab bar on phones, and Clear empties it.

### AC-FUNC-22 — Compare table [T]
Criteria: the rows follow SPEC §7.5, the values match the data, and Remove updates the table in place.

### AC-FUNC-23 — Document checklist [T]
Criteria: ticks persist per scheme (`ffg:docs`), and ticking on one scheme doesn't affect another.

### AC-FUNC-24 — Share [T]
Criteria:
1. With `navigator.share` stubbed, it is called with title, text and the canonical URL.
2. Without it, the clipboard receives the canonical URL and the toast says "Link copied".

### AC-FUNC-25 — Print styles [T]
Criteria: in `emulateMedia({media:"print"})`, the header, tab bar, tray, action buttons and footer are hidden, and the main content is visible.

### AC-FUNC-26 — Glossary anchors [B]
Criteria: every glossary term has `id="g-{slug}"`, and every in-text term link points to an existing anchor.

### AC-FUNC-27 — Glossary popover [T]
Criteria:
1. Activating a term link with JS shows a popover with the term and definition, positioned within the viewport at 320 px.
2. Esc, scrolling and outside clicks close it.
3. Without JS, the link navigates to the glossary anchor.

### AC-FUNC-28 — Legacy redirects [T]
Criteria: for every case in `tests/fixtures/legacy-routes.json`, visiting `/` plus the hash ends on `expect` (pathname, no hash) through `location.replace`, and the hashes in `untouched` cause no navigation (SPEC §7.7).

### AC-FUNC-29 — Live deadline labels [T]
Criteria: for a fixture scheme with status `deadline`, with the browser clock set (Playwright `page.clock`) to 10:00 IST on 4 days — 15 days before, 1 day before, the deadline day, and 1 day after — the stamp text is exactly "Closes {d Mon yyyy}", "1 day left", "Last day" and "Deadline passed", per DESIGN §4.3.

### AC-FUNC-30 — Theme [T]
Criteria:
1. The default follows `prefers-color-scheme`.
2. The toggle switches and persists (`ffg:theme`).
3. There is no flash: the first paint (screenshot at DOMContentLoaded with dark stored) is dark.
4. The toggle's accessible name states the action.

---

## F. Mobile

### AC-MOB-01 — No horizontal overflow [T]
Criteria: on every template (home, `/schemes/`, sheet open, central scheme, state scheme, states index, region, zero-scheme region, topic, sector, start-here, finder question, finder results, what's new, glossary, about, shortlist with 3, compare with 3, 404), `document.documentElement.scrollWidth - innerWidth` is 0 at 320, 360, 390, 768, 1024 and 1440. The compare table scrolls inside its own container.

### AC-MOB-02 — Tap targets [T]
Criteria: every `button`, `select`, `input` and non-inline `a` (not inside running text) has a bounding box of at least 44×44 at 390 px, measured as DESIGN §8 defines (checkboxes and radios by their `label`; stretched links by their card). Chips inside the desktop filter sidebar need only 36 px, at desktop widths only.

### AC-MOB-03 — Input text size [T]
Criteria: computed `font-size` ≥ 16px for every `input` and `select` at 390 px.

### AC-MOB-04 — Tab bar [T]
Criteria:
1. Below 980 px, a fixed bottom nav with 5 items (Home, Schemes, Finder, States, Saved) is present, the current section is marked `aria-current="page"`, and content isn't hidden behind it (last element fully visible when scrolled to the bottom).
2. At 980 px and above it is absent and the header nav is shown.

### AC-MOB-05 — Safe areas [M]
Criteria: on an iOS device or simulator with a notch, the header and tab bar clear the notch and home indicator. Evidence: screenshot.

---

## G. Accessibility

### AC-A11Y-01 — Automated scan [T]
Criteria: `@axe-core/playwright` with tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` reports zero violations of impact serious or critical on every AC-MOB-01 template, at 390 and 1440, in light and dark.

### AC-A11Y-02 — Keyboard [T]
Criteria:
1. Every interactive element is reachable by Tab in DOM order and operable by Enter or Space.
2. A skip link to `#main` is the first focusable element.
3. Focus is always visible (outline ≥ 2px, contrast ≥ 3:1).

### AC-A11Y-03 — Focus management [T]
Criteria:
1. Sheet (AC-FUNC-07).
2. Finder: on each question change, focus moves to the question heading.
3. The popover is dismissible by Esc, and focus stays on its trigger.

### AC-A11Y-04 — Names and states [T]
Criteria:
1. Icon-only buttons and links have accessible names.
2. Toggle buttons expose `aria-pressed`.
3. Landmarks (`header`, `nav`, `main`, `footer`) are present once each (nav may repeat with distinct labels).

### AC-A11Y-05 — Contrast [T]
Criteria: axe `color-contrast` passes in both themes. The design tokens in DESIGN §2 are verified by `tests/unit/contrast.test.ts` (text pairs ≥ 4.5:1, large text and UI ≥ 3:1).

### AC-A11Y-06 — Reduced motion [T]
Criteria: with `prefers-reduced-motion: reduce`, there are no CSS animations or transitions longer than 0.01 s on page load or sheet open.

### AC-A11Y-07 — Screen reader spot check [M]
Criteria: with VoiceOver (iOS) or TalkBack, and NVDA or VoiceOver (desktop), complete: search to scheme page → save → open shortlist; and finder to results. Evidence: notes of what was announced at each step.

---

## H. Performance

### AC-PERF-01 — Lighthouse budgets [L]
Criteria: on `/`, `/schemes/credit-guarantee-scheme-for-startups/` and `/schemes/`, mobile preset, median of 3 runs:
- Performance ≥ 0.90, Accessibility ≥ 0.95, Best Practices ≥ 0.95, SEO = 1.00
- LCP ≤ 2000 ms, CLS ≤ 0.05, TBT ≤ 200 ms

### AC-PERF-02 — JavaScript budgets [B]
Criteria: compressed (gzip) JS loaded on first paint, measured as TESTING §6 describes: `/schemes/`, `/eligibility-finder/`, `/shortlist/` and `/compare/` ≤ 60 KB each (not counting the client data JSON); every other page ≤ 25 KB. Pagefind files are excluded because they load lazily (AC-FUNC-12). Computed from `dist` by walking each page's module graph.

### AC-PERF-03 — Fonts [B]
Criteria:
1. At most 9 font files, each ≤ 30 KB, all `woff2`, self-hosted.
2. At most 2 preloaded per page.
3. `font-display: swap`.

### AC-PERF-04 — HTML weight [B]
Criteria: page HTML, uncompressed: `/schemes/` ≤ 450 KB; pages that list scheme cards (home, region, topic, sector) ≤ 220 KB; every other page ≤ 120 KB.

### AC-PERF-05 — Caching [T][P]
Criteria: hashed assets (`/_astro/*`, `/fonts/*`) are served with `Cache-Control: public, max-age=31536000, immutable`. HTML is not given long-lived caching.

---

## I. Security and privacy

### AC-SEC-01 — Response headers [T][P]
Criteria: every HTML response carries exactly the headers in SECURITY §2 (name and value), checked locally through `serve-dist` (which applies `vercel.json`) and in production with curl.

### AC-SEC-02 — CSP in HTML [B]
Criteria:
1. Every HTML page has the Astro-generated CSP meta tag.
2. The hash of every inline executable `<script>` and every inline `<style>` is listed in it. JSON-LD blocks (`type="application/ld+json"`) are data, are not executed, and are excluded.
3. There is no `'unsafe-inline'` or `'unsafe-eval'` for scripts.
4. `'wasm-unsafe-eval'` is present only because Pagefind needs it.

### AC-SEC-03 — Zero CSP violations [T]
Criteria: across the full e2e suite, a `securitypolicyviolation` listener and console capture record zero violations.

### AC-SEC-04 — No third-party requests [T]
Criteria: across the e2e suite, every network request goes to the site origin. The only non-file path allowed is `/_vercel/insights/*` when D4 = On.

### AC-SEC-05 — Safe rendering [B]
Criteria:
1. No `set:html` or `dangerouslySetInnerHTML` except the typed JSON-LD serializer (which escapes `<`).
2. No inline event-handler attributes (`on*=`) in `dist`.
3. No `style=` attributes in `dist` HTML.
4. External links use `rel="noopener"`.

### AC-SEC-06 — Dependencies [T]
Criteria:
1. All dependency versions are exact (no `^` or `~`).
2. `package-lock.json` is committed.
3. `npm run audit` (`npm audit --omit=dev --audit-level=high`) exits 0. It needs the network, so it is not part of the unit test: its output is quoted in the reports of Phases 1, 9, 12 and 14, and it runs in CI.
4. Only packages in ARCHITECTURE §2 are present, each at its exact version and not before its phase (knip plus an allowlist test).

### AC-SEC-07 — Firewall configured [P][M]
Criteria: the Vercel project has:
1. The rate-limit rule, the scanner-deny rule and bot protection exactly as SECURITY §3, and AI bots per D2.
2. Evidence: screenshots of the Firewall rules page, plus a curl showing `/.env` → 403 in production.

### AC-PRIV-01 — No cookies [T][P]
Criteria:
1. `document.cookie === ""` after visiting every template.
2. No `Set-Cookie` header on any response.

### AC-PRIV-02 — Storage keys [T]
Criteria: after exercising every feature, localStorage contains only keys starting with `ffg:` (`shortlist`, `compare`, `docs`, `quiz`, `theme`).

---

## J. Operations and maintainability

### AC-OPS-01 — Build fails closed [T]
Criteria: each of these makes `npm run build` exit non-zero:
1. Invalid data (AC-DATA-01).
2. An injected broken internal link.
3. A duplicate title.
4. A missing canonical.
5. An inline script missing from the CSP hash list.
Proven by `tests/unit/fail-closed.test.ts` using temporary fixtures.

### AC-OPS-02 — Reproducible build [T]
Criteria: two consecutive clean builds produce byte-identical `dist` (excluding the Pagefind index, whose content must still be equal once normalized).

### AC-OPS-03 — Node and scripts [B]
Criteria:
1. `engines.node` is `>=22.22.3 <23`.
2. `.nvmrc` is `22`.
3. `npm run verify` runs, in order: typecheck, lint, format check, knip, unit tests, build (with verify-dist), ac-coverage and e2e.

### AC-OPS-04 — Free tier fit [M]
Criteria: the phase 14 report records first-week Vercel usage (edge requests, data transfer, rate-limit checks), each under 10% of the Hobby limits.

### AC-OPS-05 — Type safety [T]
Criteria: `astro check` and `tsc --noEmit` report 0 errors. There are no `any`, `@ts-ignore` or `@ts-expect-error` in `src/` (ESLint rule).

### AC-OPS-06 — Lint and format [T]
Criteria: ESLint and Prettier are clean. There are no `eslint-disable` comments without an ADR reference.

### AC-OPS-07 — No dead code [T]
Criteria: `knip` reports 0 unused files, exports and dependencies.

### AC-OPS-08 — CI (if D3 = Yes) [M]
Criteria:
1. `.github/workflows/ci.yml` runs `npm run verify` and Lighthouse CI on push and PR.
2. `.github/workflows/daily-rebuild.yml` calls the Vercel deploy hook (a GitHub secret) at 00:30 UTC (06:00 IST).
3. Evidence: links to one green run of each.

### AC-OPS-09 — Traceability [T]
Criteria: `scripts/ac-coverage.ts` confirms that every [T] and [B] id allocated to the current phase or earlier (`PHASES.md` §3) has at least one test title or verify-dist check starting with that id, and that no test references a non-existent AC id. A self-test proves it fails when a covered title is removed. From Phase 12 on it covers every [T] and [B] id.

---

## K. Design fidelity

### AC-DES-01 — Tokens [T]
Criteria: CSS custom properties in `src/styles/tokens.css` equal DESIGN §2, in both themes (parsed and compared by a unit test).

### AC-DES-02 — Visual match to approved canvas [M]
Criteria: screenshots of the home, scheme, `/schemes/` (sheet open), region and finder templates at 390 and 1440 are placed side by side with the approved screenshots in `reference/design/screens/` under `docs/evidence/design/`. The owner signs off home, scheme and region in the Phase 4 report, `/schemes/` in the Phase 5 report and the finder in the Phase 6 report.

### AC-DES-03 — Visual regression baseline [T]
Criteria: after owner sign-off, Playwright `toHaveScreenshot` baselines exist for the AC-DES-02 templates (maxDiffPixelRatio 0.01). Updating a baseline requires the owner's approval, noted in the report.

---

## L. Production verification (phase 14)

### AC-PROD-01 — Live smoke [P]
Criteria: against the production origin:
1. `curl -sI` on `/`, one scheme URL, `/sitemap-index.xml`, `/robots.txt` and the PDF returns 200 with the expected content types.
2. A random path returns 404.
3. A no-slash scheme URL returns 308.
4. Headers are as in AC-SEC-01.

### AC-PROD-02 — Search Console [M]
Criteria:
1. The property is verified.
2. The sitemap is submitted with status Success.
3. URL inspection "live test" of home and one scheme page shows "URL is available to Google" and detects the structured data.
Evidence: screenshots.

### AC-PROD-03 — Rich results [M]
Criteria: the Rich Results Test and the Schema Markup Validator show no errors for one scheme, one region and one topic page.

### AC-PROD-04 — Real-device check [M]
Criteria: on one Android and one iOS phone, open home → search "kerala" → open a scheme → save → finder → results. No layout problems. Evidence: screenshots.

### AC-PROD-05 — Rollback rehearsed [M]
Criteria: the owner has performed one Vercel Instant Rollback to the previous deployment and back, recorded in the report.
