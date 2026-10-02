import { defineConfig } from '@playwright/test';

// hang-free-executions H6 gate fixture: RUN_STALLED end to end (E3, `progress_stall`).
// Three tests pass and are reported, then globalTeardown waits forever without printing anything.
// No test is in flight, so neither the per-test deadline nor the step-stall limit applies: only the
// silence-outside-tests limit (the org's stallMs) can end it, with the three results kept.
export default defineConfig({
  testDir: 'tests',
  workers: 1,
  timeout: 30_000,
  reporter: 'list',
  globalTeardown: './global-teardown.ts',
  use: { video: 'on' },
});
