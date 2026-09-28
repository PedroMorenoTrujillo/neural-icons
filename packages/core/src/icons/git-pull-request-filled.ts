import { defineIcon } from '../lib/icon-definition.js';

export const iconGitPullRequestFilled = defineIcon({
  name: 'git-pull-request-filled',
  category: 'system',
  tags: ['pull request', 'pr', 'review', 'filled'],
  paths: [
    'M4.875 6h2.25v13h-2.25z',
    'M6 3.875h8a5.125 5.125 0 0 1 5.125 5.125v4h-2.25V9a2.875 2.875 0 0 0-2.875-2.875H6z',
    'M14.5 10.5 18 14l3.5-3.5-1.55-1.55L18 10.9l-1.95-1.95z',
    'M6 2.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5z',
    'M6 16.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5z',
    'M18 16.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
