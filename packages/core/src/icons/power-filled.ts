import { defineIcon } from '../lib/icon-definition.js';

export const iconPowerFilled = defineIcon({
  name: 'power-filled',
  category: 'system',
  tags: ['on off', 'shutdown', 'switch', 'filled'],
  paths: [
    'M10.5 2h3v11h-3zM6.5 5.1l2 2.25a6 6 0 1 0 7 0l2-2.25a9 9 0 1 1-11 0z',
  ],
  variant: 'filled',
  stroke: 'none',
});
