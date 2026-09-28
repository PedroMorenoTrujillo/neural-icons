import { defineIcon } from '../lib/icon-definition.js';

export const iconPhoneOffFilled = defineIcon({
  name: 'phone-off-filled',
  category: 'communication',
  tags: ['hang up', 'call ended', 'disabled', 'filled'],
  paths: [
    'M6.5 3h3.4l1.75 4.9-2 1.55a13.3 13.3 0 0 0 4.9 4.9l1.55-2L21 14.1v3.4a3.5 3.5 0 0 1-3.8 3.5C9 20.6 3.4 15 3 6.8A3.5 3.5 0 0 1 6.5 3z',
    'M15 3.6 16.6 2l1.9 1.9L20.4 2 22 3.6l-1.9 1.9L22 7.4 20.4 9l-1.9-1.9L16.6 9 15 7.4l1.9-1.9z',
  ],
  variant: 'filled',
  stroke: 'none',
});
