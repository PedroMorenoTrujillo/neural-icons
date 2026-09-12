import { readFile, writeFile } from 'node:fs/promises';
import { svgPathProperties } from 'svg-path-properties';

const manifestPath = new URL(
  '../packages/core/icons/icons.json',
  import.meta.url,
);
const existing = JSON.parse(await readFile(manifestPath, 'utf8'));
const outlines = existing.filter(
  (icon) => icon.variant === undefined || icon.variant === 'outline',
);
const byName = new Map(existing.map((icon) => [icon.name, icon]));
const authoredNames = new Set([
  'home-filled',
  'heart-filled',
  'star-filled',
  'bell-filled',
  'user-filled',
  'check-filled',
  'warning-filled',
  'error-filled',
  'info-filled',
  'folder-filled',
  'file-filled',
]);

const round = (value) => Number(value.toFixed(2));

function strokeToFill(path, width = 2.5) {
  if (path.trim().endsWith('z')) return path;

  const properties = new svgPathProperties(path);
  const radius = width / 2;
  const polygons = [];

  for (const part of properties.getParts()) {
    if (!Number.isFinite(part.length) || part.length === 0) continue;
    if (part.length < 0.05) {
      const { x, y } = part.start;
      const points = Array.from({ length: 13 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 12;
        return `${round(x + Math.cos(angle) * radius)} ${round(
          y + Math.sin(angle) * radius,
        )}`;
      });
      polygons.push(`M${points.join(' L')} z`);
      continue;
    }
    const samples = Math.max(2, Math.ceil(part.length / 0.8));
    const points = Array.from({ length: samples + 1 }, (_, index) =>
      part.getPointAtLength((part.length * index) / samples),
    );
    const left = [];
    const right = [];
    for (let index = 0; index < points.length; index += 1) {
      const previous = points[Math.max(0, index - 1)];
      const next = points[Math.min(points.length - 1, index + 1)];
      const dx = next.x - previous.x;
      const dy = next.y - previous.y;
      const tangentLength = Math.hypot(dx, dy) || 1;
      const nx = -dy / tangentLength;
      const ny = dx / tangentLength;
      left.push([points[index].x + nx * radius, points[index].y + ny * radius]);
      right.push([
        points[index].x - nx * radius,
        points[index].y - ny * radius,
      ]);
    }
    const point = ([x, y]) => `${round(x)} ${round(y)}`;
    const commands = [`M${point(left[0])}`];
    left.slice(1).forEach((value) => commands.push(`L${point(value)}`));
    right.reverse().forEach((value) => commands.push(`L${point(value)}`));
    commands.push('z');
    polygons.push(commands.join(' '));
  }
  return polygons.join(' ') || path;
}

function createFilledPaths(paths) {
  return paths.flatMap((path) => [strokeToFill(path)]);
}

const filled = outlines.map((icon) => {
  const name = `${icon.name}-filled`;
  const existingFilled = byName.get(name);
  const hasAuthoredGeometry = existingFilled && authoredNames.has(name);
  if (hasAuthoredGeometry) return existingFilled;

  return {
    ...icon,
    name,
    tags: [...new Set([...icon.tags, 'filled'])],
    variant: 'filled',
    stroke: 'none',
    paths: createFilledPaths(icon.paths),
  };
});

const nonFilled = existing.filter((icon) => icon.variant !== 'filled');
const next = [...nonFilled, ...filled];

await writeFile(manifestPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Generated ${filled.length} filled icon specifications.`);
