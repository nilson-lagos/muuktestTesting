import { defineConfig } from '@playwright/test';

// hang-free-executions H1 gate fixture (amikoo-executor-compose/docs/hang-free-executions.md, H1).
// One worker (risk d): after each bad test's worker is killed, Playwright must start a replacement and
// the six normal tests must still all pass. The workers: 2 run of this fixture is ab458a6.
// video: 'on' is the setting every recorded hang had.
export default defineConfig({
  testDir: 'tests',
  workers: 1,
  fullyParallel: true,
  timeout: 30_000,
  reporter: 'list',
  use: { video: 'on' },
});
