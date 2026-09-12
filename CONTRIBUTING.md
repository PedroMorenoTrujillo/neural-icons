# Contributing

1. Confirm the icon is needed by Neural UI and choose a stable kebab-case name.
2. Author geometry from the Neural rules in `docs/iconography.md`; never paste third-party paths.
3. Add the canonical entry to `packages/core/icons/icons.json` in a logical order.
4. Run `npm run generate:icons` and inspect the generated SVG at multiple sizes.
5. Run `npm run check` before requesting review.

Generated files under `packages/core/src/icons`, `packages/core/svg`, and `docs/icon-inventory.md` must not be edited directly. Include provenance notes in the pull request: what need the icon serves, what references were studied conceptually, and confirmation that geometry was authored independently.
