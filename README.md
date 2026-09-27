# Neural Icons

Original, framework-agnostic iconography for Neural UI 2.0. The 197-family `0.0.1-next.2` catalog and all three adapters are published on npm under the `next` tag. Stable 1.0 is in preparation.

## Packages

- `@neural-icons/core`: immutable TypeScript icon definitions, SVG assets, and per-icon entry points. It has no DOM or framework dependency.
- `@neural-icons/angular`: a standalone Angular 22 component that renders core definitions with deterministic SSR-safe markup.
- `@neural-icons/react`: a React 19 renderer for granular Core definitions.
- `@neural-icons/vue`: a Vue 3.5 renderer for granular Core definitions.
- `showcase`: a zoneless Angular 22 SSR application that exercises the complete base set.

## Design status

The current set contains 197 families with two treatments (394 entries) chosen to cover navigation, form controls, feedback, overlays, data tables, accounts, communication, and file interactions required by Neural UI 2.0. Every family has an outline and filled variant. `paperclip` is canonical for attachment; `attach`, `attachment` and `file attachment` are search tags. `filter` is canonical for filtering; `funnel` is a search tag. Neither removed name is a public icon family. The NI-02 catalog review is recorded in the [internal QA report](docs/qa/NI-02-CORE-DISTRIBUTION-AND-CATALOG-QA.md); it is not a mathematical pixel-identity claim. The visual language and source workflow are documented in [Iconography](docs/iconography.md); the complete generated list is in [Icon inventory](docs/icon-inventory.md).

The geometry is original. No third-party SVG path data is included. Familiar semantic metaphors may be studied, but every path is rebuilt from the Neural grid and rules.

## Development

Use Node.js 22.22.3 (`.nvmrc`) and npm. The supported Node ranges match the installed Angular 22 toolchain: `^22.22.3 || ^24.15.0 || >=26.0.0`.

```bash
npm ci
npm run generate:icons
npm run check
```

Useful focused commands:

```bash
npx nx test core
npx nx test angular
npx nx build angular
npx nx serve showcase
npx nx run angular:verify-package
npx nx e2e showcase-e2e
```

`npm run generate:icons` converts the canonical geometry manifest into individual TypeScript modules, standalone SVG files, name/family types, and the inventory document. `npm run generate:variants` completes the filled companions before refreshing those artifacts. CI should use `npm run check:generated` to reject stale generated artifacts. The current catalog has 394 entries: 197 each of `outline` and `filled`.

Every core build also depends on validation. Renamed/removed icons must not leave orphaned generated files; the generator reports these for manual review. Dependency installation uses normal peer resolution; see the [audit](docs/architecture-audit.md) for the verified tooling contract.

`angular:verify-package` packs and extracts both compiled packages into a temporary directory, checks their exports and tree-shaking, and compiles a consumer with Angular AOT without workspace aliases. `node tools/verify-clean-angular-consumer.mjs --registry-only` separately installs Core and Angular from npm and repeats the AOT consumer check. The browser suite runs the production showcase locally, checks prerendered SVG markup, and verifies DOM-node reuse during hydration.

Internal catalog QA: `node tools/generate-catalog-review.mjs` generates the 197-family naming ledger and 20 contact sheets at 16/20/24/32 px. `node tools/serve-contact-sheets.mjs` serves only those internal sheets on loopback. These are review artifacts, not the public showcase.

To inspect the production build locally:

```bash
npx nx build showcase
NG_ALLOWED_HOSTS=127.0.0.1 node dist/apps/showcase/server/server.mjs
```

Open `http://127.0.0.1:4000`. The showcase server binds to loopback only.

## Consumption contract

Prefer per-icon imports in product code:

```ts
import { iconSearch } from '@neural-icons/core/icons/search';
```

The Core root contains contracts/types and small helpers only; it exports no icon definitions. Import `@neural-icons/core/catalog` explicitly when all 394 definitions are required. For one family with both variants, import its two per-icon subpaths.

Angular 22 templates use the standalone component:

```ts
import { Component } from '@angular/core';
import { NeuralIcon } from '@neural-icons/angular';
import { iconSearch } from '@neural-icons/core/icons/search';

@Component({
  imports: [NeuralIcon],
  template: `<neural-icon [icon]="searchIcon" label="Search" />`,
})
export class SearchButton {
  readonly searchIcon = iconSearch;
}
```

Omit `label` when adjacent text already provides the accessible name. Decorative icons render with `aria-hidden="true"`; labeled icons render with `role="img"` and `aria-label`.

Labels are trimmed; empty or whitespace-only labels remain decorative. SVG assets are exposed at `@neural-icons/core/svg/<name>.svg` for asset-aware consumers. Their accessible semantics must be supplied by the consuming application.

## Publishing

This repository, its packages, and the SVG catalog are licensed under [MIT](LICENSE). Core, Angular, React, and Vue `0.0.1-next.2` are published prereleases. Install matching versions explicitly; older prereleases contain an earlier catalog. A stable release requires a reviewed source checkpoint, matching Core dependency ranges, a clean registry-consumer verification, and explicit approval. Publish Core before its adapters. Do not promote a prerelease to `latest` as a substitute for publishing stable packages.

See [Architecture](docs/architecture.md), [Contributing](CONTRIBUTING.md), and the recorded [architecture decisions](docs/decisions/0001-original-source-and-package-boundaries.md).
