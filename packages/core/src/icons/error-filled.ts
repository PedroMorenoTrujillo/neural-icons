import { defineIcon } from '../lib/icon-definition.js';

export const iconErrorFilled = defineIcon({
  name: 'error-filled',
  category: 'status',
  tags: ['invalid', 'failure', 'filled'],
  paths: [
    'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM9.2 8.2 15.8 14.8 14.8 15.8 8.2 9.2zM14.8 8.2 15.8 9.2 9.2 15.8 8.2 14.8z',
  ],
  variant: 'filled',
  stroke: 'none',
});
