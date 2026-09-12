import { test, expect } from '@playwright/test';

test('serves SVGs before JavaScript and preserves those nodes during hydration', async ({
  page,
  request,
}) => {
  const response = await request.get('/');
  const html = await response.text();
  expect(response.ok()).toBe(true);
  expect(html).toContain('ngh=');
  expect(html.match(/<article\b/g)).toHaveLength(200);
  expect(html).toContain('data-neural-icon="search"');

  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  let allowScripts!: () => void;
  const scriptsAllowed = new Promise<void>((resolve) => {
    allowScripts = resolve;
  });
  await page.route(/\.js(?:\?|$)/, async (route) => {
    await scriptsAllowed;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.locator('article.card')).toHaveCount(200);
    await page.evaluate(() => {
      Object.assign(window, {
        serverIconNodes: Array.from(
          document.querySelectorAll('neural-icon svg'),
        ),
      });
    });
  } finally {
    allowScripts();
  }
  // Retry interaction until the application is bootstrapped, without relying
  // on debug APIs that production Angular does not expose.
  await expect(async () => {
    await page.getByRole('searchbox').fill('');
    await page.getByRole('searchbox').fill('alert');
    await expect(page.locator('article.card')).toHaveCount(3);
  }).toPass({ timeout: 15_000 });
  expect(
    await page.evaluate(() => {
      const original = (window as unknown as { serverIconNodes: SVGElement[] })
        .serverIconNodes;
      const current = Array.from(document.querySelectorAll('neural-icon svg'));
      return current.every((svg) => original.includes(svg as SVGElement));
    }),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test('renders and filters the icon catalog', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Neural Icons',
  );
  await expect(page.locator('article.card')).toHaveCount(200);
  await page.getByRole('searchbox').fill('alert');
  await expect(page.locator('article.card')).toHaveCount(3);
});
