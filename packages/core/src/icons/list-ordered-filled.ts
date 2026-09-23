import { defineIcon } from '../lib/icon-definition.js';

export const iconListOrderedFilled = defineIcon({
  name: 'list-ordered-filled',
  category: 'navigation',
  tags: ['numbered', 'list', 'filled'],
  paths: [
    'M4 4l1.5-1v4M4 7h3M4 11a1.5 1.5 0 1 1 3 0c0 .7-.5 1.1-1 1.5L4 14h3M4.25 17.5H7l-1.5 1.5h1a1.25 1.25 0 0 1 0 2.5H4.25M10 5h10M10 12h10M10 19h10',
  ],
  variant: 'filled',
  stroke: 'currentColor',
});
