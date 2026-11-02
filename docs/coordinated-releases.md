# Coordinated Icons releases

Core, Angular, React, Vue and the public showcase share one Icons release version. They remain separate npm packages, independent from Neural UI Core v1/v2 and Neural Native.

## Prepare and publish

1. Run `npm run release:prepare -- 1.1.2` with the next version. This uses npm workspace commands to update all four manifests, Core dependencies, the lockfile and the generated showcase version.
2. Review and commit the changes through a PR. Pedro is the only human with write access and the code owner for every file.
3. Once checks pass and the reviewed commit is on `main`, Pedro pushes `core@1.1.2`.

Only `core@*` triggers publication. Separate adapter tags are no longer required. Existing tags and published npm versions remain immutable. Nx uses a fixed release group with the Core tag pattern.

The workflow verifies generated icons, lint, unit tests, type checks, package contents, clean consumers and browser behavior. Four immutable tarballs and the production site are built from the same commit. Source manifests, packages and the showcase version must agree.

Both the original actor and the rerun actor must be Pedro. The repository must be the official repository, the ref must be a Core tag and the commit must belong to `main`. External PRs and forks only verify; they cannot publish or access the deployment secret.

Core is published first with npm Trusted Publishing. Once its exact public archive is available, Angular, React and Vue follow. All four registry archives must match the verified tarballs. Retries skip a published version only when its digest matches. Mismatches fail without overwriting. A newer version prevents an old retry from downgrading a channel or the website.

Stable releases use `latest`; prereleases use `next` and do not replace production. Each package retains its own npm Trusted Publisher bound to `PedroMorenoTrujillo/neural-icons` and `publish.yml`. CI needs no npm token or per-release 2FA code.

## Showcase and existing URLs

After registry verification and the clean published Angular consumer pass, the owner-triggered workflow advances deploy/icons to the verified source commit. The existing neural-icons Vercel project publishes that production branch at https://icons.neuralui.org/. Source commits and PRs do not advance the deployment branch.

The public address remains `https://icons.neuralui.org/`. Catalog, guide, icon and legal routes, both languages, query parameters, redirect rules and canonicals are preserved. `docs/deployment/published-urls.json` records the 510 URLs published before this automation. Builds must contain them all. After deployment CI checks each existing URL remains HTTP 200 with the same canonical and current badge. Both the Cloudflare origin and public domain must serve the exact registry-verified `/release.json`.

Keep Cloudflare PR previews. Disable automatic Git production builds so source commits cannot announce npm versions before publication; production is controlled by this release workflow.

Use `verify_only` dispatch to check a branch without publication or deployment. To recover a partial release, dispatch `publish.yml` on the same Core tag with `verify_only=false`. Immutable digests protect completed publications.

The npm CLI can accept an OIDC publication before registry security processing makes it public. The release waits up to 20 minutes for the exact Core archive, then submits the three adapters and verifies their propagation concurrently. Nothing deploys until all four public archives match the verified bytes. A retry reuses immutable archives and checks already-published versions instead of overwriting them.
