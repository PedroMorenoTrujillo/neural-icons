import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { neuralIcons } from '@neural-icons/core/catalog';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublicShowcasePath, missingPage, publicShowcasePaths } from './public-routes';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const allowedHosts = [
  'localhost',
  '127.0.0.1',
  process.env['VERCEL_URL'],
  process.env['VERCEL_BRANCH_URL'],
  process.env['VERCEL_PROJECT_PRODUCTION_URL'],
  process.env['NEURAL_ICONS_SITE_ORIGIN'] && new URL(process.env['NEURAL_ICONS_SITE_ORIGIN']).hostname,
].filter((host): host is string => Boolean(host));
const angularApp = new AngularNodeAppEngine({ allowedHosts });
const supportedPaths = publicShowcasePaths(neuralIcons.filter(icon => icon.variant === 'outline').map(icon => icon.name));
const publicOrigin = (req: express.Request): string =>
  (
    process.env['NEURAL_ICONS_SITE_ORIGIN'] ||
    (process.env['VERCEL_PROJECT_PRODUCTION_URL'] &&
      `https://${process.env['VERCEL_PROJECT_PRODUCTION_URL']}`) ||
    `${req.protocol}://${req.get('host')}`
  ).replace(/\/$/, '');

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${publicOrigin(req)}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const origin = publicOrigin(req);
  const names = neuralIcons.filter((icon) => icon.variant === 'outline').map((icon) => icon.name);
  const paths = ['/', '/guide/', '/legal-notice/', '/privacy/', '/cookies/', ...names.map((name) => `/icon/${encodeURIComponent(name)}/`)];
  const urls = paths.flatMap((path) => [path, `/es${path}`]);
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
      .map((path) => `<url><loc>${origin}${path.replace(/&/g, '&amp;')}</loc></url>`)
      .join('')}</urlset>`,
  );
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/{*splat}', (req, res, next) => {
  if (!isPublicShowcasePath(req.path, supportedPaths)) {
    res.status(404).set('X-Robots-Tag', 'noindex, follow').type('html').send(missingPage(req.path === '/es' || req.path.startsWith('/es/')));
    return;
  }
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT'] || 4000);
  app.listen(port, '127.0.0.1', () => {
    console.log(`Node Express server listening on http://127.0.0.1:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
