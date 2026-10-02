import { test, expect } from '@playwright/test';

for (let i = 1; i <= 3; i++) {
  test(`teardown-stall ${i}`, async ({ page }) => {
    await page.setContent(`<h1>ok ${i}</h1>`);
    await expect(page.locator('h1')).toHaveText(`ok ${i}`);
  });
}
