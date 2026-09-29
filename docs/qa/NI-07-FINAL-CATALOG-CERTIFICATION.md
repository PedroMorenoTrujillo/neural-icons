# NI-07 — Final catalog certification and 1.1.0 release

## Status

Release complete: 250 families / 500 glyphs, four stable `1.1.0` npm packages, registry-only consumers, and the production SSR showcase have passed the gates below. The `next` dist-tag remains on `0.0.1-next.2` for all four packages.

## Scope and provenance

The expansion began at `a9245b0564658985b0ad55e98e16557606638606` (local `main`). Batch 1 is `3e9bd23ae140aaf4f8712f619314b8e23e9cbbda` on `codex/ni-06-catalog-expansion`; NI-06B selected no further families because Batch 1 reached the target. The original 197 families remain named; 53 additive families bring the catalog to **250 outline + 250 filled = 500 glyphs**. See [NI-06](NI-06-CATALOG-EXPANSION.md) and the [NI-06B inventory](NI-06B-POST-BATCH1-INVENTORY.md).

The npm registry had `1.0.1` as `latest` and `0.0.1-next.2` as `next` for Core, Angular, React and Vue before this release. The four `1.1.0` versions were absent. A minor release is appropriate for additive families; the adapters' 1.1.0 manifests require `@neural-icons/core: ^1.1.0` and their package READMEs describe the 250-family catalog. Publish Core before its adapters.

## Visual and semantic certification

The 20 historical NI-02 contact sheets cover the original 197 pairs; six NI-06 sheets cover the 53 new pairs. Each presents outline and filled at 16, 20, 24, and 32 px. The current generated SVGs and the larger focused comparison gallery were used for the final defect review. The user approved the targeted corrections, including the final `scissors-filled` treatment. This is visual certification at the reviewed sizes, not a claim that outline and filled have identical pixels.

The focused remediation changed 25 glyph geometries across 16 families: `link`, `save`, `send`, `clipboard`, `paste`, `messages`, `files`, `eraser`, `phone-off`, `git-branch`, `git-merge`, `git-pull-request`, `git-commit`, `wallet`, `record`, and `scissors`. No family was added, removed, or renamed during NI-07. Examples of concrete defects and fixes: `link-filled` had an off-centre bridge caused by merged fill paths; `eraser` had a detached baseline and an unwanted gap; `git-branch-filled` had a blocky stem-to-branch junction; `scissors-filled` had blunt, line-like blades that did not read as a filled treatment. Both variants were adjusted where pair consistency required it. The full catalog remains `250 / 500`.

Automated SVG generation and validation pass: deterministic 24×24 outputs, 500 complete pairs, generated TypeScript/SVG parity, required fill/stroke/currentColor behavior, and package exports. The `npm run check:generated` gate verifies 1003 generated files, the 197-family historical ledger and 20 sheets, and six NI-06 sheets. The added families are listed in the NI-06 report. Search terms, aliases, categories, and canonical naming are covered by catalog validation and showcase E2E; no new public-name change was introduced in this remediation.

## Package and runtime gates

`npm run verify:release` passes against the 1.1.0 manifests:

- Lint, unit tests, production builds, React/Vue type checks, Core catalog validation, and Angular AOT/package checks.
- Core, Angular, React and Vue pack dry-runs: compiled exports and declarations, READMEs and MIT licenses; Core includes 500 SVG assets. No test or temporary files in the intended artifacts.
- Clean local-tarball Angular 22.1.6 AOT consumer with no workspace alias or package symlink. React and Vue package verifiers exercise isolated TypeScript/build consumers, SSR and Chromium hydration, and Vite/Rollup one-icon imports.
- Core root retains zero glyphs; one-icon Core/Angular/React/Vue consumers retain one glyph; explicit catalog opt-in retains 500. Angular's name registry needs only the definitions registered by the consumer.
- Production showcase SSR/hydration and Chromium E2E: 45/45 pass, including English/Spanish routes, mobile/dark display, 504 sitemap URLs, robots, new-icon routes, and SVG downloads. Raw SVGs use `currentColor` and remain available as package assets.

The package sources have no documented API breaking change. The adapters continue to accept granular Core definitions and do not load the full catalog by default. Browser checks here are Chromium-based; opt-in Firefox/WebKit emulation and real Apple hardware remain separate compatibility checks and are not claimed as completed by NI-07.

## Release-safety ledger

| Gate | Evidence / state |
| --- | --- |
| Final counts | 250 public families; 250 outline; 250 filled; 500 total |
| Source/generated parity | PASS — `npm run check:generated` |
| SVG and pair validation | PASS — `npm run validate:icons` |
| Package and clean tarball consumers | PASS — `npm run verify:release` |
| Angular/React/Vue and tree-shaking | PASS — packaged verification |
| Showcase / SEO local E2E | PASS — 45/45 Chromium tests; 504 sitemap URLs |
| Version collision | PASS — none of the four `1.1.0` versions existed before publication |
| Diff hygiene / stash | PASS — `git diff --check`; protected `stash@{0}` (`e36c545e59247efa964833e5d1d8a77fcc0bb93a`) remains untouched |
| Git commit / main push | PASS — catalog release `3acf3b505c27874658771812de6021c4e7ed9d3b` and showcase copy `34d0988` pushed to `origin/main` |
| npm publish / dist-tags | PASS — Core, Angular, React and Vue `1.1.0` are public under `latest`; `next` remains `0.0.1-next.2`. All four registry records expose MIT license, tarball and integrity metadata; adapters depend on Core `^1.1.0` |
| Registry-installed consumers | PASS — Angular 22.1.6 AOT, SSR, Chromium hydration, zoneless and tree-shaking; React/Vue TypeScript, SSR, Chromium hydration, Vite/Rollup and one-icon bundles. Lockfiles resolve npm URLs with integrity hashes and no package symlinks |
| Public showcase and Search Console preservation | PASS — production deployment `dpl_8xKcJNYx4kBXC3DDRHSpVkaWLNUC` is READY at `https://neural-icons.vercel.app/`. Public SSR serves 250 catalog tiles, new icon routes, Spanish guide, SVG assets, robots and 504 sitemap URLs; titles, descriptions, canonicals and hreflang are present. Search Console settings were not changed |

## Remaining risks and recommendation

The release gates are complete. The published 1.1.0 packages retain one glyph for one-icon consumers; only explicit catalog opt-in retains all 500. The showcase no longer claims that the added families are unpublished. Firefox, WebKit, iPhone and iPad hardware compatibility remain separate checks and are not claimed from Chromium evidence. Google indexing is controlled by the search engine; the live sitemap and metadata being served do not by themselves prove indexing. Final recommendation: **NI-07 CATALOG CERTIFIED — RELEASED**.
