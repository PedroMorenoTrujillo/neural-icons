import { test, expect } from '@playwright/test';

test('renders and filters the icon catalog', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Neural Icons',
  );
  await expect(page.locator('article.card')).toHaveCount(48);
  await page.getByRole('searchbox').fill('alert');
  await expect(page.locator('article.card')).toHaveCount(2);
});
