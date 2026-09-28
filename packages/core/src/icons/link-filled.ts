import { defineIcon } from '../lib/icon-definition.js';

export const iconLinkFilled = defineIcon({
  name: 'link-filled',
  category: 'navigation',
  tags: ['link', 'navigation', 'connect', 'filled'],
  paths: [
    'M7.875 5h3v2.75h-3a3.25 3.25 0 0 0 0 6.5h3V17h-3a6 6 0 0 1 0-12z',
    'M13.125 5h3a6 6 0 0 1 0 12h-3v-2.75h3a3.25 3.25 0 0 0 0-6.5h-3z',
    'M9.5 10.8h5v2.4h-5z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
