# Neural Icons — published `next.2` registry check (2026-09-27)

This is a post-publication addendum to the earlier [pre-release remediation](NI-PRE-RELEASE-REMEDIATION-2026-09-27.md). It records what was verified after that report; it does not certify or publish a stable release.

| Package | Published version | `next` | `latest` |
| --- | --- | --- | --- |
| `@neural-icons/core` | `0.0.1-next.2` | `0.0.1-next.2` | `0.0.1-next.0` |
| `@neural-icons/angular` | `0.0.1-next.2` | `0.0.1-next.2` | `0.0.1-next.0` |
| `@neural-icons/react` | `0.0.1-next.2` | `0.0.1-next.2` | `0.0.1-next.2` |
| `@neural-icons/vue` | `0.0.1-next.2` | `0.0.1-next.2` | `0.0.1-next.2` |

The registry confirmed every exact version and tag. npm automatically assigned `latest` to the first React and Vue publications; attempting to remove React's `latest` returned HTTP 400. No prerelease was intentionally promoted to `latest`.

Registry-only clean consumers installed Core, React, and Vue using tarball URLs and integrity hashes from `registry.npmjs.org`; React and Vue SSR rendered the `search` SVG with an accessible name. Browser-target esbuild bundles for Core alone, React, and Vue each contained exactly one Core glyph module (`search`), with no other icon definitions.

After Angular publication, `node tools/verify-clean-angular-consumer.mjs --registry-only` installed Core and Angular directly from the npm registry in a temporary Angular 22.1.6 project, with no workspace aliases or symlinks, and passed AOT compilation. Angular's published manifest depends on exactly Core `0.0.1-next.2`.

`npm run verify:release` passed after the showcase documentation was updated: generated/source parity, 197-family naming ledger, 20 contact sheets, 394 packaged glyphs, lint, tests, builds, Angular AOT, React/Vue typechecks and packaged consumers, SSR/hydration, Vite/Rollup one-icon checks, four package dry-runs, local-tarball Angular consumer, and Chromium showcase E2E (27/27). `git diff --check` passed. No stable package, Git push/tag/release, or production website deployment was performed.

The icon catalog is frozen for the 1.0 candidate. The remaining stable-release gate is a reviewed, reproducible Git checkpoint, compatible Core dependency ranges in adapters, stable-version package contents and documentation, a full clean-consumer check, and explicit approval to publish `1.0.0`. Vercel deployment is deferred until the packages are accepted.
