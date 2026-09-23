import { test, expect } from '@playwright/test';

for (let i = 0; i < 3; i++) {
  test(`reported-${i}`, async ({ page }) => {
    await page.setContent(`<h1>ok ${i}</h1>`);
    await expect(page.locator('h1')).toHaveText(`ok ${i}`);
  });
}

// A synchronous loop blocks the worker's event loop, so neither the locator timeout nor the 30s test
// timeout can fire (§6.0: every Playwright deadline is a setTimeout in this loop). The worker stops
// writing output; the coordinator stays healthy. Only something outside Playwright ends this.
test('wedge', async ({ page }) => {
  await page.setContent('<h1>wedged</h1>');
  // eslint-disable-next-line no-constant-condition
  while (true) { /* spin */ }
});

test('never-reached', async () => {});
