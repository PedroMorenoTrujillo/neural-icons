import { createRef } from 'react';
import { iconSearch } from '@neural-icons/core/icons/search';
import { NeuIcon } from '../index.js';
import type { NeuIconProps } from '../index.js';

export const valid = (
  <NeuIcon
    icon={iconSearch}
    size={20}
    width="2em"
    height={24}
    className="search"
    style={{ color: 'red' }}
    aria-label="Search"
    data-testid="search"
    ref={createRef<SVGSVGElement>()}
  />
);

// @ts-expect-error A Core definition is required.
export const missingIcon = <NeuIcon />;

// @ts-expect-error A string name cannot trigger a hidden full-catalog registry.
export const stringName = <NeuIcon icon="search" />;

// @ts-expect-error Partial objects are not Core icon definitions.
export const invalidDefinition = <NeuIcon icon={{ name: 'search' }} />;

export const overriddenViewBox: NeuIconProps = {
  icon: iconSearch,
  // @ts-expect-error The consumer cannot overwrite Core geometry.
  viewBox: '0 0 48 48',
};

export const injectedMarkup: NeuIconProps = {
  icon: iconSearch,
  // @ts-expect-error The consumer cannot inject inner markup.
  dangerouslySetInnerHTML: { __html: '<path />' },
};
