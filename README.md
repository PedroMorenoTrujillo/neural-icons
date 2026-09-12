# Neural Icons

Original, framework-agnostic iconography for Neural UI 2.0. The repository is private and the packages are intentionally not published yet.

## Packages

- `@neural-icons/core`: immutable TypeScript icon definitions, SVG assets, and per-icon entry points. It has no DOM or framework dependency.
- `@neural-icons/angular`: a standalone Angular 22 component that renders core definitions with deterministic SSR-safe markup.
- `showcase`: a zoneless Angular 22 SSR application that exercises the complete base set.

## Design status

The initial set contains 48 icons chosen to cover navigation, form controls, feedback, overlays, data tables, accounts, and file interactions required by Neural UI 2.0. The visual language and source workflow are documented in [Iconography](docs/iconography.md); the complete generated list is in [Icon inventory](docs/icon-inventory.md).

The geometry is original. No third-party SVG path data is included. Familiar semantic metaphors may be studied, but every path is rebuilt from the Neural grid and rules.

## Development

Requires Node.js 22 and npm.

```bash
npm install
npm run generate:icons
npm run check
```

Useful focused commands:

```bash
npx nx test core
npx nx test angular
npx nx build angular
npx nx serve showcase
```

`npm run generate:icons` converts the canonical geometry manifest into individual TypeScript modules, standalone SVG files, and the inventory document. CI should use `npm run check:generated` to reject stale generated artifacts.

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

## Publishing

Do not run `nx release publish` yet. Package manifests and independent release configuration are present only so packaging can be exercised before the first release. The repository and license status must be reviewed before any npm publication or public visibility change.

See [Architecture](docs/architecture.md), [Contributing](CONTRIBUTING.md), and the recorded [architecture decisions](docs/decisions/0001-original-source-and-package-boundaries.md).
