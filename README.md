# Neural Icons

Original, framework-agnostic iconography for Neural UI 2.0. The repository is private and the packages are intentionally not published yet.

## Packages

- `@neural-icons/core`: immutable TypeScript icon definitions, SVG assets, and per-icon entry points. It has no DOM or framework dependency.
- `@neural-icons/angular`: a standalone Angular 22 component that renders core definitions with deterministic SSR-safe markup.
- `showcase`: a zoneless Angular 22 SSR application that exercises the complete base set.

## Design status

The current set contains 200 icons chosen to cover navigation, form controls, feedback, overlays, data tables, accounts, communication, and file interactions required by Neural UI 2.0. The visual language and source workflow are documented in [Iconography](docs/iconography.md); the complete generated list is in [Icon inventory](docs/icon-inventory.md).

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

`npm run generate:icons` converts the canonical geometry manifest into individual TypeScript modules, standalone SVG files, and the inventory document. CI should use `npm run check:generated` to reject stale generated artifacts. The current catalog has 200 entries, including 12 explicitly named `-filled` variants.

Every core build also depends on validation. Renamed/removed icons must not leave orphaned generated files; the generator reports these for manual review. Dependency installation uses normal peer resolution; see the [audit](docs/architecture-audit.md) for the verified tooling contract.

`angular:verify-package` packs and extracts both compiled packages into a temporary directory, checks their exports and tree-shaking, and compiles a consumer with Angular AOT without workspace aliases. This uses local tarballs only and does not publish or install anything. The browser suite runs the production showcase locally, checks prerendered SVG markup, and verifies DOM-node reuse during hydration.

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

Do not run `nx release publish` yet. Package manifests and independent release configuration are present only so packaging can be exercised before the first release. The repository and license status must be reviewed before any npm publication or public visibility change.

See [Architecture](docs/architecture.md), [Contributing](CONTRIBUTING.md), and the recorded [architecture decisions](docs/decisions/0001-original-source-and-package-boundaries.md).
