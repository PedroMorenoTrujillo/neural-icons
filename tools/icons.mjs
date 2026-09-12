import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const specs = JSON.parse(
  await readFile(join(root, 'packages/core/icons/icons.json'), 'utf8'),
);
const check = process.argv.includes('--check');

const pascal = (name) =>
  name
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

const expected = new Map();

for (const icon of specs) {
  const exportName = `icon${pascal(icon.name)}`;
  const moduleSource = await format(
    `import { defineIcon } from '../lib/icon-definition.js';

export const ${exportName} = defineIcon(${JSON.stringify(icon, null, 2)});
`,
    { parser: 'typescript', singleQuote: true },
  );
  expected.set(`packages/core/src/icons/${icon.name}.ts`, moduleSource);

  const paths = icon.paths.map((path) => `  <path d="${path}"/>`).join('\n');
  const filled = icon.variant === 'filled';
  expected.set(
    `packages/core/svg/${icon.name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="${filled ? 'none' : 'currentColor'}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\n${paths}\n</svg>\n`,
  );
}

const imports = specs
  .map((icon) => {
    const exportName = `icon${pascal(icon.name)}`;
    return `import { ${exportName} } from './${icon.name}.js';`;
  })
  .join('\n');
const exports = specs
  .map(
    (icon) => `export { icon${pascal(icon.name)} } from './${icon.name}.js';`,
  )
  .join('\n');
const names = specs.map((icon) => `icon${pascal(icon.name)}`).join(',\n  ');
const indexSource = await format(
  `${imports}
import type { NeuralIconDefinition } from '../lib/icon-definition.js';

${exports}

export const neuralIcons = Object.freeze([
  ${names},
]) satisfies readonly NeuralIconDefinition[];

export type NeuralIconName = (typeof neuralIcons)[number]['name'];
`,
  { parser: 'typescript', singleQuote: true },
);
expected.set('packages/core/src/icons/index.ts', indexSource);

const table = specs
  .map(
    (icon) =>
      `| \`${icon.name}\` | ${icon.category} | ${icon.tags.join(', ')} |`,
  )
  .join('\n');
expected.set(
  'docs/icon-inventory.md',
  await format(
    `# Icon inventory\n\nGenerated from \`packages/core/icons/icons.json\`. Do not edit by hand.\n\n| Name | Category | Search tags |\n| --- | --- | --- |\n${table}\n\nTotal: **${specs.length} icons**.\n`,
    { parser: 'markdown' },
  ),
);

let failed = false;
// A removed/renamed spec must not leave an orphaned import or SVG in a package.
// Report these files rather than deleting potentially hand-authored work.
for (const directory of ['packages/core/src/icons', 'packages/core/svg']) {
  const files = await readdir(join(root, directory)).catch(() => []);
  for (const file of files) {
    if (!expected.has(`${directory}/${file}`)) {
      console.error(
        `Unexpected generated artifact; review and remove: ${directory}/${file}`,
      );
      failed = true;
    }
  }
}
for (const [relativePath, content] of expected) {
  const absolutePath = join(root, relativePath);
  if (check) {
    const current = await readFile(absolutePath, 'utf8').catch(() => null);
    if (current !== content) {
      console.error(`Out of date: ${relativePath}`);
      failed = true;
    }
  } else {
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content);
  }
}

if (failed) process.exit(1);
console.log(
  check
    ? `Verified ${expected.size} generated files.`
    : `Generated ${expected.size} files from ${specs.length} original icon specs.`,
);
