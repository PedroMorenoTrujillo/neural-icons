import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export const PROJECTS = ['core', 'angular', 'react', 'vue'];
export const REPOSITORY = 'PedroMorenoTrujillo/neural-icons';
export const OWNER = 'PedroMorenoTrujillo';
export const VERCEL_PROJECT_ID = 'prj_YRhAzLJ7xoNXOPS6KE5GVj2V5ZpE';
export const VERCEL_TEAM_ID = 'team_5yMmfudZR826vI2MXwbYfXUY';
export const DEPLOYMENT_BRANCH = 'deploy/icons';

export function releaseVersion(value) {
  assert.equal(typeof value, 'string');
  assert.match(
    value,
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/,
  );
  for (const part of value.split('-')[0].split('.'))
    assert.ok(
      Number.isSafeInteger(Number(part)),
      'Version component is too large',
    );
  for (const part of value.split('-').slice(1).join('-').split('.')) {
    assert.ok(!/^0\d+$/.test(part), 'Invalid numeric prerelease identifier');
  }
  return value;
}

export function compareReleases(left, right) {
  releaseVersion(left);
  releaseVersion(right);
  const parse = (value) => {
    const dash = value.indexOf('-');
    return {
      numbers: (dash < 0 ? value : value.slice(0, dash)).split('.').map(Number),
      prerelease: dash < 0 ? [] : value.slice(dash + 1).split('.'),
    };
  };
  const a = parse(left),
    b = parse(right);
  for (let i = 0; i < 3; i++)
    if (a.numbers[i] !== b.numbers[i])
      return Math.sign(a.numbers[i] - b.numbers[i]);
  if (!a.prerelease.length || !b.prerelease.length)
    return a.prerelease.length ? -1 : b.prerelease.length ? 1 : 0;
  for (let i = 0; i < Math.max(a.prerelease.length, b.prerelease.length); i++) {
    const x = a.prerelease[i],
      y = b.prerelease[i];
    if (x === y) continue;
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const nx = /^\d+$/.test(x),
      ny = /^\d+$/.test(y);
    if (nx && ny) return BigInt(x) < BigInt(y) ? -1 : 1;
    if (nx !== ny) return nx ? -1 : 1;
    return x < y ? -1 : 1;
  }
  return 0;
}

export function verifyManifests(manifests, version) {
  releaseVersion(version);
  for (const project of PROJECTS) {
    const manifest = manifests[project];
    assert.equal(manifest?.name, `@neural-icons/${project}`);
    assert.equal(
      manifest.version,
      version,
      `${project}: run npm run release:prepare -- ${version}`,
    );
    assert.ok(!manifest.private, `${project}: private package`);
    if (project !== 'core') {
      const range = manifest.dependencies?.['@neural-icons/core'];
      assert.ok(
        range === version ||
          (!version.includes('-') && range === `^${version}`),
        `${project}: Core dependency must target this release`,
      );
    }
  }
}

export function verifyReleaseActor(env) {
  assert.equal(
    env.GITHUB_ACTIONS,
    'true',
    'Publication is restricted to GitHub Actions',
  );
  assert.equal(env.GITHUB_REPOSITORY, REPOSITORY);
  assert.equal(env.GITHUB_ACTOR, OWNER);
  assert.equal(env.GITHUB_TRIGGERING_ACTOR, OWNER);
  assert.ok(['push', 'workflow_dispatch'].includes(env.GITHUB_EVENT_NAME));
  assert.equal(env.GITHUB_REF_TYPE, 'tag');
  const match = /^core@(.+)$/.exec(env.GITHUB_REF_NAME || '');
  assert.ok(match, 'Only a Core tag can publish the four packages');
  const version = releaseVersion(match[1]);
  assert.equal(env.GITHUB_REF, `refs/tags/core@${version}`);
  return version;
}

export function verifyArchive(bytes, artifact) {
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    artifact.sha256,
    'Archive SHA256 mismatch',
  );
  assert.equal(
    `sha512-${createHash('sha512').update(bytes).digest('base64')}`,
    artifact.integrity,
    'Archive integrity mismatch',
  );
}

export function verifyRegistryManifest(metadata, artifact) {
  assert.equal(metadata.name, artifact.name);
  assert.equal(metadata.version, artifact.version);
  assert.equal(
    metadata.dist?.integrity,
    artifact.integrity,
    'Published version contains a different archive; never overwrite or skip it',
  );
  const url = new URL(metadata.dist.tarball);
  assert.equal(url.origin, 'https://registry.npmjs.org');
  const project = artifact.name.split('/')[1];
  assert.equal(
    url.pathname,
    `/@neural-icons/${project}/-/${project}-${artifact.version}.tgz`,
  );
  return url.href;
}

export function verifyProductionTarget(version, account, project) {
  releaseVersion(version);
  assert.ok(
    !version.includes('-'),
    'Prereleases cannot replace the production showcase',
  );
  assert.equal(account, VERCEL_TEAM_ID);
  assert.equal(project, VERCEL_PROJECT_ID);
}

export function verifyWebsiteActor(env, version) {
  releaseVersion(version);
  assert.ok(!version.includes('-'), 'Only stable packages can deploy the public website');
  assert.equal(env.GITHUB_ACTIONS, 'true');
  assert.equal(env.GITHUB_REPOSITORY, REPOSITORY);
  assert.equal(env.GITHUB_ACTOR, OWNER);
  assert.equal(env.GITHUB_TRIGGERING_ACTOR, OWNER);
  if (env.GITHUB_REF_TYPE === 'tag') assert.equal(verifyReleaseActor(env), version);
  else {
    assert.equal(env.GITHUB_EVENT_NAME, 'workflow_dispatch');
    assert.equal(env.GITHUB_REF, 'refs/heads/main');
  }
}
