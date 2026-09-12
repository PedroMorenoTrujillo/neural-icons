# ADR 0001: Original source and package boundaries

- Status: accepted
- Date: 2026-09-12

## Context

Neural UI 2.0 needs a stable icon set for Angular 22, while the icon assets should remain usable outside Angular and leave room for future adapters. Copying an existing library would weaken visual ownership and could create attribution or relicensing obligations.

## Decision

Maintain original path geometry in a framework-neutral manifest. Generate reviewable SVG assets and individual TypeScript modules from it. Publish framework-neutral data as `@neural-icons/core` and place Angular-specific rendering in `@neural-icons/angular`. Keep the repository private and packages unpublished until design and licensing reviews are complete.

## Consequences

- Core stays portable and easy to tree-shake.
- Angular upgrades do not force changes to icon data.
- Deterministic generation makes drift detectable.
- Contributors must author and review geometry instead of importing third-party paths.
- The full catalog barrel is convenient but must be avoided in product bundles.
