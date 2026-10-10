import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

async function main() {
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://icons.neuralui.org';
process.env.NEURAL_ICONS_SITE_ORIGIN = origin;
process.env.NX_DAEMON = 'false';
const nxPackage = JSON.parse(await readFile(join(root, 'node_modules/nx/package.json'), 'utf8'));
execFileSync(process.execPath, [resolve(root, 'node_modules/nx', nxPackage.bin.nx), 'run', 'showcase:build'], {
  cwd: root, env: process.env, stdio: 'inherit',
});

const output = join(root, 'dist/cloudflare');
await rm(output, { recursive: true, force: true });
await cp(join(root, 'dist/apps/showcase/browser'), output, { recursive: true });
await rm(join(output, 'index.csr.html'), { force: true });
await rm(join(output, 'index.html'), { force: true });

// Rendering happens once during the build. Only files from dist/cloudflare are deployed.
const { reqHandler } = await import(pathToFileURL(join(root, 'dist/apps/showcase/server/server.mjs')).href);
const server = createServer((request, response) => reqHandler(request, response, (error) => {
  response.statusCode = error ? 500 : 404;
  response.end(error ? 'Build render failed' : 'Not found');
}));
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const localOrigin = `http://127.0.0.1:${server.address().port}`;
try {
  const sitemap = await (await fetch(`${localOrigin}/sitemap.xml`)).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  if (!urls.length || new Set(urls.map((url) => url.href)).size !== urls.length) throw new Error('Invalid sitemap');
  for (const url of urls) {
    if (url.origin !== origin || url.search) throw new Error(`Invalid static route: ${url.href}`);
    const response = await fetch(`${localOrigin}${url.pathname}`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Render failed: ${url.pathname} (${response.status})`);
    const html = await response.text();
    const canonicalTag = html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0] ?? '';
    if (!canonicalTag.includes(`href="${url.href}"`)) throw new Error(`Wrong canonical: ${url.pathname}`);
    const locale = url.pathname.startsWith('/es/') ? 'es' : 'en';
    if (!html.includes(`<html lang="${locale}"`)) throw new Error(`Wrong locale: ${url.pathname}`);
    if (url.pathname.includes('/guide/') && html.includes('class="family-tile"')) throw new Error(`Guide contains catalog: ${url.pathname}`);
    const name = url.pathname.match(/\/icon\/([^/]+)\//)?.[1];
    if (name && !html.includes(`<title>${name} — `)) throw new Error(`Missing detail metadata: ${url.pathname}`);
    const directory = join(output, url.pathname);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), html);
  }
  await writeFile(join(output, 'sitemap.xml'), sitemap);
  await writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile(join(output, '404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found — Neural Icons</title></head><body><h1>Page not found</h1><a href="/">Neural Icons</a></body></html>');
  await writeFile(join(output, '_headers'), 'https://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n\nhttps://:preview.:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n');
  async function check(directory) {
    let count = 0;
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (directory === output && ['functions', '_worker.js', 'server'].includes(entry.name)) throw new Error(`Runtime output forbidden: ${entry.name}`);
      count += entry.isDirectory() ? await check(join(directory, entry.name)) : 1;
    }
    return count;
  }
  const count = await check(output);
  if (count > 20000) throw new Error(`Cloudflare Free file limit exceeded: ${count}`);
  console.log(`Cloudflare static output: ${urls.length} verified localized pages, ${count} files, no request-time server.`);
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
}

await main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
