import { defineIcon } from '../lib/icon-definition.js';

export const iconBatteryFilled = defineIcon({
  name: 'battery-filled',
  category: 'system',
  tags: ['charge', 'battery level', 'energy', 'filled'],
  paths: [
    'M4 5h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zm0 3v8h7V8zM22 9h2v6h-2z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
