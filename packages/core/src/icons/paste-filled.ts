import { defineIcon } from '../lib/icon-definition.js';

export const iconPasteFilled = defineIcon({
  name: 'paste-filled',
  category: 'action',
  tags: ['paste', 'action', 'filled'],
  paths: [
    'M8 2.5h8v2h2.5A2.5 2.5 0 0 1 21 7v5h-2.75V7.25H5.75v11h4V21H3V7a2.5 2.5 0 0 1 2.5-2.5H8zm2.5 2v2h2v-2zM10 10h11v11H10zm2.5 2.5v6h6v-6z',
  ],
  variant: 'filled',
  stroke: 'none',
});
