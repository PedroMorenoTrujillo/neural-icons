import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { workspaceRoot } from '@nx/devkit';
import { expect, test } from '@playwright/test';

const specs = JSON.parse(
  readFileSync(resolve(workspaceRoot, 'packages/core/icons/icons.json'), 'utf8'),
) as Array<{ name: string; variant?: 'filled' }>;
const additions = specs.slice(394);

test('all 106 new SVG assets parse, render and stay within the 24px canvas', async ({
  page,
  request,
}) => {
  expect(additions).toHaveLength(106);
  await page.goto('/');
  const assets = await Promise.all(
    additions.map(async ({ name }) => {
      const response = await request.get(`/icons/${name}.svg`);
      expect(response.ok(), name).toBe(true);
      return { name, svg: await response.text() };
    }),
  );
  const issues = await page.evaluate((items) => {
    const problems: string[] = [];
    for (const { name, svg: source } of items) {
      const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
      if (parsed.querySelector('parsererror')) {
        problems.push(`${name}: malformed SVG`);
        continue;
      }
      const element = document.importNode(parsed.documentElement, true);
      element.setAttribute('style', 'position:absolute;left:-1000px;top:0');
      document.body.appendChild(element);
      const shapes = [...element.querySelectorAll('path')];
      if (!shapes.length) problems.push(`${name}: no paths`);
      for (const path of shapes) {
        const bounds = path.getBBox();
        const values = [bounds.x, bounds.y, bounds.width, bounds.height];
        if (
          values.some((value) => !Number.isFinite(value)) ||
          bounds.width <= 0 ||
          bounds.height <= 0 ||
          bounds.x < -0.05 ||
          bounds.y < -0.05 ||
          bounds.x + bounds.width > 24.05 ||
          bounds.y + bounds.height > 24.05
        ) {
          problems.push(
            `${name}: path bounds ${values.map((value) => value.toFixed(2)).join(', ')}`,
          );
        }
      }
      element.remove();
    }
    return problems;
  }, assets);
  expect(issues).toEqual([]);
});
