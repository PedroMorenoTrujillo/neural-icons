# NI-03 — React adapter

Date: 2026-09-25. Scope: local, unpublished `neural-icons` workspace. No Core geometry, icon identity, Angular API, Vue package or public showcase was changed.

## 1–10. Status, architecture and public contract

1. **Status:** NI-03 implementation and local package gates pass; changes remain unstaged for review.
2. **Starting checkpoint:** `8455b3b848616cbe1e3cb85cb4cb168c207ce0ca` on `main` (NI-02 approved).
3. **Package architecture:** `@neural-icons/react` is a separate package. It depends on Core `0.0.1-next.0` and peers on React `>=19 <20`. It has no Angular, Vue, React DOM, icon-library or SVG-parser runtime dependency.
4. **React version policy:** React/React DOM `19.3.0` and matching types were tested. React 19 accepts `ref` as a function-component prop, so no legacy `forwardRef` wrapper is needed. React 18 is not claimed.
5. **Public API:** package root exports only `NeuIcon` and `NeuIconProps`; icons remain exclusively in Core's granular paths.
6. **NeuIcon component:** one generic function renders a direct `<svg>`; no generated per-icon React components or wrapper `<span>`.
7. **Definition contract:** required `icon: NeuralIconDefinition`; compile fixtures accept a granular definition and reject strings, missing icons, partial objects, geometry overrides and markup injection.
8. **Name/registry decision:** no `name` prop or registry. Direct definitions are sufficient and cannot imply a hidden full-catalog import.
9. **Variants:** Core's existing `outline` and `filled` definitions are used as-is; no duplicate variant prop or alternate variant vocabulary.
10. **SVG rendering:** path strings are passed directly to React path elements. The same closed-path, fill/stroke, even-odd and separate-path policy as Core's generated SVG is used; no runtime SVG parsing or `innerHTML`.

## 11–24. DOM, accessibility and rendering evidence

11. **DOM:** one `<svg>`, its optional `<title>`, and Core-derived `<path>` elements. No extra DOM container.
12. **currentColor:** preserved in fill or stroke according to Core definition. CSS inheritance, `className` and `style` work normally.
13. **Size:** `size` defaults to `1em`; numeric values render as CSS pixels. Explicit `width` and `height` take precedence independently.
14. **className/style:** native SVG props pass through without modification.
15. **SVG props:** ordinary SVG/data/ID props pass through. Core geometry, fill/stroke/rules/line treatment, `xmlns`, focusability, role and `aria-hidden` remain controlled so callers cannot silently distort the certified icon.
16. **Accessibility default:** decorative with `aria-hidden="true"` and no image role.
17. **Accessible icon:** a nonblank `aria-label`, `aria-labelledby` or title produces `role="img"` and removes `aria-hidden`.
18. **Title:** a deterministic `<title>` is emitted only when it supplies the accessible name; an explicit ARIA name takes precedence to avoid duplicate announcements. No generated ID.
19. **Ref:** React 19's native ref prop targets the SVG node; unit test confirms it.
20. **SSR:** isolated packed-package consumer imports and renders Core definitions with `react-dom/server`, including the critical NI-02 families; repeated input produces identical markup.
21. **Hydration:** Chromium hydrates an SSR-rendered packed-package SVG, reuses the same node, and reports zero recoverable errors, console errors or page errors. A jsdom unit fixture also checks node reuse.
22. **197/394 parity:** the unit suite renders all 394 Core catalog definitions; source/generated checks confirm 197 paired families and 394 glyphs.
23. **Changed-family parity:** packed consumer checks both variants of `file`, `file-text`, `login`, `filter`, `paperclip`, `group` and `users` against their exact Core path data. No adapter geometry is stored separately.
24. **Removed aliases:** packed consumer rejects all four granular imports for `attach`, `attach-filled`, `funnel` and `funnel-filled`. React exports no compatibility alias.

## 25–34. Tests, bundles and dependencies

25. **Unit tests:** outline/filled rendering, Core paths, viewBox, currentColor, sizing, CSS props, decorative and named accessibility, title precedence, ref, all-glyph loop and jsdom hydration pass.
26. **Type tests:** positive SVG/ref/definition fixture and negative unsupported-prop fixtures pass with TypeScript 6.0.3, including in a standalone packed-package consumer.
27. **Tree-shaking matrix:** esbuild production bundles are minified ESM with React external. The retained-definition count is checked from the metafile, not inferred from byte size.

| Case                                | Core glyph modules |  Raw B | Gzip B |
| ----------------------------------- | -----------------: | -----: | -----: |
| A: React imported, `NeuIcon` unused |                  0 |     28 |     48 |
| Adapter only, `NeuIcon` exported    |                  0 |  1,327 |    743 |
| B: `NeuIcon` + one icon             |                  1 |  1,844 |    954 |
| C: one family, both variants        |                  2 |  2,104 |  1,052 |
| D: ten icons                        |                 10 |  3,162 |  1,485 |
| E: explicit Core catalog            |                394 | 82,195 | 20,804 |
| Root unused                         |                  0 |      0 |     20 |

28. **One-icon gate:** case B retains only `search`; zero unrelated icon modules. Vite/Rollup independently retains only `search`.
29. **Root-unused:** no icon or adapter product code is retained (0 raw bytes). Case A keeps only its non-icon test marker.
30. **Adapter overhead:** exporting the adapter without icons costs 1,327 raw / 743 gzip bytes in this esbuild harness; React itself is external and is not included in that figure.
31. **Dependency graph:** `@neural-icons/react → @neural-icons/core` and peer `react`. React DOM, type packages and TypeScript are development-only at workspace level.
32. **Package exports:** one root ESM entry and declarations, `sideEffects: false`; no React catalog or internal renderer subpath.
33. **Consumer verification:** Core and React are locally packed from `dist`, installed into an isolated temporary npm project alongside registry-cached React/DOM/types/TypeScript, then resolved without workspace source aliases. Import, TypeScript, esbuild build, SSR and Chromium hydration pass. This is **not** an npm-registry certification.
34. **Bundler verification:** esbuild matrix and Vite/Rollup one-icon smoke pass. No broader bundler compatibility is claimed.

## 35–42. Regressions, scope and recommendation

35. **Core regression:** `npm run check` passes; generated/source parity validates 791 generated files, 197 naming rows, 20 internal contact sheets and 394 icon specs. Existing granular Core bundle gates pass.
36. **Angular regression:** `npm run check` includes Angular lint, unit tests, production package build, AOT package consumer and granular bundle tests. `nx run angular:hydration-test --skipNxCache` passes zoneless SSR/Chromium hydration with five reused SVG nodes.
37. **Workspace changes:** new React package, one package verifier, one React dependency-boundary rule, and root development dependencies for React/DOM/types. Existing Core and Angular package versions and APIs are unchanged. The Nx generator dry run was rejected because it would add release/Verdaccio and root configuration outside NI-03; the package follows the existing Core Nx/TypeScript/Vitest conventions instead.
38. **Documentation:** this report and the package README explain installation, direct imports, size/color, accessibility, SSR, refs and tree-shaking. No public showcase was created.
39. **Stash verification:** the pre-existing WIP stash remains `e36c545e59247efa964833e5d1d8a77fcc0bb93a`, containing only `NEURAL-UI-REQUIRED-ICON-SET.md`, with SHA-256 `fd93e05af8dc05928e0b03175663f8fab5114713279e18e315c582215a3390a1`. It was not applied, popped, dropped or included.
40. **Git diff/status:** NI-03 changes are left unstaged; no commit, push, tag, release or npm publish was made.
41. **Risks:** the certified NI-02 Core changes are still unpublished while the existing Core package version remains `0.0.1-next.0`; a future React publication must coordinate a new approved Core release/version and update its dependency. Licensing is `UNLICENSED` and needs a separate release decision. `publint`/ATTW are not configured locally and were not claimed as passing. Only React 19.3.0, Node 22.22.3, esbuild/Vite and Chromium were verified.
42. **Recommendation:** **NI-03 COMPLETE — READY FOR VUE** for local framework development, not release approval.

React 19 ref and hydration decisions follow the [React ref documentation](https://react.dev/reference/react/forwardRef) and [hydrateRoot contract](https://react.dev/reference/react-dom/client/hydrateRoot).
