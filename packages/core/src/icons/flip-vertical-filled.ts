import { defineIcon } from '../lib/icon-definition.js';

export const iconFlipVerticalFilled = defineIcon({
  name: 'flip-vertical-filled',
  category: 'action',
  tags: ['mirror', 'image', 'filled'],
  paths: [
    'M3.5 11h2.25v2H3.5zM8.5 11h7v2h-7zM18.25 11h2.25v2h-2.25zM5.9 3.75 12 10l6.1-6.25zM5.9 20.25 12 14l6.1 6.25z',
  ],
  variant: 'filled',
  stroke: 'none',
});
