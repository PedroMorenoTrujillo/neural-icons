import { defineIcon } from '../lib/icon-definition.js';

export const iconDragFilled = defineIcon({
  name: 'drag-filled',
  category: 'action',
  tags: ['drag', 'action', 'filled'],
  paths: [
    'M6.75 2.5h2.5v4H6.75zM14.75 2.5h2.5v4h-2.5zM6.75 17.5h2.5v4h-2.5zM14.75 17.5h2.5v4h-2.5zM2.5 6.75h4v2.5h-4zM17.5 6.75h4v2.5h-4zM2.5 14.75h4v2.5h-4zM17.5 14.75h4v2.5h-4zM9.5 9.5h5v5h-5z',
  ],
  variant: 'filled',
  stroke: 'none',
});
