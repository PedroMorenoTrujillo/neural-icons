# @neural-icons/react

React 19 adapter for `@neural-icons/core`. Core owns every icon definition; this package contains only the renderer.

Version `1.0.0` uses the 197-family Core catalog. Install the matching stable packages:

```bash
npm install @neural-icons/core@1.0.0 @neural-icons/react@1.0.0
```

```tsx
import { iconSearch } from '@neural-icons/core/icons/search';
import { NeuIcon } from '@neural-icons/react';

<NeuIcon icon={iconSearch} />
<NeuIcon icon={iconSearch} size={20} className="toolbar-icon" />
<NeuIcon icon={iconSearch} aria-label="Search" />
```

Import definitions from granular `@neural-icons/core/icons/<name>` paths. The default Core and React entry points do not import the catalog. `@neural-icons/core/catalog` is an explicit, full-catalog opt-in for catalog applications.

`icon` is a Core definition, including its existing `outline` or `filled` variant. There is no `name` registry or redundant `variant` prop. `size` defaults to `1em`; explicit `width` and `height` override it independently. Color follows CSS `currentColor` through inherited color, `className`, or `style`.

Icons are decorative by default (`aria-hidden="true"`). Supply `aria-label`, `aria-labelledby`, or `title` for a meaningful standalone image. `aria-label` / `aria-labelledby` take precedence over `title` to avoid duplicate announcements; `title` then renders a deterministic SVG `<title>`. The native `ref` prop points to `<svg>` in React 19.

Geometry and semantic SVG attributes (`viewBox`, fill/stroke, stroke width, rules, line caps/joins, role, and `aria-hidden`) are controlled by the adapter. Other SVG props, including class, style, ID, data attributes, and dimensions, pass through. `NeuIcon` renders the SVG directly without an extra wrapper, DOM parser, runtime SVG string parsing, random IDs, browser globals, or hydration-specific logic.

React `>=19 <20` is a peer dependency. Core is a normal package dependency. Neither adapter nor Core requires React DOM at runtime; React DOM is used only by the test and SSR/hydration consumer fixtures.

The adapter accepts compatible Core 1.x updates, including future icon additions. MIT license; see [LICENSE](LICENSE).
