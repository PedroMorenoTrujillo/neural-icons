import assert from 'node:assert/strict';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import playwright from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist/fixtures/angular-hydration');
const browserRoot = join(dist, 'browser');
const { renderFixture } = await import(
  pathToFileURL(join(dist, 'server/server.mjs')).href
);
await renderFixture();

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(
    new URL(request.url ?? '/', 'http://localhost').pathname,
  );
  const file = resolve(
    browserRoot,
    `.${pathname === '/' ? '/index.html' : pathname}`,
  );
  if (
    !file.startsWith(`${browserRoot}/`) ||
    !existsSync(file) ||
    !statSync(file).isFile()
  ) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
  };
  response.writeHead(200, {
    'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream',
  });
  createReadStream(file).pipe(response);
});

await new Promise((resolveListen, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolveListen);
});
const browser = await playwright.chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
let releaseScripts;
const scriptGate = new Promise((resolveGate) => {
  releaseScripts = resolveGate;
});
await page.route(/\.js(?:\?|$)/, async (route) => {
  await scriptGate;
  await route.continue();
});

try {
  await page.goto(`http://127.0.0.1:${server.address().port}/`, {
    waitUntil: 'commit',
  });
  await page.locator('#ready').waitFor({ state: 'attached' });
  assert.equal(await page.locator('#ready').textContent(), 'false');
  assert.equal(await page.locator('#updates').textContent(), '0');
  assert.equal(await page.locator('neural-icon svg').count(), 4);
  const before = await page.evaluate(() => {
    window.__neuralIconsBefore = [...document.querySelectorAll('neural-icon')];
    window.__neuralSvgBefore = [
      ...document.querySelectorAll('neural-icon svg'),
    ];
    const attributes = (svg) =>
      ['viewBox', 'fill', 'stroke', 'role', 'aria-label', 'aria-hidden'].map(
        (name) => [name, svg.getAttribute(name)],
      );
    return window.__neuralSvgBefore.map((svg) => ({
      attrs: attributes(svg),
      path: svg.querySelector('path')?.getAttribute('d'),
    }));
  });

  releaseScripts();
  await page.waitForFunction(
    () => document.querySelector('#ready')?.textContent === 'true',
  );
  const after = await page.evaluate(() => {
    const icons = [...document.querySelectorAll('neural-icon')];
    const svgs = [...document.querySelectorAll('neural-icon svg')];
    const attributes = (svg) =>
      ['viewBox', 'fill', 'stroke', 'role', 'aria-label', 'aria-hidden'].map(
        (name) => [name, svg.getAttribute(name)],
      );
    return {
      hostReused: icons.every(
        (icon, index) => icon === window.__neuralIconsBefore[index],
      ),
      svgReused: svgs.every(
        (svg, index) => svg === window.__neuralSvgBefore[index],
      ),
      snapshots: svgs.map((svg) => ({
        attrs: attributes(svg),
        path: svg.querySelector('path')?.getAttribute('d'),
      })),
    };
  });
  assert.equal(after.hostReused, true, 'SSR host nodes must be reused');
  assert.equal(after.svgReused, true, 'SSR SVG nodes must be reused');
  assert.deepEqual(
    after.snapshots,
    before,
    'Initial SVG attributes and geometry must be stable',
  );
  assert.equal(await page.locator('neural-icon svg').count(), 4);
  assert.equal(
    await page.locator('#decorative svg').getAttribute('aria-hidden'),
    'true',
  );
  assert.equal(
    await page.locator('#decorative svg').getAttribute('aria-label'),
    null,
  );
  assert.equal(await page.locator('#semantic svg').getAttribute('role'), 'img');
  assert.equal(
    await page.locator('#semantic svg').getAttribute('aria-label'),
    'Information',
  );
  assert.equal(
    await page.locator('#filled svg').getAttribute('fill'),
    'currentColor',
  );
  assert.equal(
    await page.locator('#filled svg').getAttribute('stroke'),
    'none',
  );
  assert.equal(await page.locator('#updates').textContent(), '0');

  await page.locator('#change').click();
  await page.waitForFunction(
    () => document.querySelector('#updates')?.textContent === '1',
  );
  assert.equal(
    await page.locator('#dynamic neural-icon').getAttribute('data-neural-icon'),
    'x',
  );
  assert.equal(await page.locator('neural-icon svg').count(), 4);
  assert.equal(
    errors.filter((error) => /NG050\d/.test(error)).length,
    0,
    errors.join('\n'),
  );
  assert.deepEqual(errors, []);
  console.log(
    'Angular zoneless SSR/hydration passed: 4 SVG nodes reused, stable attributes, no NG050x, one signal update.',
  );
} finally {
  releaseScripts();
  await browser.close();
  await new Promise((resolveClose, reject) =>
    server.close((error) => (error ? reject(error) : resolveClose())),
  );
}
