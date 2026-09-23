import { describe, expect, it } from 'vitest';
import { neuralIcons } from '../icons/index.js';
import { defineIcon, NEURAL_ICON_VIEW_BOX } from './icon-definition.js';

describe('Neural icon definitions', () => {
  it('ships the reviewed Neural UI 2.0 baseline', () => {
    expect(neuralIcons).toHaveLength(398);
    expect(new Set(neuralIcons.map(({ name }) => name)).size).toBe(398);
  });

  it.each(neuralIcons)('$name has immutable, portable geometry', (icon) => {
    expect(icon.viewBox).toBe(NEURAL_ICON_VIEW_BOX);
    expect(icon.name).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    expect(icon.paths.length).toBeGreaterThan(0);
    expect(Object.isFrozen(icon)).toBe(true);
    expect(Object.isFrozen(icon.paths)).toBe(true);
  });

  it('defensively copies caller-owned arrays', () => {
    const paths = ['M4 12h16'];
    const icon = defineIcon({
      name: 'test-icon',
      category: 'system',
      tags: ['test'],
      paths,
    });

    paths[0] = 'M0 0';
    expect(icon.paths[0]).toBe('M4 12h16');
  });

  it('preserves an explicit filled variant', () => {
    const icon = defineIcon({
      name: 'test-filled',
      category: 'status',
      tags: ['test', 'filled'],
      variant: 'filled',
      paths: ['M4 4h16v16H4z'],
    });

    expect(icon.variant).toBe('filled');
  });

  it('preserves separate Filled layers', () => {
    const icon = defineIcon({
      name: 'layered-filled',
      category: 'status',
      tags: ['test', 'filled'],
      variant: 'filled',
      separatePaths: true,
      paths: ['M3 3h18v18H3z', 'M8 8h8v8H8z'],
    });

    expect(icon.separatePaths).toBe(true);
  });

  it('keeps Filled silhouettes closed and line-only glyphs deliberately stroked', () => {
    const strokedGlyphs = new Set([
      'command-filled',
      'activity-filled',
      'collapse-filled',
      'rotate-cw-filled',
      'rotate-ccw-filled',
      'paste-filled',
      'mention-filled',
      'list-ordered-filled',
      'arrow-up-right-filled',
      'arrow-up-left-filled',
      'arrow-down-right-filled',
      'arrow-down-left-filled',
    ]);
    for (const icon of neuralIcons.filter(
      ({ variant }) => variant === 'filled',
    )) {
      if (strokedGlyphs.has(icon.name)) {
        expect(icon.stroke).toBe('currentColor');
        expect(icon.paths.length).toBeGreaterThan(0);
        continue;
      }
      expect(icon.paths.every((path) => path.trim().endsWith('z'))).toBe(true);
    }
  });
});
