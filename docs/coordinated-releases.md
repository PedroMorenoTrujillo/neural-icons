# Coordinated Icons releases

Core, Angular, React, Vue and the public showcase share one Icons release version. They remain separate npm packages, independent from Neural UI Core v1/v2 and Neural Native.

## Prepare and publish

1. Run `npm run release:prepare -- 1.1.2` with the next version. This uses npm workspace commands to update all four manifests, Core dependencies and the lockfile.
2. Review and commit the changes through a PR. Pedro is the only human with write access and the code owner for every file.
3. Once checks pass and the reviewed commit is on `main`, Pedro pushes `core@1.1.2`.

Only `core@*` triggers publication. Separate adapter tags are no longer required. Existing tags and published npm versions remain immutable. Nx uses a fixed release group with the Core tag pattern.

The workflow verifies generated icons, lint, unit tests, type checks, package contents and browser behavior in a clean consumer. Four immutable tarballs are built from the same reviewed commit.

Both the original actor and the rerun actor must be Pedro. The repository must be the official repository, the ref must be a Core tag and the commit must belong to `main`. External PRs and forks only verify.

Core is published first with npm Trusted Publishing. Once its exact public archive is available, Angular, React and Vue follow. All four registry archives must match the verified tarballs. Retries skip a published version only when its digest matches. Mismatches fail without overwriting. A newer version prevents an old retry from downgrading a channel.

Stable releases use `latest`; prereleases use `next` and do not replace production. Each package retains its own npm Trusted Publisher bound to `PedroMorenoTrujillo/neural-icons` and `publish.yml`. CI needs no npm token or per-release 2FA code.

## Showcase and existing URLs

The dedicated showcase repository checks the npm registry for a common stable release across the four packages. It verifies the public archives before updating the runtime package versions and deploying the existing site.

The public address remains [icons.neuralui.org](https://icons.neuralui.org/). The showcase repository checks its catalog, guide, icon and legal routes in both languages, as well as the release receipt and canonicals.

Use `verify_only` dispatch to check a branch without publication. To recover a partial release, dispatch `publish.yml` on the same Core tag with `verify_only=false`. Immutable digests protect completed publications.

The npm CLI can accept an OIDC publication before registry security processing makes it public. The release waits up to 20 minutes for the exact Core archive, then submits the three adapters and verifies their propagation concurrently. Nothing deploys until all four public archives match the verified bytes. A retry reuses immutable archives and checks already-published versions instead of overwriting them.
