import { defineIcon } from '../lib/icon-definition.js';

export const iconPresentationFilled = defineIcon({
  name: 'presentation-filled',
  category: 'system',
  tags: ['slides', 'deck', 'teaching', 'filled'],
  paths: [
    'M2 2h20v15h-9v3h4v2H7v-2h4v-3H2zm3 3v9h14V5zm1 7 3-3 2.5 2 4-4L18 9l-2.5 2-4-3-2.5 3z',
  ],
  variant: 'filled',
  stroke: 'none',
});
