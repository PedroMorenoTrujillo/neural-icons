import { defineIcon } from '../lib/icon-definition.js';

export const iconBadgeCheckFilled = defineIcon({
  name: 'badge-check-filled',
  category: 'status',
  tags: ['verified', 'certified', 'trust', 'filled'],
  paths: [
    'M12 1.5 15.3 3l3.7.35.35 3.7L22 10l-1.6 3.3.35 3.7-3.7.35L14 22l-3.3-1.6-3.7.35-.35-3.7L2 14l1.6-3.3-.35-3.7 3.7-.35zM8 12l3 3 5-5-1.6-1.6-3.4 3.4-1.4-1.4z',
  ],
  variant: 'filled',
  stroke: 'none',
});
