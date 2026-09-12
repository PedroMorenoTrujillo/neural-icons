import { defineIcon } from '../lib/icon-definition.js';

export const iconCommandFilled = defineIcon({
  name: 'command-filled',
  category: 'action',
  tags: ['command', 'action', 'filled'],
  paths: [
    'M8 2.5a4.5 4.5 0 0 0-4.5 4.5v1A4.5 4.5 0 0 0 8 12h2v2H8a4.5 4.5 0 1 0 4.5 4.5v-2h-2v2a2 2 0 1 1-2.5-2.5h4v-4h4a2.5 2.5 0 1 1-2.5 2.5v2h2v-2a4.5 4.5 0 1 0 4.5-4.5h-2v-2h2A4.5 4.5 0 1 0 11.5 7v2h-2V7A2.5 2.5 0 1 1 12 9.5h4a2.5 2.5 0 1 1-2.5-2.5v2h-2V7A4.5 4.5 0 0 0 8 2.5z',
  ],
  variant: 'filled',
  stroke: 'none',
});
