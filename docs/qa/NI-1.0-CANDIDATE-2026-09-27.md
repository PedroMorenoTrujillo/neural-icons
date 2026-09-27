# Neural Icons — local 1.0.0 candidate (2026-09-27)

Status: **local release candidate; not published**. The 197-family / 394-glyph catalog is frozen. No SVG geometry or public icon identity was changed while preparing this candidate.

## Published baseline

Core, Angular, React, and Vue `0.0.1-next.2` exist in the npm registry with the `next` tag. The [registry verification addendum](NI-NEXT2-REGISTRY-CHECK-2026-09-27.md) records exact versions, dist-tags, registry-only clean-consumer installation, and adapter smoke tests. The public showcase continues to document those *published* versions rather than implying that 1.0.0 can already be installed.

## 1.0.0 package contract

All four local package manifests are `1.0.0`. Angular, React, and Vue depend on `@neural-icons/core: ^1.0.0`, so compatible future Core 1.x releases need not force adapter republication. The lockfile reflects those local manifests. The package verifier checks each package's own version and rejects incompatible Core ranges; it no longer assumes that all future package versions must match exactly.

## Verification performed

`npm run verify:release` **PASS** for the local 1.0.0 candidate: generated/source parity (791 generated files), 197 naming rows, 20 contact sheets, 394 Core exports, workspace lint/test/build, Angular AOT, React/Vue typechecks, packaged SSR and Chromium hydration, Vite/Rollup one-icon checks, four npm pack dry-runs, an Angular 22.1.6 local-tarball consumer, and showcase Chromium E2E **27/27**. The earlier `next.2` registry-only Angular consumer **PASS** remains separate evidence; a registry-only 1.0.0 consumer cannot run before stable publication.

`git diff --check` passed before this report. The candidate diff is limited to four package manifests, their package READMEs, the root README, the lockfile, and the release-candidate verifier. No SVG, catalog, adapter runtime, or showcase source changed in the 1.0.0 preparation.

The Spanish desktop installation guide was inspected in the integrated browser. Mobile and tablet behavior is covered by automated E2E; a separate manual mobile screenshot attempt did not complete, so this report does **not** claim manual visual certification of that viewport or an exhaustive human review of every page state.

## Remaining release gates

1. Review and approve the local stable candidate and any remaining manual visual/content checks.
2. Publish Core 1.0.0 first, then Angular, React, and Vue 1.0.0 under explicit authorization and user-completed 2FA.
3. Verify the exact versions and `latest` dist-tags, then repeat clean registry-only consumers against the published 1.0.0 packages.
4. Deploy the showcase to Vercel only after the packages and public documentation have been accepted.

No stable npm publication, push, tag, release, or Vercel deployment was performed while creating this candidate.
