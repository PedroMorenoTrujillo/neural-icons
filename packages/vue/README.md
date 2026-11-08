# @neural-icons/vue

Vue 3.5 adapter for `@neural-icons/core`. Core owns every icon definition; this package contains only the renderer.

[Browse all icons](https://icons.neuralui.org/) · [Installation and usage](https://icons.neuralui.org/guide/)

Version `1.2.0` uses the matching 268-family Core catalog. Install the matching stable packages:

```bash
npm install @neural-icons/core@latest @neural-icons/vue@latest
```

```vue
<script setup lang="ts">
import { iconSearch } from '@neural-icons/core/icons/search';
import { NeuIcon } from '@neural-icons/vue';
</script>

<template>
  <NeuIcon :icon="iconSearch" />
  <NeuIcon :icon="iconSearch" :size="20" class="toolbar-icon" />
  <NeuIcon :icon="iconSearch" aria-label="Search" />
</template>
```

Import definitions from granular `@neural-icons/core/icons/<name>` paths. The ordinary Vue entry does not import the catalog. `@neural-icons/core/catalog` is a separate, explicit full-catalog opt-in.

`icon` is a required Core definition, already carrying its `outline` or `filled` variant. There is no string-name registry or redundant `variant` prop. `size` defaults to `1em`; explicit `width` and `height` attrs override it independently. Color follows CSS `currentColor` through inheritance, `class`, or `style`.

Icons are decorative by default (`aria-hidden="true"`). Supply `aria-label`, `aria-labelledby`, or `title` for a meaningful standalone image. ARIA names take precedence over `title` to avoid duplicate announcements; `title` alone creates a deterministic SVG `<title>`. Ordinary attributes and event listeners fall through directly to `<svg>`. Geometry-critical attributes, `role` and `aria-hidden` are controlled by the adapter and cannot be overridden by fallthrough attrs.

Vue SSR is supported with `createSSRApp()` and `renderToString()`; the same component hydrates without browser-only runtime code. There is no imperative SVG/ref API: this component deliberately exposes no methods or wrapper node. Vue `>=3.5 <3.6` is a peer dependency; Core is a normal dependency.

The adapter accepts compatible Core 1.x updates, including future icon additions. MIT license; see [LICENSE](LICENSE).
