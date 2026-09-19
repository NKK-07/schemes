# Invalid data fixtures (AC-DATA-01)

Each file is one scheme record in the **new** format (ARCHITECTURE §4.1), built from a real record with exactly one defect. `tests/unit/schema.test.ts` must show that each is rejected, and that the error names the field below. Files 01–05 fail the Zod schema on their own. Files 06–08 pass the schema and fail `validateDataset()` when added to the real dataset.

| File | Defect | Rejected by | Error must name |
|---|---|---|---|
| `01-missing-name.json` | `name` removed | Zod schema | `name` |
| `02-unknown-type.json` | `types` contains `"lottery"` | Zod schema | `types.1` |
| `03-state-without-region.json` | `level: "state"` without `region` | Zod refine | `region` |
| `04-deadline-without-date.json` | `status: "deadline"` without `deadline` | Zod refine | `deadline` |
| `05-non-https-url.json` | `officialUrl` starts with `http://` | Zod schema | `officialUrl` |
| `06-unknown-stacks-with.json` | `stacksWith` contains `"no-such-scheme"` | `validateDataset()` (AC-DATA-03) | `stacksWith` and `no-such-scheme` |
| `07-unknown-document-key.json` | `documents` contains `"passport"` | `validateDataset()` (AC-DATA-03) | `documents` and `passport` |
| `08-duplicate-id.json` | `id` is `"prayas"`, which already exists | `validateDataset()` (AC-DATA-04) | `id` and `prayas` |

The build-level half of AC-DATA-01 copies each file into `src/data/schemes/` in a temporary copy of the repository and asserts that `npm run build` exits non-zero.

These files are frozen. Agents may not edit them (AGENTS §4 F-01).
