import { createRef } from 'react';
import { act } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import type { NeuralIconDefinition } from '@neural-icons/core';
import { neuralIcons } from '@neural-icons/core/catalog';
import { iconSearch } from '@neural-icons/core/icons/search';
import { iconSearchFilled } from '@neural-icons/core/icons/search-filled';
import { NeuIcon } from '../index.js';

function svg(markup: string): SVGSVGElement {
  const element = document.createElement('div');
  element.innerHTML = markup;
  const node = element.querySelector('svg');
  if (!node) throw new Error('Expected an SVG element');
  return node;
}

describe('NeuIcon', () => {
  it('renders Core geometry directly with decorative semantics', () => {
    const node = svg(renderToStaticMarkup(<NeuIcon icon={iconSearch} />));
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

  it('renders filled geometry with the same fill policy as Core SVG', () => {
    const node = svg(renderToStaticMarkup(<NeuIcon icon={iconSearchFilled} />));
    expect(node.getAttribute('fill')).toBe('currentColor');
    expect(node.getAttribute('stroke')).toBe('none');
    expect(node.getAttribute('stroke-width')).toBe('2.24');
    expect(node.querySelector('path')?.getAttribute('d')).toBe(
      iconSearchFilled.paths.join(' '),
    );
  });

  it('forwards size, dimensions, className, style and ordinary SVG props', () => {
    const node = svg(
      renderToStaticMarkup(
        <NeuIcon
          icon={iconSearch}
          size={20}
          width={32}
          className="test-icon"
          style={{ color: 'rebeccapurple' }}
          data-testid="search"
          id="search-id"
        />,
      ),
    );
    expect(node.getAttribute('width')).toBe('32');
    expect(node.getAttribute('height')).toBe('20');
    expect(node.getAttribute('class')).toBe('test-icon');
    expect(node.style.color).toBe('rebeccapurple');
    expect(node.getAttribute('data-testid')).toBe('search');
    expect(node.id).toBe('search-id');
  });

  it('uses aria-label as the accessible name', () => {
    const node = svg(
      renderToStaticMarkup(<NeuIcon icon={iconSearch} aria-label="Search" />),
    );
    expect(node.getAttribute('role')).toBe('img');
    expect(node.getAttribute('aria-label')).toBe('Search');
    expect(node.hasAttribute('aria-hidden')).toBe(false);
  });

  it('accepts an external aria-labelledby name without adding a duplicate title', () => {
    const node = svg(
      renderToStaticMarkup(
        <NeuIcon
          icon={iconSearch}
          aria-labelledby="search-label"
          title="Search"
        />,
      ),
    );
    expect(node.getAttribute('role')).toBe('img');
    expect(node.getAttribute('aria-labelledby')).toBe('search-label');
    expect(node.querySelector('title')).toBeNull();
    expect(node.hasAttribute('aria-hidden')).toBe(false);
  });

  it('renders a deterministic title only when it is the accessible name', () => {
    const named = svg(
      renderToString(<NeuIcon icon={iconSearch} title="Search" />),
    );
    const labelled = svg(
      renderToString(
        <NeuIcon icon={iconSearch} title="Search" aria-label="Find" />,
      ),
    );
    expect(named.querySelector('title')?.textContent).toBe('Search');
    expect(named.getAttribute('role')).toBe('img');
    expect(labelled.querySelector('title')).toBeNull();
    expect(labelled.getAttribute('aria-label')).toBe('Find');
  });

  it('passes ref directly to the SVG element', async () => {
    const host = document.createElement('div');
    const root = createRoot(host);
    const ref = createRef<SVGSVGElement>();
    await act(async () => {
      root.render(<NeuIcon icon={iconSearch} ref={ref} />);
    });
    expect(ref.current).toBe(host.querySelector('svg'));
    await act(async () => {
      root.unmount();
    });
  });

  it('hydrates the existing SVG without warnings or replacement', async () => {
    const host = document.createElement('div');
    host.innerHTML = renderToString(
      <NeuIcon icon={iconSearch} aria-label="Search" />,
    );
    const before = host.querySelector('svg');
    const errors: unknown[] = [];
    const root = await act(async () =>
      hydrateRoot(host, <NeuIcon icon={iconSearch} aria-label="Search" />, {
        onRecoverableError: (error) => {
          errors.push(error);
        },
      }),
    );
    expect(host.querySelector('svg')).toBe(before);
    expect(errors).toEqual([]);
    await act(async () => {
      root.unmount();
    });
  });

  it('renders all 394 Core definitions without changing their paths', () => {
    expect(neuralIcons).toHaveLength(394);
    for (const icon of neuralIcons) {
      const definition: NeuralIconDefinition = icon;
      const node = svg(renderToStaticMarkup(<NeuIcon icon={icon} />));
      const expected =
        definition.variant === 'filled' &&
        definition.stroke !== 'currentColor' &&
        definition.paths.every((path) => path.trim().endsWith('z')) &&
        !definition.separatePaths
          ? [icon.paths.join(' ')]
          : icon.paths;
      expect(
        Array.from(node.querySelectorAll('path'), (path) =>
          path.getAttribute('d'),
        ),
      ).toEqual(expected);
      expect(node.getAttribute('viewBox')).toBe(icon.viewBox);
    }
  });
});
