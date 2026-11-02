import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import {
  ACCOUNT_ID,
  PAGES_PROJECT,
  REPOSITORY,
  verifyProductionTarget,
} from './release-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const built = resolve(root, 'dist/cloudflare');
const release = JSON.parse(
  readFileSync(
    resolve(
      root,
      'dist/release',
      process.argv.includes('--published') || process.argv.includes('--live')
        ? 'registry-verified.json'
        : 'icons-release.json',
    ),
    'utf8',
  ),
);
assert.equal(release.repository, REPOSITORY);
assert.equal(release.project, PAGES_PROJECT);
const baseline = JSON.parse(
  readFileSync(resolve(root, 'docs/deployment/published-urls.json'), 'utf8'),
);
assert.equal(baseline.origin, 'https://icons.neuralui.org');
const routes = [
  ...readFileSync(resolve(built, 'sitemap.xml'), 'utf8').matchAll(
    /<loc>([^<]+)<\/loc>/g,
  ),
].map((match) => match[1]);
for (const url of baseline.urls)
  assert.ok(routes.includes(url), `Published URL removed: ${url}`);
const page = (html, url) => {
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0];
  assert.ok(canonical?.includes(`href="${url}"`), `Changed canonical: ${url}`);
  assert.ok(
    html.match(/class="release-version"[^>]*>\s*v([^<]+)</)?.[1]?.trim() ===
      release.version,
    `Stale version: ${url}`,
  );
};
for (const url of routes)
  page(
    readFileSync(
      resolve(built, '.' + new URL(url).pathname, 'index.html'),
      'utf8',
    ),
    url,
  );

if (process.argv.includes('--published') || process.argv.includes('--live')) {
  verifyProductionTarget(
    release.version,
    process.env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID,
    process.env.CLOUDFLARE_PAGES_PROJECT || PAGES_PROJECT,
  );
  assert.equal(
    release.registryVerified,
    true,
    'The four npm packages must be verified before deployment',
  );
  for (const artifact of release.packages) {
    const response = await fetch(
      `https://registry.npmjs.org/-/package/${encodeURIComponent(artifact.name)}/dist-tags`,
      { signal: AbortSignal.timeout(20_000) },
    );
    assert.ok(response.ok);
    assert.equal(
      (await response.json()).latest,
      release.version,
      'A newer release exists; do not replace the showcase',
    );
  }
}
writeFileSync(
  resolve(built, 'release.json'),
  JSON.stringify(release, null, 2) + '\n',
);

if (process.argv.includes('--live')) {
  const origins = ['https://neuraliconsweb.pages.dev', baseline.origin];
  for (const origin of origins) {
    let verified = false;
    for (let attempt = 0; attempt < 18; attempt++) {
      try {
        const response = await fetch(
          `${origin}/release.json?run=${release.workflowRun}`,
          { cache: 'no-store', signal: AbortSignal.timeout(15_000) },
        );
        assert.ok(response.ok);
        const live = await response.json();
        for (const field of [
          'version',
          'commit',
          'repository',
          'project',
          'workflowRun',
          'registryVerified',
        ])
          assert.equal(live[field], release[field]);
        assert.deepEqual(live.packages, release.packages);
        verified = true;
        break;
      } catch (error) {
        if (attempt === 17) throw error;
        await delay(5_000);
      }
    }
    assert.ok(verified);
  }
  let index = 0;
  const concurrency = 6;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (index < baseline.urls.length) {
        const url = baseline.urls[index++];
        const response = await fetch(url, {
          redirect: 'manual',
          signal: AbortSignal.timeout(20_000),
        });
        assert.equal(
          response.status,
          200,
          `Published URL changed status: ${url}`,
        );
        page(await response.text(), url);
      }
    }),
  );
  console.log(
    `Verified the public release and all ${baseline.urls.length} existing URLs without redirects or canonical changes.`,
  );
} else
  console.log(
    `Verified ${routes.length} built pages; all ${baseline.urls.length} existing URLs and the release badge are preserved.`,
  );
