import { defineConfig } from '@playwright/test';

// hang-free-executions H2 gate fixture (amikoo-executor-compose/docs/hang-free-executions.md, H2).
// The run must never get this far: setup fails first. The config and spec exist so that, if it
// does, the failure reads as "setup passed when it should not have", not as "no tests found".
export default defineConfig({
  testDir: 'tests',
  reporter: 'list',
});
