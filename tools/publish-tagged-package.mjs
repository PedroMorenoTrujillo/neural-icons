import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(import.meta.dirname, '..');
const ref = process.env.GITHUB_REF_NAME ?? '';
const match =
  /^(core|angular|react|vue)@(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/.exec(ref);
assert(
  match,
  'Expected an independent Nx tag such as core@1.2.0 or vue@1.2.0-next.1',
);
const [, project, version] = match;
const manifestPath = resolve(root, 'dist/packages', project, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const source = JSON.parse(
  readFileSync(resolve(root, 'packages', project, 'package.json'), 'utf8'),
);
assert.equal(manifest.name, `@neural-icons/${project}`);
assert.equal(
  manifest.version,
  version,
  'Tag must match the compiled package version',
);
assert.equal(
  source.version,
  version,
  'Tag must match the source package version',
);
assert.equal(manifest.private, undefined, 'Do not publish a private package');
const distTag = version.includes('-') ? 'next' : 'latest';
console.log(
  `${ref}: ${manifest.name}@${version} from dist/packages/${project}, npm tag ${distTag}`,
);

if (process.argv.includes('--publish')) {
  assert.equal(
    process.env.GITHUB_ACTIONS,
    'true',
    'Publishing is restricted to GitHub Actions',
  );
  assert.equal(
    process.env.GITHUB_REF,
    `refs/tags/${ref}`,
    'Publishing requires a tag event',
  );
  assert.equal(
    process.env.GITHUB_REPOSITORY,
    'PedroMorenoTrujillo/neural-icons',
  );

  if (project !== 'core') {
    const core = JSON.parse(
      readFileSync(resolve(root, 'packages/core/package.json'), 'utf8'),
    );
    assert(
      manifest.dependencies?.['@neural-icons/core'],
      'Adapter must depend on Core',
    );
    // Independent tag jobs can start together; wait for Core to become available first.
    let available = false;
    for (let attempt = 0; attempt < 12; attempt++) {
      try {
        const published = JSON.parse(
          execFileSync(
            'npm',
            [
              'view',
              `@neural-icons/core@${core.version}`,
              'version',
              '--json',
              '--registry=https://registry.npmjs.org/',
            ],
            { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
          ),
        );
        available = published === core.version;
      } catch {
        available = false;
      }
      if (available) break;
      if (attempt < 11) await delay(15_000);
    }
    assert(
      available,
      `Publish @neural-icons/core@${core.version} before its adapters`,
    );
  }

  execFileSync(
    'npm',
    [
      'publish',
      resolve(root, 'dist/packages', project),
      '--access',
      'public',
      '--tag',
      distTag,
      '--registry=https://registry.npmjs.org/',
    ],
    { cwd: root, stdio: 'inherit' },
  );
} else {
  assert(
    process.argv.includes('--check'),
    'Use --check to validate without publishing',
  );
}
