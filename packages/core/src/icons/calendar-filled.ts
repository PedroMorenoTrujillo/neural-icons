import { defineIcon } from '../lib/icon-definition.js';

export const iconCalendarFilled = defineIcon({
  name: 'calendar-filled',
  category: 'system',
  tags: ['date', 'schedule', 'filled'],
  paths: [
    'M4.125 4.125h15.75v16.75H4.125zM6 10h12v8.875H6z',
    'M8.125 2.125h1.75v4.75h-1.75z',
    'M14.125 2.125h1.75v4.75h-1.75z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
