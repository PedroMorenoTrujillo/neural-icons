import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';

const output = resolve(import.meta.dirname, '../../..', 'test-results/public-access');
export default defineConfig({
  testDir: './public',
  outputDir: output,
  fullyParallel: true,
  workers: 2,
  retries: 1,
  timeout: 30_000,
  reporter: [['list'], ['json', { outputFile: resolve(output, 'report.json') }]],
  use: { baseURL: 'https://icons.neuralui.org', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop-public', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-public', use: { ...devices['Pixel 5'], viewport: { width: 358, height: 780 } } },
  ],
});
