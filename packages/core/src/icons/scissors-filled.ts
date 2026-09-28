import { defineIcon } from '../lib/icon-definition.js';

export const iconScissorsFilled = defineIcon({
  name: 'scissors-filled',
  category: 'action',
  tags: ['cut', 'trim', 'editor', 'filled'],
  paths: [
    'M6.25 4.25a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM6.25 6.25a1.5 1.5 0 1 1 0 3 1.5 1.5 0 1 1 0-3z',
    'M6.25 12.75a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7zM6.25 14.75a1.5 1.5 0 1 1 0 3 1.5 1.5 0 1 1 0-3z',
    'M8.45 10 9.7 8.85 13.2 11 21 20.5l-.35.35-9.75-7.65z',
    'M8.45 14 9.7 15.15 13.2 13 21 3.5l-.35-.35-9.75 7.65z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
