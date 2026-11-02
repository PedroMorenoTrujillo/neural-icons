import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { generateReleaseVersion } from './generate-release-version.mjs';
import {
  PROJECTS,
  REPOSITORY,
  PAGES_PROJECT,
  compareReleases,
  verifyManifests,
  verifyReleaseActor,
  verifyArchive,
  verifyRegistryManifest,
} from './release-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const directory = resolve(root, 'dist/release');
const manifestPath = resolve(directory, 'icons-release.json');
const git = (args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const npm = (args) =>
  execFileSync('npm', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });

function readRelease() {
  const release = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.equal(release.repository, REPOSITORY);
  assert.equal(release.commit, git(['rev-parse', 'HEAD']));
  assert.equal(release.packages.length, PROJECTS.length);
  const source = Object.fromEntries(
    PROJECTS.map((project) => [
      project,
      JSON.parse(
        readFileSync(
          resolve(root, 'packages', project, 'package.json'),
          'utf8',
        ),
      ),
    ]),
  );
  verifyManifests(source, release.version);
  for (const [index, artifact] of release.packages.entries()) {
    assert.equal(artifact.name, `@neural-icons/${PROJECTS[index]}`);
    assert.equal(artifact.version, release.version);
    assert.equal(artifact.file, basename(artifact.file));
    verifyArchive(readFileSync(resolve(directory, artifact.file)), artifact);
  }
  return release;
}

async function registry(artifact) {
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(artifact.name)}/${artifact.version}`,
    { signal: AbortSignal.timeout(20_000) },
  );
  if (response.status === 404) return false;
  assert.ok(response.ok, `Registry lookup failed: ${response.status}`);
  const metadata = await response.json();
  const url = verifyRegistryManifest(metadata, artifact);
  const archive = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  assert.ok(archive.ok, 'Published archive is not available');
  verifyArchive(Buffer.from(await archive.arrayBuffer()), artifact);
  return true;
}

async function waitForRegistry(artifact) {
  for (let attempt = 0; attempt < 24; attempt++) {
    if (await registry(artifact)) return;
    if (attempt < 23) await delay(15_000);
  }
  throw new Error(
    `${artifact.name}@${artifact.version} is not publicly available; no showcase deployment is allowed`,
  );
}

if (process.argv.includes('--identity')) {
  const version = verifyReleaseActor(process.env);
  assert.equal(generateReleaseVersion(true), version);
  git(['merge-base', '--is-ancestor', 'HEAD', 'origin/main']);
  console.log(`Verified owner-triggered release: core@${version}`);
} else if (process.argv.includes('--prepare')) {
  const version = generateReleaseVersion(true);
  const source = Object.fromEntries(
    PROJECTS.map((project) => [
      project,
      JSON.parse(
        readFileSync(
          resolve(root, 'packages', project, 'package.json'),
          'utf8',
        ),
      ),
    ]),
  );
  verifyManifests(source, version);
  if (process.env.GITHUB_REF_TYPE === 'tag') {
    assert.equal(process.env.GITHUB_REF_NAME, `core@${version}`);
    git(['merge-base', '--is-ancestor', 'HEAD', 'origin/main']);
  }
  mkdirSync(directory, { recursive: true });
  const packages = PROJECTS.map((project) => {
    const compiled = resolve(root, 'dist/packages', project);
    const manifest = JSON.parse(
      readFileSync(resolve(compiled, 'package.json'), 'utf8'),
    );
    verifyManifests({ ...source, [project]: manifest }, version);
    const [pack] = JSON.parse(
      npm([
        'pack',
        compiled,
        '--json',
        '--pack-destination',
        directory,
        '--ignore-scripts',
      ]),
    );
    const bytes = readFileSync(resolve(directory, pack.filename));
    return {
      name: manifest.name,
      version,
      file: pack.filename,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}`,
    };
  });
  const release = {
    repository: REPOSITORY,
    version,
    commit: git(['rev-parse', 'HEAD']),
    project: PAGES_PROJECT,
    channel: version.includes('-') ? 'next' : 'latest',
    packages,
  };
  writeFileSync(manifestPath, JSON.stringify(release, null, 2) + '\n');
  console.log(`Prepared four immutable npm archives for core@${version}`);
} else if (process.argv.includes('--publish')) {
  const version = verifyReleaseActor(process.env);
  git(['merge-base', '--is-ancestor', 'HEAD', 'origin/main']);
  const release = readRelease();
  assert.equal(release.version, version);
  for (const artifact of release.packages) {
    const tags = await fetch(
      `https://registry.npmjs.org/-/package/${encodeURIComponent(artifact.name)}/dist-tags`,
      { signal: AbortSignal.timeout(20_000) },
    );
    if (tags.ok) {
      const current = (await tags.json())[release.channel];
      if (current)
        assert.ok(
          compareReleases(version, current) >= 0,
          'Refusing to move an npm channel or the showcase backwards',
        );
    } else assert.equal(tags.status, 404);
    if (!(await registry(artifact))) {
      npm([
        'publish',
        resolve(directory, artifact.file),
        '--access',
        'public',
        '--tag',
        release.channel,
        '--provenance',
        '--registry=https://registry.npmjs.org/',
      ]);
    }
    await waitForRegistry(artifact);
    console.log(
      `Verified public archive: ${artifact.name}@${artifact.version}`,
    );
  }
  writeFileSync(
    resolve(directory, 'registry-verified.json'),
    JSON.stringify(
      {
        ...release,
        registryVerified: true,
        workflowRun: process.env.GITHUB_RUN_ID,
      },
      null,
      2,
    ) + '\n',
  );
} else if (process.argv.includes('--verify-registry')) {
  const release = readRelease();
  for (const artifact of release.packages) await waitForRegistry(artifact);
  console.log(
    `All four npm archives match the verified candidate ${release.version}`,
  );
} else throw new Error('Use --prepare, --publish or --verify-registry');
