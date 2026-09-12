import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

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
  const nodeCheck = `
    import assert from 'node:assert/strict';
    import { neuralIcons } from '@neural-icons/core';
    assert.equal(neuralIcons.length, ${specs.length});
    for (const expected of neuralIcons) {
      const module = await import('@neural-icons/core/icons/' + expected.name);
      const icon = Object.values(module)[0];
      assert.deepEqual(icon, { ...expected, variant: expected.variant ?? 'outline' });
      assert(Object.isFrozen(icon.paths));
      assert(import.meta.resolve('@neural-icons/core/svg/' + icon.name + '.svg').endsWith('.svg'));
    }
    assert.throws(() => import.meta.resolve('@neural-icons/core/lib/icon-definition'));
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
    import { NeuralIcon } from '@neural-icons/angular';
    import { defineIcon } from '@neural-icons/core';
    import { iconSearch } from '@neural-icons/core/icons/search';
    const mutablePaths = ['M4 12h16'];
    const definition = defineIcon({name: 'custom', category: 'system', tags: ['custom'], paths: mutablePaths});
    // @ts-expect-error Public definitions must reject mutation, even when input arrays were mutable.
    definition.paths.push('M0 0');
    // @ts-expect-error Tags are also readonly in the public API.
    definition.tags.push('changed');
    @Component({
      selector: 'consumer-root', imports: [NeuralIcon],
      template: '<neural-icon [icon]="search" [size]="20" label="Search" />',
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
    ['root', "import { iconSearch as value } from '@neural-icons/core';"],
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
  console.log(
    `Verified ${specs.length} packaged icon exports, SVG exports, readonly types, and Angular AOT consumption.`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
