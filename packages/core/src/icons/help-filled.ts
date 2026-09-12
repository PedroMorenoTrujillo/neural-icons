import { defineIcon } from '../lib/icon-definition.js';

export const iconHelpFilled = defineIcon({
  name: 'help-filled',
  category: 'status',
  tags: ['question', 'support', 'filled'],
  paths: [
    'M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm-1.25 14h2.5V19h-2.5zm0-2.25v-1.5c0-1.56.35-2.36 1.9-2.9a2.2 2.2 0 1 0-3.15-2v.4H6.75v-.4a4.95 4.95 0 1 1 6.97 4.52c-.7.28-.97.55-.97 1.08v.8z',
  ],
  variant: 'filled',
  stroke: 'none',
});
