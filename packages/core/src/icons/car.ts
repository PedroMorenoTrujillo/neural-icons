import { defineIcon } from '../lib/icon-definition.js';

export const iconCar = defineIcon({
  name: 'car',
  category: 'navigation',
  tags: ['vehicle', 'drive', 'transport'],
  paths: [
    'M5 10 7 5h10l2 5M4 10h16a2 2 0 0 1 2 2v5H2v-5a2 2 0 0 1 2-2zM6 17v2M18 17v2M7 13h2M15 13h2',
  ],
});
