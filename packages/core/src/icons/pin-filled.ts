import { defineIcon } from '../lib/icon-definition.js';

export const iconPinFilled = defineIcon({
  name: 'pin-filled',
  category: 'navigation',
  tags: ['pin', 'navigation', 'marker', 'filled'],
  paths: [
    'M12 2.5a7.5 7.5 0 0 0-7.5 7.5c0 5.55 6.02 10.42 7.5 11.5 1.48-1.08 7.5-5.95 7.5-11.5A7.5 7.5 0 0 0 12 2.5zm0 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  ],
  variant: 'filled',
  stroke: 'none',
});
