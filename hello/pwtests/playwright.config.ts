import { defineConfig } from '@playwright/test';

// hang-free-executions H1 gate fixture (amikoo-executor-compose/docs/hang-free-executions.md, H1).
// Two workers: one bad test per detector, six normal tests that must all pass on the other worker
// and on the replacements. Run once more with `--workers 1` in the command (risk d).
// video: 'on' is the setting every recorded hang had.
export default defineConfig({
  testDir: 'tests',
  workers: 2,
  fullyParallel: true,
  timeout: 30_000,
  reporter: 'list',
  use: { video: 'on' },
});
