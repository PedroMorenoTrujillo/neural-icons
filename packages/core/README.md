# @neural-icons/core

Framework-agnostic, immutable icon definitions for Neural. Import individual icons for the strongest tree-shaking boundary:

[Browse all icons](https://icons.neuralui.org/) · [Installation and usage](https://icons.neuralui.org/guide/)

```ts
import { iconCheck } from '@neural-icons/core/icons/check';
```

The root `@neural-icons/core` exports only types and small universal helpers; it never imports glyphs. Import `@neural-icons/core/catalog` only when the full catalog is intentionally needed. A single family can use separate outline and filled subpaths, so importing one variant does not retain its sibling.

The package also ships standalone SVG assets under `svg/`. Version `1.2.0` contains 268 families (536 glyphs), including 18 new chart families. Releases `1.1.0` through `1.1.2` contain 250 families. See the repository documentation for source, authorship, and release policy.
