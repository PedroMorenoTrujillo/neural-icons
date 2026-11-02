import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { DEPLOYMENT_BRANCH, VERCEL_PROJECT_ID, VERCEL_TEAM_ID, PROJECTS, REPOSITORY, verifyProductionTarget, verifyManifests, verifyRegistryManifest, verifyArchive } from './release-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const manifests = Object.fromEntries(PROJECTS.map(name => [name, JSON.parse(readFileSync(resolve(root, 'packages', name, 'package.json'), 'utf8'))]));
const version = manifests.core.version;
verifyManifests(manifests, version);
verifyProductionTarget(version, process.env.VERCEL_ORG_ID || VERCEL_TEAM_ID, process.env.VERCEL_PROJECT_ID || VERCEL_PROJECT_ID);
assert.equal(process.env.VERCEL_GIT_COMMIT_REF, DEPLOYMENT_BRANCH);
assert.equal(process.env.VERCEL_ENV, 'production');
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
assert.equal(process.env.VERCEL_GIT_COMMIT_SHA, commit);
execFileSync('git', ['diff', '--quiet', 'HEAD', '--', 'apps', 'packages', 'tools', 'package.json', 'package-lock.json'], { cwd: root });
const packages = [];
// CI already compared these immutable registry archives with this exact source
// before promoting deploy/icons. Reverify their public bytes during the host build.
for (const project of PROJECTS) {
  const name = `@neural-icons/${project}`;
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, { signal: AbortSignal.timeout(20_000) });
  assert.equal(response.status, 200);
  const packument = await response.json();
  assert.equal(packument['dist-tags']?.latest, version, 'Refusing a stale or unpublished website version');
  const metadata = packument.versions?.[version];
  assert.equal(metadata?.name, name);
  assert.match(metadata.dist?.integrity || '', /^sha512-[A-Za-z0-9+/]+=*$/);
  const archiveUrl = verifyRegistryManifest(metadata, { name, version, integrity: metadata.dist.integrity });
  const archive = await fetch(archiveUrl, { signal: AbortSignal.timeout(30_000) });
  assert.equal(archive.status, 200);
  const bytes = Buffer.from(await archive.arrayBuffer());
  const artifact = { name, version, file: `neural-icons-${project}-${version}.tgz`, sha256: createHash('sha256').update(bytes).digest('hex'), integrity: metadata.dist.integrity };
  verifyArchive(bytes, artifact);
  packages.push(artifact);
}
const receipt = { repository: REPOSITORY, version, commit, project: VERCEL_PROJECT_ID, channel: 'latest', packages, registryVerified: true, provider: 'vercel', deploymentBranch: DEPLOYMENT_BRANCH };
for (const path of ['.vercel/output/static/release.json', '.vercel/output/functions/showcase.func/browser/release.json']) {
  writeFileSync(resolve(root, path), JSON.stringify(receipt, null, 2) + '\n');
}
console.log(`Vercel receipt bound to source ${commit} and all four verified public npm archives`);
