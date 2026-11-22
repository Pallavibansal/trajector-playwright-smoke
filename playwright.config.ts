import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke-test configuration for trajectormedical.com.
 *  - Mobile viewport (iPhone 13 emulation: 390x844, touch, mobile UA)
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
    video: 'on',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: {
        ...devices['iPhone 13'],
        // Run the iPhone profile on Chromium so only one browser install is required.
        browserName: 'chromium',
      },
    },
  ],
});
