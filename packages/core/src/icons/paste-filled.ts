import { defineIcon } from '../lib/icon-definition.js';

export const iconPasteFilled = defineIcon({
  name: 'paste-filled',
  category: 'action',
  tags: ['paste', 'action', 'filled'],
  paths: [
    'M5.5 6h13A1.5 1.5 0 0 1 20 7.5v12A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-12A1.5 1.5 0 0 1 5.5 6zM11 10.5h2v4h2.5L12 18l-3.5-3.5H11z',
    'M8 3h8v5H8zM10 4.5h4V6h-4z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
