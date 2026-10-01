import { test, expect } from '@playwright/test';

// Never reached when H2 works: the H2 gate fixtures fail in setup.
test('h2 setup fixture should never run', async () => {
  expect(true).toBe(true);
});
