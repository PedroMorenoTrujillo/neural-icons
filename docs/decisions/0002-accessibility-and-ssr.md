# ADR 0002: Accessibility and deterministic rendering

- Status: accepted
- Date: 2026-09-12

## Decision

Icons are decorative by default and become named images only when a `label` is provided. Interactive semantics remain on the parent control. The Angular renderer must be deterministic and may not depend on DOM globals, generated IDs, time, randomness, or a mutable icon registry.

## Consequences

- Button and link names are not duplicated by decorative SVGs.
- Standalone informative icons have an explicit accessible name.
- Server and client render the same SVG tree, supporting Angular hydration.
- No registration provider is required; imports remain statically analyzable.
