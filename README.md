# Neural Icons

Original, framework-agnostic iconography for Neural UI 2.0. Core and the Angular, React, and Vue adapters are published on npm as stable `1.1.0` packages with 250 families / 500 glyphs. `0.0.1-next.2` remains available under `next`.

Browse the [icon catalog](https://icons.neuralui.org/) and [installation and usage guide](https://icons.neuralui.org/guide/). Both are also available in Spanish from the language switcher. Cloudflare serves the production showcase as static pages; see [deployment settings](docs/cloudflare-deployment.md).

## Packages

- `@neural-icons/core`: immutable TypeScript icon definitions, SVG assets, and per-icon entry points. It has no DOM or framework dependency.
- `@neural-icons/angular`: a standalone Angular 22 component that renders core definitions with deterministic SSR-safe markup.
- `@neural-icons/react`: a React 19 renderer for granular Core definitions.
- `@neural-icons/vue`: a Vue 3.5 renderer for granular Core definitions.
- `showcase`: a zoneless Angular 22 SSR application that exercises the complete base set.

## Design status

The current set contains 250 families with two treatments (500 entries) covering navigation, form controls, feedback, overlays, data tables, accounts, communication, files, commerce, and media. Every family has an outline and filled variant. `paperclip` is canonical for attachment; `attach`, `attachment` and `file attachment` are search tags. `filter` is canonical for filtering; `funnel` is a search tag. Neither removed name is a public icon family. The NI-02 base catalog review is recorded in the [internal QA report](docs/qa/NI-02-CORE-DISTRIBUTION-AND-CATALOG-QA.md); the [NI-06 expansion report](docs/qa/NI-06-CATALOG-EXPANSION.md) covers the additional families. The visual language and source workflow are documented in [Iconography](docs/iconography.md); the complete generated list is in [Icon inventory](docs/icon-inventory.md).

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

For a local cross-browser regression after installing the Playwright Firefox and WebKit engines, run `NEURAL_ICONS_CROSS_BROWSER=1 npx playwright test --config=apps/showcase-e2e/playwright.config.mts`. This opt-in matrix includes desktop Firefox/WebKit and iPhone/iPad WebKit emulation. Real iOS hardware still needs a separate device check.

`npm run generate:icons` converts the canonical geometry manifest into individual TypeScript modules, standalone SVG files, name/family types, and the inventory document. `npm run generate:variants` completes the filled companions before refreshing those artifacts. CI should use `npm run check:generated` to reject stale generated artifacts. The current catalog has 500 entries: 250 each of `outline` and `filled`.

Every core build also depends on validation. Renamed/removed icons must not leave orphaned generated files; the generator reports these for manual review. Dependency installation uses normal peer resolution; see the [audit](docs/architecture-audit.md) for the verified tooling contract.

`angular:verify-package` packs and extracts both compiled packages into a temporary directory, checks their exports and tree-shaking, and compiles a consumer with Angular AOT without workspace aliases. `node tools/verify-clean-angular-consumer.mjs --registry-only` separately installs Core and Angular from npm and repeats the AOT consumer check. The browser suite runs the production showcase locally, checks prerendered SVG markup, and verifies DOM-node reuse during hydration.

Internal catalog QA: `node tools/generate-catalog-review.mjs` preserves the historical 197-family naming ledger and 20 contact sheets; `node tools/generate-ni06-review.mjs` generates six sheets for the 53 added families. Both use representative 16/20/24/32 px previews. `node tools/serve-contact-sheets.mjs` serves the base sheets on loopback. These are review artifacts, not the public showcase.

To inspect the production build locally:

```bash
npx nx build showcase
node dist/apps/showcase/server/server.mjs
```

Open `http://127.0.0.1:4000`. The showcase server binds to loopback only.

## Consumption contract

Prefer per-icon imports in product code:

```ts
import { iconSearch } from '@neural-icons/core/icons/search';
```

The Core root contains contracts/types and small helpers only; it exports no icon definitions. Import `@neural-icons/core/catalog` explicitly when all 500 definitions are required. For one family with both variants, import its two per-icon subpaths.

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

This repository, its packages, and the SVG catalog are licensed under [MIT](LICENSE). Core, Angular, React, and Vue `1.1.0` are published under `latest` with the 250-family catalog. The adapters declare `@neural-icons/core: ^1.1.0`. The `next` tag remains on `0.0.1-next.2`; it has not been promoted to `latest`.

See [npm releases](docs/npm-releases.md) for the independent package tags, release checks, Core-first order, and the four required npm trusted publishers.

See [Architecture](docs/architecture.md), [Contributing](CONTRIBUTING.md), and the recorded [architecture decisions](docs/decisions/0001-original-source-and-package-boundaries.md).
