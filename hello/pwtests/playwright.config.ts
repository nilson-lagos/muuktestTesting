import { defineConfig } from '@playwright/test';

// hang-free-executions H4 gate fixture (amikoo-executor-compose/docs/hang-free-executions.md, H4).
// Ten tests of ~8 s each, one worker, video on: long enough to kill the container midway and count
// which results and videos made it to the backend. case 03 fails on purpose, for the failed count.
export default defineConfig({
  testDir: 'tests',
  workers: 1,
  timeout: 30_000,
  reporter: 'list',
  use: { video: 'on' },
});
