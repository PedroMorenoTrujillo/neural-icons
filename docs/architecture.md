# Architecture

## Boundaries

```text
packages/core       pure icon data; no DOM, Angular, or runtime registry
       ↓
packages/angular    Angular 22 standalone renderer
       ↓
apps/showcase       SSR + hydration integration and visual review
```

`@neural-icons/core` is the source-level contract. An icon is an immutable object containing a kebab-case name, category, search tags, a fixed `0 0 24 24` view box, and one or more path strings. This representation is serializable and safe to use in browsers, Node.js, workers, tests, and server rendering.

`@neural-icons/angular` imports only that contract. It owns rendering and accessibility policy but does not own icon data. Future adapters must depend on core rather than one another.

## Tree-shaking and package exports

Every icon is emitted as its own module under `@neural-icons/core/icons/<name>`. Product code should use those entry points so a bundle includes only explicitly imported definitions. The root exports only types and small universal helpers; it never re-exports glyph definitions. `@neural-icons/core/catalog` explicitly opts into `neuralIcons` and all 398 definitions for tooling and the QA gallery. `provideAllNeuralIcons()` is the analogous explicit Angular opt-in.

Both package manifests declare `sideEffects: false`. Core is built with TypeScript while preserving the module graph. Angular is built with ng-packagr in partial compilation mode, producing the Angular Package Format for Angular 22 consumers.

The package check verifies root contracts and per-icon imports with Vite against unpacked build artifacts. A separate esbuild matrix verifies that root imports retain zero glyphs, per-icon imports retain only selected definitions, and the explicit catalog retains all 398. Native Node ESM does not tree-shake: use per-icon entry points to avoid evaluating unnecessary definitions in server-only consumers.

Raw assets have explicit `./svg/*.svg` exports. Workspace TypeScript aliases mirror the JavaScript entry points; internal `core/lib/*` paths are not an application API. Core production compilation excludes DOM and Node ambient types, and lint rejects framework imports from core.

## Angular API

`NeuralIcon` is standalone and OnPush. Its inputs are:

- `icon` (required): a direct `NeuralIconDefinition` or a registered `NeuralIconName`. Names resolve only through explicit `provideNeuralIcons(...definitions)`; unknown names render no SVG and warn once per name/instance in development.
- `size`: CSS length or number; numbers become pixels. Default `1em`.
- `strokeWidth`: numeric SVG stroke width. Default `1.75`.
- `label`: accessible name, trimmed before rendering. Default `null`; blank labels also make the icon decorative.

Color is inherited through `currentColor`, so component libraries can theme icons without runtime configuration.

## SSR and hydration

Rendering is a pure function of signal inputs. The component does not read `window`, `document`, layout, time, randomness, or global mutable registries. It creates no generated IDs. The same inputs therefore produce the same SVG tree on the server and client, avoiding hydration mismatches.

The showcase uses Angular 22 SSR, prerendering, client hydration, and zoneless change detection as an integration boundary. Package tests verify deterministic path output and accessible states.

The production browser test intercepts JavaScript downloads, records the prerendered SVG nodes, then enables JavaScript and filters the catalog. Remaining SVGs must be the original server nodes and the browser must report no errors. This covers the current prerendered route; dynamic request-time rendering and other host environments need their own consumer integration tests. The local test server uses an explicit allowed host and binds to loopback.

## Accessibility

Decorative is the safe default when an icon appears inside a labeled button or beside visible text. In that mode the SVG receives `aria-hidden="true"`. When `label` is supplied, the SVG receives `role="img"` and `aria-label`, and `aria-hidden` is removed. SVGs are never keyboard-focusable; interactive behavior belongs to the surrounding control.

## Source and generation

Canonical geometry lives in `packages/core/icons/icons.json`. `tools/icons.mjs` deterministically generates:

- one TypeScript module per icon;
- one standalone SVG per icon;
- the barrel and full catalog;
- `docs/icon-inventory.md`.

Generated files are committed for review and packaging. `tools/validate-icons.mjs` checks naming, uniqueness, category vocabulary, search metadata, base-set size, and path safety. Adding arbitrary SVG markup, event handlers, styles, references, or external URLs is not supported.

`core:build` depends on `core:validate`, which verifies generated content and rejects orphaned artifacts. Generator/tool changes and the shared TypeScript configuration participate in Nx task inputs. `angular:verify-package` depends on production package builds and intentionally runs without cache: it verifies the tarball file surface, all icon/SVG exports, readonly declarations and Angular AOT consumption from a temporary directory. CI runs this through `npm run check`, plus the separate production browser suite.
