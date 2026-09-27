import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtemp,
  readFile,
  realpath,
  rm,
  writeFile,
  lstat,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const directory = await mkdtemp(join(tmpdir(), 'neural-icons-clean-angular-'));
const registryOnly = process.argv.includes('--registry-only');
const versions = Object.fromEntries(
  await Promise.all(
    ['core', 'angular'].map(async (name) => [
      name,
      JSON.parse(
        await readFile(join(root, 'packages', name, 'package.json'), 'utf8'),
      ).version,
    ]),
  ),
);
const run = (file, args, cwd = directory) =>
  execFileSync(file, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

try {
  await writeFile(
    join(directory, 'package.json'),
    JSON.stringify({ private: true, type: 'module' }),
  );
  const packageSpecs = [];
  for (const name of ['core', 'angular']) {
    if (registryOnly) {
      packageSpecs.push(`@neural-icons/${name}@${versions[name]}`);
    } else {
      const [pack] = JSON.parse(
        run(
          'npm',
          ['pack', '--json', '--ignore-scripts', '--pack-destination', directory],
          join(root, 'dist/packages', name),
        ),
      );
      packageSpecs.push(join(directory, pack.filename));
    }
  }
  run('npm', [
    'install',
    '--registry=https://registry.npmjs.org/',
    '--no-audit',
    '--no-fund',
    '--no-bin-links',
    '--ignore-scripts',
    '--save-exact',
    ...packageSpecs,
    '@angular/core@22.1.6',
    '@angular/common@22.1.6',
    '@angular/compiler@22.1.6',
    '@angular/compiler-cli@22.1.6',
    '@angular/platform-browser@22.1.6',
    'rxjs@7.8.2',
    'tslib@2.8.1',
    'typescript@6.0.3',
  ]);

  if (registryOnly) {
    const lock = JSON.parse(
      await readFile(join(directory, 'package-lock.json'), 'utf8'),
    );
    for (const name of ['core', 'angular']) {
      const entry = lock.packages[`node_modules/@neural-icons/${name}`];
      assert.ok(
        entry?.resolved?.startsWith('https://registry.npmjs.org/') &&
          entry.integrity,
        `${name}: not installed from the npm registry`,
      );
    }
  }

  for (const name of ['core', 'angular']) {
    const installed = join(directory, 'node_modules/@neural-icons', name);
    assert.equal(
      (await lstat(installed)).isSymbolicLink(),
      false,
      `${name}: linked package`,
    );
    assert.ok(
      (await realpath(installed)).startsWith(await realpath(directory)),
      `${name}: escaped clean consumer`,
    );
    const manifest = JSON.parse(
      await readFile(join(installed, 'package.json'), 'utf8'),
    );
    assert.equal(manifest.version, versions[name]);
  }

  await writeFile(
    join(directory, 'consumer.ts'),
    `
    import { Component } from '@angular/core';
    import { NeuralIcon, provideNeuralIcons } from '@neural-icons/angular';
    import { iconSave } from '@neural-icons/core/icons/save';
    @Component({
      selector: 'clean-consumer',
      imports: [NeuralIcon],
      template: '<neural-icon [icon]="save" [size]="20" label="Save" /><neural-icon icon="save" label="Save by name" />',
    })
    export class CleanConsumer {
      readonly save = iconSave;
      static readonly providers = provideNeuralIcons(iconSave);
    }
  `,
  );
  await writeFile(
    join(directory, 'tsconfig.json'),
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
    join(
      directory,
      'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js',
    ),
    '-p',
    'tsconfig.json',
  ]);
  const compiled = await readFile(
    join(directory, 'compiled/consumer.js'),
    'utf8',
  );
  assert.ok(
    compiled.includes('ɵɵdefineComponent') ||
      compiled.includes('ɵɵngDeclareComponent'),
    'Angular AOT compilation missing',
  );
  console.log(
    `Clean Angular 22.1.6 consumer: ${registryOnly ? 'npm registry' : 'local tarball'} install and AOT PASS (no workspace aliases or package symlinks)`,
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
