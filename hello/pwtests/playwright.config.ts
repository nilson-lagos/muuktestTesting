import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

// hang-free-executions H8 gate fixture (amikoo-executor-compose/docs/hang-free-executions.md, H8).
// A run with far more output than the executor may keep, and a video per test:
//  - every `--list` load of this config prints ~30 MB, so a failed command's setup log passes the
//    runner's 25 MB cap (first 5 MB + last 20 MB);
//  - the tests in ./h8 print ~150 MB in total, past execa's 100 MB maxBuffer;
//  - video on and the html reporter, which copies every video it can still find at the end.
if (process.argv.includes('--list')) {
  const line = 'h8-config-spew '.padEnd(1023, '=') + '\n';
  for (let i = 0; i < 30 * 1024; i++) process.stdout.write(line);
}

export default defineConfig({
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['@muuktest/amikoo-playwright/reporter'],
    ['@muuktest/amikoo-reporter'],
  ],
  testDir: './h8',
  timeout: 60_000,
  retries: 0,
  workers: 2,
  use: {
    headless: true,
    video: 'on',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
