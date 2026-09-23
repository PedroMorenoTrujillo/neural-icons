import { defineIcon } from '../lib/icon-definition.js';

export const iconRouteFilled = defineIcon({
  name: 'route-filled',
  category: 'navigation',
  tags: ['route', 'navigation', 'path', 'filled'],
  paths: [
    'M5 15.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM19 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM7 16.75h3.75v-11H17v2.5h-3.75v11H7z',
  ],
  variant: 'filled',
  stroke: 'none',
});
