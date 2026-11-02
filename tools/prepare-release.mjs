import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  releaseVersion,
  verifyManifests,
  compareReleases,
  PROJECTS,
} from './release-policy.mjs';
import { generateReleaseVersion } from './generate-release-version.mjs';

const root = resolve(import.meta.dirname, '..');
const version = releaseVersion(process.argv[2]);
const previous = JSON.parse(
  readFileSync(resolve(root, 'packages/core/package.json'), 'utf8'),
).version;
if (compareReleases(version, previous) < 0)
  throw new Error('Refusing to prepare an older Icons release');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (args) => execFileSync(npm, args, { cwd: root, stdio: 'inherit' });
run(['pkg', 'set', `version=${version}`, '--workspaces']);
for (const project of PROJECTS.slice(1)) {
  run([
    'pkg',
    'set',
    `dependencies.@neural-icons/core=${version}`,
    '--workspace',
    `@neural-icons/${project}`,
  ]);
}
run(['install', '--package-lock-only', '--ignore-scripts']);
const manifests = Object.fromEntries(
  PROJECTS.map((project) => [
    project,
    JSON.parse(
      readFileSync(resolve(root, 'packages', project, 'package.json'), 'utf8'),
    ),
  ]),
);
verifyManifests(manifests, version);
generateReleaseVersion();
console.log(
  `Prepared all four packages and the showcase for core@${version}. Commit and push the reviewed changes before creating that tag.`,
);
