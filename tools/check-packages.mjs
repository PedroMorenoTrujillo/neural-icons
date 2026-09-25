import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const angularBuildRequire = createRequire(
  new URL('../node_modules/@angular/build/package.json', import.meta.url),
);
const { build: buildWithEsbuild } = angularBuildRequire('esbuild');

// Exercise the actual tarballs outside the workspace: no source path aliases,
// registry access, publication, or dependency installation is involved.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const temporary = await mkdtemp(join(tmpdir(), 'neural-icons-package-check-'));
const run = (file, args, cwd = temporary) =>
  execFileSync(file, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

try {
  await writeFile(
    join(temporary, 'package.json'),
    '{"private":true,"type":"module"}',
  );
  for (const name of ['core', 'angular']) {
    const packed = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
        join(root, 'dist/packages', name),
      ),
    )[0];
    const destination = join(temporary, 'node_modules/@neural-icons', name);
    await mkdir(destination, { recursive: true });
    run('tar', [
      '-xzf',
      join(temporary, packed.filename),
      '-C',
      destination,
      '--strip-components=1',
    ]);
    assert(
      !packed.files.some(({ path }) => /\.(spec|test)\./.test(path)),
      'Tests must not leak into packages',
    );
  }
  // Angular compilation needs its real peer packages, never a source alias to
  // either Neural package. Core itself is checked before linking any framework.
  const specs = JSON.parse(
    await readFile(join(root, 'packages/core/icons/icons.json'), 'utf8'),
  );
  const packedCore = join(temporary, 'node_modules/@neural-icons/core');
  const expectedNames = specs.map(({ name }) => name).sort();
  const packedSvgNames = (await readdir(join(packedCore, 'svg')))
    .filter((name) => name.endsWith('.svg'))
    .map((name) => name.slice(0, -4))
    .sort();
  const packedDefinitionNames = (await readdir(join(packedCore, 'src/icons')))
    .filter((name) => name.endsWith('.js') && name !== 'index.js')
    .map((name) => name.slice(0, -3))
    .sort();
  assert.deepEqual(packedSvgNames, expectedNames, 'Packed SVG names must match the manifest exactly');
  assert.deepEqual(packedDefinitionNames, expectedNames, 'Packed definitions must match the manifest exactly');
  for (const name of expectedNames) {
    assert.deepEqual(
      await readFile(join(packedCore, 'svg', `${name}.svg`)),
      await readFile(join(root, 'packages/core/svg', `${name}.svg`)),
      `${name}: packed SVG must equal the generated source SVG`,
    );
  }
  const nodeCheck = `
    import assert from 'node:assert/strict';
    import { readFile } from 'node:fs/promises';
    import * as core from '@neural-icons/core';
    import { neuralIcons } from '@neural-icons/core/catalog';
    assert(!('iconSearch' in core));
    assert(!('neuralIcons' in core));
    assert.equal(neuralIcons.length, ${specs.length});
    for (const expected of neuralIcons) {
      const module = await import('@neural-icons/core/icons/' + expected.name);
      const icon = Object.values(module)[0];
      assert.deepEqual(icon, { ...expected, family: expected.variant === 'filled' ? expected.name.replace(/-filled$/, '') : expected.name, variant: expected.variant ?? 'outline' });
      assert(Object.isFrozen(icon.paths));
      assert(import.meta.resolve('@neural-icons/core/svg/' + icon.name + '.svg').endsWith('.svg'));
    }
    assert.throws(() => import.meta.resolve('@neural-icons/core/lib/icon-definition'));
    assert.throws(() => import.meta.resolve('@neural-icons/core/icons/index'));
    for (const removed of ['attach', 'attach-filled', 'funnel', 'funnel-filled']) {
      await assert.rejects(import('@neural-icons/core/icons/' + removed), { code: 'ERR_MODULE_NOT_FOUND' });
      await assert.rejects(readFile(new URL(import.meta.resolve('@neural-icons/core/svg/' + removed + '.svg'))), { code: 'ENOENT' });
    }
  `;
  await writeFile(join(temporary, 'node-check.mjs'), nodeCheck);
  run(process.execPath, ['node-check.mjs']);

  for (const dependency of ['@angular', 'rxjs', 'tslib']) {
    await symlink(
      join(root, 'node_modules', dependency),
      join(temporary, 'node_modules', dependency),
      'dir',
    );
  }
  const consumer = `
    import { Component } from '@angular/core';
    import { NeuralIcon, provideNeuralIcons, provideAllNeuralIcons } from '@neural-icons/angular';
    import { defineIcon } from '@neural-icons/core';
    import type { NeuralIconFamily, NeuralIconName } from '@neural-icons/core';
    import { iconSearch } from '@neural-icons/core/icons/search';
    const registrations = provideNeuralIcons(iconSearch);
    const allRegistrations = provideAllNeuralIcons;
    void registrations;
    void allRegistrations;
    const mutablePaths = ['M4 12h16'];
    const definition = defineIcon({name: 'custom', category: 'system', tags: ['custom'], paths: mutablePaths});
    const family: NeuralIconFamily = 'search';
    const name: NeuralIconName = 'search-filled';
    void family;
    void name;
    // @ts-expect-error The family union must reject unknown names.
    const unknownFamily: NeuralIconFamily = 'not-an-icon';
    void unknownFamily;
    // @ts-expect-error Public definitions must reject mutation, even when input arrays were mutable.
    definition.paths.push('M0 0');
    // @ts-expect-error Tags are also readonly in the public API.
    definition.tags.push('changed');
    @Component({
      selector: 'consumer-root', imports: [NeuralIcon],
      template: '<neural-icon [icon]="search" [size]="20" label="Search" /><neural-icon icon="search" label="Search by name" />',
    })
    export class Consumer { readonly search = iconSearch; }
  `;
  await writeFile(join(temporary, 'consumer.ts'), consumer);
  await writeFile(
    join(temporary, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'preserve',
        moduleResolution: 'bundler',
        strict: true,
        experimentalDecorators: true,
        skipLibCheck: false,
        types: [],
        lib: ['ES2022', 'DOM'],
        outDir: './compiled',
      },
      angularCompilerOptions: { strictTemplates: true },
      files: ['consumer.ts'],
    }),
  );
  run(process.execPath, [
    join(root, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'),
    '-p',
    'tsconfig.json',
  ]);
  const angularBundle = await readFile(
    join(
      temporary,
      'node_modules/@neural-icons/angular/fesm2022/neural-icons-angular.mjs',
    ),
    'utf8',
  );
  assert(
    angularBundle.includes('ɵɵngDeclareComponent'),
    'The library must use partial Angular compilation',
  );

  const cases = [
    [
      'per-icon',
      "import { iconSearch as value } from '@neural-icons/core/icons/search';",
    ],
    [
      'root',
      "import { NEURAL_ICON_VIEW_BOX as value } from '@neural-icons/core';",
    ],
    [
      'constant',
      "import { NEURAL_ICON_STROKE_WIDTH as value } from '@neural-icons/core';",
    ],
    ['adapter', "import { NeuralIcon as value } from '@neural-icons/angular';"],
  ];
  for (const [name, source] of cases) {
    const entry = join(temporary, `${name}.js`);
    await writeFile(entry, `${source}\nconsole.log(value);`);
    const results = await build({
      root: temporary,
      configFile: false,
      logLevel: 'silent',
      build: {
        write: false,
        minify: true,
        lib: { entry, formats: ['es'] },
        rollupOptions: { external: ['@angular/core'] },
      },
    });
    const code = results
      .flatMap((result) => result.output)
      .filter((item) => item.type === 'chunk')
      .map((item) => item.code)
      .join('\n');
    for (const icon of specs.filter(
      ({ name }) => name !== 'search' && name !== 'search-filled',
    )) {
      assert(
        !code.includes(`name:"${icon.name}"`),
        `${name} retained unrelated icon ${icon.name}`,
      );
      for (const path of icon.paths.filter((path) => path.length > 40)) {
        assert(
          !code.includes(path),
          `${name} retained unrelated geometry: ${icon.name}`,
        );
      }
    }
    if (name === 'constant' || name === 'adapter') {
      assert(
        !code.includes('name:"search"'),
        `${name} must not import the catalog`,
      );
    }
    console.log(
      `Tree-shaking ${name}: ${Buffer.byteLength(code)} bytes; no unrelated geometry.`,
    );
  }
  const tenNames = specs
    .filter(({ variant }) => variant !== 'filled')
    .slice(0, 10)
    .map(({ name }) => name);
  const pascal = (name) =>
    name
      .split('-')
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join('');
  const imports = (names) =>
    names
      .map(
        (name) =>
          `import { icon${pascal(name)} } from '@neural-icons/core/icons/${name}';`,
      )
      .join('\n');
  const symbols = (names) => names.map((name) => `icon${pascal(name)}`);
  const matrix = [
    [
      'CORE ROOT ONLY',
      "import { NEURAL_ICON_VIEW_BOX } from '@neural-icons/core'; console.log(NEURAL_ICON_VIEW_BOX);",
      [],
    ],
    [
      'ONE ICON',
      `${imports(['search'])}\nconsole.log(iconSearch);`,
      ['search'],
    ],
    [
      'ONE FAMILY WITH VARIANTS',
      `${imports(['search', 'search-filled'])}\nconsole.log(iconSearch, iconSearchFilled);`,
      ['search', 'search-filled'],
    ],
    [
      '10 ICONS',
      `${imports(tenNames)}\nconsole.log(${symbols(tenNames).join(', ')});`,
      tenNames,
    ],
    [
      'ANGULAR COMPONENT + ONE ICON',
      `import { NeuralIcon, provideNeuralIcons } from '@neural-icons/angular';\n${imports(['search'])}\nconsole.log(NeuralIcon, provideNeuralIcons(iconSearch));`,
      ['search'],
    ],
    [
      'ANGULAR COMPONENT + 10 ICONS',
      `import { NeuralIcon, provideNeuralIcons } from '@neural-icons/angular';\n${imports(tenNames)}\nconsole.log(NeuralIcon, provideNeuralIcons(${symbols(tenNames).join(', ')}));`,
      tenNames,
    ],
    [
      'FULL CATALOG',
      "import { neuralIcons } from '@neural-icons/core/catalog'; console.log(neuralIcons);",
      specs.map(({ name }) => name),
    ],
    ['ROOT UNUSED', "import '@neural-icons/core';", []],
  ];
  for (const [name, source, expectedNames] of matrix) {
    const result = await buildWithEsbuild({
      absWorkingDir: temporary,
      stdin: {
        contents: source,
        resolveDir: temporary,
        sourcefile: `${name.toLowerCase().replaceAll(' ', '-')}.mjs`,
      },
      bundle: true,
      platform: 'browser',
      format: 'esm',
      minify: true,
      write: false,
      metafile: true,
      external: ['@angular/*'],
    });
    const code = result.outputFiles[0]?.text ?? '';
    const actualNames = Object.values(result.metafile.outputs)
      .flatMap(({ inputs }) => Object.entries(inputs))
      .filter(([, input]) => input.bytesInOutput > 0)
      .map(
        ([path]) =>
          path.match(/@neural-icons\/core\/src\/icons\/([^/]+)\.js$/)?.[1],
      )
      .filter((iconName) => iconName && iconName !== 'index')
      .sort();
    assert.deepEqual(
      actualNames,
      [...expectedNames].sort(),
      `${name}: unexpected glyph definitions in esbuild output`,
    );
    if (name === 'ROOT UNUSED') {
      assert.equal(Buffer.byteLength(code), 0, 'Unused root must emit 0 bytes');
    }
    console.log(
      `Esbuild ${name}: ${actualNames.length} glyphs, ${Buffer.byteLength(code)} raw bytes, ${gzipSync(code).length} gzip bytes.`,
    );
  }
  console.log(run(process.execPath, [join(root, 'tools/verify-name-tree-shaking.mjs'), temporary]));
  console.log(
    `Verified ${specs.length} packaged icon exports, SVG exports, readonly types, and Angular AOT consumption.`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
