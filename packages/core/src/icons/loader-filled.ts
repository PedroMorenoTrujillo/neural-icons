import { defineIcon } from '../lib/icon-definition.js';

export const iconLoaderFilled = defineIcon({
  name: 'loader-filled',
  category: 'status',
  tags: ['loading', 'progress', 'filled'],
  paths: [
    'M10.9 2.8h2.2v3.3h-2.2zM17.9 10.9h3.3v2.2h-3.3zM10.9 17.9h2.2v3.3h-2.2zM2.8 10.9h3.3v2.2H2.8zM17.2 4.95l1.55 1.55-2.35 2.35-1.55-1.55zM17.2 19.05l-2.35-2.35 1.55-1.55 2.35 2.35zM6.8 19.05l-1.55-1.55 2.35-2.35 1.55 1.55zM6.8 4.95l2.35 2.35-1.55 1.55-2.35-2.35z',
  ],
  variant: 'filled',
  stroke: 'none',
});
