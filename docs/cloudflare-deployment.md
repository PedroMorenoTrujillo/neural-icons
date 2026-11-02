# Static showcase deployment

Cloudflare Pages connects to `PedroMorenoTrujillo/neural-icons` for pull-request previews. Production is deployed to the existing `neuraliconsweb` project by `publish.yml`, after the four npm packages have been published and verified. Automatic Git production deployments must be disabled to avoid a source commit deploying an unpublished version.

- Build: `npm ci && npm exec -- nx run showcase:test && npm run build:cloudflare`
- Output: `dist/cloudflare`
- Node: `24.15.0`
- Set `SKIP_DEPENDENCY_INSTALL=1` and `NX_DAEMON=false`.
- Production domain: `https://icons.neuralui.org/`

The build renders all catalog, guide and icon pages in English and Spanish, and verifies their canonical URLs and content. The deployed output contains static files only, with a real 404 and no Pages Functions or Worker. Preview domains send `X-Robots-Tag: noindex, nofollow`.

Canonical detail URLs are `/icon/{name}/` and `/es/icon/{name}/`. Guide URLs are `/guide/` and `/es/guide/`. Query parameters such as `variant` and `framework` remain supported. Cloudflare zone Redirect Rules must forward old root query URLs to these paths while preserving the query string. Restrict the rules to `icons.neuralui.org` and `/` to avoid redirect loops. Configure Spanish icon and guide rules before their English counterparts, followed by the Spanish catalog rule.

The four npm packages and the production showcase share the Core release version. A source commit or PR does not publish npm packages or deploy production; Pedro's Core tag starts the coordinated release. Existing paths and canonical URLs remain unchanged. Do not deploy `.vercel/output` or `dist/apps/showcase/server` to Cloudflare. See [coordinated releases](coordinated-releases.md).
