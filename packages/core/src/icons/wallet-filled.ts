import { defineIcon } from '../lib/icon-definition.js';

export const iconWalletFilled = defineIcon({
  name: 'wallet-filled',
  category: 'commerce',
  tags: ['balance', 'purse', 'money', 'filled'],
  paths: [
    'M5 3h13v2H5a2 2 0 0 0-2 2v.5A4 4 0 0 1 5 6h13a3 3 0 0 1 3 3v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7a4 4 0 0 1 3-4zM12 11h8.5v1.5H12zM12 16.5h8.5V18H12zM12 12.5h1.5v4H12zM16.5 13.5a1 1 0 1 0 0 2 1 1 0 1 0 0-2z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
