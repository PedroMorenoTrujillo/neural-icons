import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { build as viteBuild } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(
  new URL('../node_modules/@angular/build/package.json', import.meta.url),
);
const { build } = require('esbuild');
const temp = await mkdtemp(join(tmpdir(), 'neural-icons-vue-consumer-'));
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
  for (const name of ['core', 'vue']) {
    const packed = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temp],
        join(root, 'dist/packages', name),
      ),
    )[0];
    assert(
      !packed.files.some(({ path }) => /\.(spec|test|typecheck)\./.test(path)),
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
    'vue@3.5.43',
    'typescript@6.0.3',
  ]);

  const ssrSource = `
    import assert from 'node:assert/strict';
    import { createSSRApp, h } from 'vue';
    import { renderToString } from 'vue/server-renderer';
    import { NeuIcon } from '@neural-icons/vue';
    import { iconSearch } from '@neural-icons/core/icons/search';
    import { iconSearchFilled } from '@neural-icons/core/icons/search-filled';
    assert.equal(typeof NeuIcon, 'object');
    for (const icon of [iconSearch, iconSearchFilled]) {
      const markup = await renderToString(createSSRApp({ render: () => h(NeuIcon, { icon, 'aria-label': icon.name }) }));
      assert(markup.includes('<svg'));
      assert(markup.includes('viewBox="0 0 24 24"'));
      assert(markup.includes('role="img"'));
      assert(markup.includes(icon.paths[0]));
      assert.equal(markup, await renderToString(createSSRApp({ render: () => h(NeuIcon, { icon, 'aria-label': icon.name }) })));
    }
    for (const family of ['file', 'file-text', 'login', 'filter', 'paperclip', 'group', 'users']) {
      for (const suffix of ['', '-filled']) {
        const icon = Object.values(await import('@neural-icons/core/icons/' + family + suffix))[0];
        const markup = await renderToString(createSSRApp({ render: () => h(NeuIcon, { icon }) }));
        assert(markup.includes(icon.paths[0]));
      }
    }
    for (const removed of ['attach', 'attach-filled', 'funnel', 'funnel-filled']) {
      await assert.rejects(import('@neural-icons/core/icons/' + removed), { code: 'ERR_MODULE_NOT_FOUND' });
    }
    console.log('SSR/critical families/removed aliases: PASS');
  `;
  await writeFile(join(temp, 'ssr.mjs'), ssrSource);
  const ssrResult = run('node', ['ssr.mjs']).trim();

  await writeFile(
    join(temp, 'consumer.ts'),
    `
    import { h } from 'vue';
    import { iconSearch } from '@neural-icons/core/icons/search';
    import { NeuIcon } from '@neural-icons/vue';
    import type { NeuIconProps } from '@neural-icons/vue';
    const props: NeuIconProps = { icon: iconSearch, size: 20 };
    export const valid = h(NeuIcon, { ...props, class: 'search', style: { color: 'red' }, 'aria-label': 'Search', width: 32 });
    // @ts-expect-error string names cannot load a hidden catalog
    const invalid: NeuIconProps = { icon: 'search' };
    // @ts-expect-error size has a constrained type
    const invalidSize: NeuIconProps = { icon: iconSearch, size: true };
    void invalid; void invalidSize;
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
        skipLibCheck: true,
        lib: ['ES2022', 'DOM'],
        types: [],
        noEmit: true,
      },
      include: ['consumer.ts'],
    }),
  );
  run(join(temp, 'node_modules/.bin/tsc'), ['--project', 'tsconfig.json']);

  const ten = [
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
  ];
  const importedTen = ten.map((name) => {
    const symbol = `icon${name.replace(/(^|-)(\w)/g, (_, _dash, c) => c.toUpperCase())}`;
    return { name, symbol };
  });
  const matrix = [
    [
      'A Vue import unused',
      `import { NeuIcon } from '@neural-icons/vue'; export const value = 1;`,
      [],
    ],
    ['ADAPTER ONLY', `export { NeuIcon } from '@neural-icons/vue';`, []],
    [
      'B one icon',
      `import { h } from 'vue'; import { NeuIcon } from '@neural-icons/vue'; import { iconSearch } from '@neural-icons/core/icons/search'; export const node = h(NeuIcon, { icon: iconSearch });`,
      ['search'],
    ],
    [
      'C one family',
      `import { h } from 'vue'; import { NeuIcon } from '@neural-icons/vue'; import { iconSearch } from '@neural-icons/core/icons/search'; import { iconSearchFilled } from '@neural-icons/core/icons/search-filled'; export const nodes = [iconSearch, iconSearchFilled].map(icon => h(NeuIcon, { icon }));`,
      ['search', 'search-filled'],
    ],
    [
      'D ten icons',
      `import { h } from 'vue'; import { NeuIcon } from '@neural-icons/vue'; ${importedTen.map(({ name, symbol }) => `import { ${symbol} } from '@neural-icons/core/icons/${name}';`).join(' ')} export const nodes = [${importedTen.map(({ symbol }) => symbol).join(',')}].map(icon => h(NeuIcon, { icon }));`,
      ten,
    ],
    [
      'E explicit catalog',
      `import { h } from 'vue'; import { NeuIcon } from '@neural-icons/vue'; import { neuralIcons } from '@neural-icons/core/catalog'; export const nodes = neuralIcons.map(icon => h(NeuIcon, { icon }));`,
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
      external: ['vue'],
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
      rollupOptions: { external: ['vue'] },
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
    import { createSSRApp, h } from 'vue';
    import { NeuIcon } from '@neural-icons/vue';
    import { iconSearch } from '@neural-icons/core/icons/search';
    const host = document.getElementById('root');
    const before = host.querySelector('svg');
    const warnings = [];
    const app = createSSRApp({ render: () => h(NeuIcon, { icon: iconSearch, 'aria-label': 'Search' }) });
    app.config.warnHandler = warning => warnings.push(String(warning));
    app.mount(host);
    setTimeout(() => {
      window.__neuralHydration = { reused: host.querySelector('svg') === before, warnings, count: host.querySelectorAll('svg').length };
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
    define: {
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  });
  const initialMarkup = run('node', [
    '--input-type=module',
    '-e',
    `import { createSSRApp, h } from 'vue'; import { renderToString } from 'vue/server-renderer'; import { NeuIcon } from '@neural-icons/vue'; import { iconSearch } from '@neural-icons/core/icons/search'; console.log(await renderToString(createSSRApp({ render: () => h(NeuIcon, { icon: iconSearch, 'aria-label': 'Search' }) })));`,
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
    if (message.type() === 'error' || message.type() === 'warning')
      consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error)));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(() => window.__neuralHydration !== undefined);
  const hydration = await page.evaluate(() => window.__neuralHydration);
  assert.deepEqual(hydration, { reused: true, warnings: [], count: 1 });
  assert.deepEqual(consoleErrors, []);

  console.log(ssrResult);
  console.log('Consumer TypeScript/build/import: PASS');
  console.log('Chromium Vue SSR hydration: PASS');
  console.log('Vite/Rollup one-icon smoke: PASS');
  console.log('Bundle matrix:', JSON.stringify(results));
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(temp, { recursive: true, force: true });
}
