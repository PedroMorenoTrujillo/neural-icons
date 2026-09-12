import { defineIcon } from '../lib/icon-definition.js';

export const iconRouteFilled = defineIcon({
  name: 'route-filled',
  category: 'navigation',
  tags: ['route', 'navigation', 'path', 'filled'],
  paths: [
    'M4 2.75a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5zM19.25 15.75a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5zM4 8.25v2.2c0 1.5 1.2 2.3 3.5 3.05 1.9.62 2.75 1.65 2.75 3.25V18h2.5v-1.25c0-2.7-1.5-4.4-4.48-5.37C6.82 10.9 6.5 10.5 6.5 10.1V8.25zM15.5 17h-2.75v2.5h2.75z',
  ],
  variant: 'filled',
  stroke: 'none',
});
