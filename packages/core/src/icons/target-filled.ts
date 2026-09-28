import { defineIcon } from '../lib/icon-definition.js';

export const iconTargetFilled = defineIcon({
  name: 'target-filled',
  category: 'action',
  tags: ['goal', 'aim', 'focus', 'filled'],
  paths: [
    'M12 1a11 11 0 1 0 0 22 11 11 0 1 0 0-22zm0 2.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 1 1 0-17zM12 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12zm0 3.25a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 1 1 0-5.5z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
