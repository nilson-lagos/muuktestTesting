import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const appUrl = process.env.BASE_URL;
if (!appUrl) {
  throw new Error('BASE_URL is not set. Point it at the app under test, e.g. BASE_URL=https://staging.muuktest.com:5000');
}

export default defineConfig({
  reporter: [
    ['@muuktest/amikoo-playwright/reporter'],
    ['@muuktest/amikoo-reporter'],
  ],
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  retries: 0,
  workers: 1,
  //reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: appUrl,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
