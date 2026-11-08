import { defineIcon } from '../lib/icon-definition.js';

export const iconChartSankeyFilled = defineIcon({
  name: 'chart-sankey-filled',
  category: 'system',
  tags: ['sankey diagram', 'flow diagram', 'flow bands', 'filled'],
  paths: [
    'M2.75 2.75h5.5v6.5h-5.5zM2.75 14.75h5.5v6.5h-5.5zM15.75 7.25h5.5v9.5h-5.5z',
    'M7 4.75c4.9 0 5.6 3.8 9.75 3.8v2.5C11.55 11.05 11 7.25 7 7.25zM7 16.75c4 0 4.55-3.8 9.75-3.8v2.5c-4.15 0-4.85 3.8-9.75 3.8z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
