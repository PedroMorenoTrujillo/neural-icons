# Neural Icons — pre-release remediation (2026-09-27)

## 1. Status

Local candidate `0.0.1-next.2` is prepared for an independent final audit. No npm publish, dist-tag change, push, tag, release, production deploy, or commit was performed. Registry-only installation of this candidate remains impossible until publication; all candidate-consumer checks below use the built tarballs.

## 2. Starting checkpoint

`main` at `3a712d98bd88202cb5307bf1cb7945a68690b2e3` (`feat(showcase): add Neural Icons public catalog explorer`), already five commits ahead of `origin/main`. The working tree initially contained uncommitted showcase, SVG and contact-sheet work; those changes were preserved. The existing stash was not applied, popped, dropped, or rewritten.

## 3. Astra findings matrix

| Finding                           | Disposition         | Evidence / limitation                                                                                                                                   |
| --------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-01 license                     | Fixed               | Identical MIT text at root and in all four packed packages; no UNLICENSED publishable manifest.                                                         |
| P0-02 release pipeline            | Fixed               | Four Nx release projects resolve `packageRoot` to `dist/packages/{core,angular,react,vue}`; all four npm pack dry-runs inspect compiled artifacts.      |
| P1-01 installation matches site   | Fixed for candidate | Versioned `next.2` commands and explicit unpublished notices; clean candidate consumer uses tarballs, not a nonexistent registry version.               |
| P1-02 responsive header           | Fixed               | Browser checks at 1280, 1024, 900, 820, 769, 720, 640, 390 and 358 CSS px; enlarged Spanish text at 769 px.                                             |
| P1-03 SEO/SSR                     | Fixed locally       | Six route/language SSR cases, crawlable detail links, metadata, hreflang, sitemap and robots. Canonical production origin remains a deployment setting. |
| P1-04 E2E/release gate            | Fixed               | Current 27-case Chromium suite included in `npm run verify:release`.                                                                                    |
| P1-05 HTML accessibility examples | Fixed               | Decorative, informative, and icon-only-button examples use consistent accessible naming.                                                                |
| P2-01 raw SVG acquisition         | Fixed               | `/icons/<name>.svg` assets and actual download links; inline SVG copy remains available.                                                                |
| P2-02 framework guides            | Fixed locally       | Per-framework install/use, requirements, variants, size, color, accessibility and API links; Angular direct vs string registration clarified.           |
| P2-03 Spanish search              | Fixed               | Locale-specific aliases without changing canonical family identifiers.                                                                                  |
| P2-04 code selection semantics    | Fixed               | Button groups with `aria-pressed`, no incomplete ARIA tab contract.                                                                                     |
| P2-05 color/theme/hit targets     | Fixed               | Dark preview contrast, persistent theme/system default, larger compact controls.                                                                        |
| P2-06 shareable state             | Fixed               | Icon, locale, guide/catalog, framework, and variant survive direct URL and reload; history navigation tested.                                           |
| P2-07 product trust               | Fixed locally       | MIT, repository, package metadata, versions, peer ranges, granular-import statement.                                                                    |

## 4. P0-01 MIT license

Root and package LICENSE files have the same SHA-256 prefix `dde25dafc3a7`; all five manifests declare `MIT`. The SVG catalog is covered by the root/Core MIT license. The showcase exposes the license. The four packed tarballs contain LICENSE. Obsolete contradictory `LICENSE.md` files were replaced, not retained as alternate licenses.

## 5. P0-02 four-package release pipeline

Nx resolves `nx-release-publish` to `dist/packages/core`, `dist/packages/angular`, `dist/packages/react`, and `dist/packages/vue`. Core/Angular retain their existing distribution behavior; React/Vue have explicit dist publish roots. The release verification script rejects source/test leakage and missing compiled JS, declarations, metadata, or license.

## 6. Version strategy

Local proposed candidate: Core, Angular, React and Vue `0.0.1-next.2`. The three adapters depend on exactly Core `0.0.1-next.2`. Core must be published first; then Angular, React and Vue. On the registry as checked 2026-09-27, Core's `next` and `latest` point to `0.0.1-next.0`; Angular's `next` points to `0.0.1-next.1` and `latest` to `0.0.1-next.0`; React/Vue return npm 404. No `next.2` package was published in this work. Stable/latest requires later explicit approval and an appropriate stable version, not promotion of the local candidate by assumption.

## 7. Installation flow

HTML defaults to direct SVG download with no framework or Neural UI. Framework instructions name Core plus the adapter and pin the local candidate version; the site clearly says these commands are not yet registry-installable. The candidate consumer exercises Core and Angular by installing local tarballs into a fresh directory with npm, framework dependencies from npm, no workspace path alias, and no Neural-package symlink. React and Vue package verification also installs locally packed tarballs into temporary consumers.

## 8. Responsive header and architecture

The Angular showcase uses Angular `22.1.6`. `App` is the state/navigation/SEO container. `ShowcaseHeader`, `CatalogView`, `GuideView`, and `DetailPanel` are presentation components with inputs/outputs; catalog data and code-snippet generation are separate modules. Component-owned styles replaced the former 926-line `app.scss`; its remaining container stylesheet is about 100 lines and the previous 9 kB component-style warning is gone. Browser checks found and fixed cascade-order regressions introduced by extraction. The catalog/guide mobile and tablet checks are passing, including Spanish enlarged text.

## 9. SEO/SSR

Server rendering now reflects catalog, guide, and icon detail in English and Spanish before hydration. Titles, descriptions, `html[lang]`, Open Graph fields, canonical URLs, and EN/ES hreflang follow the route. Detail tiles are real links. `robots.txt` and `sitemap.xml` are served by the production server. Set `NEURAL_ICONS_SITE_ORIGIN` to the final public origin before deployment; no production domain was invented. Invalid icon URLs are marked `noindex, follow`.

## 10. E2E update

The obsolete two-glyph-card and Angular-default assumptions were removed. Browser coverage now includes the 197-family grid, variants, framework snippets, aliases, clipboard, locale, dark mode, focus trap, Escape, direct URLs, SSR/hydration, responsive widths, guide on 358/390 px, enlarged text, sitemap, robots, and direct SVG asset acquisition. The current Chromium suite has 27 tests.

## 11. HTML accessibility

The guide renders full decorative SVG (`aria-hidden`), informative SVG (`role="img"` plus `aria-label` and no `aria-hidden`), and icon-only button (accessible name on the button, decorative nested icon) examples. The examples are generated from the actual Core search glyph rather than placeholder geometry.

## 12. SVG acquisition

The production showcase copies Core SVG assets to `/icons/`. Guide and detail offer working download URLs. Plain `<img>` examples reference copied public assets; CSS `currentColor` examples use inline SVG, since an external `<img>` does not inherit page color into the file.

## 13. Framework guides

Peer ranges: Angular `>=22 <23`, React `>=19 <20`, Vue `>=3.5 <3.6`; Core has no framework peer. Direct Angular `[icon]` definitions do not require a registry. String usage is `icon="search"`, not a nonexistent `name` input, and requires selected `provideNeuralIcons(iconSearch)` registration. React/Vue accept direct definitions and have no hidden catalog. Outlined/filled import paths and sizing are documented per framework.

## 14. Spanish search

Spanish aliases cover representative direction, file, attach, filter, home, mail, mention, search, and user concepts; approved English aliases remain. Search metadata does not create extra public families. Detail links preserve `lang=es`.

## 15. Code selector accessibility

Framework and variant selectors are semantically button groups with `aria-pressed`; no incomplete `role=tab` remains. Keyboard operation uses native buttons.

## 16. Theme/color/hit targets

The dark `#152033` preview uses a contrasting light backing. Selected theme is stored; an unset preference follows the OS. Compact header/filter controls have practical hit areas. The swatches are examples; any valid CSS color works through `currentColor` for inline SVG/adapters.

## 17. Shareable URL state

Route state contains family, locale, view, framework and filled variant. Deep-link SSR and a Spanish React filled reload are browser-tested; ephemeral search/category/theme are not unnecessarily encoded. Back/forward behavior is covered in the detail test.

## 18. Product trust metadata

All packages include repository/homepage/bugs/license metadata. The site explains MIT, package state, 197 families/394 glyphs, Core/adapter boundaries, no Neural UI dependency, and granular vs explicit catalog imports.

## 19. Showcase performance

Guide SSR no longer renders the catalog grid's 197 SVG components. The production initial browser bundle is approximately 324 kB raw / 85 kB estimated transfer after the component split; the catalog is intentionally included by the catalog explorer. This is not a claim that the regular adapters contain the full catalog.

## 20. Core quality

Generated/source parity passes for 791 generated files, 197 naming rows and 20 contact sheets; SVG validation passes for 394 glyphs. Core root retains zero glyphs; icon imports are granular; full catalog is an explicit opt-in. Approved pre-existing SVG/contact-sheet edits were not reopened by this remediation.

## 21. Angular quality

Angular AOT, package verification, one- and ten-icon tree-shaking, and a separate clean tarball consumer on Angular `22.1.6` pass. The clean consumer uses npm-installed dependencies and no Neural-package symlinks/source aliases. The existing Angular package suite covers SSR/hydration and name registry behavior.

## 22. React quality

Typecheck, SSR, clean packaged consumer, Chromium hydration, Vite/Rollup, and one-icon tree-shaking pass. React is still unpublished on npm.

## 23. Vue quality

Typecheck, SSR, clean packaged consumer, Chromium hydration, Vite/Rollup, and one-icon tree-shaking pass. Vue is still unpublished on npm.

## 24. Tree-shaking

Latest local gate: Core root 0 glyphs/34 raw bytes; one icon 1 glyph/478 bytes; one family 2 glyphs/727 bytes; ten icons 10 glyphs/1520 bytes; Angular +1 1 glyph/6272 bytes; Angular +10 10 glyphs/7314 bytes; full catalog 394 glyphs/80776 bytes; unused root 0 bytes. React +1 retained one glyph (1844 raw bytes); Vue +1 retained one glyph (2034 raw bytes). Byte counts are environment-specific; unrelated glyph retention is the structural gate.

## 25. Publish dry-run contents

`npm pack --dry-run --json` from the four Nx-resolved dist roots: Core 1591 files including 394 SVGs, Angular 6 files, React 9 files, Vue 9 files. Each has compiled JS, declarations, README, LICENSE and manifest; no test/fixture/TS source leakage or packed symlinks. Each adapter depends on Core `0.0.1-next.2`.

## 26. Browser matrix

Chromium checks cover catalog/guide/detail, EN/ES SSR, light/dark, 1280 through 358 px, mobile dialog and focus, enlarged tablet text, color examples, direct URLs, and acquisition endpoints. Current suite: 27/27 passing.

## 27. Accessibility

Native link/button semantics, names, focus management, mobile modal trap, Escape, status feedback, and illustrative icon semantics have test coverage. No WCAG certification is claimed. A dedicated axe run was not added; this remains a final-audit opportunity rather than a claimed pass.

## 28. SEO HTML verification

Raw server responses were checked for `/`, `/?lang=es`, `/?view=guide`, `/?view=guide&lang=es`, `/?icon=search`, and `/?icon=search&lang=es`. Each returns route-specific content, title/description, language, canonical/hreflang and OG fields before browser hydration. Guide SSR excludes the hidden family grid.

## 29. Release gate

`npm run verify:release` chains generated/SVG validation, lint, unit tests, builds, Angular/React/Vue package checks, adapter typechecks, four-artifact dry-runs, a no-symlink Angular tarball consumer, and the current Chromium suite. It does not publish or mutate registry tags.

## 30. Remaining risks

Registry-only install of `next.2` cannot be certified before publication. Public canonical origin is deployment-configured. Automated E2E does not replace a full manual visual or assistive-technology audit. The pre-existing approved local icon edits remain uncommitted with the remediation and must be reviewed as part of the final diff.

## 31. Exact publication plan

After independent Astra approval: (1) verify candidate/version availability, (2) publish Core `next.2` with `next` tag, (3) verify registry Core, (4) publish Angular/React/Vue `next.2` with `next` tag in that order, (5) install all four from registry in clean consumers, (6) align/showcase docs and configured public origin, (7) run final independent audit, (8) only then plan stable/latest with separate approval. No step was executed in this remediation.

## 32. Git status

Branch `main`, five local commits ahead of origin at start. Remediation and pre-existing approved local work remain unstaged/uncommitted for review. `git diff --check` passes. No push/tag/release/publish/deploy occurred.

## 33. Stash status

`stash@{0}` remains `e36c545e59247efa964833e5d1d8a77fcc0bb93a` (`wip: preserve Neural UI required icon set draft`); it was not touched.

## 34. Recommendation

**NEURAL ICONS PRE-RELEASE — READY FOR FINAL ASTRA AUDIT**, subject to the independent review of this uncommitted candidate and the explicitly deferred registry-only installation step. This is not approval to publish.
