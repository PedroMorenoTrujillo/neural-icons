import { describe, expect, it } from 'vitest';
import { neuralIcons } from '../icons/index.js';
import { defineIcon, NEURAL_ICON_VIEW_BOX } from './icon-definition.js';

describe('Neural icon definitions', () => {
  it('ships the reviewed Neural UI 2.0 baseline', () => {
    expect(neuralIcons).toHaveLength(48);
    expect(new Set(neuralIcons.map(({ name }) => name)).size).toBe(48);
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
});
