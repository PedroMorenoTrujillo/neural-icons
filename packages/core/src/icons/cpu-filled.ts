import { defineIcon } from '../lib/icon-definition.js';

export const iconCpuFilled = defineIcon({
  name: 'cpu-filled',
  category: 'system',
  tags: ['cpu', 'system', 'filled'],
  paths: [
    'M7 7h10v10H7zM3 8.5h3v2.5H3zM3 13h3v2.5H3zM18 8.5h3v2.5h-3zM18 13h3v2.5h-3zM8.5 3h2.5v3H8.5zM13 3h2.5v3H13zM8.5 18h2.5v3H8.5zM13 18h2.5v3H13z',
  ],
  variant: 'filled',
  stroke: 'none',
});
