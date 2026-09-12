import { defineIcon } from '../lib/icon-definition.js';

export const iconError = defineIcon({
  name: 'error',
  category: 'status',
  tags: ['invalid', 'failure'],
  paths: [
    'M12 3.25a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 1 0 0-17.5M9 9l6 6M15 9l-6 6',
  ],
});
