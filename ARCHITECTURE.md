# ARCHITECTURE.md — locked technical design

This file defines **how** the site is built. Everything here is **locked**. An agent that believes something here is wrong or impossible stops and writes a proposal (`docs/proposals/`). It does not work around it. Changes are recorded as ADRs in `docs/adr/`.

---

## 1. Shape of the system

```
data (JSON, Zod-validated)
   │  astro build (static)
   ▼
dist/  ── HTML pages (~175 indexable), /_astro/* hashed CSS+JS, /pagefind/*, /og/*.png,
          /data/schemes.json, sitemap, robots.txt, fonts, PDF
   │  git push → Vercel build → Vercel CDN (firewall + vercel.json headers)
   ▼
browser: plain HTML first → small bundled scripts (event delegation) → Preact islands where needed
          state: nanostores persisted to localStorage (ffg:*) · search: Pagefind (lazy)
```

- **No server code.** There are no `src/pages/api/*` routes, no `export const prerender = false`, no middleware, no adapters.
- `output: 'static'` is the only mode.

## 2. Stack (exact, pinned)

`package.json` uses **exact versions** (no `^` or `~`) and `package-lock.json` is committed. Node **22.x, at least 22.22.3** (`engines.node: ">=22.22.3 <23"`, `.nvmrc: 22`), npm.

| Package | Version | Kind | Added in phase | Purpose |
|---|---|---|---|---|
| astro | 7.3.3 | dep | 1 | Static site framework |
| @astrojs/preact | 6.0.5 | dep | 5 | Preact islands |
| preact | 10.29.8 | dep | 5 | UI for islands |
| nanostores | 1.5.3 | dep | 4 | Shared client state |
| @nanostores/persistent | 1.3.5 | dep | 4 | localStorage persistence and cross-tab sync |
| @nanostores/preact | 1.1.0 | dep | 6 | Store hooks in islands |
| @astrojs/sitemap | 3.7.4 | dep | 8 | Sitemap |
| astro-pagefind | 2.0.1 | dep | 5 | Runs Pagefind after build |
| pagefind | 1.5.2 | dep | 5 | Static search index and client |
| schema-dts | 2.0.0 | dep | 8 | Typed JSON-LD |
| astro-og-canvas | 0.13.2 | dep | 8 | Social images at build |
| @lucide/astro | 1.47.0 | dep | 3 | Icons in `.astro` components |
| lucide-preact | 1.47.0 | dep | 5 | Icons in islands (same icon set) |
| typescript | 6.0.3 | dev | 1 | `@astrojs/check` requires ^5 or ^6. **Not 7.x.** |
| @astrojs/check | 0.9.10 | dev | 1 | Type-checking `.astro` files |
| @types/node | 22.20.3 | dev | 1 | Node types |
| vitest | 5.0.1 | dev | 1 | Unit tests |
| @playwright/test | 1.63.0 | dev | 1 | End-to-end tests |
| @axe-core/playwright | 4.13.0 | dev | 11 | Accessibility scans |
| @lhci/cli | 0.15.1 | dev | 1 | Lighthouse CI |
| linkinator | 8.1.0 | dev | 1 | Link check (CI) |
| html-validate | 11.16.0 | dev | 3 | HTML validity |
| eslint | 10.10.0 | dev | 1 | Lint |
| typescript-eslint | 8.70.0 | dev | 1 | TypeScript lint rules |
| eslint-plugin-astro | 3.2.1 | dev | 1 | Astro lint rules |
| prettier | 3.9.8 | dev | 1 | Formatting |
| prettier-plugin-astro | 1.0.1 | dev | 1 | Astro formatting |
| knip | 6.37.0 | dev | 1 | Unused files, exports and dependencies |
| tsx | 4.23.13 | dev | 1 | Running TypeScript scripts |
| node-html-parser | 9.0.4 | dev | 3 | HTML and XML parsing in `verify-dist.ts` and tests (never regex over HTML) |

**Fonts are files, not a package.** The 9 font files are committed in `public/fonts/` (copied byte-for-byte from `reference/fonts/`). They were cut from `@fontsource/*` 5.3.0 (SIL OFL 1.1) as Latin + ₹ subsets, because the Fontsource CSS would ship both `woff` and `woff2`, split every weight into several files, and put ₹ in a separate Latin-Extended file. See DESIGN §3 and ADR 0006.

**When packages are added.** Each package is added, at exactly this version, in the phase shown (the phase that first imports or runs it), so that `knip` never has to ignore an unused dependency. Adding one earlier or later is a finding. Phase 0 still installs the **whole** set together in its spike to prove the versions are compatible (A6). `linkinator` and `@lhci/cli` count as used from Phase 1 because `package.json` scripts run them. `astro.config.mjs` starts in Phase 1 with only the core settings (including `markdown: { syntaxHighlight: false }`) and `security.csp`; each integration is added to it in its package's phase (`@astrojs/preact` and `astro-pagefind` in Phase 5, `@astrojs/sitemap` in Phase 8).

**Dependency rule:** no other package may be added without an ADR approved by the owner. Phase 0 verifies peer compatibility of this exact set (§11). If a version conflicts, Phase 0 proposes the nearest compatible version in an ADR. It does not silently pick one.

Explicitly **not** used: Tailwind or any CSS framework, React, jQuery, Alpine, a CMS, analytics SDKs, Google Fonts at runtime, any CDN.

## 3. Folder structure (exact)

```
/
├─ SPEC.md  ACCEPTANCE.md  ARCHITECTURE.md  DESIGN.md  SECURITY.md  TESTING.md
├─ AGENTS.md  AUDIT.md  PHASES.md  README.md
├─ CLAUDE.md  GEMINI.md          one-line pointers so each CLI loads its rules (AGENTS §1)
├─ templates/                    phase-report, audit-report, adr, proposal, manual-check
├─ package.json  package-lock.json  .nvmrc  tsconfig.json  astro.config.mjs
├─ vercel.json  playwright.config.ts  vitest.config.ts  lighthouserc.json
├─ eslint.config.js  .prettierrc  .prettierignore  knip.json  .html-validate.json  .gitignore  .npmrc
├─ .phase                       current phase number, one line (TESTING §2)
├─ .github/workflows/ci.yml  daily-rebuild.yml        (only if D3 = Yes)
├─ docs/
│  ├─ adr/NNNN-title.md          decisions
│  ├─ proposals/NNNN-title.md    change requests to SPEC/ACCEPTANCE/ARCHITECTURE
│  ├─ reports/phase-NN.md        builder reports
│  ├─ audits/phase-NN-audit-K.md reviewer reports
│  └─ evidence/                  screenshots, manual-check notes
├─ reference/                    READ-ONLY inputs (never imported by src/)
│  ├─ data-source/*.mjs          legacy data (migration source)
│  ├─ design/site.css            approved visual reference (see DESIGN §8 for known deltas)
│  ├─ design/screens/*.png       approved screenshots per template (AC-DES-02)
│  ├─ design/prototype/*.html    rendered prototype pages (markup reference and copy source, DESIGN §9)
│  ├─ fonts/*.v1.woff2 + OFL-*.txt  font files to copy into public/fonts
│  ├─ icons/                     favicon, app icons and manifest to copy into public/
│  └─ founders-field-guide-sep-2026.pdf
├─ public/
│  ├─ founders-field-guide-sep-2026.pdf
│  ├─ fonts/*.v1.woff2  fonts/OFL-newsreader.txt  fonts/OFL-ibm-plex.txt   from reference/fonts (DESIGN §3)
│  ├─ favicon.svg  favicon.ico  icons/(apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png)
│  └─ manifest.webmanifest     all byte-copied from reference/icons/ (favicon.* and manifest at the root, PNGs in icons/)
├─ scripts/
│  ├─ migrate-legacy.ts          Phase 2, one-off, kept for traceability
│  ├─ verify-dist.ts             post-build contract checks (AC-… [B])
│  ├─ serve-dist.ts              local server applying vercel.json headers + trailingSlash
│  ├─ build-test.ts              runs `npm run build` with BUILD_DATE = golden.json.buildDate (cross-platform)
│  └─ ac-coverage.ts             AC traceability check
├─ src/
│  ├─ assets/og-wordmark.png     social-image wordmark (DESIGN §5); read by pages/og at build, never published
│  ├─ content.config.ts          the `schemes` collection only (§4.1)
│  ├─ data/
│  │  ├─ schemes/{id}.json       one file per scheme
│  │  ├─ regions.json  updates.json  glossary.json  documents.json
│  │  ├─ topics.json  sectors.json  roadmap.json  rankings.json  labels.json  order.json
│  ├─ lib/                       PURE TypeScript. No DOM, no `astro:*` imports (`astro/zod` is allowed).
│  │  ├─ slug.ts  urls.ts  order.ts  filters.ts  finder.ts  similar.ts
│  │  ├─ status.ts  format.ts  glossary.ts  seo.ts  jsonld.ts  content.ts  schema.ts  data.ts
│  ├─ stores/                    nanostores only
│  │  ├─ shortlist.ts  compare.ts  docs.ts  quiz.ts  theme.ts
│  ├─ scripts/                   small bundled client modules (event delegation)
│  │  ├─ actions.ts  glossary-popover.ts  share-print.ts  deadlines.ts
│  │  ├─ doc-checklist.ts  theme-toggle.ts  legacy-redirect.ts  toast.ts
│  ├─ islands/                   Preact components (.tsx)
│  │  ├─ BrowseControls.tsx  EligibilityFinder.tsx  ShortlistView.tsx
│  │  ├─ CompareView.tsx  CompareTray.tsx
│  ├─ components/                Astro components (server-only markup)
│  │  ├─ Layout.astro  Head.astro  Header.astro  Footer.astro  TabBar.astro
│  │  ├─ Breadcrumbs.astro  SchemeCard.astro  Stamp.astro  Chip.astro  Button.astro
│  │  ├─ SearchBar.astro  TileMap.astro  MiniList.astro  StatsGrid.astro
│  │  ├─ Steps.astro  DocChecklist.astro  GlossaryText.astro  JsonLd.astro
│  ├─ styles/  tokens.css  fonts.css  base.css  print.css  (component styles live in each .astro file)
│  └─ pages/
│     ├─ index.astro  404.astro  start-here.astro  eligibility-finder.astro
│     ├─ whats-new.astro  glossary.astro  about.astro  shortlist.astro  compare.astro
│     ├─ schemes/index.astro  schemes/[slug].astro
│     ├─ states/index.astro  states/[region]/index.astro  states/[region]/[slug].astro
│     ├─ topics/[topic].astro  sectors/[sector].astro
│     ├─ og/[...route].ts        astro-og-canvas
│     ├─ robots.txt.ts           from D2 (SECURITY §4)
│     └─ data/schemes.json.ts    static endpoint for islands (§6.3)
└─ tests/
   ├─ unit/*.test.ts             Vitest
   ├─ e2e/*.spec.ts              Playwright
   ├─ e2e/fixtures.ts            extended `test` with automatic guards (TESTING §5.1)
   ├─ helpers/                   independent reference implementations (predicate.ts, order.ts) + templates.ts (URL list for sweeps)
   └─ fixtures/                  golden.json, url-map.json, slug-cases.json, legacy-routes.json, search.json, invalid/*.json
```

## 4. Data contract

### 4.1 Zod schema (authoritative)

The schemas live in **`src/lib/schema.ts`**, which imports `z` from `astro/zod` and nothing else, so the same module runs in Astro, in Vitest and in `tsx` scripts (Assumption A10). `src/content.config.ts` imports `SchemeSchema` from it.

```ts
// src/lib/schema.ts (shape; implementation may split helpers but not change rules)
import { z } from "astro/zod";
const TYPE = z.enum(["grant","loan","equity","guarantee","tax","ipr","procurement","incubation",
  "fellowship","subsidy","challenge","compute","infrastructure","compliance","support"]);
const STAGE = z.enum(["idea","early","growth"]);
const SECTOR = z.enum(["all","tech","deeptech","manufacturing","bio","agri","defence","space","climate","telecom","rail"]);
const STATUS = z.enum(["open","calls","deadline","announced","closed","auto"]);
const TIER = z.enum(["top","major","more"]);
const REGION_CODE = z.string().regex(/^[A-Z]{2}$/);

const Scheme = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(3), abbr: z.string().min(2), body: z.string().min(3),
  level: z.enum(["central","state"]), region: REGION_CODE.optional(),
  types: z.array(TYPE).min(1), stages: z.array(STAGE).min(1), sectors: z.array(SECTOR).min(1),
  amount: z.string().min(2), amountLakh: z.number().min(0),
  student: z.boolean(), needsDpiit: z.boolean(),
  status: STATUS, deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), statusNote: z.string().optional(),
  effort: z.union([z.literal(1), z.literal(2), z.literal(3)]), tier: TIER,
  addedOn: z.string().regex(/^\d{4}-\d{2}$/),
  summary: z.string().min(40), benefits: z.array(z.string().min(3)).min(1),
  eligibility: z.array(z.string().min(3)).min(1), documents: z.array(z.string()),
  steps: z.array(z.string().min(3)).min(1),
  officialUrl: z.string().url().startsWith("https://"),
  stacksWith: z.array(z.string()), verifiedNote: z.string().min(3)
}).strict()
 .refine(s => s.level === "state" ? !!s.region : !s.region,
         { message: "state schemes need region; central must not", path: ["region"] })
 .refine(s => s.status !== "deadline" || !!s.deadline,
         { message: "deadline status needs deadline", path: ["deadline"] });
```

The other data files, with the same `.strict()` rule:
- **Region:** `{code, name, col:int 0–9, row:int 0–7, ut:boolean}`
- **Update:** `{date:YYYY-MM-DD, title, text, schemeId?}`
- **GlossaryTerm:** `{term, definition}`
- **DocumentType:** `{key, label}`
- **Topic:** `{slug, short, home:boolean, types:TYPE[] | "student", filter, title, h1, description, blurb, intro:string[]}`
- **Sector:** `{key:SECTOR, slug, short, blurb, title, h1, description, intro:string[]}`
- **Roadmap:** `{founder: Step[], student: Step[]}`, where `Step = {title, text, schemeIds:string[]}`
- **Rankings:** `Record<REGION_CODE, "Best Performer"|"Top Performer"|"Leader"|"Aspiring Leader"|"Emerging">`
- **Labels:** the display labels for `TYPE`, `STAGE` and `SECTOR`, copied verbatim from the legacy `meta.mjs`. **Effort labels** are the ones the approved prototype displayed (not `meta.mjs`'s short forms): `1` Simple — online form · `2` Moderate — proposal and review · `3` Competitive — pitch or jury. **`STATUS` labels are not copied** (the legacy file says "Periodic calls" and "Closing soon"); they are exactly SPEC §8: `open` Open · `calls` Opens in rounds · `deadline` Closes {d Mon yyyy} (a template filled from `deadline`) · `announced` Announced · `closed` Closed · `auto` Automatic. `labels.json` also holds `lastVerified` (YYYY-MM-DD) and `dpiitSchemeId: "dpiit"` (the scheme the finder's DPIIT note links to, DESIGN §4.9).

Cross-record rules (ids exist, uniqueness) are enforced by one pure function, `validateDataset()` in `src/lib/content.ts`, called by verify-dist (AC-DATA-03, AC-DATA-04) and by `tests/unit/schema.test.ts`. Its errors name the record id, the field and the bad value. All 115 current records pass this schema (checked with Zod 4.6 on 18 Sep 2026).

**How the data is loaded (one way only).**
- **Schemes** are the only Astro content collection: `defineCollection({ loader: glob({ pattern: "*.json", base: "./src/data/schemes" }), schema: SchemeSchema })`. File name = `{id}.json` = entry id.
- **Every other data file** is a plain JSON module imported by `src/lib/data.ts`, which parses it with its schema, runs `validateDataset()` over everything, and throws on the first error (so the build fails). File shapes: `regions.json`, `updates.json`, `documents.json`, `topics.json`, `sectors.json` and `order.json` are arrays; `glossary.json` is an array of `{term, definition}`; `roadmap.json` is `{founder, student}`; `rankings.json` and `labels.json` are objects.
- `lib/data.ts` is the only file in `src/lib/` that imports from `src/data/`. `scripts/verify-dist.ts` and the tests read the same files with `fs` and the same schemas; they never import `astro:content`.

### 4.2 Source of truth
`src/data/**` is the only source of facts. `reference/data-source/*.mjs` is used **only** by `scripts/migrate-legacy.ts` and `tests/unit/migration-parity.test.ts`.

### 4.3 Legacy → new field mapping (Phase 2)

| Legacy | New | Transform |
|---|---|---|
| `id` | `id` | same |
| `name`, `abbr`, `body` | same | same |
| `level` (added by legacy build: C/S) | `level` | C → central, S → state |
| `st` | `region` | same code |
| `type`, `stage`, `sector` | `types`, `stages`, `sectors` | same order |
| `amt`, `amtL` | `amount`, `amountLakh` | same |
| `student`, `dpiit` | `student`, `needsDpiit` | same |
| `status`, `deadline`, `statusNote` | same | same |
| `ease` | `effort` | same |
| `tier` | `tier` | same |
| `since` | `addedOn` | same |
| `sum`, `ben`, `elig`, `docs`, `steps` | `summary`, `benefits`, `eligibility`, `documents`, `steps` | same order |
| `link` | `officialUrl` | same |
| `stacks` | `stacksWith` | same |
| `verified` | `verifiedNote` | same |
| `REGIONS` tuple `[code,name,col,row,"UT"?]` | Region | `ut = tuple[4] === "UT"` |
| `UPDATES {d,t,x,id}` | Update `{date,title,text,schemeId?}` | empty id → omitted |
| `ROADMAP {t,x,ids}` | Step `{title,text,schemeIds}` | same |
| `TOPICS` (`match` fn) | Topic (`types` list or `"student"`) | types per SPEC §7.6 |
| `SLUG_OVERRIDES` | `src/lib/slug.ts` constant | same entries |

## 5. Routes and slugs (exact)

```
slugify(s) = s.normalize("NFKD").replace(/[̀-ͯ]/g,"")
             .replace(/₹/g," rs ").replace(/&/g," and ").replace(/['’]/g,"")
             .toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")
trim(s, 64) = s.length <= 64 ? s : (cut = s.slice(0,64), i = cut.lastIndexOf("-"), i > 0 ? cut.slice(0,i) : cut)
schemeSlug  = SLUG_OVERRIDES[id] ?? trim(slugify(name), 64)
             ; if the slug already exists in the same scope (central, or the same region) → slug + "-" + id
regionSlug  = slugify(region.name)
central URL = /schemes/{schemeSlug}/        state URL = /states/{regionSlug}/{schemeSlug}/
```

- Iterate schemes in legacy order: central first, then state, as listed in `src/data/order.json` (the ids in legacy order, written by the migration). Scheme files are always named `{id}.json`.
- Synthetic cases (trimming, collisions, ₹, &, apostrophes, accents) are in `tests/fixtures/slug-cases.json`; `slug.test.ts` must pass them as well as `url-map.json`.
- Results must equal `tests/fixtures/url-map.json` (AC-ROUTE-02).
- Astro config: `trailingSlash: "always"`, `build.format: "directory"`, `build.inlineStylesheets: "never"`, `site: SITE`, `markdown: { syntaxHighlight: false }`.
- `vercel.json`: `"trailingSlash": true`, `"cleanUrls": true`.

## 6. Client-side architecture

### 6.1 Two kinds of client code (strict boundary)

| Kind | Where | Use for | Rules |
|---|---|---|---|
| **Bundled scripts** | `src/scripts/*.ts`, included via `<script>` in a component (Astro bundles them into `/_astro/*.js`) | Behaviour on server-rendered markup: save/compare buttons, glossary popover, share/print, deadline labels, doc checklist, theme toggle, legacy redirect, toast | Event delegation on `document`. Read and write stores. **Never** render large markup. Each file ≤ 150 lines. |
| **Preact islands** | `src/islands/*.tsx` | App-like UIs that render from state: the `/schemes/` controls (filters, tiers, sort, search), the finder, the shortlist view, the compare view, the compare tray | `client:idle` by default. `client:load` only for EligibilityFinder, ShortlistView and CompareView (they are the page's main content). No island imports another island. Props must be serializable. |

- No `client:only` for SEO-relevant content.
- Island server output must be meaningful: a skeleton or the plain list, never blank for crawlers.

### 6.2 State (nanostores)

| Store | Key | Type | Rules |
|---|---|---|---|
| shortlist | `ffg:shortlist` | `string[]` of scheme ids | dedupe; drop unknown ids on read |
| compare | `ffg:compare` | `string[]` of ids, max 3 | refuse the 4th (AC-FUNC-20) |
| docs | `ffg:docs` | `Record<id, docKey[]>` | |
| quiz | `ffg:quiz` | `{st?,stage?,sector?,student?,need?,dpiit?}` | validate values against the enums |
| theme | `ffg:theme` | `"light" \| "dark"` | absent = follow the OS |

- Every store is a `persistentAtom` (never `persistentMap`, which writes one localStorage key per field) with `listen: true` for cross-tab sync and an `encode`/`decode` pair: `JSON.stringify` / a decoder that parses inside try/catch, validates against the rules above, and returns the default on anything invalid. So there are exactly five keys, one per store.
- Stores are the only place that touch localStorage. Anything else is forbidden, with **one** exception: the inline theme boot script in `Head.astro` (DESIGN §6.2) reads `ffg:theme` before first paint. It never writes.

### 6.3 Client data
- `src/pages/data/schemes.json.ts` emits `/data/schemes.json` at build: `{v, labels, regions:[{code,name}], schemes:[{id,url,name,abbr,body,amount,amountLakh,where,level,region,types,stages,sectors,student,needsDpiit,status,deadline,statusNote,tier,effort,summary,benefits:first3,eligibility:first2,firstStep}]}`.
- It is fetched lazily by the finder, shortlist, compare and tray islands, once per page (memoized).

### 6.4 Search
- Pagefind indexes **scheme pages only**. `data-pagefind-body` goes on the scheme `<article>`, and `data-pagefind-meta="id:{id}"`.
- `BrowseControls` dynamically imports `/pagefind/pagefind.js` on first focus of the search input, or when `q` is present. It maps results to ids and intersects them with the filter predicate from `lib/filters.ts`.
- **How `/schemes/` filters without re-rendering cards:** the page renders every card server-side inside `[data-list]`, each card carrying `data-id`. `BrowseControls` receives one prop, `items`, with only the fields the predicate and sorts need (`id, name, tier, level, region, types, stages, sectors, student, status, amountLakh, effort, addedOn`). It computes the visible, ordered id list with `lib/filters.ts` and `lib/order.ts` and applies it to the list by setting `hidden` on cards and moving card nodes into the new order. It never renders cards itself. The result line, controls, sheet and empty state are the island's own markup.
- Result order when searching follows SPEC §7.1.

### 6.5 Shared logic
`lib/filters.ts`, `lib/order.ts`, `lib/finder.ts` and `lib/similar.ts` are used by both build-time pages and islands, so there is one implementation. **Tests verify them against independent helpers and golden files, never against themselves.**

### 6.6 DOM hooks (the contract between server markup and bundled scripts)

Server components render these attributes; bundled scripts find them by delegation. No other **behaviour** hooks may be invented; a new one needs a proposal. Presentational attributes that `site.css` already uses for styling (`data-s` on stamps, `data-l` on map tiles, `data-open` on the sheet) are allowed and are not hooks.

| Hook | On | Script | Behaviour |
|---|---|---|---|
| `data-act="save"` `data-id` `data-abbr` | `button` | `actions.ts` | Toggle the id in the shortlist and set `aria-pressed`. The accessible name and any visible label never change (DESIGN §4.4, §4.6; WCAG 2.5.3) |
| `data-act="compare"` `data-id` `data-abbr` | `button` | `actions.ts` | Toggle the id in compare and set `aria-pressed`; refuse a 4th with the toast (AC-FUNC-20). Names never change |
| `data-count="shortlist"` | `span` | `actions.ts` | Text = shortlist size; `hidden` when 0 |
| `data-share` `data-title` `data-text` | `button` | `share-print.ts` | `navigator.share({title, text, url})` with `url` = the page's canonical `href`; else clipboard + toast "Link copied"; else `prompt()` |
| `data-print` | `button` | `share-print.ts` | `window.print()` |
| `data-deadline="YYYY-MM-DD"` | `.stamp` | `deadlines.ts` | Live label (DESIGN §4.3) |
| `data-docs-for="{id}"` / `data-doc="{key}"` | `ul` / `input[type=checkbox]` | `doc-checklist.ts` | Restore and persist ticks in the `docs` store |
| `class="term"` `data-term` `data-def` | `a` | `glossary-popover.ts` | Open the popover on activation; the link still points to the glossary anchor |
| `data-theme-toggle` | `button` | `theme-toggle.ts` | DESIGN §6.2 |
| `data-toast` | `div role="status"` (one per page, in `Layout.astro`) | `toast.ts` | Show a message for 2.5 s |
| `data-list` / `data-id` | card list container / each card | `BrowseControls` island | Filtering and ordering on `/schemes/` (§6.4) |
| — | `/` only | `legacy-redirect.ts` | SECURITY §5 rule 5; runs only when `location.hash` starts with `#/` |

Islands mount through Astro's `astro-island`; they read and write the same stores, so a save in an island updates every `data-act="save"` button and every `data-count` on the page.

`CompareTray` is the one island whose server output is an empty, `hidden` container: it is page chrome that only exists when the visitor has selected something, not content (AGENTS F-14 does not apply to it).

## 7. Styling
- Plain CSS. `src/styles/tokens.css` holds the design tokens (DESIGN §2) and `base.css` holds element defaults. Component styles are scoped `<style>` blocks in `.astro` files. Islands use class names defined in a companion `.css` file imported by the island.
- `build.inlineStylesheets: "never"`, so all CSS ships as external files.
- **No `style` attributes anywhere** (the CSP blocks them). This includes Preact `style={…}` props. Positioning (the popover) is done by setting `element.style.*` in an effect.
- No `!important` except: `[hidden]`, `html:not(.js) .js-only`, `.js .no-js` (DESIGN §6.3), and the print stylesheet.
- Colours only through tokens. Two exceptions: `rgba()` values inside `box-shadow` that `reference/design/site.css` already contains are copied as they are, and `print.css` uses literal `#fff` and `#000` (paper is always white and ink black in print). Everything else that was a raw colour in `site.css` is a token (`--backdrop`, `--tray-rule`, DESIGN §2).
- Fonts: `@font-face` rules in `src/styles/fonts.css` pointing at `/fonts/*.v1.woff2` (DESIGN §3). Preload at most 2. A changed font file gets a new version suffix (`.v2.woff2`); files are never edited in place.

## 8. SEO implementation

### 8.1 Titles and descriptions (`lib/seo.ts`)

| Template | Title | Fallback when > 70 chars | Description |
|---|---|---|---|
| Scheme | The first of these that is ≤ 70 characters: ① `{name}: Eligibility, Benefits & How to Apply (2026)` ② `{name}: Eligibility, Benefits & How to Apply` ③ `{name}: How to Apply (2026)` ④ `{name}: How to Apply` ⑤ `{clip(name, 55)}: How to Apply` | (the chain is the fallback) | `clip("{amount}. {summary}", 158)` |
| Region (≥ 1 scheme) | `Startup Schemes in {name} (2026): State Grants, Incentives & Policy` | `Startup Schemes in {name} (2026)` | `clip("{n} {name} startup scheme(s) — {abbr1}, {abbr2}, {abbr3} — plus every central scheme open to {name} founders. Amounts, eligibility and how to apply.", 158)` (the first 3 of the region's schemes in recommended order, or as many as exist) |
| Region (0 schemes) | same | same | `{name} has no dedicated startup scheme listed in this guide; founders there can use every central scheme. See the most useful ones and how to apply.` |
| Topic / sector | `title` from data | Remove the first " in India" (applies to 2 sector titles today) | `description` from data |

Fixed pages (title · description):

| Path | Title | Description |
|---|---|---|
| `/` | Government Schemes for Indian Startups (2026) — Founder's Field Guide | `{n} central and state government schemes for Indian startups — grants, loans, tax relief, equity and incubation — with eligibility, documents and how to apply.` |
| `/schemes/` | All {n} Government Schemes for Startups in India (2026) | `Search and filter {n} central and state schemes for Indian startups — grants, loans, equity, tax relief and incubation — by stage, sector, state and status.` |
| `/states/` | Startup Schemes by State & Union Territory in India (2026) | `State startup policies, seed grants, monthly allowances and reimbursements for all {nStates} states and {nUTs} union territories — with {nState} state schemes explained.` |
| `/start-here/` | Startup Schemes Roadmap: Where to Start (2026) | New to government schemes? Register, get DPIIT recognition, join an incubator, then apply for grants, loans and equity — in that order. Student track included. |
| `/eligibility-finder/` | Eligibility Finder: Which Government Schemes Can My Startup Get? | Answer six quick questions — state, stage, sector, student status, what you need and DPIIT recognition — and get a ranked list of schemes that fit. |
| `/whats-new/` | What's New: Startup Scheme Changes in India (2025–26) | New schemes, closures and changed limits from 2025–26 — Fund of Funds 2.0, the Seed Fund closing, Section 140, the RDI Fund, new state policies and more. |
| `/glossary/` | Startup Scheme Glossary: DPIIT, TBI, CGTMSE, AIF & More Explained | Plain-English meanings of the acronyms you'll meet in Indian startup schemes — DPIIT, IMB, TBI, AIF, SIDBI, CGTMSE, TRL, GeM, TReDS, Udyam and more. |
| `/about/` | About the Founder's Field Guide: Sources & Method | How the Founder's Field Guide is researched and checked, what it covers, and why it is an independent guide rather than an official government website. |
| `/shortlist/` | Your Shortlist — Founder's Field Guide | Schemes you've saved on this device. Print them or compare side by side. |
| `/compare/` | Compare Schemes — Founder's Field Guide | Compare up to three government schemes side by side. |
| `/404` | Page not found — Founder's Field Guide | This page doesn't exist. Search the guide or browse every scheme. |

(`{n}`, `{nState}`, `{nStates}`, `{nUTs}` are computed from data — never literals. With the current data every indexable title is 36–70 characters and unique, and every description is 70–160 characters; checked by the spec author on 18 Sep 2026 and enforced by AC-SEO-01/02.)

- `og:title` = scheme name (scheme pages), otherwise the title.
- All of these tags (title, description, canonical, robots, Open Graph, Twitter) are rendered by `Head.astro` itself with normal Astro expressions (which escape text) — one component, so nothing is emitted twice. No SEO helper package is used: `astro-seo` renders the title with `set:html`, which leaves `&` unescaped (html-validate `no-raw-characters`) and breaks the one-`set:html` rule. Non-indexable pages get `noindex,follow`, no canonical and no `og:*` or `twitter:*` tags (AC-SEO-03, AC-SEO-05, AC-SEO-09).
- `clip(s,n)` collapses whitespace. If longer than n, it cuts at the last space before n−1, strips trailing punctuation and adds "…".

### 8.2 JSON-LD per template (built with `schema-dts` types in `lib/jsonld.ts`)
- **Every page:** `WebSite` (`@id: {origin}/#website`).
- **Home:** + `Organization`, and `WebPage` with `mainEntity: ItemList` of the top-tier schemes.
- **Scheme:** `WebPage` (breadcrumb, `mainEntity` → the service), `BreadcrumbList`, and `GovernmentService {name, alternateName?, description, serviceType, provider: GovernmentOrganization{name: body}, areaServed: Country India | State {name, containedInPlace: India}, audience: BusinessAudience, url: officialUrl}`.
- **`/schemes/`, region, topic and sector pages:** `CollectionPage` + `ItemList` + `BreadcrumbList`.
- **Glossary:** `DefinedTermSet` with a `DefinedTerm` per entry (url = anchor).
- **About:** `AboutPage`.
- Serialize with `JSON.stringify(...).replace(/</g, "\\u003c")` in `JsonLd.astro`. This is the **only** `set:html` in the codebase.

### 8.3 Sitemap and robots
- `@astrojs/sitemap` with `filter` excluding `/shortlist/`, `/compare/` and `/404`, and `serialize` setting `lastmod` = `lastVerified`.
- `robots.txt` is generated by `src/pages/robots.txt.ts` from the D2 decision.

### 8.4 Social images
`astro-og-canvas` route generating `/og/schemes/{id}.png`, `/og/regions/{code}.png` and `/og/default.png` at 1200×630 in the DESIGN §5 layout. Layout, sizes and font family names exactly as DESIGN §5; the wordmark is `src/assets/og-wordmark.png`. The route throws at build, naming the page, when a title is longer than 100 characters.

## 9. Configuration and decision switches

| Env var | Default | Effect |
|---|---|---|
| `SITE_URL` | unset | Overrides the canonical origin |
| `VERCEL_PROJECT_PRODUCTION_URL` | set by Vercel | Canonical origin fallback |
| `PUBLIC_ANALYTICS` | `on` if D4 = On, else `off` | Adds `<script defer src="/_vercel/insights/script.js"></script>` to every page (added in Phase 9). The file only exists on Vercel after the owner enables Web Analytics, so `npm run build:test` always sets `off`, and link checks skip `/_vercel/insights/` (AC-SEO-11). |
| `GOOGLE_SITE_VERIFICATION` | unset | Adds the verification meta tag |
| `LAST_VERIFIED` | from `src/data/labels.json` | Footer and sitemap `lastmod` |
| `BUILD_DATE` | the current time | The clock for build-time deadline closing (AC-DATA-06). `npm run build:test` pins it to `golden.json.buildDate` so golden values stay valid after real deadlines pass; production builds never set it. It is an explicit input, not test detection (AGENTS F-07). |

**D3 = Yes** adds `.github/workflows/ci.yml` and `daily-rebuild.yml` (TESTING §8). **D2 = Block** changes `robots.txt` and the firewall runbook (SECURITY §4).

## 10. ADRs to be written in Phase 1
0001 Static Astro, no server · 0002 Islands vs bundled scripts boundary · 0003 Pagefind for search · 0004 nanostores persistence · 0005 CSP via Astro `security.csp` meta + header CSP · 0006 Self-hosted fonts · 0007 Exact version pinning · 0008 URL scheme and permanence.

## 11. Assumptions Phase 0 must verify (do not assume)
- A1: Astro 7.3.3 `security.csp` works for static output with Preact islands. It hashes the island hydration inline scripts, and `scriptDirective.resources` accepts `'self'` and `'wasm-unsafe-eval'`.
- A2: `astro-pagefind` 2.0.1 runs on Astro 7.3.3 and Pagefind 1.5.2 with `trailingSlash: "always"`.
- A3: `astro-og-canvas` 0.13.2 renders on Node 22 at build on Vercel (canvaskit-wasm).
- A4: The `@astrojs/sitemap` filter and serialize APIs behave as §8.3.
- A5: Vercel `trailingSlash: true` + `cleanUrls: true` + Astro directory output yields 308 for no-slash paths and 200 for assets.
- A6: The peer dependency set in §2 installs with `npm ci` with no `--legacy-peer-deps`.
- A7: `@nanostores/persistent` `listen: true` syncs across tabs in Chromium and WebKit (Playwright).
- A8: `npm ci --ignore-scripts` followed by `npm run build` succeeds locally and on Vercel (so `.npmrc` can set `ignore-scripts=true`, SECURITY §6).
- A9: Vercel serves `dist/404.html` with status 404 for unknown paths, with the `vercel.json` headers applied.
- A10: `import { z } from "astro/zod"` works in Astro pages, in Vitest and in a `tsx` script, so `src/lib/schema.ts` can be shared.

For each assumption, Phase 0 reports **VERIFIED** (with a minimal spike in a throwaway branch and its output) or **FAILED** (with a proposal).
