# Publishing the four Icons packages

Icons keeps independent versions for `@neural-icons/core`, `@neural-icons/angular`, `@neural-icons/react`, and `@neural-icons/vue`. The showcase deploys to Cloudflare when `main` changes; npm packages publish only when their own release tag is pushed.

The GitHub workflow is `.github/workflows/publish.yml`. Before publishing it runs the existing complete `verify:release` gate, including package checks, clean Angular consumer, and browser tests. It verifies the tagged commit belongs to `main` and that the tag, source version, and compiled package version agree. Only the compiled package named by the tag is published.

React and Vue consumer checks install the compiled local tarballs and fetch framework dependencies from npm, so a clean CI runner does not require a preloaded npm cache. Their `--offline` option remains available for local checks with an already populated cache.

Use the independent Nx tag convention: `core@1.2.0`, `angular@1.2.0`, `react@1.2.0`, or `vue@1.2.0`. These are examples; use the package's actual prepared version. Stable versions use npm `latest`; prerelease versions use `next`. This workflow does not create versions or tags and does not promote an existing prerelease.

Publish Core first when its version changes, then the adapters. Adapter jobs wait up to three minutes for the source Core version to appear in the registry; they fail instead of publishing if Core is unavailable. The release gate verifies adapter dependencies accept that Core version.

## Required one-time npm configuration

Each of the **four packages** needs its own npm trusted publisher. On npmjs.com package settings configure GitHub Actions with:

- Organization/user: `PedroMorenoTrujillo`
- Repository: `neural-icons`
- Workflow filename: `publish.yml`
- Environment: leave empty
- Allow direct `npm publish`

The workflow uses OIDC and grants `id-token: write` only to the publish job; no npm token is stored. Configuring one package does not authorize the other three. Do not push a release tag until these four npm settings have been verified. Merging this workflow or changing the showcase does not publish any package.

References: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) and [Nx independent releases](https://nx.dev/docs/guides/nx-release/release-projects-independently).
