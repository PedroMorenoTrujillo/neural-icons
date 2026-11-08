import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const packages = ['core', 'angular', 'react', 'vue'];
const versions = Object.fromEntries(
  packages.map((name) => [
    name,
    JSON.parse(readFileSync(resolve(root, 'packages', name, 'package.json'), 'utf8'))
      .version,
  ]),
);

function acceptsCoreVersion(range) {
  if (range === versions.core) return true;
  const minimum = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(range ?? '');
  const current = /^(\d+)\.(\d+)\.(\d+)$/.exec(versions.core);
  if (!minimum || !current || Number(minimum[1]) < 1) return false;
  if (minimum[1] !== current[1]) return false;
  const [, , minMinor, minPatch] = minimum.map(Number);
  const [, , currentMinor, currentPatch] = current.map(Number);
  return (
    currentMinor > minMinor ||
    (currentMinor === minMinor && currentPatch >= minPatch)
  );
}

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
  assert.equal(pack.version, versions[name]);
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
    assert.equal(files.filter((file) => file.endsWith('.svg')).length, 536);
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
    assert.ok(
      acceptsCoreVersion(manifest.dependencies?.['@neural-icons/core']),
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
    `${pack.name}@${versions[name]}: ${files.length} packed files, MIT, compiled entries and declarations verified`,
  );
}
