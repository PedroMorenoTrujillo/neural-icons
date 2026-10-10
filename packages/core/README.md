# @neural-icons/core

Framework-agnostic, immutable icon definitions for Neural. Import individual icons for the strongest tree-shaking boundary:

[Browse all icons](https://icons.neuralui.org/) · [Installation and usage](https://icons.neuralui.org/guide/)

```ts
import { iconCheck } from '@neural-icons/core/icons/check';
```

The root `@neural-icons/core` exports only types and small universal helpers; it never imports glyphs. Import `@neural-icons/core/catalog` only when the full 500-icon catalog is intentionally needed. A single family can use separate outline and filled subpaths, so importing one variant does not retain its sibling.

The package also ships standalone SVG assets under `svg/`. See the repository documentation for source, authorship, and release policy. Version `1.1.0` contains 250 families (500 glyphs). Stable versions `1.0.0` and `1.0.1`, and prerelease `0.0.1-next.2`, contain the earlier 197-family catalog.
