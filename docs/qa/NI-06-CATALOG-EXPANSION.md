# NI-06 — Catalog expansion 197 → 250

## 1. Status

**NI-06 CATALOG EXPANSION PASS** for the local, unpublished candidate. This certifies the checks below, not a deployed site or an npm release. The 53-family selection was recorded before geometry work in [`NI-06-CATALOG-EXPANSION-PROPOSAL.md`](../../NI-06-CATALOG-EXPANSION-PROPOSAL.md).

## 2. Starting commit

`a9245b0564658985b0ad55e98e16557606638606` (`main` at branch creation). Work is on `codex/ni-06-catalog-expansion`; HEAD has not moved.

## 3. Starting catalog counts

197 public families, 197 outline, 197 filled, 394 glyph definitions.

## 4. Gap-analysis methodology

The existing public names and search tags were compared against common application, admin, editor, communication, development, commerce, media, device, location, security and productivity tasks. Official Lucide, Material Symbols, Phosphor, Tabler and Heroicons catalogs were used for *concept coverage*, not copied paths or shapes. The proposal records the nearest existing Neural icon and why each selected concept is distinct.

## 5. Candidate concepts

87 concepts were considered: the 53 selected families below and 34 rejected or deferred concepts. The proposal contains the candidate/decision ledger. Selection favored commonly reusable UI meaning, distinct names, and an outline/filled pair that can convey one concept at 16 px.

## 6. Rejected duplicates

The 34 rejected or deferred candidates are in the proposal. Notably, `attach`/`attachment` remain search metadata for `paperclip`, `funnel` remains search metadata for `filter`, and `webhook` was replaced by `hash` after its triangular treatment proved ambiguous. No new alias is a second public glyph export.

## 7. Selected 53 families

`chevrons-left`, `chevrons-right`, `arrow-right-left`, `sliders-horizontal`, `file-search`, `file-lock`, `quote`, `scissors`, `strikethrough`, `layers`, `phone-call`, `phone-off`, `headphones`, `mail-open`, `megaphone`, `git-branch`, `git-merge`, `git-pull-request`, `git-commit`, `braces`, `hash`, `shopping-cart`, `shopping-bag`, `credit-card`, `wallet`, `receipt`, `briefcase`, `truck`, `music`, `film`, `record`, `repeat`, `shuffle`, `captions`, `monitor`, `smartphone`, `battery`, `battery-charging`, `power`, `sun`, `moon`, `car`, `plane`, `ticket`, `luggage`, `fingerprint`, `shield-alert`, `ban`, `badge-check`, `target`, `book-open`, `presentation`, `kanban`.

## 8. Category distribution

| Category | New | Final |
|---|---:|---:|
| Navigation | 7 | 47 |
| Action | 5 | 66 |
| File | 3 | 34 |
| System | 17 | 58 |
| Communication | 5 | 23 |
| Status | 3 | 9 |
| Commerce | 7 | 7 |
| Media | 6 | 6 |
| **Total** | **53** | **250** |

## 9. Naming/alias decisions

Family identifiers are semantic and stable kebab-case; variants retain the `-filled` suffix. Search-only examples include `swap` → `arrow-right-left`, `adjust` → `sliders-horizontal`, `secure file` → `file-lock`, `blockquote` → `quote`, `version control` → the Git family, `checkout` → `credit-card`, and `number sign` → `hash`. English tags are in the canonical specs; Spanish search terms are in the showcase data. The complete per-family alias ledger is in the proposal and specs. Existing canonical `paperclip` and `filter` rules were not changed.

## 10. Originality/design methodology

The Core specs were drawn as new 24×24 paths in Neural's 1.75-stroke, rounded-join, `currentColor` grammar. Outline and filled share the family silhouette and direction while allowing intentional negative-space differences. External catalogs informed missing concepts only. The original 394 specs were frozen.

## 11. Outline QA

All 53 new outline definitions were rendered on the six internal review sheets at 16, 20, 24 and 32 px, on light and dark backgrounds. Naming, orientation, apparent size and small-size legibility were checked. The `scissors` and `file-search` paths were refined where the first render reduced readability.

## 12. Filled QA

All 53 filled definitions were checked at the same sizes and themes. `book-open`, `kanban`, `ban`, `record`, `hash` and `shopping-bag` were refined after visual or bounds review. The final `shopping-bag-filled` handle stays inside the viewBox; browser geometry checks confirm it.

## 13. Pair consistency

Each new outline/filled pair was reviewed for the same semantic object, direction, bounding intent, visual weight and readable negative space. The filled variant is not a different icon or public family. No unresolved pair mismatch was found in this pass.

## 14. Core implementation

`packages/core/icons/icons.json` remains canonical. The generation script produced 500 granular definition modules and 500 SVGs; `icon-names`, Core index and inventory were regenerated. `commerce` and `media` were added to the typed category contract and validator. `npm run check:generated` and `npm run validate:icons` pass.

## 15. Angular adapter

The existing Angular API is unchanged. Granular direct definition and explicit-name registry probes pass with new icons: `iconSun` retains one glyph; ten mixed icons retain ten; full catalog remains opt-in. The production/AOT and clean Angular 22.1.6 packed-consumer checks pass, as do the established zoneless SSR/hydration regressions.

## 16. React adapter

The API is unchanged. Packed-consumer typing/build, SSR, Chromium hydration and Vite/Rollup pass. A new NI-06 `iconSun` bundle case retains exactly one glyph (1,895 raw / 986 gzip bytes with the adapter); the explicit full catalog retains 500.

## 17. Vue adapter

The API is unchanged. Packed-consumer typing/build, SSR, Chromium hydration and Vite/Rollup pass. A new NI-06 `iconSun` bundle case retains exactly one glyph (2,085 raw / 1,065 gzip bytes with the adapter); the explicit full catalog retains 500.

## 18. Raw SVG/HTML parity

Every new spec has a generated SVG asset under `packages/core/svg` and a granular definition module under `packages/core/src/icons`. The showcase serves the same 106 new SVG assets for raw HTML/download use. Browser tests fetch and parse each new asset and compare rendering bounds; no adapter-specific glyph fork was introduced.

## 19. Search/aliases

Canonical names and search-only English/Spanish terms work in the catalog. Existing `attach`/`funnel` non-family rules remain intact. No alias creates a duplicate public family or route.

## 20. Showcase update

The local explorer displays 250 families and one card per family, with outline/filled comparison in detail. Category labels and counts were updated in English and Spanish. Installation and snippet copy explicitly warn that npm `latest` still contains the prior 197-family release; NI-06 icon imports must not be presented as already published. The public deployment was not changed.

## 21. SEO/routes/sitemap

Local SSR metadata, canonical/alternate icon URLs and the generated sitemap cover both locales. The E2E suite verifies a new `shopping-cart` route in English and Spanish, indexable server HTML, a real catalog link and 504 sitemap URLs (250×2 icon URLs plus four catalog/guide URLs). The existing Google Search Console verification was left untouched; no indexing request was submitted.

## 22. Catalog tests

Core tests assert 250 outline, 250 filled, unique names, complete pairs and valid categories. React/Vue expectations and showcase navigation/performance tests use the new counts. The full browser suite passes **45/45**.

## 23. SVG validation

`npm run validate:icons` passes. Automated checks cover path structure, viewBox-compatible generation, unsafe content/attributes, currentColor behavior and pair completeness. Chromium parses all 106 new SVG assets and checks each path's rendered geometry for clipping; all pass.

## 24. Visual QA

Six internal HTML contact sheets in [`ni-06-contact-sheets`](ni-06-contact-sheets/README.md) compare all 53 families, outline/filled, 16/20/24/32 px and light/dark. These were regenerated after the final path edits and inspected in Chromium. The sheets are QA artifacts, not a public showcase. Visual certification means render and pair consistency at the target sizes, not mathematical pixel equality.

## 25. Existing-geometry regression

The first 394 canonical JSON objects have unchanged text and values against HEAD; the only original-prefix text difference is the comma needed after the former final object to append new records. Their serialized JSON SHA-256 is `21b76164f7de3106a04d199d817ea79ccfe02438f5ba56eae48c64661a5bdce7`. No previously tracked per-icon generated module or SVG changed. Only aggregate generated indexes changed. The 20 NI-02 review sheets pass their unchanged-generation check.

## 26. Tree-shaking results

| Case | Retained glyphs | Raw bytes | Gzip bytes |
|---|---:|---:|---:|
| Core root only | 0 | 34 | 52 |
| Core one icon | 1 | 478 | 321 |
| Core one family, both variants | 2 | 727 | 415 |
| Core ten icons | 10 | 1,520 | 584 |
| Angular + one icon | 1 | 6,272 | 1,869 |
| Angular + ten icons | 10 | 7,314 | 2,142 |
| Full catalog, explicit | 500 | 106,822 | 27,000 |
| Root unused | 0 | 0 | 20 |

Additional Angular `iconSun` and ten-mixed probes retain 1 and 10 modules respectively. React/Vue new-icon probes also retain exactly one. Byte figures are reproducible local esbuild measurements, not universal bundle sizes.

## 27. Package verification

`npm run verify:release` passes compiled-pack checks for Core, Angular, React and Vue. The release-candidate audit uses `npm pack --dry-run --json` against `dist/packages/*`, checks manifests, declarations and compiled JS, and verifies `LICENSE` and `README.md` in each distributable. React/Vue packed consumers and the clean Angular packed consumer pass. No registry install or publication is claimed for this unpublished expansion.

## 28. Full checks

`npm run check`, package typechecks/verification, release-candidate audit, Angular clean-consumer AOT, showcase build, SEO/SSR E2E and `npm run verify:release` pass. The browser suite is 45/45. A static UI detector reports ten false positives on explanatory prose containing literal `<img>` examples; these are translation strings, not broken rendered images. Generated Playwright/test logs were moved out of the repository to recoverable `/private/tmp` locations.

## 29. Final counts

**250 public families; 250 outline + 250 filled = 500 glyphs.** No existing family was removed or renamed.

## 30. SemVer recommendation

A **minor** Core version increment is appropriate when release is later authorized, because adding granular icon paths is additive. Adapter versions should be decided with the actual dependency/release policy at that time. NI-06 did not bump a package version, publish or change a dist-tag. The pre-existing local working tree already contained `1.0.1` package-manifest changes from prior work; those were preserved, not attributed to NI-06.

## 31. Git state

Branch `codex/ni-06-catalog-expansion`, HEAD `a9245b0564658985b0ad55e98e16557606638606`. NI-06 remains unstaged and uncommitted. `git diff --check` passes. No push, pull, rebase, tag, release, deploy or npm publication occurred. The branch inherited unrelated pre-existing uncommitted work, including the `1.0.1` manifests; this must be separated in any later review/commit. At the local tracking snapshot, `main` is 7 commits ahead of `origin/main` and 0 behind; NI-06 did not change this divergence or fetch the remote.

## 32. Stash integrity

`stash@{0}` remains `e36c545e59247efa964833e5d1d8a77fcc0bb93a`, contains only `NEURAL-UI-REQUIRED-ICON-SET.md`, and its file SHA-256 remains `fd93e05af8dc05928e0b03175663f8fab5114713279e18e315c582215a3390a1`. It was not applied, popped or dropped.

## 33. Remaining issues

No blocking catalog, visual, package or SEO check remains in the **local candidate**. Publication/deployment and registry-only validation of the new version are intentionally outstanding and require separate authorization. Human product approval of the 53 new designs is still appropriate before release. The inherited unrelated dirty work must not be bundled with NI-06 in a future commit.

## 34. Recommendation

**NI-06 CATALOG EXPANSION PASS** locally. Keep the branch for design/code review; approve concepts and visual sheets before deciding versions or publication. Do not present the 53 new families as available on npm or the live website yet.
