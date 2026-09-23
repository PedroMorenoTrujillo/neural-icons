import { defineIcon } from '../lib/icon-definition.js';

export const iconCalendarPlusFilled = defineIcon({
  name: 'calendar-plus-filled',
  category: 'file',
  tags: ['calendar-plus', 'file', 'plus', 'filled'],
  paths: [
    'M4.125 4.125h15.75v16.75H4.125zM6 10h12v8.875H6z',
    'M8.125 2.125h1.75v4.75h-1.75z',
    'M14.125 2.125h1.75v4.75h-1.75z',
    'M11.125 12.25h1.75v2.375h2.375v1.75h-2.375v2.125h-1.75v-2.125H8.75v-1.75h2.375z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
