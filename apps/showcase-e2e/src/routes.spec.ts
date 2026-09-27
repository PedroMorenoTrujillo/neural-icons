import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', lang: 'en', heading: 'Find your icon.', title: 'Icon catalog' },
  {
    path: '/?lang=es',
    lang: 'es',
    heading: 'Encuentra tu icono.',
    title: 'Catálogo de iconos',
  },
  {
    path: '/?view=guide',
    lang: 'en',
    heading: 'Install and use',
    title: 'Install and use',
  },
  {
    path: '/?view=guide&lang=es',
    lang: 'es',
    heading: 'Instalación y uso',
    title: 'Instalación y uso',
  },
  { path: '/?icon=search', lang: 'en', heading: 'search', title: 'search' },
  {
    path: '/?icon=search&lang=es',
    lang: 'es',
    heading: 'search',
    title: 'search',
  },
] as const;

for (const route of routes) {
  test(`SSR serves ${route.path} with route-specific content`, async ({
    request,
  }) => {
    const response = await request.get(route.path);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain(`<html lang="${route.lang}"`);
    expect(html).toContain(route.heading);
    expect(html).toContain(route.title);
    expect(html).toContain('property="og:title"');
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('hreflang="es"');
  });
}

test('guide SSR does not render the hidden catalog grid', async ({
  request,
}) => {
  const response = await request.get('/?view=guide&lang=es');
  const html = await response.text();
  expect(html).toContain('Instalación y uso');
  expect(html).not.toContain('class="family-tile"');
});

test('Spanish detail URLs preserve locale, variant and framework across reload', async ({
  page,
}) => {
  await page.goto('/?icon=search&lang=es&variant=filled&framework=react');
  await expect(page.getByRole('heading', { name: 'search' })).toBeVisible();
  await expect(page.locator('.large-preview neural-icon')).toHaveAttribute(
    'data-neural-icon',
    'search-filled',
  );
  await expect(page.locator('.snippet')).toContainText('@neural-icons/react');
  await page.reload();
  await expect(page.locator('.large-preview neural-icon')).toHaveAttribute(
    'data-neural-icon',
    'search-filled',
  );
  await expect(page.locator('.snippet')).toContainText('@neural-icons/react');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

for (const width of [1280, 1024, 900, 820, 769, 720, 640, 390, 358]) {
  test(`Spanish header has no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/?lang=es');
    await expect(
      page.getByRole('heading', { name: 'Neural Icons', exact: true }),
    ).toBeVisible();
    const layout = await page.evaluate(() => ({
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      offenders: Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .filter(
          (element) =>
            element.getBoundingClientRect().right > window.innerWidth + 1,
        )
        .slice(0, 8)
        .map(
          (element) =>
            `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 35)}:${Math.round(element.getBoundingClientRect().right)}`,
        ),
    }));
    expect(layout.overflow, layout.offenders.join(', ')).toBeLessThanOrEqual(1);
  });
}

test('robots, sitemap and SVG download are served by the production app', async ({
  request,
}) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Sitemap:');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('?icon=search');
  const svg = await request.get('/icons/search.svg');
  expect(svg.ok()).toBe(true);
  expect(await svg.text()).toContain('<svg');
  const favicon = await request.get('/favicon.svg');
  expect(favicon.ok()).toBe(true);
  expect(await favicon.text()).toContain('fav_grad_blue');
});

for (const width of [390, 358]) {
  test(`Spanish guide remains usable in dark mode at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 780 });
    await page.goto('/?view=guide&lang=es&framework=vue');
    await expect(
      page.getByRole('heading', { name: 'Instalación y uso' }),
    ).toBeVisible();
    await expect(page.locator('.installation-status')).toContainText(
      'Core y Vue 0.0.1-next.2 están publicados en npm',
    );
    await expect(page.locator('.installation-step').first().locator('code')).toContainText(
      'npm install @neural-icons/core@0.0.1-next.2 @neural-icons/vue@0.0.1-next.2',
    );
    await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
    await expect(page.locator('app-root')).toHaveClass(/theme-dark/);
    await page.reload();
    await expect(page.locator('app-root')).toHaveClass(/theme-dark/);
    await page
      .getByRole('group', { name: 'Tecnología para la instalación y el uso' })
      .getByRole('button', { name: 'HTML' })
      .click();
    await expect(page.locator('#installation')).toContainText(
      'Preparar el archivo SVG',
    );
    await expect(page.locator('#installation')).toContainText(
      'role="img" aria-label="Buscar"',
    );
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('tablet header tolerates enlarged text in Spanish', async ({ page }) => {
  await page.setViewportSize({ width: 769, height: 850 });
  await page.goto('/?lang=es');
  await page.addStyleTag({ content: 'html { font-size: 150%; }' });
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
