import { defineIcon } from '../lib/icon-definition.js';

export const iconChartTimelineFilled = defineIcon({
  name: 'chart-timeline-filled',
  category: 'system',
  tags: ['timeline chart', 'milestones', 'chronology', 'filled'],
  paths: [
    'M2.75 10.85h18.5v2.3H2.75zM4.85 4.5h2.3V12h-2.3zM16.85 12h2.3v7.5h-2.3z',
    'M6 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 1 0 0-5.4zM12 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 1 0 0-5.4zM18 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 1 0 0-5.4z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
