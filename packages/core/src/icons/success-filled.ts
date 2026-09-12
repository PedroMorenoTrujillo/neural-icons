import { defineIcon } from '../lib/icon-definition.js';

export const iconSuccessFilled = defineIcon({
  name: 'success-filled',
  category: 'status',
  tags: ['complete', 'valid', 'filled'],
  paths: [
    'M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm-1.75 13.8L5.8 11.85l1.95-1.95 2.5 2.5 5.95-5.95 1.95 1.95z',
  ],
  variant: 'filled',
  stroke: 'none',
});
