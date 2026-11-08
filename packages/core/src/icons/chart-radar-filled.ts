import { defineIcon } from '../lib/icon-definition.js';

export const iconChartRadarFilled = defineIcon({
  name: 'chart-radar-filled',
  category: 'system',
  tags: ['radar chart', 'spider chart', 'multivariate', 'filled'],
  paths: [
    'M12 2 21.5 7v10L12 22 2.5 17V7zM12 5l-7 3.75v6.5L12 19l7-3.75v-6.5zM12 7.5l5.5 2-2 5.5-3.5 2-4.5-3.5 1-3.5z',
    'M11 4h2v5h-2zM14.65 13.7l5.1 1.53-.6 1.95-5.1-1.53zM3.5 15.25l4.5-3.35 1.2 1.6-4.5 3.35z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
