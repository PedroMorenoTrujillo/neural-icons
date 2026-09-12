import { defineIcon } from '../lib/icon-definition.js';

export const iconTrash = defineIcon({
  name: 'trash',
  category: 'action',
  tags: ['delete', 'remove'],
  paths: [
    'M4 6.5h16M9 3.5h6l.75 3M6.25 6.5l.75 14h10l.75-14M10 10v6.75M14 10v6.75',
  ],
});
