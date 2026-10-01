import { test, expect } from '@playwright/test';

// (i)   STEP_STALLED — a step that never ends, inside a test allowed 10 min: caught at STEP_STALL_MS
//       (10 min default), long before its own deadline (12 min).
// (ii)  TEST_HUNG — the worker spins in afterEach, so Playwright's own 10 s timeout can never fire:
//       caught at T + 2 min (2m10s); ffmpeg is killed first, the worker 60 s later.
// (iii) six normal tests that must pass.
// Timeouts are set with describe.configure, NOT test.setTimeout(): a run-time setTimeout is invisible
// to the coordinator until test end (H1 finding).

test.describe('stalled step', () => {
  test.describe.configure({ timeout: 10 * 60_000 });
  test('(i) waits forever inside a step', async ({ page }) => {
    await page.setContent('<h1>stalled</h1>');
    await test.step('wait for a promise that never resolves', async () => {
      await new Promise(() => {});
    });
  });
});

test.describe('hung worker', () => {
  test.describe.configure({ timeout: 10_000 });
  test.afterEach(() => { while (true) {} });
  test('(ii) worker spins after the body', async ({ page }) => {
    await page.setContent('<h1>hung</h1>');
    await expect(page.locator('h1')).toHaveText('hung');
  });
});

for (let i = 0; i < 6; i++) {
  test(`(iii) normal ${i}`, async ({ page }) => {
    await page.setContent(`<h1>n${i}</h1>`);
    await expect(page.locator('h1')).toHaveText(`n${i}`);
    await page.waitForTimeout(2000);
  });
}
