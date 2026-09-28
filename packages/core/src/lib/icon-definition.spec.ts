import { describe, expect, it } from 'vitest';
import { neuralIcons } from '../icons/index.js';
import { defineIcon, NEURAL_ICON_VIEW_BOX } from './icon-definition.js';

describe('Neural icon definitions', () => {
  it('ships 250 complete outline/filled families', () => {
    expect(neuralIcons).toHaveLength(500);
    expect(new Set(neuralIcons.map(({ name }) => name)).size).toBe(500);
    const outlines = neuralIcons.filter(({ variant }) => variant === 'outline');
    const filled = neuralIcons.filter(({ variant }) => variant === 'filled');
    expect(outlines).toHaveLength(250);
    expect(filled).toHaveLength(250);
    const families = new Set(outlines.map(({ family }) => family));
    expect(families.size).toBe(250);
    expect(filled.every(({ family }) => families.has(family))).toBe(true);
  });

  it('keeps attachment discovery on the canonical paperclip family', () => {
    const paperclip = neuralIcons.find(({ name }) => name === 'paperclip');
    const filled = neuralIcons.find(({ name }) => name === 'paperclip-filled');
    expect(paperclip?.tags).toContain('attach');
    expect(paperclip?.tags).toContain('file attachment');
    expect(filled?.tags).toContain('attach');
    expect(neuralIcons.some(({ family }) => family === 'attach')).toBe(false);
  });

  it('keeps funnel discovery on filter without a public funnel family', () => {
    const filter = neuralIcons.find(({ name }) => name === 'filter');
    const filled = neuralIcons.find(({ name }) => name === 'filter-filled');
    expect(filter?.tags).toContain('funnel');
    expect(filled?.tags).toContain('funnel');
    expect(neuralIcons.some(({ family }) => family === 'funnel')).toBe(false);
  });

  it('preserves the approved file, file-text and login geometries', () => {
    const path = (name: string) =>
      neuralIcons.find((icon) => icon.name === name)?.paths[0];
    expect(path('file-filled')).toContain('M14 3v5h4z');
    expect(path('file-text')).toContain('M8.5 11h7M12 11v7');
    expect(path('file-text-filled')).toContain(
      'M8.5 10.5h7v2.2H13v5.5h-2v-5.5H8.5z',
    );
    expect(path('login')).toContain('M20 12H9M13 8l-4 4 4 4');
    expect(path('login-filled')).toContain(
      'M20 10.75h-7V8l-4 4 4 4v-2.75h7z',
    );
  });

  it.each(neuralIcons)('$name has immutable, portable geometry', (icon) => {
    expect(icon.viewBox).toBe(NEURAL_ICON_VIEW_BOX);
    expect(icon.name).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    expect(icon.family).toBe(
      icon.variant === 'filled' ? icon.name.replace(/-filled$/, '') : icon.name,
    );
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
    expect(icon.family).toBe('test');
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
      'mention-filled',
      'list-ordered-filled',
      'arrow-up-right-filled',
      'arrow-up-left-filled',
      'arrow-down-right-filled',
      'arrow-down-left-filled',
      'hash-filled',
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
