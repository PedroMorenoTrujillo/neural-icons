import { defineIcon } from '../lib/icon-definition.js';

export const iconBattery = defineIcon({
  name: 'battery',
  category: 'system',
  tags: ['charge', 'battery level', 'energy'],
  paths: [
    'M4 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM22 10v4M6 10h7',
  ],
});
