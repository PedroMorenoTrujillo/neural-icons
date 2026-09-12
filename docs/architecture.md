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

Every icon is emitted as its own module under `@neural-icons/core/icons/<name>`. Product code should use those entry points so a bundle includes only explicitly imported definitions. The root barrel and `neuralIcons` array are conveniences for tooling and the showcase; application components should not import the complete array.

Both package manifests declare `sideEffects: false`. Core is built with TypeScript while preserving the module graph. Angular is built with ng-packagr in partial compilation mode, producing the Angular Package Format for Angular 22 consumers.

## Angular API

`NeuralIcon` is standalone and OnPush. Its inputs are:

- `icon` (required): a `NeuralIconDefinition`.
- `size`: CSS length or number; numbers become pixels. Default `1em`.
- `strokeWidth`: numeric SVG stroke width. Default `1.75`.
- `label`: accessible name. Default `null`, making the icon decorative.

Color is inherited through `currentColor`, so component libraries can theme icons without runtime configuration.

## SSR and hydration

Rendering is a pure function of signal inputs. The component does not read `window`, `document`, layout, time, randomness, or global mutable registries. It creates no generated IDs. The same inputs therefore produce the same SVG tree on the server and client, avoiding hydration mismatches.

The showcase uses Angular 22 SSR, prerendering, client hydration, and zoneless change detection as an integration boundary. Package tests verify deterministic path output and accessible states.

## Accessibility

Decorative is the safe default when an icon appears inside a labeled button or beside visible text. In that mode the SVG receives `aria-hidden="true"`. When `label` is supplied, the SVG receives `role="img"` and `aria-label`, and `aria-hidden` is removed. SVGs are never keyboard-focusable; interactive behavior belongs to the surrounding control.

## Source and generation

Canonical geometry lives in `packages/core/icons/icons.json`. `tools/icons.mjs` deterministically generates:

- one TypeScript module per icon;
- one standalone SVG per icon;
- the barrel and full catalog;
- `docs/icon-inventory.md`.

Generated files are committed for review and packaging. `tools/validate-icons.mjs` checks naming, uniqueness, category vocabulary, search metadata, base-set size, and path safety. Adding arbitrary SVG markup, event handlers, styles, references, or external URLs is not supported.
