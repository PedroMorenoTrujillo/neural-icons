import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { DEPLOYMENT_BRANCH, VERCEL_PROJECT_ID, verifyWebsiteActor } from './release-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const release = JSON.parse(readFileSync(resolve(root, 'dist/release/registry-verified.json'), 'utf8'));
verifyWebsiteActor(process.env, release.version);
assert.equal(release.registryVerified, true);
assert.equal(release.project, VERCEL_PROJECT_ID);
assert.equal(release.commit, git(['rev-parse', 'HEAD']));
git(['fetch', 'origin', 'main', DEPLOYMENT_BRANCH]);
git(['merge-base', '--is-ancestor', 'HEAD', 'origin/main']);
// Never force-push or overwrite a newer website publication.
git(['merge-base', '--is-ancestor', `origin/${DEPLOYMENT_BRANCH}`, 'HEAD']);
git(['push', 'origin', `HEAD:refs/heads/${DEPLOYMENT_BRANCH}`]);
console.log(`Promoted verified ${release.version} source ${release.commit} to the existing Vercel project's ${DEPLOYMENT_BRANCH} branch`);
