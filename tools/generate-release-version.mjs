import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { releaseVersion } from './release-policy.mjs';

const root = resolve(import.meta.dirname, '..');
export function generateReleaseVersion(check = false) {
  const version = releaseVersion(
    JSON.parse(
      readFileSync(resolve(root, 'packages/core/package.json'), 'utf8'),
    ).version,
  );
  const output = resolve(root, 'apps/showcase/src/app/release-version.ts');
  const content = `// Generated from packages/core/package.json.\nexport const ICONS_VERSION = '${version}';\n`;
  if (check) {
    if (readFileSync(output, 'utf8') !== content)
      throw new Error('Showcase version is stale; run npm run release:version');
  } else writeFileSync(output, content);
  return version;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  generateReleaseVersion(process.argv.includes('--check'));
