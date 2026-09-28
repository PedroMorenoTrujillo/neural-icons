import { defineIcon } from '../lib/icon-definition.js';

export const iconScissorsFilled = defineIcon({
  name: 'scissors-filled',
  category: 'action',
  tags: ['cut', 'trim', 'editor', 'filled'],
  paths: [
    'M6.25 4.25a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM6.25 6.25a1.5 1.5 0 1 1 0 3 1.5 1.5 0 1 1 0-3z',
    'M6.25 12.75a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM6.25 14.75a1.5 1.5 0 1 1 0 3 1.5 1.5 0 1 1 0-3z',
    'M8.62 10.18 19.84 21.18 21.2 21.2 21.18 19.84 9.95 8.82z',
    'M9.95 15.18 21.18 4.18 21.2 2.8 19.84 2.82 8.62 13.82z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
