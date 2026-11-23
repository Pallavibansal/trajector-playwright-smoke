import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke-test configuration for trajectormedical.com.
 *  - Full-size desktop viewport (1920x1080)
 *  - Video recorded for every test run
 *  - Full test log written to ./logs by a custom reporter
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  outputDir: 'test-results',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['./reporters/file-logger-reporter.ts', { logDir: 'logs' }],
  ],
  use: {
    baseURL: 'https://www.trajectormedical.com',
    browserName: 'chromium',
    viewport: { width: 1920, height: 1080 },
    video: 'on',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {},
    },
  ],
});
