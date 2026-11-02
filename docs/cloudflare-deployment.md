# Showcase hosting

Production remains on the existing Vercel project **neural-icons**, at **https://icons.neuralui.org/**. No DNS change, proxy or origin migration is required. The coordinated release workflow promotes an already verified source commit to **deploy/icons** only after all four npm archives are public and verified. Vercel's existing Git integration builds that branch with `npm run build:vercel:published`. The host independently verifies the four immutable registry archives, records their hashes and source commit in `release.json`, and retains the existing Angular SSR function and static assets.

Other source branches are ignored by the production project. A main push or PR cannot publish the public showcase. The workflow waits for the public release receipt, version badge and all 510 existing canonical URLs before reporting success. The same project and domain retain their existing protection settings. No additional Vercel publishing token is stored in GitHub.

## Existing Cloudflare previews

The separate Pages projects remain previews of the source repository. Their existing Git build settings are independent of production Vercel. Preview build: `npm run build:cloudflare`; output: `dist/cloudflare`. Preview hosts carry noindex headers. They do not control icons.neuralui.org.

Canonical paths remain /icon/{name}/, /es/icon/{name}/, /guide/ and /es/guide/. The production SSR handler preserves legacy root query links and query parameters such as variant, framework and lang.

See [coordinated releases](coordinated-releases.md). Manual recovery of the currently published version uses publish.yml with verify_only=false and deploy_current=true on main; it verifies existing npm archives and does not republish npm.
