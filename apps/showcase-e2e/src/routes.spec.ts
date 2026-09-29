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
  {
    path: '/?icon=shopping-cart',
    lang: 'en',
    heading: 'shopping-cart',
    title: 'shopping-cart',
  },
  {
    path: '/?icon=shopping-cart&lang=es',
    lang: 'es',
    heading: 'shopping-cart',
    title: 'shopping-cart',
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

test('new families have indexable SSR metadata and real catalog links', async ({
  request,
}) => {
  const detail = await request.get('/?icon=shopping-cart&lang=es');
  expect(detail.ok()).toBe(true);
  const html = await detail.text();
  expect(html).toContain('shopping-cart: Comercio · carrito, comprar.');
  expect(html).toMatch(/<meta name="robots" content="index, follow"/);
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0] ?? '';
  expect(canonical).toContain('https://');
  expect(canonical).toContain('?icon=shopping-cart');
  expect(canonical).toContain('lang=es');
  const catalog = await request.get('/?lang=es');
  expect(await catalog.text()).toContain('href="/?icon=shopping-cart&amp;lang=es"');
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

for (const width of [1280, 900, 390, 320]) {
  test(`icon detail stays within its panel at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/?icon=arrow-down&lang=es&framework=vue');
    await expect(page.locator('.detail-panel')).toBeVisible();
    const layout = await page.evaluate(() => {
      const panel = document.querySelector<HTMLElement>('.detail-panel');
      const codeBlocks = Array.from(
        panel?.querySelectorAll<HTMLElement>('.code-section pre') ?? [],
      );
      return {
        panelOverflow: (panel?.scrollWidth ?? 0) - (panel?.clientWidth ?? 0),
        pageOverflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        codeOverflow: Math.max(
          0,
          ...codeBlocks.map((code) => code.scrollWidth - code.clientWidth),
        ),
      };
    });
    expect(layout.panelOverflow).toBeLessThanOrEqual(1);
    expect(layout.pageOverflow).toBeLessThanOrEqual(1);
    expect(layout.codeOverflow).toBeLessThanOrEqual(1);
  });
}

test('detail close is an accessible X and the purple swatch remains visible', async ({
  page,
}) => {
  await page.goto('/?lang=es');
  await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
  await page.goto('/?icon=arrow-down&lang=es');
  const close = page.getByRole('button', { name: 'Cerrar' });
  await expect(close).toHaveText('×');
  const purpleSwatch = page.getByRole('button', {
    name: 'Color de muestra #8b5cf6',
  });
  await expect(purpleSwatch).toHaveCSS('background-color', 'rgb(139, 92, 246)');
  await purpleSwatch.click();
  await expect(purpleSwatch).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.large-preview')).toHaveCSS('--preview-ink', '#8b5cf6');
  await close.click();
  await expect(page.locator('.detail-panel')).toHaveCount(0);
});

test('detail guidance and code follow the selected technology', async ({
  page,
}) => {
  await page.goto('/?icon=search&lang=es');
  const note = page.locator('.detail-panel .a11y-note');
  const tabs = page.locator('.detail-panel .framework-tabs');
  await expect(note).toContainText('<img alt="">');
  await expect(note).not.toContainText('Angular');
  await tabs.getByRole('button', { name: 'Angular' }).click();
  await expect(note).toContainText('[label]');
  await expect(note).not.toContainText('React');
  await tabs.getByRole('button', { name: 'React' }).click();
  await expect(note).toContainText('En React');
  await expect(note).toContainText('aria-labelledby');
  await expect(note).not.toContainText('[label]');
  await tabs.getByRole('button', { name: 'Vue' }).click();
  await expect(note).toContainText('En plantillas Vue');
  await expect(note).not.toContainText('Angular');
  await expect(page.locator('.code-section pre').first()).toHaveCSS(
    'background-color',
    'rgb(14, 23, 38)',
  );
  await expect(page.locator('.code-section pre').last()).toHaveCSS(
    'background-color',
    'rgb(14, 23, 38)',
  );
});

test('guide opens in HTML and omits private repository links', async ({ page }) => {
  await page.goto('/?icon=wand&framework=react&lang=es');
  await page.locator('.primary-nav').getByRole('link', { name: 'Primeros pasos' }).click();
  await expect(
    page.locator('.installation-tabs').getByRole('button', { name: 'HTML' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page).not.toHaveURL(/framework=/);
  await expect(page.locator('.about-section a')).toHaveCount(0);
  await expect(page.locator('.about-section')).toHaveCSS('border-top-width', '0px');
});

test('catalog never retains a framework query outside guide or icon detail', async ({ page }) => {
  await page.goto('/?lang=es&framework=angular');
  await expect(page.getByRole('heading', { name: 'Encuentra tu icono.' })).toBeVisible();
  await expect(page).not.toHaveURL(/framework=/);

  await page.locator('.primary-nav').getByRole('link', { name: 'Primeros pasos' }).click();
  await page.locator('.installation-tabs').getByRole('button', { name: 'Angular' }).click();
  await expect(page).toHaveURL(/framework=angular/);

  await page.locator('.primary-nav').getByRole('link', { name: 'Iconos' }).click();
  await expect(page).not.toHaveURL(/framework=/);
  await page.goBack();
  await expect(page).toHaveURL(/framework=angular/);
  await page.goForward();
  await expect(page).not.toHaveURL(/framework=/);
});

test('SVG download is separated from its code block', async ({ page }) => {
  await page.goto('/?icon=wand');
  const margin = await page.locator('.code-section a[download]').evaluate((link) =>
    Number.parseFloat(window.getComputedStyle(link).marginTop),
  );
  expect(margin).toBeGreaterThanOrEqual(12);
});

test('reopening the detail resets usage to HTML', async ({ page }) => {
  await page.goto('/?icon=search&lang=es&framework=vue');
  await expect(
    page.locator('.detail-panel .framework-tabs').getByRole('button', {
      name: 'Vue',
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await expect(page).not.toHaveURL(/framework=/);
  await page.locator('#family-search').click();
  await expect(
    page.locator('.detail-panel .framework-tabs').getByRole('button', {
      name: 'HTML',
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.detail-panel .a11y-note')).toContainText(
    '<img alt="">',
  );
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

test('header surfaces span the viewport while controls keep the content width', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto('/?lang=es');
  const layout = await page.evaluate(() => {
    const rect = (selector: string) =>
      document.querySelector<HTMLElement>(selector)?.getBoundingClientRect();
    const masthead = rect('.masthead');
    const nav = rect('.primary-nav');
    const shell = rect('.shell');
    const brand = rect('.identity');
    const actions = rect('.header-actions');
    return {
      mastheadWidth: masthead?.width,
      navWidth: nav?.width,
      brandInset: (brand?.left ?? 0) - (shell?.left ?? 0),
      actionsInset: (shell?.right ?? 0) - (actions?.right ?? 0),
    };
  });
  expect(layout.mastheadWidth).toBe(1920);
  expect(layout.navWidth).toBe(1920);
  expect(layout.brandInset).toBeCloseTo(32, 0);
  expect(layout.actionsInset).toBeCloseTo(32, 0);
});

for (const width of [390, 820, 1280]) {
  test(`guide code wraps instead of scrolling horizontally at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/?view=guide&lang=es');
    const overflow = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      blocks: Array.from(document.querySelectorAll<HTMLElement>('.installation-step pre, .usage pre'))
        .map((block) => block.scrollWidth - block.clientWidth),
    }));
    expect(overflow.page).toBeLessThanOrEqual(1);
    expect(Math.max(...overflow.blocks)).toBeLessThanOrEqual(1);
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
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain('?icon=search');
  expect(sitemapXml).toContain('?icon=shopping-cart');
  expect(sitemapXml).toContain('?icon=hash');
  expect(sitemapXml.match(/<url>/g)).toHaveLength(504);
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
      'Core y Vue 1.1.0 están publicados en npm con la etiqueta latest',
    );
    await expect(page.locator('.installation-step').first().locator('code')).toContainText(
      'npm install @neural-icons/core@latest @neural-icons/vue@latest',
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
