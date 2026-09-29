import { expect, test } from '@playwright/test';

test('SSR renders the full family catalog and hydration preserves SVG nodes', async ({
  page,
  request,
}) => {
  const response = await request.get('/');
  const html = await response.text();
  expect(response.ok()).toBe(true);
  expect(html).toContain('ngh=');
  expect(html.match(/class="family-tile"/g)).toHaveLength(250);
  expect(html).toContain('250 icon families');
  expect(html).not.toContain('class="preview-label"');
  expect(html).not.toContain('id="family-attach"');
  expect(html).not.toContain('id="family-funnel"');

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
    await expect(page.locator('.family-tile')).toHaveCount(250);
    await page.evaluate(() => {
      Object.assign(window, {
        serverIconNodes: Array.from(
          document.querySelectorAll('.tile-preview neural-icon svg'),
        ),
      });
    });
  } finally {
    allowScripts();
  }

  await expect(async () => {
    await page.getByRole('searchbox', { name: 'Search icons' }).fill('alert');
    await expect(page.locator('.family-tile')).toHaveCount(4);
  }).toPass({ timeout: 15_000 });
  expect(
    await page.evaluate(() => {
      const original = (window as unknown as { serverIconNodes: SVGElement[] })
        .serverIconNodes;
      const current = Array.from(
        document.querySelectorAll('.tile-preview neural-icon svg'),
      );
      return current.every((svg) => original.includes(svg as SVGElement));
    }),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test('search, approved aliases, category, empty state and variant preview', async ({
  page,
}) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search icons' });
  await expect(page.locator('.family-tile')).toHaveCount(250);
  await search.fill('attach');
  await expect(page.locator('.tile-name')).toHaveText('paperclip');
  await search.fill('funnel');
  await expect(page.locator('.tile-name')).toHaveText('filter');
  await search.fill('file');
  await page
    .getByRole('group', { name: 'Filter by category' })
    .getByRole('button', { name: 'File' })
    .click();
  await expect(page.locator('.family-tile')).not.toHaveCount(0);
  await expect(async () => {
    expect(await page.locator('.tile-preview neural-icon').count()).toBe(
      await page.locator('.family-tile').count(),
    );
  }).toPass();
  await search.fill('not-an-icon');
  await expect(page.getByText('No matching icons')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toHaveValue('');
});

test('detail, snippets, copy, deep link, history and keyboard close', async ({
  page,
  context,
  browserName,
}) => {
  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  } else {
    // Firefox/WebKit do not expose Playwright's clipboard permissions.
    // Keep the copy interaction observable without changing the app behavior.
    await page.addInitScript(() => {
      let copiedText = '';
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            copiedText = text;
          },
          readText: async () => copiedText,
        },
      });
    });
  }
  await page.goto('/?icon=file-text');
  await expect(page.getByRole('heading', { name: 'file-text' })).toBeVisible();
  await expect(page.locator('.size-sample')).toHaveCount(4);
  await expect(page.locator('.size-sample neural-icon')).toHaveCount(4);
  await expect(page.locator('.code-section').first()).toContainText(
    '/icons/file-text.svg',
  );
  await page
    .getByRole('button', { name: 'Filled', exact: true })
    .last()
    .click();
  await expect(page.locator('.large-preview neural-icon')).toHaveAttribute(
    'data-neural-icon',
    'file-text-filled',
  );
  await expect(page.locator('.code-section').first()).toContainText(
    '/icons/file-text-filled.svg',
  );
  await page
    .getByRole('group', { name: 'Technology for installation and use' })
    .last()
    .getByRole('button', { name: 'React' })
    .click();
  await expect(page.locator('.snippet')).toContainText(
    '<NeuIcon icon={iconFileTextFilled}',
  );
  await page
    .getByRole('group', { name: 'Technology for installation and use' })
    .last()
    .getByRole('button', { name: 'Vue' })
    .click();
  await expect(page.locator('.snippet')).toContainText(
    ':icon="iconFileTextFilled"',
  );
  await page
    .getByRole('group', { name: 'Technology for installation and use' })
    .last()
    .getByRole('button', { name: 'Angular' })
    .click();
  await expect(page.locator('.snippet')).toContainText(
    '<neural-icon [icon]="iconFileTextFilled"',
  );
  await page.getByRole('button', { name: 'Copy name' }).click();
  await expect(page.getByRole('status').last()).toContainText('Name copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'file-text',
  );

  await page.keyboard.press('Escape');
  await expect(page.locator('.detail-panel')).toHaveCount(0);
  await expect(page).not.toHaveURL(/icon=/);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'file-text' })).toBeVisible();
});

test('mobile and dark theme retain a usable catalog and detail', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('app-root')).toHaveClass(/theme-dark/);
  await page.getByRole('link', { name: 'Inspect paperclip' }).click();
  await expect(page.locator('.detail-panel')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeFocused();
  await expect(page.locator('.catalog-column')).toHaveAttribute('inert', '');
  await page.keyboard.press('Shift+Tab');
  await expect(
    page.getByRole('button', { name: 'Copy snippet' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('.detail-panel')).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test('certified families retain their distinct canonical SVG paths', async ({
  page,
}) => {
  await page.goto('/');
  for (const name of [
    'file',
    'file-text',
    'login',
    'logout',
    'group',
    'users',
    'paperclip',
    'filter',
  ]) {
    const tile = page.locator(`#family-${name}`);
    await expect(tile).toHaveCount(1);
    await expect(tile.locator('neural-icon')).toHaveCount(1);
  }
  await expect(
    page.locator('neural-icon[data-neural-icon="file-text"] svg path'),
  ).toHaveAttribute('d', /M8\.5 11h7M12 11v7/);
  await expect(
    page.locator('neural-icon[data-neural-icon="login"] svg path'),
  ).toHaveAttribute('d', /M20 12H9M13 8l-4 4 4 4/);
});
