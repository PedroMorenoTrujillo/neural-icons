# NI-02 — Final Core distribution and catalog QA

Date: 2026-09-25. Scope: local, unpublished `neural-icons` working tree. This report supersedes the pre-remediation NI-02 snapshots; no release decision is implied.

## 1. Status and count

**READY FOR FRAMEWORK EXPANSION.** The final manifest contains **197 families / 394 glyphs**: one outline and one filled variant per family. The baseline immediately before this remediation was 198 / 396. The difference is exactly the removal of public `funnel` and `funnel-filled`. The 193 previously frozen KEEP families received no geometry change; the approved family fixes were limited to `file`, `file-text` and `login`.

## 2. Public identity decisions

| Decision | Final state |
| --- | --- |
| `attach → paperclip` | Already removed before this phase. `paperclip` and `paperclip-filled` are canonical; `attach`, `attachment`, `file attachment` remain search tags only. |
| `funnel → filter` | Applied. `filter` and `filter-filled` remain; both retain `funnel` as a search tag. No `funnel` definition, SVG, runtime alias or granular export remains. |
| `group` / `users` | Both KEEP as separate public families and different compositions. Neither geometry nor name changed. |
| `file` / `file-text` | Separate families: generic document versus text document. Proposal E, a geometric T, is applied to both `file-text` variants. |

There is no `FunnelIcon = FilterIcon` or analogous `attach` runtime alias. Search terms do not become public icon names. The existing showcase's search finds `filter` for `funnel` and `paperclip` for `attach`; Chromium E2E asserts those outcomes.

## 3. Approved geometry, exactly applied

- `file-filled`: only `M14 3v5h5z → M14 3v5h4z`; the page exterior, bars, `file` outline and identity are unchanged.
- `file-text` outline: `M6 3.5h8l4 4v13H6zM14 3.5v4h4M8.5 11h7M12 11v7`.
- `file-text-filled`: `M6 3h8l4 4v14H6zM14 3v5h4zM8.5 10.5h7v2.2H13v5.5h-2v-5.5H8.5z`. Its exterior and repaired fold match final `file-filled`; the T is a true even-odd negative-space cutout using `currentColor`, not white paint, `<text>`, a font or a mask.
- `login` outline and filled use the approved left-pointing arrow into the existing left-side door. `logout` stays unchanged and points out.

Proposal A: **REJECTED**. Proposal C: **REJECTED**. Proposal D: **REJECTED**. Proposal E: **APPROVED + APPLIED**. At native 16 px, `file`'s two bars and `file-text`'s T are perceptually distinct in outline and filled, light and dark. This is a visual-recognition judgment, not mathematical/pixel identity certification.

The source of truth is `packages/core/icons/icons.json`; the official `tools/icons.mjs` pipeline regenerated TypeScript definitions, standalone/package SVG, name/family unions, catalog index and inventory. The legacy expansion templates for these approved shapes were also updated so they cannot reintroduce the old versions.

## 4. Naming, categories and visual dispositions

The final [naming ledger](NI-02-NAMING-LEDGER.md) has 197 final KEEP naming rows, including the 10 surviving members of the earlier 11-item naming/category review. The eleventh, `funnel`, is recorded above as MERGED into `filter` and no longer has a row. No rename or category reclassification beyond the approvals was applied. Category suggestions from the earlier audit are not silently treated as approvals; current categories are retained.

The final [visual disposition ledger](NI-02-VISUAL-DISPOSITIONS.md) has 197 rows: **192 KEEP, 3 FIXED, 2 MERGED, 0 REVIEW**. `file`, `file-text`, `login` are FIXED; `filter` and `paperclip` are MERGED-canonical without geometry changes; `group` and `users` are KEEP. The apparent drop from 193 previously frozen KEEP statuses to 192 arises because `filter` and `paperclip` are now classified MERGED for identity accounting while `group` becomes KEEP. It does **not** denote a geometry edit to a frozen family.

## 5. Source, generated output, package boundaries

`npm run check:generated` verified **791** generated files, including all 394 definition modules, all 394 SVG files, types, index and inventory; it also verified the 197-row ledgers and all 20 official contact sheets. The generator's orphan check found no removed source definition or SVG. Package validation unpacked locally built tarballs and proved that their **394 SVG filenames and 394 definition module filenames exactly equal the manifest set** and every packed SVG is byte-for-byte equal to its generated source SVG. Runtime import of every packaged definition deep-equals the manifest-derived definition.

The following granular Core paths are present and tested by the all-icon package loop: `/icons/file`, `/icons/file-text`, `/icons/login`, `/icons/filter`, `/icons/paperclip`, `/icons/group`, `/icons/users`. Their filled companions are also present. Imports and SVG assets for `/icons/attach`, `/icons/attach-filled`, `/icons/funnel`, `/icons/funnel-filled` are explicitly asserted absent. Package wildcard exports therefore cannot revive the removed names from stale `dist` files. The Core root exports no glyph definitions; the complete catalog is explicit `@neural-icons/core/catalog` opt-in. No default Angular full registry was introduced.

## 6. Automated SVG and visual QA

`npm run validate:icons` passed for all **394** specs: paired variants, allowed fields/categories, tags, 24×24 canvas, currentColor/none policy, forbidden markup/resources, path characters and generated SVG presence. Independent `xmllint` parsed all 394 SVGs; Sharp rasterized all 394 without errors or blank output. Six previously frozen glyphs (`wand`, `cloud`, `cloud-upload`, `cloud-download`, `unlock-filled`, `unlink-filled`) touch an outermost raster pixel at 24 px. This detector reports boundary contact, not proven clipping; none of those glyphs was modified by this phase, and no new clipping was seen in the approved pairs. This remains a bounded automated observation, not a claim of mathematical pixel perfection.

All **20 official internal contact sheets** were regenerated from the final manifest and generated SVGs. They contain exactly 197 family cards, both variants, 16/20/24/32 px, light and dark; no `attach` or `funnel` family card. Targeted final generated-SVG comparisons were rendered separately for [file/file-text](</Users/pedromorenotrujillo/Documents/Codex/2026-09-23/referenced-chatgpt-conversation-this-is-an/outputs/NI-02-FINAL-FILE.png>), [login/logout](</Users/pedromorenotrujillo/Documents/Codex/2026-09-23/referenced-chatgpt-conversation-this-is-an/outputs/NI-02-FINAL-LOGIN.png>), [filter/paperclip](</Users/pedromorenotrujillo/Documents/Codex/2026-09-23/referenced-chatgpt-conversation-this-is-an/outputs/NI-02-FINAL-DISCOVERY.png>) and [group/users](</Users/pedromorenotrujillo/Documents/Codex/2026-09-23/referenced-chatgpt-conversation-this-is-an/outputs/NI-02-FINAL-PEOPLE.png>). At the tested sizes, the file-text T remains distinct, the `file-filled` fold protrusion is gone, login enters, logout exits, filter is canonical, and group/users remain distinct. No new concrete defect was observed in these targeted comparisons. These PNGs are review evidence, not public showcase assets.

## 7. Bundle matrix from unpacked local packages

| Case | Retained glyphs | Raw bytes | Gzip bytes |
| --- | ---: | ---: | ---: |
| CORE ROOT ONLY | 0 | 34 | 52 |
| ONE ICON | 1 | 478 | 321 |
| ONE FAMILY WITH VARIANTS | 2 | 727 | 415 |
| 10 ICONS | 10 | 1,520 | 584 |
| ANGULAR COMPONENT + ONE ICON | 1 | 6,272 | 1,869 |
| ANGULAR COMPONENT + 10 ICONS | 10 | 7,314 | 2,142 |
| FULL CATALOG, explicit opt-in | 394 | 80,772 | 20,030 |
| ROOT UNUSED | 0 | 0 | 20 |

The gate inspects retained module names in esbuild's metafile, not bytes alone. The separate A–F name-resolution cases retained **1 / 1 / 2 / 2 / 0 / 394** icon modules, respectively; case B, `provideNeuralIcons(iconSave)`, retained only `save`, not the catalog. Vite/Rollup smoke checks in the package validator found no unrelated geometry. No package architecture rewrite was needed.

## 8. Core, Angular, SSR/hydration and Chromium E2E

`npm run check` passed: generated-file and SVG validation; Nx lint, unit tests and production builds for Core, Angular and the existing showcase; Angular package verification and AOT consumer compilation from unpacked local tarballs. The Angular unit suite covers direct definition, explicitly registered string names, multiple provider calls, reactive name changes, unknown-name behavior, filled rendering and accessibility. The ordinary Angular component does not load all 394 glyphs; `provideAllNeuralIcons` remains intentional opt-in.

`nx run angular:hydration-test` passed its zoneless SSR/Chromium fixture: five SVG nodes reused, direct and registered names, no NG050x hydration error and one signal update. `nx e2e showcase-e2e` passed **3/3** Chromium tests, including server markup before JavaScript, node reuse, final family count, exact changed path assertions and search-keyword behavior. These assertions support those specific claims, not an unbounded visual-regression claim.

## 9. Risks and gates

- These are **local, unpublished changes**. Existing npm prereleases may still contain prior geometry and exports; this report is not an npm-registry certification or authorization to publish.
- Public removal of `funnel` (and the prior `attach` removal) is a breaking identity change for any external consumer using those unpublished/local paths. No hidden compatibility alias is provided.
- Licensing and any later release/public-showcase approval remain separate decisions. The internal QA sheets are not a public showcase.
- The six edge-pixel contacts noted above are a diagnostic limitation, not a newly confirmed clipping defect. Further aesthetic changes to frozen glyphs require a new decision.

**Framework expansion gate: READY FOR FRAMEWORK EXPANSION** on the audited local Core/Angular contract. React and Vue were **not** started. **Public showcase gate: NOT AUTHORIZED IN THIS PHASE**; no new public showcase was developed or published. The existing local showcase was built and tested by the requested gates. Certification did not include a push, tag, release or npm publish; committing the approved local changes is a separate authorized step.
