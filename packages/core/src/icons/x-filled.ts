import { defineIcon } from '../lib/icon-definition.js';

export const iconXFilled = defineIcon({
  name: 'x-filled',
  category: 'action',
  tags: ['close', 'remove', 'filled'],
  paths: [
    'M5 3.25 12 10.25l7-7 1.75 1.75-7 7 7 7-1.75 1.75-7-7-7 7L3.25 19l7-7-7-7z',
  ],
  variant: 'filled',
  stroke: 'none',
});
