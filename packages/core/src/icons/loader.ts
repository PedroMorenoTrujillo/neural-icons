import { defineIcon } from '../lib/icon-definition.js';

export const iconLoader = defineIcon({
  name: 'loader',
  category: 'status',
  tags: ['loading', 'progress'],
  paths: [
    'M12 3.25v2.5M18.2 5.8l-1.75 1.75M20.75 12h-2.5M18.2 18.2l-1.75-1.75M12 20.75v-2.5M5.8 18.2l1.75-1.75M3.25 12h2.5M5.8 5.8l1.75 1.75',
  ],
});
