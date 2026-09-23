import { defineIcon } from '../lib/icon-definition.js';

export const iconCommandFilled = defineIcon({
  name: 'command-filled',
  category: 'action',
  tags: ['command', 'action', 'filled'],
  paths: [
    'M9 9h6v6H9zM9 9H6a3 3 0 1 1 3-3v3M15 9h3a3 3 0 1 0-3-3v3M9 15H6a3 3 0 1 0 3 3v-3M15 15h3a3 3 0 1 1-3 3v-3',
  ],
  variant: 'filled',
  stroke: 'currentColor',
});
