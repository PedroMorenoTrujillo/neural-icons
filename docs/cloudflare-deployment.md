# Static showcase deployment

Cloudflare Pages connects to `PedroMorenoTrujillo/neural-icons` using its native GitHub integration. Production follows `main`; pull requests receive preview deployments and a Cloudflare check.

- Build: `npm ci && npm exec -- nx run showcase:test && npm run build:cloudflare`
- Output: `dist/cloudflare`
- Node: `24.15.0`
- Set `SKIP_DEPENDENCY_INSTALL=1` and `NX_DAEMON=false`.
- Production domain: `https://icons.neuralui.org/`

The build renders all catalog, guide and icon pages in English and Spanish, and verifies their canonical URLs and content. The deployed output contains static files only, with a real 404 and no Pages Functions or Worker. Preview domains send `X-Robots-Tag: noindex, nofollow`.

Canonical detail URLs are `/icon/{name}/` and `/es/icon/{name}/`. Guide URLs are `/guide/` and `/es/guide/`. Query parameters such as `variant` and `framework` remain supported. Cloudflare zone Redirect Rules must forward old root query URLs to these paths while preserving the query string. Restrict the rules to `icons.neuralui.org` and `/` to avoid redirect loops. Configure Spanish icon and guide rules before their English counterparts, followed by the Spanish catalog rule.

The npm packages and their release versions are independent of the website deployment. A commit deploying the showcase does not publish any npm package. Do not deploy `.vercel/output` or `dist/apps/showcase/server` to Cloudflare.
