import { defineIcon } from '../lib/icon-definition.js';

export const iconBanFilled = defineIcon({
  name: 'ban-filled',
  category: 'status',
  tags: ['forbidden', 'blocked', 'prohibited', 'filled'],
  paths: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zm0 3a7 7 0 1 1 0 14 7 7 0 1 1 0-14z',
    'M5.4 3.8 20.2 18.6l-1.6 1.6L3.8 5.4z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
