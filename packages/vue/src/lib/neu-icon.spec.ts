import { createApp, createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import type { NeuralIconDefinition } from '@neural-icons/core';
import { neuralIcons } from '@neural-icons/core/catalog';
import { iconSearch } from '@neural-icons/core/icons/search';
import { iconSearchFilled } from '@neural-icons/core/icons/search-filled';
import { NeuIcon } from '../index.js';

async function markup(
  icon: NeuralIconDefinition,
  attrs: Record<string, unknown> = {},
): Promise<string> {
  return renderToString(
    createSSRApp({ render: () => h(NeuIcon, { icon, ...attrs }) }),
  );
}

function svg(markupText: string): SVGSVGElement {
  const container = document.createElement('div');
  container.innerHTML = markupText;
  const node = container.querySelector('svg');
  if (!node) throw new Error('Expected an SVG element');
  return node;
}

describe('NeuIcon', () => {
  it('renders outline Core geometry with decorative semantics', async () => {
    const node = svg(await markup(iconSearch));
    expect(node.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(node.getAttribute('width')).toBe('1em');
    expect(node.getAttribute('height')).toBe('1em');
    expect(node.getAttribute('fill')).toBe('none');
    expect(node.getAttribute('stroke')).toBe('currentColor');
    expect(node.getAttribute('stroke-width')).toBe('1.75');
    expect(node.getAttribute('aria-hidden')).toBe('true');
    expect(node.hasAttribute('role')).toBe(false);
    expect(node.querySelector('path')?.getAttribute('d')).toBe(
      iconSearch.paths[0],
    );
  });

  it('renders filled geometry with the exact Core fill policy', async () => {
    const node = svg(await markup(iconSearchFilled));
    expect(node.getAttribute('fill')).toBe('currentColor');
    expect(node.getAttribute('stroke')).toBe('none');
    expect(node.getAttribute('stroke-width')).toBe('2.24');
    expect(node.querySelector('path')?.getAttribute('d')).toBe(
      iconSearchFilled.paths.join(' '),
    );
  });

  it('passes through size, dimensions, class, style and ordinary SVG attrs', async () => {
    const node = svg(
      await markup(iconSearch, {
        size: 20,
        width: 32,
        class: 'test-icon',
        style: { color: 'rebeccapurple' },
        id: 'search-id',
        'data-testid': 'search',
      }),
    );
    expect(node.getAttribute('width')).toBe('32');
    expect(node.getAttribute('height')).toBe('20');
    expect(node.getAttribute('class')).toBe('test-icon');
    expect(node.style.color).toBe('rebeccapurple');
    expect(node.id).toBe('search-id');
    expect(node.getAttribute('data-testid')).toBe('search');
  });

  it('does not allow fallthrough attrs to override Core geometry or decorative semantics', async () => {
    const node = svg(
      await markup(iconSearch, {
        viewBox: '0 0 48 48',
        fill: 'red',
        stroke: 'green',
        role: 'presentation',
        'aria-hidden': 'false',
        'stroke-width': 8,
        strokeWidth: 9,
        strokeLinecap: 'square',
        fillRule: 'nonzero',
        innerHTML: '<circle cx="12" cy="12" r="12" />',
      }),
    );
    expect(node.getAttribute('viewBox')).toBe(iconSearch.viewBox);
    expect(node.getAttribute('fill')).toBe('none');
    expect(node.getAttribute('stroke')).toBe('currentColor');
    expect(node.getAttribute('stroke-width')).toBe('1.75');
    expect(node.getAttribute('stroke-linecap')).toBe('round');
    expect(node.getAttribute('fill-rule')).toBe('evenodd');
    expect(node.getAttribute('aria-hidden')).toBe('true');
    expect(node.hasAttribute('role')).toBe(false);
    expect(node.querySelector('circle')).toBeNull();
    expect(node.querySelector('path')).not.toBeNull();
  });

  it('uses aria-label and aria-labelledby without duplicating title announcements', async () => {
    const labelled = svg(
      await markup(iconSearch, {
        'aria-label': 'Search',
        title: 'Search icon',
      }),
    );
    const labelledBy = svg(
      await markup(iconSearch, {
        'aria-labelledby': 'search-label',
        title: 'Search icon',
      }),
    );
    expect(labelled.getAttribute('role')).toBe('img');
    expect(labelled.getAttribute('aria-label')).toBe('Search');
    expect(labelled.querySelector('title')).toBeNull();
    expect(labelled.hasAttribute('aria-hidden')).toBe(false);
    expect(labelledBy.getAttribute('aria-labelledby')).toBe('search-label');
    expect(labelledBy.querySelector('title')).toBeNull();
  });

  it('renders a deterministic title when title alone names the icon', async () => {
    const first = await markup(iconSearch, { title: 'Search' });
    expect(first).toBe(await markup(iconSearch, { title: 'Search' }));
    const node = svg(first);
    expect(node.querySelector('title')?.textContent).toBe('Search');
    expect(node.getAttribute('role')).toBe('img');
    expect(node.hasAttribute('aria-hidden')).toBe(false);
  });

  it('hydrates the same SVG node without a mismatch', async () => {
    const host = document.createElement('div');
    host.innerHTML = await markup(iconSearch, { 'aria-label': 'Search' });
    const before = host.querySelector('svg');
    const warnings: string[] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnings.push(args.map(String).join(' '));
    };
    try {
      const app = createSSRApp({
        render: () => h(NeuIcon, { icon: iconSearch, 'aria-label': 'Search' }),
      });
      app.mount(host);
      await nextTick();
      expect(host.querySelector('svg')).toBe(before);
      expect(warnings).toEqual([]);
      app.unmount();
    } finally {
      console.warn = originalWarn;
    }
  });

  it('mounts as a direct SVG without an imperative wrapper', async () => {
    const host = document.createElement('div');
    const app = createApp({ render: () => h(NeuIcon, { icon: iconSearch }) });
    app.mount(host);
    expect(host.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    app.unmount();
  });

  it('renders all 536 Core glyphs with unchanged paths', async () => {
    expect(neuralIcons).toHaveLength(536);
    for (const icon of neuralIcons) {
      const definition: NeuralIconDefinition = icon;
      const node = svg(await markup(definition));
      const expected =
        definition.variant === 'filled' &&
        definition.stroke !== 'currentColor' &&
        definition.paths.every((path) => path.trim().endsWith('z')) &&
        !definition.separatePaths
          ? [definition.paths.join(' ')]
          : definition.paths;
      expect(
        Array.from(node.querySelectorAll('path'), (path) =>
          path.getAttribute('d'),
        ),
      ).toEqual(expected);
      expect(node.getAttribute('viewBox')).toBe(definition.viewBox);
    }
  });
});
