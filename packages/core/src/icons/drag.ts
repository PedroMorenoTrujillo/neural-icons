import { defineIcon } from '../lib/icon-definition.js';

export const iconDrag = defineIcon({
  name: 'drag',
  category: 'action',
  tags: ['drag', 'action'],
  paths: [
    'M8 5v14M16 5v14M5 8l3-3 3 3M13 8l3-3 3 3M5 16l3 3 3-3M13 16l3 3 3-3',
  ],
});
