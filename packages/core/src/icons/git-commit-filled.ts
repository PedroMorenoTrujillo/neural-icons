import { defineIcon } from '../lib/icon-definition.js';

export const iconGitCommitFilled = defineIcon({
  name: 'git-commit-filled',
  category: 'system',
  tags: ['commit', 'revision', 'version control', 'filled'],
  paths: [
    'M3 10.875h6v2.25H3z',
    'M15 10.875h6v2.25h-6z',
    'M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z',
  ],
  variant: 'filled',
  stroke: 'none',
  separatePaths: true,
});
