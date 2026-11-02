import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const origin = 'https://icons.neuralui.org';
const { version } = JSON.parse(readFileSync(resolve(__dirname, '../../../packages/core/package.json'), 'utf8')) as { version: string };
const cases = [
  ['/', '/', 'Find your icon.'],
  ['/es/', '/es/', 'Encuentra tu icono.'],
  ['/guide/', '/guide/', 'Install and use'],
  ['/es/guide/', '/es/guide/', 'Instalación y uso'],
  ['/?lang=es', '/es/', 'Encuentra tu icono.'],
  ['/?view=guide', '/guide/', 'Install and use'],
  ['/?view=guide&lang=es', '/es/guide/', 'Instalación y uso'],
  ['/?icon=search', '/icon/search/', 'search'],
  ['/?icon=shopping-cart&lang=es', '/es/icon/shopping-cart/', 'shopping-cart'],
  ['/?icon=search&lang=es&variant=filled&framework=react', '/es/icon/search/', 'search'],
] as const;

for (const [path, canonicalPath, heading] of cases) {
  test(`anonymous public access: ${path}`, async ({ page, context }, testInfo) => {
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
    if (path.includes('variant=filled')) {
      await expect(page.locator('.large-preview neural-icon')).toHaveAttribute('data-neural-icon', 'search-filled');
      await expect(page.locator('.snippet')).toContainText('@neural-icons/react');
      expect(current.searchParams.get('variant')).toBe('filled');
      expect(current.searchParams.get('framework')).toBe('react');
    }
    if (path === '/es/' && testInfo.project.name === 'mobile-public') {
      await page.screenshot({ path: resolve(process.cwd(), 'test-results/public-access/icons-mobile.png') });
    }
  });
}
