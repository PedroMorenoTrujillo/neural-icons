import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = join(root, 'packages/angular/fixtures/hydration');
const requested = process.argv[2];
if (!requested) {
  throw new Error('Pass an Angular tarball path or an npm version.');
}
const candidate = resolve(requested);
const tarball = existsSync(candidate);
const angularSpec = tarball ? `file:${candidate}` : requested;
const temporary = await mkdtemp(join(tmpdir(), 'neural-icons-consumer-'));
const run = (file, args) =>
  execFileSync(file, args, {
    cwd: temporary,
    encoding: 'utf8',
    maxBuffer: 20_000_000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

let success = false;
try {
  await mkdir(join(temporary, 'src'));
  const packageJson = {
    name: 'neural-icons-registry-consumer',
    version: '0.0.0',
    private: true,
    type: 'module',
    dependencies: {
      '@angular/common': '22.1.6',
      '@angular/compiler': '22.1.6',
      '@angular/core': '22.1.6',
      '@angular/platform-browser': '22.1.6',
      '@angular/platform-server': '22.1.6',
      '@angular/router': '22.1.6',
      '@angular/ssr': '22.1.6',
      '@neural-icons/core': '0.0.1-next.0',
      '@neural-icons/angular': angularSpec,
      rxjs: '~7.8.0',
      tslib: '^2.3.0',
    },
    devDependencies: {
      '@angular/build': '22.1.6',
      '@angular/cli': '22.1.6',
      '@angular/compiler-cli': '22.1.6',
      '@types/node': '^24.0.0',
      typescript: '6.0.3',
    },
  };
  await writeFile(
    join(temporary, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );
  await writeFile(
    join(temporary, 'angular.json'),
    JSON.stringify(
      {
        $schema: './node_modules/@angular/cli/lib/config/schema.json',
        version: 1,
        projects: {
          consumer: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: {
                  outputPath: 'dist/consumer',
                  browser: 'src/main.ts',
                  index: 'src/index.html',
                  tsConfig: 'tsconfig.json',
                  server: 'src/main.server.ts',
                  ssr: { entry: 'src/server.ts' },
                  prerender: false,
                  outputMode: 'server',
                },
                configurations: { production: { optimization: true } },
                defaultConfiguration: 'production',
              },
            },
          },
        },
      },
      null,
      2,
    ),
  );
  await writeFile(
    join(temporary, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'preserve',
          moduleResolution: 'bundler',
          strict: true,
          experimentalDecorators: true,
          skipLibCheck: false,
          types: ['node'],
        },
        angularCompilerOptions: {
          strictTemplates: true,
          strictInjectionParameters: true,
        },
        include: ['src/**/*.ts'],
      },
      null,
      2,
    ),
  );
  for (const file of [
    'app.ts',
    'main.ts',
    'main.server.ts',
    'server.ts',
    'index.html',
  ]) {
    await copyFile(join(fixture, file), join(temporary, 'src', file));
  }

  run('npm', ['install', '--no-audit', '--no-fund']);
  const installed = JSON.parse(
    run('npm', [
      'ls',
      '@neural-icons/core',
      '@neural-icons/angular',
      '--depth=0',
      '--json',
    ]),
  );
  assert.equal(
    installed.dependencies['@neural-icons/core'].version,
    '0.0.1-next.0',
  );
  assert.equal(
    installed.dependencies['@neural-icons/angular'].version,
    '0.0.1-next.1',
  );

  run(join(temporary, 'node_modules/.bin/ng'), [
    'build',
    'consumer',
    '--configuration',
    'production',
  ]);
  assert(existsSync(join(temporary, 'dist/consumer/server/server.mjs')));
  const hydration = run(process.execPath, [
    join(root, 'tools/test-angular-hydration.mjs'),
    join(temporary, 'dist/consumer'),
  ]);
  assert(hydration.includes('SSR/hydration passed'));
  const matrix = JSON.parse(
    run(process.execPath, [
      join(root, 'tools/verify-name-tree-shaking.mjs'),
      temporary,
    ]),
  );
  console.log(
    JSON.stringify(
      {
        source: tarball
          ? 'angular-tarball-and-published-core'
          : 'npm-registry-only',
        angular: installed.dependencies['@neural-icons/angular'].version,
        core: installed.dependencies['@neural-icons/core'].version,
        aotProductionBuild: true,
        chromiumHydration: true,
        zoneless: true,
        matrix,
      },
      null,
      2,
    ),
  );
  success = true;
} catch (error) {
  console.error(`Consumer retained for diagnosis: ${temporary}`);
  throw error;
} finally {
  if (success) await rm(temporary, { recursive: true, force: true });
}
