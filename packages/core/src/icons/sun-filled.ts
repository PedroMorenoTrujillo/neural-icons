import { defineIcon } from '../lib/icon-definition.js';

export const iconSunFilled = defineIcon({
  name: 'sun-filled',
  category: 'system',
  tags: ['light mode', 'day', 'weather', 'filled'],
  paths: [
    'M12 7a5 5 0 1 0 0 10 5 5 0 1 0 0-10zM11 1h2v4h-2zM11 19h2v4h-2zM1 11h4v2H1zM19 11h4v2h-4zM4.6 3.2 7.4 6l-1.4 1.4-2.8-2.8zM18 16.6l2.8 2.8-1.4 1.4-2.8-2.8zM19.4 3.2l1.4 1.4L18 7.4 16.6 6zM6 16.6 7.4 18l-2.8 2.8-1.4-1.4z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
