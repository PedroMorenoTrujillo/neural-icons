import { defineIcon } from '../lib/icon-definition.js';

export const iconChartNetworkFilled = defineIcon({
  name: 'chart-network-filled',
  category: 'system',
  tags: ['network graph', 'nodes', 'connections', 'filled'],
  paths: [
    'M5.5 2.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 1 0 0-6.5zM18.5 4.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 1 0 0-6.5zM11.5 15.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 1 0 0-6.5z',
    'M7.9 5.22l8.5 1.3-.35 2.26-8.5-1.3zM7.5 7.58l4.27 9.25-2.1.97L5.4 8.55zM18.15 10.67l-4.68 7.35-1.96-1.24 4.68-7.35z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
