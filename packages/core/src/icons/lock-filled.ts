import { defineIcon } from '../lib/icon-definition.js';

export const iconLockFilled = defineIcon({
  name: 'lock-filled',
  category: 'system',
  tags: ['secure', 'private', 'filled'],
  paths: [
    'M6 10V7a6 6 0 0 1 12 0v3h1.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 19.5v-7A2.5 2.5 0 0 1 4.5 10zM8.5 10h7V7a3.5 3.5 0 1 0-7 0z',
  ],
  variant: 'filled',
  stroke: 'none',
});
