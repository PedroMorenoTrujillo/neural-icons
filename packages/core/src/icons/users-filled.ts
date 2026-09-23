import { defineIcon } from '../lib/icon-definition.js';

export const iconUsersFilled = defineIcon({
  name: 'users-filled',
  category: 'system',
  tags: ['people', 'team', 'filled'],
  paths: [
    'M17 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    'M17 14c3.3 0 5.25 2.2 5.25 5.5V21h-6.5v-1.5c0-2.25-.65-4.15-1.8-5.2.95-.2 1.9-.3 3.05-.3z',
    'M9.25 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
    'M9.25 13.75c-3.8 0-6.15 2-6.5 5.75h13c-.35-3.75-2.7-5.75-6.5-5.75z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
