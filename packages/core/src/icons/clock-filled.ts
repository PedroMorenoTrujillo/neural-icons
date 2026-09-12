import { defineIcon } from '../lib/icon-definition.js';

export const iconClockFilled = defineIcon({
  name: 'clock-filled',
  category: 'system',
  tags: ['time', 'history', 'filled'],
  paths: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM10.5 6h3v5.25l3.75 2.25-1.5 2.5-5.25-3.25z',
  ],
  variant: 'filled',
  stroke: 'none',
});
