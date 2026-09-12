import { defineIcon } from '../lib/icon-definition.js';

export const iconErrorFilled = defineIcon({
  name: 'error-filled',
  category: 'status',
  tags: ['invalid', 'failure', 'filled'],
  paths: [
    'M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zM8.1 6.35 12 10.25l3.9-3.9 1.75 1.75-3.9 3.9 3.9 3.9-1.75 1.75-3.9-3.9-3.9 3.9-1.75-1.75 3.9-3.9-3.9-3.9z',
  ],
  variant: 'filled',
  stroke: 'none',
});
