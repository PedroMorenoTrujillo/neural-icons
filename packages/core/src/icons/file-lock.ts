import { defineIcon } from '../lib/icon-definition.js';

export const iconFileLock = defineIcon({
  name: 'file-lock',
  category: 'file',
  tags: ['protected document', 'secure file', 'permissions'],
  paths: [
    'M5 3.5h9l4 4V13M14 3.5v4h4M5 3.5v17h7M13.5 17v-1.5a2.5 2.5 0 0 1 5 0V17M12.5 17h7v5h-7z',
  ],
});
