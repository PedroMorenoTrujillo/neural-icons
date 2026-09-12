# Neural iconography

## Visual language

Neural Icons use a calm technical outline style intended to sit beside Neural UI typography without competing with it.

- Canvas: `24 × 24`, with the primary drawing kept inside an optical safe area of roughly `3–21`.
- Stroke: `1.75`, round caps, round joins, no fill.
- Coordinates: prefer whole, half, and quarter units. Optical correction may use quarters when a mathematically centered shape looks visually off.
- Corners: soft but economical. Containers normally use 1–2 unit radii; symbols avoid bubbly over-rounding.
- Density: one dominant silhouette and at most two supporting details. At 16px, the meaning must remain recognizable.
- Directional geometry: arrow heads use balanced 45-degree movements and a consistent 5–6 unit reach.
- Status geometry: circular status containers share the same 8.75-unit radius and internal mark scale.
- Color: never encoded in an icon. Stroke inherits `currentColor`; semantic color belongs to Neural UI.

The recognizable Neural signature is the combination of a slightly finer 1.75 stroke, generous internal air, compact rounded terminals, and consistent quarter-unit optical alignment. Similar UI metaphors are unavoidable across icon systems; path data and proportions here are authored independently from these rules.

## Naming

Names are lowercase, English, singular, and kebab-case. Use the visual object or action (`arrow-left`, `sort-ascending`), not a product-specific placement (`table-sort-button`). Opposites must form explicit pairs. Search synonyms belong in `tags`, not aliases in the public API.

Renaming an icon is a breaking change once packages are published. Before 1.0, renames still require updating the manifest, generated files, inventory, and any Neural UI usage in one change.

## Creating SVGs

SVGs are built from our own specifications on the Neural 24px grid. A contributor may sketch in Figma, Illustrator, or directly in path notation, but the accepted geometry is transcribed into `packages/core/icons/icons.json`. Do not paste path data from Lucide, Material Symbols, Heroicons, Phosphor, Font Awesome, or another library—even when its license would permit reuse—because this project needs its own coherent visual authorship.

Run:

```bash
npm run generate:icons
npm run validate:icons
```

Review generated SVGs at 16, 20, 24, and 32 pixels, in both light and dark contexts. Check alignment beside text, pair consistency, ambiguity, and clipping before approval.

## Acceptance checklist

1. The icon fills a genuine Neural UI use case and does not duplicate an existing semantic.
2. Geometry follows the shared grid, stroke, terminal, and density rules.
3. The shape is recognizable at 16px without color or animation.
4. Name, category, and at least two search tags are present.
5. Generation, validation, unit tests, package builds, and the showcase build pass.
6. A reviewer confirms the path was created from the Neural specification rather than copied.
