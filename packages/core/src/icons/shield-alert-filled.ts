import { defineIcon } from '../lib/icon-definition.js';

export const iconShieldAlertFilled = defineIcon({
  name: 'shield-alert-filled',
  category: 'status',
  tags: ['security warning', 'threat', 'risk', 'filled'],
  paths: [
    'M12 1.5 21 5.5V12c0 5.2-3.2 8.6-9 10.5C6.2 20.6 3 17.2 3 12V5.5zm-1.2 6v7h2.4v-7zm0 9v2h2.4v-2z',
  ],
  variant: 'filled',
  stroke: 'none',
});
