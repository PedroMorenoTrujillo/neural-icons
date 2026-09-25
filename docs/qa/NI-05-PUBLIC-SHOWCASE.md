# NI-05 — Public showcase

## Status and starting point

**NI-05 COMPLETE — READY FOR FINAL AUDIT.** This is a local, unpublished showcase implementation. Starting checkpoint: `1a8bbf49534bfe2a7c4e268f2713fdb7f35a0a7b` on `main` (approved NI-04). NI-05 remains unstaged and uncommitted.

## Product and visual direction

1. **Purpose:** help developers discover one canonical icon family, compare its outline/filled pair, then copy the correct granular import and adapter usage.
2. **Art direction:** a compact specimen atlas, not a marketing landing page. The existing Neural blue remains the functional accent; neutral surfaces and hairline divisions let the glyphs lead.
3. **Typography and spacing:** compact sans-serif labels, tabular counts, an 8/12/16/24/32 px rhythm. No repeated heavy cards, hero gradient, or ornamental shadows.
4. **Grid density:** 197 border-joined family tiles. Default two 27 px glyphs per tile, outline first; single-variant mode uses 30 px. The selected glyph is inspected separately at 16, 20, 24, 32 and 76 px.
5. **Header/sidebar:** a compact masthead and filter strip precede the catalog; detail is a sticky right panel on wide screens. Below 1000 px it becomes a fixed, accessible dialog-like panel.
6. **Responsive/theming:** mobile keeps the same search and catalog. Light and dark styles use one `currentColor` glyph source. Four preview ink choices are CSS color only.
7. **Focus/motion:** visible keyboard focus; mobile detail focuses Close, traps Tab inside, makes the background inert, restores tile focus on close, and closes on Escape. Transitions are minimal and disabled under reduced motion.

## Catalog architecture and discovery

8. **Source of truth:** `apps/showcase/src/app/app.ts` explicitly imports `@neural-icons/core/catalog`. Family, category, tags, variant and paths come from Core definitions; no separate showcase metadata ledger was added.
9. **Full catalog:** exactly **197 families / 394 glyphs**, paired by Core `family` and `variant`. The showcase is the intentional full-catalog consumer; Core root and all three adapter roots remain catalog-free.
10. **Canonical identity:** tiles always use `family`, not a search alias. `attach` returns `paperclip`; `funnel` returns `filter`. Neither retired alias appears as a family.
11. **Search:** immediate, case-insensitive substring match over canonical name, Core tags and category. Clear control, result count and empty state are provided. There is no backend, debounce or fuzzy-search dependency.
12. **Filters:** six categories come directly from current Core data: action, communication, file, navigation, status and system. A single grid-preview switch offers Both, Outline and Filled; no invented “recently added” taxonomy.
13. **Grid/detail:** 197 focusable family buttons with paired visual samples. Selection opens the same-page detail with name, category, keywords, variant choice, color and size comparison. This avoids presenting 394 separate concepts.
14. **Deep link/history:** `?icon=<canonical-family>` is shareable. Selection/close use browser history; Back restores the prior selection. URL state is read after hydration so the SSR and first client render match. Unknown names leave detail closed.

## Usage, copying and accessibility

15. **Core import:** the selected definition is generated as `@neural-icons/core/icons/<exact-definition-name>`; filled uses the certified `-filled` subpath. The export identifier is derived from the definition name.
16. **Angular:** snippets use `NeuralIcon` from `@neural-icons/angular`, a granular Core definition, a component field and `<neural-icon [icon]="…" [size]="24" />`.
17. **React:** snippets use `NeuIcon` from `@neural-icons/react` and `<NeuIcon icon={…} size={24} />`.
18. **Vue:** snippets use `NeuIcon` from `@neural-icons/vue` in `<script setup>` and `<NeuIcon :icon="…" :size="24" />`.
19. **Copy:** canonical name, granular import and framework snippet have separate controls and a polite live-status message. Clipboard access happens only in a user-triggered browser action; failure offers a text-selection fallback.
20. **Accessibility education:** detail explains decorative versus semantic use: Angular `[label]`, React/Vue `aria-label` or `title`. The grid's preview SVGs are decorative because the family buttons have names. This is guidance, not a claim of blanket WCAG certification.
21. **Tree-shaking education:** the catalog footer shows a one-icon import and explicitly distinguishes ordinary consumers from this full-catalog explorer.
22. **Versions and links:** UI says “Development preview”; it makes no claim that local Core/React/Vue package versions are already published. No speculative repo or npm links were added.

## Visual checks

23. **Desktop/mobile/dark/detail:** inspected the local Chromium preview in the integrated browser. Dense cells remain scannable; the right detail displays size samples and code without hiding the catalog on desktop. Mobile overlay and dark theme were inspected.
24. **File/file-text:** filtered together in the live atlas; `file-text` retains its distinct T-like mark in outline/filled, with a legible 16 px detail sample. No geometry changed.
25. **Login/logout:** filtered together; entering/exiting arrow orientation remains visibly distinct. No geometry changed.
26. **Group/users:** remain separate canonical families. `paperclip` and `filter` remain canonical and discoverable from the approved aliases.
27. **Certification limit:** this is screenshot inspection plus path assertions, not a pixel-diff baseline or a fresh certification of all 394 glyph shapes. The NI-02 contact sheets remain the separate internal QA artifacts.

## Build, performance and regression evidence

28. **Showcase checks:** production Angular AOT build, unit tests and lint pass. The component-style budget was raised only in the showcase project to accommodate its new catalog/detail UI (9 kB warning / 12 kB error); the final compiled style was 8.74 kB.
29. **Chromium E2E:** 6/6 pass for SSR presence, hydration without console errors and with SVG-node reuse, counts, aliases, category, variant preview, detail, snippets, clipboard, URL/history, keyboard, mobile/dark and targeted canonical paths.
30. **SSR:** the server emits the 197 named family buttons and 394 grid SVGs before JavaScript. Family names are indexable in the static page. Detail for a `?icon=` link opens after hydration rather than generating 197 individual prerendered detail routes.
31. **Hydration:** client reuses server SVG nodes, with no observed NG050x or browser-console errors in the E2E gate. URL and viewport-dependent state is applied after hydration.
32. **Performance sample:** in the final local headless Chromium run, DOMContentLoaded was 87.1 ms, load 89.6 ms, first contentful paint 60 ms, and a `file-text` search updated the 197-family grid to one family in 8.2 ms through the next animation frame. These are exploratory local timings, not a cross-device benchmark or performance SLA. No virtualization was introduced.
33. **Full-catalog bundle:** the built showcase main file was 283,192 B raw / 87,189 B gzip (plus 226 B stylesheet). This deliberately includes the catalog and Angular runtime; it is not a one-icon consumer measurement.
34. **Granular comparison:** the existing Core gate reports ONE ICON 1 glyph / 478 B raw and FULL CATALOG 394 glyphs / 80,772 B raw. Angular component + one icon retains one glyph; React and Vue packaged one-icon gates also retain exactly one.
35. **Core:** `npm run check` passes; generated/source parity verifies 791 generated files, 197 naming rows and 20 contact sheets. Core validation reports 394 glyph specifications. No Core source, geometry, names or package exports were changed.
36. **Angular:** `npm run check` includes package/AOT checks. Its separate zoneless SSR/hydration regression passes with five SVG nodes reused.
37. **React/Vue:** both packaged-consumer verifiers pass after NI-05, including their one-icon tree-shaking gates. Their APIs and catalog ownership are unchanged.
38. **Static analysis:** the UI design detector returned no mechanical findings. `git diff --check` passes.

## Scope, safety and recommendation

39. **Stash:** `stash@{0}` remains `e36c545e59247efa964833e5d1d8a77fcc0bb93a`, containing only `NEURAL-UI-REQUIRED-ICON-SET.md`; its SHA-256 remains `fd93e05af8dc05928e0b03175663f8fab5114713279e18e315c582215a3390a1`. No pop/apply/drop.
40. **Git:** NI-05 changes are limited to `apps/showcase`, `apps/showcase-e2e` and this report, and remain unstaged. No commit, push, tag, release, npm publish or production deployment.
41. **Risks:** the public showcase is implemented locally but not deployed; theme choice is session-only; icon detail is client-opened after SSR; the visual review has no automated pixel-diff baseline. These are explicit boundaries, not adapter or catalog regressions.
42. **Recommendation:** **NI-05 COMPLETE — READY FOR FINAL AUDIT**. A final design/product review should precede any publication or deployment.
