# NI-06B — Batch 2 catalog proposal

## Decision: no Batch 2 glyphs

The brief fixes the ceiling at 250 families / 500 glyphs and requires selecting exactly `250 - CURRENT_FAMILIES`. The post-Batch-1 inventory measures 250 families and 500 glyphs, with 250 outlines and 250 filled variants. Therefore:

```text
REMAINING_FAMILIES = 250 - 250 = 0
REMAINING_GLYPHS   = 500 - 500 = 0
minimum candidates = 2 × 0 = 0
selected families = 0
```

Adding anything would violate the exact target. No new Core spec, SVG, alias, route, or contact sheet is proposed in NI-06B. This is a no-op continuation, not a reason to invent a larger target.

## Concept coverage review

The NI-06 Batch 1 proposal already compared concept coverage (not artwork) with the official [Lucide](https://lucide.dev/icons/), [Material Symbols](https://fonts.google.com/icons), [Phosphor](https://phosphoricons.com/), [Tabler](https://tabler.io/icons), and [Heroicons](https://heroicons.com/) catalogs. It contains the source rationale, 87-concept decision ledger, selected 53 families, and rejected/deferred alternatives. No third-party paths, proportions, or distinctive geometry were used.

Rechecking the brief's product areas against the actual 250-family catalog confirms substantial coverage: `kanban`, `git-branch`, `git-commit`, `git-merge`, `upload`, `download`, `file-lock`, `file-search`, `paperclip`, `inbox`, `messages`, `mention`, `bell`, `receipt`, `credit-card`, `wallet`, `truck`, `music`, `film`, `captions`, `camera`, `mic`, `monitor`, `smartphone`, `cpu`, `database`, `server`, `shield-alert`, `fingerprint`, `key`, `map`, `map-pin`, `navigation`, `compass`, `globe`, and `route`, among others. This is a catalog audit, not a claim that every specialist concept has its own family.

## Unselected gap signals

The table records possible future discovery topics. “Not selected” is due to the fixed target being full; it is not a claim of zero product value. No demand is inferred from absent telemetry.

| Candidate concept | Score | Classification | Current nearest representation / decision |
|---|---:|---|---|
| `audit-log` | 4 | MISSING | No unambiguous dedicated audit-log family; a later target could assess it against history/log concepts. Not added past 250. |
| `api-key` | 4 | MISSING | `key`, `code`, and `server` are related but not identical. Keep as a possible distinct future concept. |
| `team` | 4 | REVIEW | `group` and `users` intentionally remain distinct. Do not alias or merge them without a semantic review. |
| `printer` | 2 | TOO_NICHE | Device family not justified within the capped expansion. |
| `tablet` | 3 | REVIEW | `smartphone` and `monitor` cover adjacent device classes but are not exact aliases. |
| `memory-chip` | 2 | TOO_NICHE | `cpu`/`database`/`server` do not mean memory; specialist need can be evaluated later. |
| `invoice` | 3 | ALIAS_CANDIDATE | Search term for `receipt` is already present; no separate glyph without a distinctly useful silhouette. |
| `basket` | 3 | ALIAS_CANDIDATE | Search term for `shopping-cart` is already present. |
| `attachment` | 4 | ALIAS_CANDIDATE | `paperclip` is canonical for attachment; preserve the existing ownership rule. |
| `headset` | 3 | ALIAS_CANDIDATE | `headphones` carries the headset search term. |
| `desktop` / `mobile` | 3 | ALIAS_CANDIDATE | Search terms map to `monitor` / `smartphone`; no duplicate device families. |
| `subtitles` | 3 | ALIAS_CANDIDATE | Search term for `captions`. |
| `loop` | 3 | ALIAS_CANDIDATE | Search term for `repeat`; do not create a duplicate family. |
| `funnel` | 4 | DUPLICATE | Existing canonical family is `filter`; keep `funnel` as search metadata only. |

## Selected families

**None (0).** Category delta: zero in every category. The exact 250-family target is already met by Batch 1.

## Geometry and visual review

Not applicable to Batch 2 because no family is selected. Batch 1's 53 outline/filled pairs and six contact sheets remain the visual evidence. NI-06B made no geometry, alias, or generated-output changes, so no Batch 2 image sheet can be produced without duplicating historical QA.

## Gates carried forward / rerun

- `npm run check`: PASS.
- `npm run verify:release`: PASS; includes Core validation, all four package checks, Angular AOT/clean consumer, React and Vue type/package/SSR/hydration/Vite-Rollup probes, showcase build, SEO/E2E; Chromium E2E **45/45**.
- Latest esbuild matrix: Core root only = 0 glyphs; one icon = 1; one family with variants = 2; ten icons = 10; Angular + one = 1; Angular + ten = 10; explicit full catalog = 500; root-unused = 0 raw bytes.
- React one-new-icon package probe = 1 glyph (1,895 raw / 986 gzip); Vue = 1 (2,085 / 1,065); Angular one-new-icon probe = 1.
- Full-catalog measured probe = 106,934 raw / 27,036 gzip bytes. Batch 2's source/bundle delta is zero because it adds no files or glyphs.
- Package version/tag, publication, Search Console, and deployment were not changed by NI-06B.

## Recommendation

**NI-06 CATALOG EXPANSION PASS — NI-06B adds nothing because the exact 250 / 500 target is already complete.** Any further catalog growth needs a separately approved target and new selection review.
