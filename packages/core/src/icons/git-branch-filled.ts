import { defineIcon } from '../lib/icon-definition.js';

export const iconGitBranchFilled = defineIcon({
  name: 'git-branch-filled',
  category: 'system',
  tags: ['branch', 'version control', 'development', 'filled'],
  paths: [
    'M4.875 6h2.25v13h-2.25z',
    'M4.875 13.25c0-5.3 2.8-8.375 7.125-8.375h6v2.25h-6c-3 0-4.875 2.1-4.875 6.125z',
    'M6 2.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5z',
    'M6 16.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5z',
    'M18 3.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
