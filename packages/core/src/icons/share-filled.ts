import { defineIcon } from '../lib/icon-definition.js';

export const iconShareFilled = defineIcon({
  name: 'share-filled',
  category: 'action',
  tags: ['share', 'action', 'export', 'filled'],
  paths: [
    'M17 2.5a3 3 0 1 0 0 6 3 3 0 1 0 0-6z',
    'M7 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z',
    'M17 15.5a3 3 0 1 0 0 6 3 3 0 1 0 0-6z',
    'M8.6 10.35 14.4 6.85 15.55 8.75 9.75 12.25z',
    'M9.75 11.75 15.55 15.25 14.4 17.15 8.6 13.65z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
