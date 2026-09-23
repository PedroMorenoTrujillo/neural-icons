import { defineIcon } from '../lib/icon-definition.js';

export const iconUnderlineFilled = defineIcon({
  name: 'underline-filled',
  category: 'action',
  tags: ['format', 'text decoration', 'filled'],
  paths: [
    'M5.5 3.5h3v8c0 2.75 1.25 4 3.5 4s3.5-1.25 3.5-4v-8h3v8c0 4.5-2.45 6.75-6.5 6.75S5.5 16 5.5 11.5zM4 20h16v2H4z',
  ],
  variant: 'filled',
  stroke: 'none',
});
