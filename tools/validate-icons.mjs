import { readFile } from 'node:fs/promises';

const specs = JSON.parse(
  await readFile(new URL('../packages/core/icons/icons.json', import.meta.url)),
);
const errors = [];
const names = new Set();
const allowedCategories = new Set([
  'action',
  'communication',
  'file',
  'navigation',
  'status',
  'system',
]);
const pathCharacters = /^[0-9a-zA-Z.,+\-\s]+$/;

if (specs.length < 30 || specs.length > 500) {
  errors.push(
    `Expected a focused catalog of 30–500 icons, found ${specs.length}.`,
  );
}

for (const icon of specs) {
  if (!/^[a-z]+(?:-[a-z]+)*$/.test(icon.name)) {
    errors.push(`${icon.name}: names must be lowercase kebab-case.`);
  }
  if (names.has(icon.name)) errors.push(`${icon.name}: duplicate name.`);
  names.add(icon.name);
  if (!allowedCategories.has(icon.category)) {
    errors.push(`${icon.name}: unknown category ${icon.category}.`);
  }
  if (!Array.isArray(icon.tags) || icon.tags.length < 2) {
    errors.push(`${icon.name}: include at least two search tags.`);
  }
  if (
    icon.variant !== undefined &&
    !['outline', 'filled'].includes(icon.variant)
  ) {
    errors.push(`${icon.name}: variant must be outline or filled.`);
  }
  if (
    icon.stroke !== undefined &&
    !['none', 'currentColor'].includes(icon.stroke)
  ) {
    errors.push(`${icon.name}: stroke must be none or currentColor.`);
  }
  if (!Array.isArray(icon.paths) || icon.paths.length === 0) {
    errors.push(`${icon.name}: at least one path is required.`);
    continue;
  }
  for (const path of icon.paths) {
    if (
      !pathCharacters.test(path) ||
      /(?:script|style|url|href|on\w+=)/i.test(path)
    ) {
      errors.push(`${icon.name}: path contains forbidden content.`);
    }
  }

  if (icon.variant === 'filled' && icon.name.endsWith('-filled')) {
    const rootName = icon.name.replace(/-filled$/, '');
    if (['error', 'info', 'warning'].includes(rootName)) {
      const pathText = icon.paths.join(' ');
      if (!pathText.includes('z')) {
        errors.push(`${icon.name}: status cut-outs must use closed subpaths.`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${specs.length} original Neural icon specifications.`);
