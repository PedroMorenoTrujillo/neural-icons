import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { App } from './app';

describe('Neural Icons public showcase', () => {
  beforeEach(async () => {
    vi.stubGlobal('scrollTo', () => undefined);
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    window.history.replaceState({}, '', '/');
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
    vi.unstubAllGlobals();
  });

  async function render() {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  function required<T extends Element>(root: HTMLElement, selector: string): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing test element: ${selector}`);
    return element;
  }

  async function search(root: HTMLElement, value: string) {
    const input = required<HTMLInputElement>(root, '#icon-search');
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await TestBed.inject(ApplicationRef).whenStable();
  }

  it('shows one glyph per family and keeps the full catalog count', async () => {
    const { root } = await render();
    expect(root.querySelectorAll('.family-tile')).toHaveLength(250);
    expect(root.querySelectorAll('.tile-preview neural-icon')).toHaveLength(
      250,
    );
    expect(root.querySelector('.masthead .primary-nav')).toBeNull();
    expect(root.querySelector('.preview-label')).toBeNull();
    expect(root.querySelector('.family-tile#family-attach')).toBeNull();
    expect(root.querySelector('.family-tile#family-funnel')).toBeNull();
    expect(root.querySelector('.brand-mark')?.getAttribute('src')).toBe('favicon.svg');
    expect(root.querySelector('.brand-mark')?.textContent).toBe('');
  });

  it('pairs installation with standalone usage for each framework', async () => {
    const { fixture, root } = await render();
    expect(root.querySelector('.catalog-column.guide-view')).toBeNull();
    expect(root.querySelector('.catalog-intro a')?.getAttribute('href')).toBe(
      '/?view=guide',
    );
    required<HTMLAnchorElement>(
      root,
      '.primary-nav a[href="/?view=guide"]',
    ).click();
    await fixture.whenStable();
    const installation = required<HTMLElement>(root, '#installation');
    expect(root.querySelector('.catalog-column.guide-view')).not.toBeNull();
    expect(installation?.textContent).toContain('250 families');
    expect(installation?.querySelectorAll('.installation-step')).toHaveLength(
      4,
    );

    const tabs = installation.querySelectorAll<HTMLButtonElement>(
      '.installation-tabs button',
    );
    expect([...tabs].map((tab) => tab.textContent?.trim())).toEqual([
      'HTML',
      'Angular',
      'React',
      'Vue',
    ]);
    expect(tabs[0].getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('.installation-lead')?.textContent).toContain(
      'plain HTML',
    );
    expect(root.querySelector('.installation-status')?.textContent).toContain(
      'current npm release still has 197',
    );
    expect(
      root.querySelector('.installation-status')?.textContent,
    ).not.toContain('React');
    expect(root.querySelector('.installation-step')?.textContent).toContain(
      'No package is needed',
    );
    expect(root.querySelector('.installation-step code')?.textContent).toBe(
      '/icons/search.svg',
    );
    expect(installation.textContent).not.toContain('npm install @');
    expect(root.querySelector('#usage code')?.textContent).toContain(
      '<img src="/icons/search.svg" alt="Search" width="24" height="24">',
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      'insert the SVG inline',
    );
    expect(root.querySelector('#color code')?.textContent).toContain(
      'class="brand-icon"',
    );
    expect(root.querySelector('#color')?.textContent).toContain(
      'does not inherit CSS color',
    );

    tabs[1].click();
    await fixture.whenStable();
    expect(installation.querySelector('.installation-step:first-child code')?.textContent).toBe(
      'npm install @neural-icons/core@latest @neural-icons/angular@latest',
    );
    expect(root.querySelector('.installation-lead')?.textContent).toContain(
      'In Angular',
    );
    expect(root.querySelector('.installation-status')?.textContent).toContain(
      'Core and Angular are on npm under the latest tag',
    );
    expect(root.querySelector('.installation-step')?.textContent).toContain(
      'Install the latest Core and Angular packages',
    );
    expect(root.querySelector('.installation-step h3')?.textContent).toBe(
      'Install for Angular',
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      "import { iconSearch } from '@neural-icons/core/icons/search';",
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      'pass the definition to [icon]',
    );
    expect(root.querySelector('#color')?.textContent).toContain(
      'NeuralIcon renders an inline SVG',
    );
    expect(root.querySelector('#color')?.textContent).not.toContain('<img>');

    tabs[2].click();
    await fixture.whenStable();
    expect(installation.querySelector('.installation-step:first-child code')?.textContent).toBe(
      'npm install @neural-icons/core@latest @neural-icons/react@latest',
    );
    expect(root.querySelector('.installation-status')?.textContent).toContain(
      'Core and React are on npm under the latest tag',
    );
    expect(root.querySelector('.installation-step')?.textContent).toContain(
      'Install the latest Core and React packages',
    );
    expect(root.querySelector('.installation-step h3')?.textContent).toContain(
      'Install for React',
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      '<NeuIcon icon={iconSearch} size={24} />',
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      'icon prop of NeuIcon',
    );
    tabs[3].click();
    await fixture.whenStable();
    expect(installation.querySelector('.installation-step:first-child code')?.textContent).toBe(
      'npm install @neural-icons/core@latest @neural-icons/vue@latest',
    );
    expect(root.querySelector('.installation-status')?.textContent).toContain(
      'Core and Vue are on npm under the latest tag',
    );
    expect(root.querySelector('#usage h3')?.textContent).toBe(
      'Use an icon in Vue',
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      '<NeuIcon :icon="iconSearch" :size="24" />',
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      'Import iconSearch in <script setup>',
    );
    expect(root.querySelector('#color')?.textContent).toContain(
      'This fragment uses iconSearch from the example above',
    );
    expect(root.querySelector('#installation')?.textContent).toContain(
      'In a Vue template, NeuIcon is decorative by default',
    );
    expect(root.querySelector('.usage.about-section a')).toBeNull();
    required<HTMLAnchorElement>(root, '.primary-nav a[href="/"]').click();
    await fixture.whenStable();
    required<HTMLAnchorElement>(
      root,
      '.primary-nav a[href="/?view=guide"]',
    ).click();
    await fixture.whenStable();
    expect(
      root
        .querySelector('.installation-tabs button')
        ?.getAttribute('aria-pressed'),
    ).toBe('true');
    expect(window.location.search).not.toContain('framework=');
  });

  it('offers the whole guide and catalog interface in Spanish', async () => {
    const { fixture, root } = await render();
    const languageButton = required<HTMLButtonElement>(
      root,
      '.language-button',
    );
    languageButton.click();
    await fixture.whenStable();

    expect(document.documentElement.lang).toBe('es');
    expect(window.location.search).toContain('lang=es');
    expect(root.querySelector('#catalog-heading')?.textContent).toBe(
      'Encuentra tu icono.',
    );
    root.querySelectorAll<HTMLAnchorElement>('.primary-nav a')[1].click();
    await fixture.whenStable();
    expect(root.querySelector('#installation-heading')?.textContent).toBe(
      'Instalación y uso',
    );
    expect(root.querySelector('#color')?.textContent).toContain(
      'cualquier color CSS válido',
    );

    const htmlTab = root.querySelectorAll<HTMLButtonElement>(
      '.installation-tabs button',
    )[0];
    htmlTab.click();
    await fixture.whenStable();
    expect(root.querySelector('#installation')?.textContent).toContain(
      'No necesitas instalar un paquete',
    );
    expect(root.querySelector('.installation-step h3')?.textContent).toBe(
      'Preparar el archivo SVG',
    );
    expect(root.querySelector('.installation-step code')?.textContent).toBe(
      '/icons/search.svg',
    );
    expect(root.querySelector('.installation-status')?.textContent).toContain(
      'La versión actual de npm aún tiene 197',
    );
    expect(
      root.querySelector('.installation-status')?.textContent,
    ).not.toContain('React');
    expect(root.querySelector('#usage code')?.textContent).toContain(
      'alt="Buscar"',
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      'Muestra el archivo copiado con <img>',
    );

    root
      .querySelectorAll<HTMLButtonElement>('.installation-tabs button')[1]
      .click();
    await fixture.whenStable();
    expect(root.querySelector('.installation-lead')?.textContent).toContain(
      'En Angular',
    );
    expect(root.querySelector('#usage')?.textContent).toContain(
      'pasa la definición a [icon]',
    );
    expect(root.querySelector('#color')?.textContent).toContain(
      'Este fragmento usa iconSearch del ejemplo anterior',
    );

    root.querySelectorAll<HTMLAnchorElement>('.primary-nav a')[0].click();
    await fixture.whenStable();
    await search(root, 'comunicación');
    expect(root.querySelectorAll('.family-tile').length).toBeGreaterThan(0);
    languageButton.click();
    await fixture.whenStable();
    expect(document.documentElement.lang).toBe('en');
    expect(window.location.search).not.toContain('lang=es');
  });

  it('provides the selected SVG asset and an inline HTML example for each variant', async () => {
    const { fixture, root } = await render();
    required<HTMLAnchorElement>(root, '#family-file-text').click();
    await fixture.whenStable();

    const htmlTab = [
      ...root.querySelectorAll<HTMLButtonElement>('.framework-tabs button'),
    ].find((button) => button.textContent?.trim() === 'HTML');
    if (!htmlTab) throw new Error('Missing HTML example tab');
    expect(htmlTab).toBe(root.querySelector('.framework-tabs button'));
    expect(htmlTab.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('.code-section code')?.textContent).toBe(
      '/icons/file-text.svg',
    );
    const outline = root.querySelector('.snippet code')?.textContent ?? '';
    expect(outline).toContain('class="brand-icon"');
    expect(outline).toContain('fill="none"');
    expect(outline).toContain('currentColor');
    expect(outline).not.toContain('@neural-icons/angular');

    const filled = [
      ...root.querySelectorAll<HTMLButtonElement>(
        '.detail-variant-switch button',
      ),
    ].find((button) => button.textContent?.trim() === 'Filled');
    if (!filled) throw new Error('Missing filled variant control');
    filled.click();
    await fixture.whenStable();
    expect(root.querySelector('.code-section code')?.textContent).toBe(
      '/icons/file-text-filled.svg',
    );
    const filledSnippet =
      root.querySelector('.snippet code')?.textContent ?? '';
    expect(filledSnippet).toContain('fill="currentColor"');
    expect(filledSnippet).not.toBe(outline);
  });

  it('explains arbitrary CSS colors and identifies preview swatches as examples', async () => {
    const { fixture, root } = await render();
    root.querySelectorAll<HTMLAnchorElement>('.primary-nav a')[1].click();
    await fixture.whenStable();
    const guide = root.querySelector('#color');
    expect(guide?.textContent).toContain('Any valid CSS color works');
    expect(guide?.textContent).toContain('currentColor');
    expect(guide?.textContent).toContain('not a fixed palette');

    root.querySelectorAll<HTMLAnchorElement>('.primary-nav a')[0].click();
    await fixture.whenStable();
    required<HTMLButtonElement>(root, '#family-search').click();
    await fixture.whenStable();
    expect(root.querySelector('.color-section')?.textContent).toContain(
      'use any CSS color',
    );
  });

  it('finds canonical families from approved aliases and category', async () => {
    const { root } = await render();
    await search(root, 'attach');
    expect(root.querySelectorAll('.family-tile')).toHaveLength(1);
    expect(root.querySelector('.tile-name')?.textContent).toBe('paperclip');
    await search(root, 'funnel');
    expect(root.querySelectorAll('.family-tile')).toHaveLength(1);
    expect(root.querySelector('.tile-name')?.textContent).toBe('filter');
    await search(root, 'does-not-exist');
    expect(root.querySelector('.empty-state')).not.toBeNull();
  });

  it('keeps the grid singular and compares variants in the detail panel', async () => {
    const { fixture, root } = await render();
    expect(root.querySelectorAll('.tile-preview neural-icon')).toHaveLength(
      250,
    );
    expect(
      root
        .querySelector('#family-file-text neural-icon')
        ?.getAttribute('data-neural-icon'),
    ).toBe('file-text');

    required<HTMLButtonElement>(root, '#family-file-text').click();
    await fixture.whenStable();
    expect(root.querySelector('#detail-heading')?.textContent).toBe(
      'file-text',
    );
    expect(window.location.search).toContain('icon=file-text');
    expect(root.querySelector('.detail-panel')).not.toBeNull();
    const filled = [
      ...root.querySelectorAll<HTMLButtonElement>(
        '.detail-variant-switch button',
      ),
    ].find((button) => button.textContent?.trim() === 'Filled');
    if (!filled) throw new Error('Missing filled variant control');
    filled.click();
    await fixture.whenStable();
    expect(
      root
        .querySelector('.large-preview neural-icon')
        ?.getAttribute('data-neural-icon'),
    ).toBe('file-text-filled');
  });
});
