import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

// hang-free-executions H9 gate fixture (amikoo-executor-compose/docs/hang-free-executions.md, H9).
// One test stops its own video ffmpeg (SIGSTOP) mid-test, the way a wedged ffmpeg looks to
// Playwright. Without the executor's E0 patch, closing that page waits for ffmpeg until the test
// timeout (30 s) and the test fails in teardown; with it, ffmpeg gets 15 s, is killed, the test
// passes without a video, and everything else runs as usual.
export default defineConfig({
  reporter: [
    ['@muuktest/amikoo-playwright/reporter'],
    ['@muuktest/amikoo-reporter'],
  ],
  testDir: './h9',
  timeout: 30_000,
  fullyParallel: true,
  expect: { timeout: 15_000 },
  retries: 0,
  workers: 2,
  //reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
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
