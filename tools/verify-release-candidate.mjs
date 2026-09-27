import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const version = '0.0.1-next.2';
const packages = ['core', 'angular', 'react', 'vue'];

for (const name of packages) {
  const directory = resolve(root, 'dist/packages', name);
  const manifest = JSON.parse(
    readFileSync(resolve(directory, 'package.json'), 'utf8'),
  );
  const project = JSON.parse(
    execFileSync(
      resolve(root, 'node_modules/.bin/nx'),
      ['show', 'project', name, '--json'],
      {
        cwd: root,
        encoding: 'utf8',
      },
    ),
  );
  const publishRoot =
    project.targets?.['nx-release-publish']?.options?.packageRoot;
  assert.equal(
    publishRoot,
    `dist/packages/${name}`,
    `${name}: publish root must be the compiled package`,
  );

  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', directory], {
      cwd: root,
      encoding: 'utf8',
    }),
  );
  const files = pack.files.map((file) => file.path);
  assert.equal(pack.name, `@neural-icons/${name}`);
  assert.equal(pack.version, version);
  assert.equal(manifest.license, 'MIT');
  assert.ok(
    manifest.repository && manifest.homepage && manifest.bugs,
    `${name}: missing discovery metadata`,
  );
  assert.ok(files.includes('LICENSE'), `${name}: LICENSE missing from tarball`);
  assert.ok(
    files.includes('README.md'),
    `${name}: README missing from tarball`,
  );
  assert.ok(files.includes('package.json'));
  assert.ok(
    files.some((file) => /\.(js|mjs)$/.test(file)),
    `${name}: compiled JS missing`,
  );
  assert.ok(
    files.some((file) => /\.d\.ts$/.test(file)),
    `${name}: declarations missing`,
  );
  assert.ok(
    files.every(
      (file) =>
        !/(?:\.spec\.|\.test\.|__tests__|fixtures?\/|\.tsbuildinfo$)/.test(
          file,
        ),
    ),
    `${name}: tests or build artifacts leaked`,
  );
  assert.ok(
    files.every((file) => !file.endsWith('.ts') || file.endsWith('.d.ts')),
    `${name}: TypeScript source leaked`,
  );
  assert.ok(
    files.every(
      (file) => !lstatSync(resolve(directory, file)).isSymbolicLink(),
    ),
    `${name}: symlink in tarball`,
  );

  if (name === 'core') {
    assert.equal(files.filter((file) => file.endsWith('.svg')).length, 394);
    for (const file of [
      'src/index.js',
      'src/index.d.ts',
      'src/icons/search.js',
      'src/icons/search-filled.js',
      'svg/search.svg',
    ]) {
      assert.ok(files.includes(file), `core: missing ${file}`);
    }
  } else {
    assert.equal(
      manifest.dependencies?.['@neural-icons/core'],
      version,
      `${name}: Core dependency mismatch`,
    );
    assert.equal(
      files.filter((file) => file.endsWith('.svg')).length,
      0,
      `${name}: duplicate Core assets`,
    );
  }

  const entrypoints = [
    manifest.main,
    manifest.module,
    manifest.types,
    manifest.typings,
  ].filter(Boolean);
  for (const entrypoint of entrypoints) {
    assert.ok(
      existsSync(resolve(directory, entrypoint)),
      `${name}: broken entrypoint ${entrypoint}`,
    );
  }
  console.log(
    `${pack.name}@${version}: ${files.length} packed files, MIT, compiled entries and declarations verified`,
  );
}
