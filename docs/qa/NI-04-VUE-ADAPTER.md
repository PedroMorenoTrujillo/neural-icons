# NI-04 — Vue adapter

Date: 2026-09-25. Scope: local, unpublished `neural-icons` workspace. No Core glyph, Angular API, React API or public showcase was changed.

## 1–10. Status and package contract

1. **Status:** NI-04 implementation and local package gates pass. Changes are unstaged for review; this is not a release certification.
2. **Starting checkpoint:** `41d95af10cc5b09c48e6deec4d46eeb1d0a39c57` on `main` (NI-03 approved).
3. **Package architecture:** `@neural-icons/vue` is a separate, buildable package. Core owns all geometry, definitions, family names, variants and search metadata. Vue contains only a renderer.
4. **Vue version policy:** Vue `3.5.43` was installed and tested. The peer range is deliberately limited to `>=3.5.0 <3.6.0`; older and future minor versions are not certified here.
5. **Public API:** the root exports `NeuIcon` and the `NeuIconProps` type; no duplicated catalog or internal renderer subpath is public.
6. **NeuIcon:** a single generic component for all Core definitions, not 394 generated Vue components.
7. **Definition contract:** required `icon: NeuralIconDefinition`. Compile fixtures accept a granular Core definition and reject missing, string and partial definitions.
8. **Name/registry decision:** no `name` prop, provider, global registry or hidden dynamic import. Direct definition use is sufficient.
9. **Variants:** existing Core `outline` and `filled` definitions are passed directly; there is no redundant `variant` prop or new variant vocabulary.
10. **Vue rendering architecture:** `defineComponent` with one render function using `h()`, explicit props and `inheritAttrs: false`. This gives controlled attribute fallthrough while keeping the component thin. There are no composables or browser globals.

## 11–23. DOM, semantics and parity

11. **SVG DOM:** one direct `<svg>` with optional deterministic `<title>` and Core-derived `<path>` children. No wrapper, SVG-string parser, `DOMParser` or `innerHTML`.
12. **Attribute fallthrough:** class, style, ID, data attributes, dimensions and ordinary SVG attributes flow to the SVG. Geometry/semantic attrs in both kebab-case and camelCase, plus markup-injection props, are filtered; Core-controlled values are then written to the SVG. A unit test attempts viewBox/fill/stroke/stroke-width/strokeWidth/role/aria-hidden and innerHTML overrides and confirms protection.
13. **currentColor:** preserved in fill/stroke according to Core's definition, with normal CSS inheritance/class/style control.
14. **Size:** `size` defaults to `1em`; numbers and CSS strings work. Explicit `width` and `height` attrs override it independently without changing viewBox.
15. **class/style:** Vue fallthrough lands directly on `<svg>` and is covered by SSR tests.
16. **Accessibility:** decorative by default (`aria-hidden="true"`, no image role). Nonblank `aria-label`, `aria-labelledby` or `title` creates `role="img"` and removes `aria-hidden`.
17. **Title:** a stable `<title>` is rendered only when it supplies the accessible name; explicit ARIA names take precedence to avoid duplicate announcements. No random IDs.
18. **Ref/expose:** no imperative methods or explicit SVG ref API. Vue's normal component ref behavior remains; the DOM root itself is an SVG.
19. **SSR:** an isolated consumer imports packed Core/Vue packages and renders outline, filled and NI-02 critical families with `createSSRApp()` and `renderToString()`; output is deterministic.
20. **Hydration:** Chromium hydrates packed-package SSR markup, reuses the same SVG node, and reports zero Vue hydration warnings, console errors or page errors. A jsdom unit test also verifies node reuse. The bare esbuild browser fixture explicitly defines Vue's standard compile-time flags; it does not suppress hydration warnings.
21. **197/394 parity:** the unit suite renders all 394 Core definitions with unchanged path data and viewBox. Generated/source validation confirms 197 paired families.
22. **Changed families:** the packed consumer renders both variants of `file`, `file-text`, `login`, `filter`, `paperclip`, `group` and `users`, preserving Core paths.
23. **Removed aliases:** packed consumer rejects granular imports for `attach`, `attach-filled`, `funnel` and `funnel-filled`; Vue publishes no substitute identity.

## 24–32. Tests, bundles and package evidence

24. **Tests:** outline/filled rendering, geometry, currentColor, size, class/style, safe fallthrough including camelCase and markup-injection rejection, accessibility, title, direct SVG DOM, jsdom hydration and all-glyph loop pass.
25. **Types:** positive Core definition, size, class/style, ARIA and SVG-attribute fixtures compile; missing/invalid definitions and invalid size are rejected. TypeScript 6.0.3 also resolves the built package declarations in an isolated consumer. Vue's open-ended fallthrough attrs are protected at runtime rather than falsely claimed as compile-time forbidden.
26. **Tree-shaking matrix:** esbuild minified ESM with Vue external; retained Core glyph modules are counted from the metafile, not inferred from byte size.

| Case                              | Retained glyphs |  Raw B | Gzip B |
| --------------------------------- | --------------: | -----: | -----: |
| A: Vue imported, `NeuIcon` unused |               0 |     28 |     48 |
| Adapter only, `NeuIcon` exported  |               0 |  1,531 |    810 |
| B: `NeuIcon` + one icon           |               1 |  2,034 |  1,035 |
| C: one family, both variants      |               2 |  2,296 |  1,134 |
| D: ten icons                      |              10 |  3,352 |  1,560 |
| E: explicit Core catalog          |             394 | 82,381 | 20,874 |
| Root unused                       |               0 |      0 |     20 |

27. **One-icon gate:** case B retains exactly `search`; zero unrelated definitions. An independent Vite/Rollup build also retains only `search`.
28. **Root-unused:** no product code is retained (0 raw bytes). Case A retains only its non-icon test marker.
29. **Bundlers:** esbuild matrix plus Vite/Rollup one-icon smoke pass. No larger compatibility matrix is claimed.
30. **Full catalog:** `@neural-icons/core/catalog` remains explicit opt-in; no `@neural-icons/vue/all` exists.
31. **Dependency graph:** runtime dependency `@neural-icons/core: 0.0.1-next.0`; peer `vue >=3.5 <3.6`. Vue `3.5.43` is a workspace development dependency for build/tests. No React, Angular, parser, DOM library or third-party icon runtime dependency is added to the Vue package.
32. **Package exports/types:** ESM root JS and declarations resolve from the built package, with `sideEffects: false`. Local `npm pack` excludes tests and ships no source `.ts` export target.

## 33–42. Regressions, scope and recommendation

33. **Real consumer:** built Core and Vue are locally packed and installed into a standalone temporary npm project with registry-cached Vue/TypeScript. Import, typecheck, esbuild build, SSR and Chromium hydration pass without workspace source aliases. This is **not** npm-registry certification.
34. **Core regression:** `npm run check` passes: 791 generated files, 197 naming rows, 20 internal contact sheets, 394 icon specs, lint/tests/build and granular package bundle gates. No Core source or geometry file was modified.
35. **Angular regression:** `npm run check` includes Angular lint/tests, production package and AOT consumer with registry behavior and granular bundles. `nx run angular:hydration-test --skipNxCache` passes zoneless SSR/Chromium hydration with five SVG nodes reused.
36. **React regression:** `npm run check` includes React lint/tests/build. `nx run react:typecheck --skipNxCache` and the packed React consumer pass, including SSR, Chromium hydration, Vite/Rollup and one-icon = one glyph.
37. **Cross-framework consistency:** all three adapters consume Core definitions and preserve variant, path and currentColor semantics. Angular's optional explicit name registry stays Angular-specific; React and Vue use direct definitions. Decorative accessibility is the default in each.
38. **Workspace changes:** new Vue package and verifier, one Vue dependency-boundary rule, and Vue development dependency plus lockfile. The Nx library generator dry run was not applied because it would alter release/Verdaccio and unrelated root configuration; the package follows the existing React/Core Nx/TypeScript/Vitest pattern.
39. **Documentation:** package README covers install, granular import, size/color, accessibility, SSR and tree-shaking. No public showcase was created.
40. **Stash and Git:** pre-existing WIP stash `e36c545e59247efa964833e5d1d8a77fcc0bb93a` remains untouched; it contains only `NEURAL-UI-REQUIRED-ICON-SET.md` with SHA-256 `fd93e05af8dc05928e0b03175663f8fab5114713279e18e315c582215a3390a1`. NI-04 changes remain unstaged; no commit, push, tag, release or npm publish was made.
41. **Risks:** NI-02 Core changes are still unpublished while the package version remains `0.0.1-next.0`; any later Vue publication must coordinate an approved Core release/version and dependency update. Licensing remains `UNLICENSED`. `publint`/ATTW are not configured and are not claimed as passing. Only Vue 3.5.43, Node 22.22.3, the installed esbuild/Vite toolchain and Chromium were tested.
42. **Recommendation:** **NI-04 COMPLETE — READY FOR SHOWCASE** as a local framework foundation. This does not authorize building or publishing the public showcase.

Vue implementation choices follow the official [render-function](https://vuejs.org/guide/extras/render-function), [attribute fallthrough](https://vuejs.org/guide/components/attrs) and [SSR/hydration](https://vuejs.org/guide/scaling-up/ssr) contracts.
