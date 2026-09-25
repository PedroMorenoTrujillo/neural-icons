# @neural-icons/core

Framework-agnostic, immutable icon definitions for Neural. Import individual icons for the strongest tree-shaking boundary:

```ts
import { iconCheck } from '@neural-icons/core/icons/check';
```

The root `@neural-icons/core` exports only types and small universal helpers; it never imports glyphs. Import `@neural-icons/core/catalog` only when the full 394-icon catalog is intentionally needed. A single family can use separate outline and filled subpaths, so importing one variant does not retain its sibling.

The package also ships standalone SVG assets under `svg/`. See the repository documentation for source, authorship, and release policy. Public prereleases exist; this document does not imply a stable release.
