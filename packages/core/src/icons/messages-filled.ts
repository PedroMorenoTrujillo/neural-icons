import { defineIcon } from '../lib/icon-definition.js';

export const iconMessagesFilled = defineIcon({
  name: 'messages-filled',
  category: 'communication',
  tags: ['messages', 'communication', 'filled'],
  paths: [
    'M8 3h9a4 4 0 0 1 4 4v8a1.25 1.25 0 0 1-1.25 1.25H19V7a2 2 0 0 0-2-2H8z',
    'M6 7h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H9l-6 3v-5.5A4 4 0 0 1 2 14v-3a4 4 0 0 1 4-4zM7 11h7v1.75H7zM7 14.5h4.5v1.75H7z',
  ],
  variant: 'filled',
  stroke: 'none',
});
