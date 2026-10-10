import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

// This suite always checks the local production artifact.
const baseURL = 'http://127.0.0.1:4311';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import 'dotenv/config';

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * Generated as a .mts file so Node forces ESM regardless of workspace
 * `type`. Playwright routes `.mts` through its ESM loader (dynamic import,
 * bypassing the pirates CJS-compile path), and Nx's native TS strip loads
 * `.mts` directly. Playwright's configLoader auto-discovers
 * `playwright.config.mts` via its extension list
 * (.ts/.js/.mts/.mjs/.cts/.cjs).
 */
export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src' }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command:
      'npm exec nx build showcase && node dist/apps/showcase/server/server.mjs',
    env: {
      PORT: '4311',
      NG_ALLOWED_HOSTS: '127.0.0.1',
      NEURAL_ICONS_SITE_ORIGIN: 'https://icons.neuralui.org',
    },
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    ...(process.env['NEURAL_ICONS_CROSS_BROWSER'] === '1'
      ? [
          { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
          { name: 'webkit', use: { ...devices['Desktop Safari'] } },
          { name: 'iphone-webkit', use: { ...devices['iPhone 13'] } },
          { name: 'ipad-webkit', use: { ...devices['iPad Pro 11'] } },
        ]
      : []),
  ],
});
