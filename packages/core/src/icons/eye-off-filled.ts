import { defineIcon } from '../lib/icon-definition.js';

export const iconEyeOffFilled = defineIcon({
  name: 'eye-off-filled',
  category: 'action',
  tags: ['hidden', 'visibility', 'filled'],
  paths: [
    'M8.2 6.2C9.3 5.9 10.5 5.75 12 5.75c3.75 0 6.75 2.25 9.25 6.25-1.05 1.8-2.15 3.1-3.45 3.8l-2.93-2.93A3 3 0 0 0 11.13 9.13z',
    'M6.2 8.2l2.93 2.93A3 3 0 0 0 12.87 14.87l2.93 2.93c-1.1.3-2.3.45-3.8.45C8.25 18.25 5.25 16 2.75 12c1.05-1.8 2.15-3.1 3.45-3.8z',
    'M3.6 2.4 21.6 20.4 20.4 21.6 2.4 3.6z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
