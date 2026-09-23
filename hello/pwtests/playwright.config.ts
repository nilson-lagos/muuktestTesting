import { defineConfig } from '@playwright/test';

// v2-delivery phase 3 gate fixture (amikoo-executor-compose/docs/open-executor-hang.md §6.3, T4).
// One worker so the order is fixed: three tests pass and are reported, then one wedges its worker.
// video: 'on' is the setting every recorded hang had.
export default defineConfig({
  testDir: 'tests',
  workers: 1,
  timeout: 30_000,
  reporter: 'list',
  use: { video: 'on' },
});
