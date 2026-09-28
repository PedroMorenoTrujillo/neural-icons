import { defineIcon } from '../lib/icon-definition.js';

export const iconBatteryChargingFilled = defineIcon({
  name: 'battery-charging-filled',
  category: 'system',
  tags: ['charging', 'power supply', 'energy', 'filled'],
  paths: [
    'M4 5h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zm8.8 2.5-4.4 5.6h3l-1.2 4.2 5.5-6.8h-3.2l.3-3zM22 9h2v6h-2z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
