import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const origin = 'https://icons.neuralui.org';
const { version } = JSON.parse(readFileSync(resolve(__dirname, '../../../packages/core/package.json'), 'utf8')) as { version: string };
const cases = [
  ['/', '/', 'Neural Icons'],
  ['/es/', '/es/', 'Neural Icons'],
  ['/icons/', '/icons/', 'Find your icon.'],
  ['/es/icons/', '/es/icons/', 'Encuentra tu icono.'],
  ['/guide/', '/guide/', 'Install and use'],
  ['/es/guide/', '/es/guide/', 'Instalación y uso'],
  ['/?lang=es', '/es/', 'Neural Icons'],
  ['/?view=guide', '/guide/', 'Install and use'],
  ['/?view=guide&lang=es', '/es/guide/', 'Instalación y uso'],
  ['/?icon=search', '/icon/search/', 'search'],
  ['/?icon=shopping-cart&lang=es', '/es/icon/shopping-cart/', 'shopping-cart'],
  ['/?icon=search&lang=es&variant=filled&framework=react', '/es/icon/search/', 'search'],
] as const;

for (const [path, canonicalPath, heading] of cases) {
  test(`anonymous public access: ${path}`, async ({ page, context }) => {
    expect(await context.cookies()).toEqual([]);
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    expect(response?.headers()['cf-mitigated']).toBeUndefined();
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + canonicalPath);
    await expect(page.locator('.release-version')).toHaveText('v' + version);
    await expect(page).not.toHaveTitle(/just a moment|access denied|authentication required|security checkpoint|checking your browser|not found/i);
    const current = new URL(page.url());
    expect(current.origin).toBe(origin);
    expect(current.hash).toBe('');
    // Existing query links may keep their address while rendering the canonical
    // view. Requiring an invented redirect would break this supported contract.

  });
}

test('legacy filled React view preserves query state', async ({ page }) => {
  await page.goto('/?icon=search&lang=es&variant=filled&framework=react');
  await expect(page.getByRole('heading', { name: 'search', exact: true })).toBeVisible();
  await expect(page.locator('.large-preview neural-icon')).toHaveAttribute('data-neural-icon', 'search-filled');
  await expect(page.locator('.snippet')).toContainText('@neural-icons/react');
  const current = new URL(page.url());
  expect(current.origin).toBe(origin);
  expect(current.searchParams.get('variant')).toBe('filled');
  expect(current.searchParams.get('framework')).toBe('react');
});

test('capture the published catalogue version', async ({ page }, testInfo) => {
  await page.goto('/es/icons/');
  await expect(page.locator('.release-version')).toHaveText('v' + version);
  await expect(page.getByRole('heading', { name: 'Encuentra tu icono.', exact: true })).toBeVisible();
  await page.screenshot({ path: resolve(process.cwd(), 'test-results/public-access/icons-' + testInfo.project.name + '.png') });
});
