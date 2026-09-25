import { h } from 'vue';
import { iconSearch } from '@neural-icons/core/icons/search';
import { NeuIcon } from '../index.js';
import type { NeuIconProps } from '../index.js';

export const validProps: NeuIconProps = {
  icon: iconSearch,
  size: 20,
  title: 'Search',
};

export const validVNode = h(NeuIcon, {
  ...validProps,
  class: 'search',
  style: { color: 'red' },
  'aria-label': 'Search',
  width: 32,
  id: 'search-icon',
});

// @ts-expect-error The Core definition is required.
export const missingIcon: NeuIconProps = {};

// @ts-expect-error A string name cannot trigger a hidden full-catalog registry.
export const stringName: NeuIconProps = { icon: 'search' };

// @ts-expect-error Partial objects are not Core definitions.
export const invalidDefinition: NeuIconProps = { icon: { name: 'search' } };

// @ts-expect-error Size is intentionally limited to a number or string.
export const invalidSize: NeuIconProps = { icon: iconSearch, size: true };
