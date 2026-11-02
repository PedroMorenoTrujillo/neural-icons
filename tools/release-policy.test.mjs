import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import {
  PROJECTS,
  REPOSITORY,
  OWNER,
  VERCEL_TEAM_ID,
  VERCEL_PROJECT_ID,
  verifyWebsiteActor,
  releaseVersion,
  compareReleases,
  verifyManifests,
  verifyReleaseActor,
  verifyArchive,
  verifyRegistryManifest,
  verifyProductionTarget,
} from './release-policy.mjs';

const env = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: REPOSITORY,
  GITHUB_ACTOR: OWNER,
  GITHUB_TRIGGERING_ACTOR: OWNER,
  GITHUB_EVENT_NAME: 'push',
  GITHUB_REF_TYPE: 'tag',
  GITHUB_REF_NAME: 'core@1.2.3',
  GITHUB_REF: 'refs/tags/core@1.2.3',
};
const manifests = () =>
  Object.fromEntries(
    PROJECTS.map((project) => [
      project,
      {
        name: `@neural-icons/${project}`,
        version: '1.2.3',
        ...(project === 'core'
          ? {}
          : { dependencies: { '@neural-icons/core': '1.2.3' } }),
      },
    ]),
  );

test('only Pedro can publish a Core tag from the official repository, including reruns', () => {
  assert.equal(verifyReleaseActor(env), '1.2.3');
  for (const change of [
    { GITHUB_ACTOR: 'contributor' },
    { GITHUB_TRIGGERING_ACTOR: 'contributor' },
    { GITHUB_ACTOR: 'github-actions[bot]' },
    { GITHUB_REPOSITORY: 'attacker/neural-icons' },
    { GITHUB_EVENT_NAME: 'pull_request' },
    { GITHUB_EVENT_NAME: 'pull_request_target' },
    { GITHUB_EVENT_NAME: 'workflow_run' },
    { GITHUB_REF_TYPE: 'branch' },
    { GITHUB_REF_NAME: 'react@1.2.3' },
    { GITHUB_REF: 'refs/heads/main' },
  ])
    assert.throws(() => verifyReleaseActor({ ...env, ...change }));
});

test('a release cannot mix versions or another Neural package', () => {
  verifyManifests(manifests(), '1.2.3');
  for (const project of PROJECTS) {
    const source = manifests();
    source[project].version = '1.2.2';
    assert.throws(() => verifyManifests(source, '1.2.3'));
  }
  const source = manifests();
  source.core.name = '@neural-ui/core';
  assert.throws(() => verifyManifests(source, '1.2.3'));
  const oldDependency = manifests();
  oldDependency.vue.dependencies['@neural-icons/core'] = '^1.1.0';
  assert.throws(() => verifyManifests(oldDependency, '1.2.3'));
});

test('invalid versions cannot become tag names, paths or commands', () => {
  for (const version of ['1.2.3', '1.2.3-next.2'])
    assert.equal(releaseVersion(version), version);
  for (const version of [
    'latest',
    '^1.2.3',
    '01.2.3',
    '1.2.3-next.01',
    '../1.2.3',
    '1.2.3;command',
    '1.2.3\n',
  ])
    assert.throws(() => releaseVersion(version));
});

test('stable and prerelease ordering cannot silently downgrade a channel', () => {
  for (const [older, newer] of [
    ['1.2.9', '1.2.10'],
    ['1.2.3-next.2', '1.2.3-next.10'],
    ['1.2.3-next.10', '1.2.3'],
    ['1.2.3', '2.0.0'],
    ['1.2.3-alpha', '1.2.3-beta'],
  ]) {
    assert.equal(compareReleases(older, newer), -1);
    assert.equal(compareReleases(newer, older), 1);
    assert.equal(compareReleases(older, older), 0);
  }
});

test('an existing registry version can only be reused when the exact verified archive matches', () => {
  const bytes = Buffer.from('verified package');
  const artifact = {
    name: '@neural-icons/core',
    version: '1.2.3',
    sha256: createHash('sha256').update(bytes).digest('hex'),
    integrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}`,
  };
  const metadata = {
    name: artifact.name,
    version: artifact.version,
    dist: {
      integrity: artifact.integrity,
      tarball: 'https://registry.npmjs.org/@neural-icons/core/-/core-1.2.3.tgz',
    },
  };
  verifyArchive(bytes, artifact);
  verifyRegistryManifest(metadata, artifact);
  assert.throws(() => verifyArchive(Buffer.from('tampered'), artifact));
  assert.throws(() =>
    verifyRegistryManifest(
      { ...metadata, dist: { ...metadata.dist, integrity: 'sha512-other' } },
      artifact,
    ),
  );
  assert.throws(() =>
    verifyRegistryManifest(
      {
        ...metadata,
        dist: { ...metadata.dist, tarball: 'https://attacker.test/pkg.tgz' },
      },
      artifact,
    ),
  );
});

test('a prerelease or a v1/v2 showcase target cannot replace Icons production', () => {
  verifyProductionTarget('1.2.3', VERCEL_TEAM_ID, VERCEL_PROJECT_ID);
  assert.throws(() =>
    verifyProductionTarget('1.2.3-next.1', VERCEL_TEAM_ID, VERCEL_PROJECT_ID),
  );
  assert.throws(() =>
    verifyProductionTarget('1.2.3', 'another-account', VERCEL_PROJECT_ID),
  );
  for (const project of [
    'neuralicons',
    'neuraluicomponents',
    'neuraluicomponents-v2',
  ])
    assert.throws(() => verifyProductionTarget('1.2.3', VERCEL_TEAM_ID, project));
});

test('only the owner can promote a stable verified Core tag or manually rebuild main on Vercel', () => {
  verifyWebsiteActor(env, '1.2.3');
  const manual = { ...env, GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_REF_TYPE: 'branch', GITHUB_REF: 'refs/heads/main' };
  verifyWebsiteActor(manual, '1.2.3');
  for (const change of [{ GITHUB_ACTOR: 'contributor' }, { GITHUB_TRIGGERING_ACTOR: 'contributor' }, { GITHUB_REPOSITORY: 'fork/neural-icons' }, { GITHUB_EVENT_NAME: 'pull_request' }, { GITHUB_REF: 'refs/heads/feature' }]) assert.throws(() => verifyWebsiteActor({ ...manual, ...change }, '1.2.3'));
  assert.throws(() => verifyWebsiteActor(manual, '1.2.3-beta.1'));
});
