import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:4316';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      // Ionic picks iOS mode from the user agent, so Chromium runs the iOS mode tests without WebKit.
      name: 'Mobile Safari',
      use: { ...devices['iPhone 15'], browserName: 'chromium' },
    },
  ],
  webServer: {
    // CI tests the production build, which is what gets deployed, so build-tool
    // updates are checked at runtime and not only by `npm run build` succeeding.
    command: process.env.CI
      ? 'npm run build && npm run preview -- --port 4316 --strictPort'
      : 'npm run dev -- --port 4316 --strictPort',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
