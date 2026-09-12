import { defineIcon } from '../lib/icon-definition.js';

export const iconPrintFilled = defineIcon({
  name: 'print-filled',
  category: 'action',
  tags: ['print', 'action', 'filled'],
  paths: [
    'M7 2.5h10v5H7zM4 8h16a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-2v3.5H6V18H4a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3zm4.5 12h7v-4.5h-7zM18 11h2v2h-2z',
  ],
  variant: 'filled',
  stroke: 'none',
});
