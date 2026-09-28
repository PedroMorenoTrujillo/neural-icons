import { readFile } from 'node:fs/promises';

const specs = JSON.parse(
  await readFile(new URL('../packages/core/icons/icons.json', import.meta.url)),
);
const errors = [];
const names = new Set();
const families = new Map();
const allowedFields = new Set([
  'name',
  'category',
  'tags',
  'variant',
  'stroke',
  'separatePaths',
  'paths',
]);
const allowedCategories = new Set([
  'action',
  'commerce',
  'communication',
  'file',
  'media',
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
  for (const field of Object.keys(icon)) {
    if (!allowedFields.has(field)) {
      errors.push(`${icon.name}: unsupported field ${field}.`);
    }
  }
  if (
    typeof icon.name !== 'string' ||
    !/^[a-z]+(?:-[a-z]+)*$/.test(icon.name)
  ) {
    errors.push(`${String(icon.name)}: names must be lowercase kebab-case.`);
    continue;
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
  const variant = icon.variant ?? 'outline';
  const family =
    variant === 'filled' ? icon.name.replace(/-filled$/, '') : icon.name;
  if (variant === 'filled' && !icon.name.endsWith('-filled')) {
    errors.push(`${icon.name}: filled names must end in -filled.`);
  }
  if (variant === 'outline' && icon.name.endsWith('-filled')) {
    errors.push(`${icon.name}: outline names cannot end in -filled.`);
  }
  const pair = families.get(family) ?? {};
  if (pair[variant]) {
    errors.push(`${icon.name}: duplicate ${variant} variant for ${family}.`);
  }
  pair[variant] = icon;
  families.set(family, pair);
  if (
    icon.stroke !== undefined &&
    !['none', 'currentColor'].includes(icon.stroke)
  ) {
    errors.push(`${icon.name}: stroke must be none or currentColor.`);
  }
  if (
    icon.separatePaths !== undefined &&
    (icon.variant !== 'filled' || icon.separatePaths !== true)
  ) {
    errors.push(`${icon.name}: separatePaths is only valid for filled icons.`);
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
  const svg = await readFile(
    new URL(`../packages/core/svg/${icon.name}.svg`, import.meta.url),
    'utf8',
  ).catch(() => null);
  if (!svg) {
    errors.push(`${icon.name}: generated SVG is missing.`);
  } else {
    if (
      !/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="24" height="24" viewBox="0 0 24 24" /.test(
        svg,
      )
    ) {
      errors.push(`${icon.name}: SVG canvas/viewBox conflicts with 24×24.`);
    }
    if (
      /<(?:script|style|image|foreignObject|use|animate|set|filter|mask|clipPath)\b|\b(?:href|id|on\w+|url\()\s*=/i.test(
        svg,
      ) ||
      /<(?!(?:svg|path|\/svg)\b)[^>]*>/i.test(svg)
    ) {
      errors.push(`${icon.name}: SVG contains forbidden markup or reference.`);
    }
    if (
      !/\bfill="(?:none|currentColor)"/.test(svg) ||
      !/\bstroke="(?:none|currentColor)"/.test(svg) ||
      /\b(?:fill|stroke)="(?:#[0-9a-fA-F]+|rgb|hsl)/.test(svg)
    ) {
      errors.push(`${icon.name}: SVG must use currentColor/none paint.`);
    }
    if (
      svg.match(/<path\b/g)?.length !== icon.paths.length &&
      !(
        icon.variant === 'filled' &&
        !icon.separatePaths &&
        icon.stroke !== 'currentColor' &&
        icon.paths.every((path) => path.trim().endsWith('z'))
      )
    ) {
      errors.push(`${icon.name}: SVG path count differs from the source.`);
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

for (const [family, pair] of families) {
  if (!pair.outline || !pair.filled) {
    errors.push(`${family}: outline/filled pair is incomplete.`);
    continue;
  }
  if (pair.outline.category !== pair.filled.category) {
    errors.push(`${family}: variants must share a category.`);
  }
  if (
    JSON.stringify(pair.outline.tags) !==
    JSON.stringify(pair.filled.tags.filter((tag) => tag !== 'filled'))
  ) {
    errors.push(`${family}: variants must share search tags.`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${specs.length} original Neural icon specifications.`);
