import { test, expect } from '@playwright/test';

// v2 C gate fixture: a ~25-minute run. Sixty tests of ~75 s each, no output spam; with one worker and
// --grep for cases 01-20 the run lasts ~25 min, so the last tests' in-flight rows must outlive the old
// 15-minute TTL. case 07 fails on purpose, as on h8-hygiene.
for (let i = 1; i <= 60; i++) {
  const name = `case ${String(i).padStart(2, '0')}`;
  test(name, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setContent(`<h1 id="n">${name}</h1>`);
    await page.waitForTimeout(75_000);
    await expect(page.locator('#n')).toHaveText(i === 7 ? 'not this one' : name, { timeout: 1_000 });
  });
}
