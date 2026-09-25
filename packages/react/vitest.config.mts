import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/react',
  plugins: [nxViteTsPaths()],
  test: {
    name: 'react',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
  },
});
