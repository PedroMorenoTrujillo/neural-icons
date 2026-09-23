import { defineIcon } from '../lib/icon-definition.js';

export const iconWandFilled = defineIcon({
  name: 'wand-filled',
  category: 'action',
  tags: ['wand', 'action', 'filled'],
  paths: [
    'M3.65 18.65 12.65 9.65 14.35 11.35 5.35 20.35z',
    'M16 3.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z',
    'M20 13.5l.625 1.875L22.5 16l-1.875.625L20 18.5l-.625-1.875L17.5 16l1.875-.625z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
