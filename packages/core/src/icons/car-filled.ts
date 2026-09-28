import { defineIcon } from '../lib/icon-definition.js';

export const iconCarFilled = defineIcon({
  name: 'car-filled',
  category: 'navigation',
  tags: ['vehicle', 'drive', 'transport', 'filled'],
  paths: [
    'M7 4h10l2.5 5H20a3 3 0 0 1 3 3v5H1v-5a3 3 0 0 1 3-3h.5zM8 6.5 6.75 9h10.5L16 6.5zM3 18h6v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM15 18h6v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
