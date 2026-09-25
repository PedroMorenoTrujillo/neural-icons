import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { build as viteBuild } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(
  new URL('../node_modules/@angular/build/package.json', import.meta.url),
);
const { build } = require('esbuild');
const temp = await mkdtemp(join(tmpdir(), 'neural-icons-react-consumer-'));
const run = (file, args, cwd = temp) =>
  execFileSync(file, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

let server;
let browser;
try {
  await writeFile(
    join(temp, 'package.json'),
    JSON.stringify({ private: true, type: 'module' }),
  );
  const tarballs = [];
  for (const name of ['core', 'react']) {
    const packed = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temp],
        join(root, 'dist/packages', name),
      ),
    )[0];
    assert(
      !packed.files.some(({ path }) => /\.(spec|test)\./.test(path)),
      `${name}: test file leaked`,
    );
    tarballs.push(join(temp, packed.filename));
  }
  run('npm', [
    'install',
    '--offline',
    '--no-audit',
    '--no-fund',
    '--save-exact',
    ...tarballs,
    'react@19.3.0',
    'react-dom@19.3.0',
    '@types/react@19.3.0',
    '@types/react-dom@19.3.0',
    'typescript@6.0.3',
  ]);

  const dependencyCheck = `
    import assert from 'node:assert/strict';
    import { createElement } from 'react';
    import { renderToString } from 'react-dom/server';
    import { NeuIcon } from '@neural-icons/react';
    import { iconSearch } from '@neural-icons/core/icons/search';
    import { iconSearchFilled } from '@neural-icons/core/icons/search-filled';
    import { iconFile } from '@neural-icons/core/icons/file';
    import { iconFileText } from '@neural-icons/core/icons/file-text';
    import { iconLogin } from '@neural-icons/core/icons/login';
    import { iconFilter } from '@neural-icons/core/icons/filter';
    import { iconPaperclip } from '@neural-icons/core/icons/paperclip';
    import { iconGroup } from '@neural-icons/core/icons/group';
    import { iconUsers } from '@neural-icons/core/icons/users';
    const names = [iconFile, iconFileText, iconLogin, iconFilter, iconPaperclip, iconGroup, iconUsers];
    for (const icon of [iconSearch, iconSearchFilled, ...names]) {
      const markup = renderToString(createElement(NeuIcon, { icon, 'aria-label': icon.name }));
      assert(markup.includes('<svg'));
      assert(markup.includes('viewBox="0 0 24 24"'));
      assert(markup.includes('role="img"'));
      assert(markup.includes(icon.paths[0]));
      assert.equal(markup, renderToString(createElement(NeuIcon, { icon, 'aria-label': icon.name })));
    }
    for (const family of ['file', 'file-text', 'login', 'filter', 'paperclip', 'group', 'users']) {
      for (const suffix of ['', '-filled']) {
        const icon = Object.values(await import('@neural-icons/core/icons/' + family + suffix))[0];
        const markup = renderToString(createElement(NeuIcon, { icon }));
        assert(markup.includes(icon.paths[0]));
      }
    }
    assert.equal(typeof NeuIcon, 'function');
    for (const removed of ['attach', 'attach-filled', 'funnel', 'funnel-filled']) {
      await assert.rejects(import('@neural-icons/core/icons/' + removed), { code: 'ERR_MODULE_NOT_FOUND' });
    }
    console.log('SSR/critical families/removed aliases: PASS');
  `;
  await writeFile(join(temp, 'ssr.mjs'), dependencyCheck);
  const ssrResult = run('node', ['ssr.mjs']).trim();

  await writeFile(
    join(temp, 'consumer.tsx'),
    `
    import { createRef } from 'react';
    import { iconSearch } from '@neural-icons/core/icons/search';
    import { NeuIcon } from '@neural-icons/react';
    export const valid = <NeuIcon icon={iconSearch} size={20} width="2em" className="search" style={{ color: 'red' }} aria-label="Search" ref={createRef<SVGSVGElement>()} />;
    // @ts-expect-error string names cannot load a hidden catalog
    export const invalid = <NeuIcon icon="search" />;
    // @ts-expect-error geometry belongs to Core
    export const invalidGeometry = <NeuIcon icon={iconSearch} viewBox="0 0 48 48" />;
  `,
  );
  await writeFile(
    join(temp, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        skipLibCheck: true,
        types: ['react'],
        noEmit: true,
      },
      include: ['consumer.tsx'],
    }),
  );
  run(join(temp, 'node_modules/.bin/tsc'), ['--project', 'tsconfig.json']);

  const matrix = [
    [
      'A react import unused',
      `import { NeuIcon } from '@neural-icons/react'; export const value = 1;`,
      [],
    ],
    ['ADAPTER ONLY', `export { NeuIcon } from '@neural-icons/react';`, []],
    [
      'B one icon',
      `import { createElement } from 'react'; import { NeuIcon } from '@neural-icons/react'; import { iconSearch } from '@neural-icons/core/icons/search'; export const node = createElement(NeuIcon, { icon: iconSearch });`,
      ['search'],
    ],
    [
      'C one family',
      `import { createElement } from 'react'; import { NeuIcon } from '@neural-icons/react'; import { iconSearch } from '@neural-icons/core/icons/search'; import { iconSearchFilled } from '@neural-icons/core/icons/search-filled'; export const nodes = [iconSearch, iconSearchFilled].map(icon => createElement(NeuIcon, { icon }));`,
      ['search', 'search-filled'],
    ],
    [
      'D ten icons',
      `import { createElement } from 'react'; import { NeuIcon } from '@neural-icons/react'; ${['search', 'home', 'user', 'save', 'download', 'file', 'file-text', 'login', 'filter', 'paperclip'].map((n) => `import { icon${n.replace(/(^|-)(\w)/g, (_, _dash, c) => c.toUpperCase())} } from '@neural-icons/core/icons/${n}';`).join(' ')} export const nodes = [${['Search', 'Home', 'User', 'Save', 'Download', 'File', 'FileText', 'Login', 'Filter', 'Paperclip'].map((n) => `icon${n}`).join(',')}].map(icon => createElement(NeuIcon, { icon }));`,
      [
        'search',
        'home',
        'user',
        'save',
        'download',
        'file',
        'file-text',
        'login',
        'filter',
        'paperclip',
      ],
    ],
    [
      'E explicit catalog',
      `import { createElement } from 'react'; import { NeuIcon } from '@neural-icons/react'; import { neuralIcons } from '@neural-icons/core/catalog'; export const nodes = neuralIcons.map(icon => createElement(NeuIcon, { icon }));`,
      null,
    ],
    ['ROOT UNUSED', `export {};`, []],
  ];
  const results = [];
  for (const [name, source, expected] of matrix) {
    const entry = join(temp, 'bundle-entry.mjs');
    await writeFile(entry, source);
    const output = await build({
      entryPoints: [entry],
      absWorkingDir: temp,
      bundle: true,
      write: false,
      format: 'esm',
      platform: 'browser',
      minify: true,
      treeShaking: true,
      metafile: true,
      external: ['react'],
    });
    const bytes = output.outputFiles[0]?.contents ?? new Uint8Array();
    const retained = Object.keys(output.metafile.inputs)
      .map(
        (path) =>
          path.match(/@neural-icons\/core\/src\/icons\/([^/]+)\.js$/)?.[1],
      )
      .filter((name) => name && name !== 'index')
      .sort();
    if (expected)
      assert.deepEqual(
        retained,
        [...expected].sort(),
        `${name}: unrelated glyph retention`,
      );
    else
      assert.equal(
        retained.length,
        394,
        'Full catalog must be explicit and complete',
      );
    results.push({
      case: name,
      raw: bytes.length,
      gzip: gzipSync(bytes).length,
      glyphs: retained.length,
    });
  }

  const viteEntry = join(temp, 'vite-entry.mjs');
  await writeFile(viteEntry, matrix[2][1]);
  const viteOutput = await viteBuild({
    root: temp,
    configFile: false,
    logLevel: 'error',
    build: {
      write: false,
      lib: { entry: viteEntry, formats: ['es'], fileName: 'neural-one-icon' },
      rollupOptions: { external: ['react'] },
    },
  });
  const viteResult = Array.isArray(viteOutput) ? viteOutput[0] : viteOutput;
  const viteModules = Object.keys(viteResult.output[0].modules)
    .map(
      (path) =>
        path.match(/@neural-icons\/core\/src\/icons\/([^/]+)\.js$/)?.[1],
    )
    .filter((name) => name && name !== 'index');
  assert.deepEqual(
    viteModules,
    ['search'],
    'Vite/Rollup must retain only search',
  );

  const browserSource = `
    import { createElement } from 'react';
    import { hydrateRoot } from 'react-dom/client';
    import { NeuIcon } from '@neural-icons/react';
    import { iconSearch } from '@neural-icons/core/icons/search';
    const host = document.getElementById('root');
    const before = host.querySelector('svg');
    const recoverable = [];
    hydrateRoot(host, createElement(NeuIcon, { icon: iconSearch, 'aria-label': 'Search' }), {
      onRecoverableError: error => recoverable.push(String(error)),
    });
    setTimeout(() => {
      window.__neuralHydration = { reused: host.querySelector('svg') === before, recoverable, count: host.querySelectorAll('svg').length };
    }, 100);
  `;
  const browserEntry = join(temp, 'browser-entry.mjs');
  await writeFile(browserEntry, browserSource);
  await build({
    entryPoints: [browserEntry],
    bundle: true,
    platform: 'browser',
    format: 'iife',
    outfile: join(temp, 'browser.js'),
  });
  const initialMarkup = run('node', [
    '--input-type=module',
    '-e',
    `import { createElement } from 'react'; import { renderToString } from 'react-dom/server'; import { NeuIcon } from '@neural-icons/react'; import { iconSearch } from '@neural-icons/core/icons/search'; console.log(renderToString(createElement(NeuIcon, { icon: iconSearch, 'aria-label': 'Search' })));`,
  ]).trim();
  const html = `<!doctype html><html><body><div id="root">${initialMarkup}</div><script src="/browser.js"></script></body></html>`;
  server = createServer(async (request, response) => {
    if (request.url === '/browser.js') {
      response.setHeader('content-type', 'text/javascript');
      response.end(await readFile(join(temp, 'browser.js')));
    } else {
      response.setHeader('content-type', 'text/html');
      response.end(html);
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error)));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(() => window.__neuralHydration !== undefined);
  const hydration = await page.evaluate(() => window.__neuralHydration);
  assert.deepEqual(hydration, { reused: true, recoverable: [], count: 1 });
  assert.deepEqual(consoleErrors, []);

  console.log(ssrResult);
  console.log('Consumer TypeScript/build/import: PASS');
  console.log('Chromium SSR hydration: PASS');
  console.log('Vite/Rollup one-icon smoke: PASS');
  console.log('Bundle matrix:', JSON.stringify(results));
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(temp, { recursive: true, force: true });
}
