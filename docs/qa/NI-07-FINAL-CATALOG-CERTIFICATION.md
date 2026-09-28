# NI-07 — Final catalog certification and 1.1.0 release

## Status

Release candidate verified locally; Git delivery, npm publication, registry consumers, and production deployment remain pending. This report must not be marked as a final release pass until those checks have evidence below.

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
| Version collision | PASS — npm reported no `1.1.0` for any of the four packages |
| Diff hygiene / stash | Pending final pre-commit check; preserve `stash@{0}` (`e36c545e59247efa964833e5d1d8a77fcc0bb93a`) |
| Git commit / main push | PENDING |
| npm publish / dist-tags | PENDING — npm login and any required 2FA must be completed by the owner |
| Registry-installed consumers | PENDING until npm publication |
| Public showcase and Search Console preservation | PENDING production verification; do not alter verification or submit manual indexing requests |

## Remaining risks and recommendation

Do not publish if the final Git diff reveals unrelated material, if a package artifact changes after verification without rerunning its gates, or if npm authentication fails. Do not claim Firefox, WebKit, iPhone or iPad hardware coverage from Chromium tests. After registry publication, update the showcase's temporary 197-family npm warnings, deploy, and verify the live sitemap and routes. Final recommendation remains **PENDING RELEASE** until every post-publication gate is recorded.
