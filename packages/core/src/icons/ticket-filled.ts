import { defineIcon } from '../lib/icon-definition.js';

export const iconTicketFilled = defineIcon({
  name: 'ticket-filled',
  category: 'navigation',
  tags: ['admission', 'pass', 'event', 'filled'],
  paths: [
    'M2 4h20v6a2 2 0 0 0 0 4v6H2v-6a2 2 0 0 0 0-4zm10 3v2h2V7zm0 4v2h2v-2zm0 4v2h2v-2z',
  ],
  variant: 'filled',
  stroke: 'none',
});
