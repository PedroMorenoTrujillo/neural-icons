# Architecture audit — 2026-09-12

Baseline: `963986f` (`feat: establish Neural Icons monorepo`). Scope: package architecture, build contracts, portability, accessibility and SSR/hydration verification. The original 48 canonical icon specifications remain unchanged; the catalog now contains 376 specifications: 188 coordinated outline and filled treatments.

## Assessment

Retain the existing three-layer design: framework-neutral definitions → Angular renderer → showcase. A global icon registry, provider configuration, HTML injection, runtime fetching, and framework-specific core types are unnecessary. Nx is adequate for the current four projects; replacing the build system would not resolve an observed issue.

## Findings and corrections

| Priority | Finding                                                                                                                                                                | Resolution/evidence                                                                                                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1       | Existing browser coverage used the development server and did not prove production hydration. The production server returned HTTP 400 for the unconfigured local host. | Test the built Node server with an explicit allowed loopback host. Assert server HTML, delay JavaScript, record SVG nodes, then verify the surviving nodes are reused after hydration and filtering. Both Chromium tests pass. |
| P2       | Workspace aliases let source tests bypass the distributed package surface. No external consumer check existed.                                                         | Pack both build outputs locally, extract into an isolated consumer, verify all 376 JS and SVG exports, reject internal imports, and compile an Angular AOT consumer with no Neural source aliases.                             |
| P2       | Raw SVGs were shipped but the export map prevented package-subpath resolution.                                                                                         | Add `./svg/*.svg` to core exports and verify every asset subpath.                                                                                                                                                              |
| P2       | `defineIcon` froze arrays at runtime but its generic return type retained mutable array methods for mutable caller inputs.                                             | Return readonly path/tag types while preserving literal names. The external compiler test uses expected type errors to prevent regression.                                                                                     |
| P2       | Building directly through Nx skipped generated-source validation; removed specs could leave exported artifacts behind.                                                 | Require validation before core builds, reject orphaned generated artifacts, and include shared tooling/configuration in task inputs.                                                                                           |
| P2       | Core inherited browser and Node ambient types; workspace aliases exposed internal source paths.                                                                        | Compile core with ES types only, reject framework imports via Nx lint, and narrow aliases to declared public entry points.                                                                                                     |
| P2       | Node `>=22.0.0` admitted runtimes unsupported by installed Angular 22.1.6.                                                                                             | Align engines with installed Angular packages, pin the verified Node 22.22.3 in `.nvmrc`, and use it in CI.                                                                                                                    |
| P2       | A whitespace-only label created an image with no useful accessible name.                                                                                               | Normalize labels and test transition back to decorative semantics.                                                                                                                                                             |

An additional tooling correction removes the unused `vite-tsconfig-paths` direct dependency. Its transitive `tsconfck` declared a TypeScript 5 peer, conflicting with Angular 22's TypeScript 6 requirement. Nx already provides the path-resolution plugin used by core tests. Regenerating the lockfile with normal peer resolution and running a clean `npm ci --offline` succeeds; CI and the README now use `npm ci` without `--legacy-peer-deps`.

## Verified behavior retained

- Static imports and `sideEffects: false` already allow the installed Vite 8 bundler to remove unrelated icons. No catalog/API restructuring is justified by this audit.
- Core executes as native ESM without Angular present; every packaged icon matches the catalog and retains frozen paths.
- The Angular production package uses partial compilation; the development variant also builds successfully. The adapter imports Angular as an external peer and contains no icon registry.
- The existing Angular peer range excludes Angular 21 and 23. Angular 22.1.6 is the concrete compiler/runtime tested here.
- Full uncached lint, unit tests and production builds pass. External-package checks and the production Chromium hydration/filtering suite pass.

## Reproduction

```bash
npm ci
npm exec nx run-many -- -t lint,test,build --skipNxCache
npm exec nx run angular:verify-package
npm exec nx e2e showcase-e2e -- --skipNxCache
```

The package check uses the installed Angular/Vite toolchain and temporary local tarballs; it performs no npm publication. Its byte counts are uncompressed fixture measurements, not a universal size guarantee. CI is configured to run the checks, but remote CI execution is outside this local audit.

## Limits and deferred work

- Compatibility testing covers Angular 22.1.6, Node 22.22.3, the installed Vite bundler and Chromium. Other Angular 22 minors, other bundlers, dynamic request-time SSR and the actual Neural UI 2.0 consumer require integration coverage before a stable release claim.
- The catalog now has a 376-entry baseline: 188 base icons with outline and filled treatments. Further expansion, stricter geometric/path-syntax validation, visual review and license selection are separate workstreams.
- Independent release configuration is provisional. Both packages are `0.0.1`, and the adapter's core range `^0.0.1` deliberately does not accept `0.0.2`; revisit versioning when releases are authorized.

## References

- [Angular Package Format](https://angular.dev/tools/libraries/angular-package-format): partial compilation and side effects.
- [Angular library consumption](https://angular.dev/tools/libraries/creating-libraries): test built libraries with consumers outside source aliases.
- [Angular host validation](https://angular.dev/best-practices/security#preventing-server-side-request-forgery-ssrf): explicit allowed hosts for the production server.
- [Nx module boundaries](https://nx.dev/docs/guides/enforce-module-boundaries): workspace dependency constraints.
- Installed `@angular/core`, `@angular/cli` and `@angular/build` package manifests at version 22.1.6: exact runtime and compiler requirements.
