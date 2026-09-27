import { expect, test } from '@playwright/test';

test('records catalog load, grid and search costs without a synthetic benchmark claim', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.family-tile')).toHaveCount(197);
  const metrics = await page.evaluate(async () => {
    const navigation = performance.getEntriesByType('navigation')[0] as
      PerformanceNavigationTiming | undefined;
    const paints = performance.getEntriesByType('paint');
    const input = document.querySelector<HTMLInputElement>('#icon-search')!;
    const gridCount = document.querySelectorAll('.family-tile').length;
    const glyphCount = document.querySelectorAll(
      '.tile-preview neural-icon',
    ).length;
    const start = performance.now();
    input.value = 'file-text';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );
    return {
      domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? null,
      loadMs: navigation?.loadEventEnd ?? null,
      firstContentfulPaintMs:
        paints.find((entry) => entry.name === 'first-contentful-paint')
          ?.startTime ?? null,
      initialGridFamilies: gridCount,
      initialGridGlyphs: glyphCount,
      searchUpdateMs: performance.now() - start,
      filteredGridFamilies: document.querySelectorAll('.family-tile').length,
    };
  });

  expect(metrics.initialGridFamilies).toBe(197);
  expect(metrics.initialGridGlyphs).toBe(197);
  expect(metrics.filteredGridFamilies).toBe(1);
  console.log(`NI-05 exploratory Chromium timings: ${JSON.stringify(metrics)}`);
});
