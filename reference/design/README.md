# Design reference (read-only)

| Path | What it is | How to use it |
|---|---|---|
| `site.css` | The approved stylesheet of the prototype | Port its rules into `tokens.css`, `base.css`, `print.css` and scoped component styles, applying every difference listed in DESIGN §8 |
| `screens/*.png` | Approved screenshots of the prototype, per template, at 390 px and 1440 px (captured 18 Sep 2026) | The visual target for AC-DES-02. Compare side by side; do not trace pixel values from them |
| `prototype/*.html` | Rendered prototype pages for every template (home, states index, a region, a scheme, a topic, a sector, start here, finder, what's new, glossary, about, shortlist, compare, 404) | Markup reference and the copy source named in DESIGN §9. Their scripts, inline handlers and `data-*` names are **not** the architecture (ARCHITECTURE §6 is) |

The design canvas the owner approved (current look plus three alternative directions) is at `https://claude.ai/artifact/VJCSS2dQckEy9KrA9xQqU7`. It is private to the owner. The alternative directions (A Civic Ledger, B File Cover, C Launchpad) are single light-mode screens and cannot be built from without a DESIGN amendment (DESIGN §1).

Screens:

| File | Template | Width | Theme | State |
|---|---|---|---|---|
| `home-390.png`, `home-1440.png` | Home | 390, 1440 (full page) | Light | 3 schemes saved |
| `scheme-central-390.png`, `scheme-central-1440.png` | Scheme page (CGSS) | 390, 1440 (full page) | Light | |
| `scheme-central-390-dark.png` | Scheme page (CGSS) | 390 | Dark | |
| `schemes-1440.png` | All schemes, grant + idea filters | 1440 | Light | |
| `schemes-sheet-390.png` | All schemes, filter sheet open | 390 | Light | |
| `scheme-state-390.png` | State scheme page (KSUM Seed Fund) | 390 (full page) | Light | |
| `region-390.png`, `region-1440.png` | Karnataka | 390, 1440 (full page) | Light | |
| `region-kerala-1440.png` | Kerala | 1440 | Light | |
| `states-map-390.png`, `states-map-1440.png` | States index with tile map | 390, 1440 | Light | |
| `finder-question-390.png`, `finder-question-1440.png`, `finder-results-390.png`, `finder-results-1440.png` | Eligibility finder | 390, 1440 | Light | Question 1; results for a Kerala student |
| `shortlist-390.png` | Shortlist | 390 | Light | 3 saved |
| `compare-390.png`, `compare-1440.png` | Compare | 390, 1440 | Light | 3 selected |

Known differences between these screenshots and the contract: the finder's Back/Next buttons use arrow characters in the screenshots and Lucide icons in the contract; status stamps in the screenshots use legacy labels (for example "Open · rolling", "Periodic calls", "Closes 30 Sep"); the contract uses the SPEC §8 labels everywhere ("Open", "Opens in rounds", "Closes 30 Sep 2026"). A few colours change for contrast (DESIGN §8). Where they differ, DESIGN.md wins.
