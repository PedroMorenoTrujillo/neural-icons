import { defineIcon } from '../lib/icon-definition.js';

export const iconSaveFilled = defineIcon({
  name: 'save-filled',
  category: 'action',
  tags: ['save', 'action', 'store', 'filled'],
  paths: [
    'M5 3h11.5L20.5 7v12a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V5a2 2 0 0 1 1.5-2zM8 4.5h7.5v4H8zM8 13.5h8.5v6H8z',
    'M9.5 16h5v1.5h-5z',
  ],
  variant: 'filled',
  stroke: 'none',
});
