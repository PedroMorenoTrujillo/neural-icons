import { defineIcon } from '../lib/icon-definition.js';

export const iconReceiptFilled = defineIcon({
  name: 'receipt-filled',
  category: 'commerce',
  tags: ['invoice', 'bill', 'transaction', 'filled'],
  paths: [
    'M4 2h16v20l-3-1.75L14 22l-2-1.75L10 22l-3-1.75L4 22zm3 5v2h10V7zm0 4v2h10v-2zm0 4v2h6v-2z',
  ],
  variant: 'filled',
  stroke: 'none',
});
