import { test, expect } from '@playwright/test';

// Each case paints a counter for ~8 s so its video has real frames, then asserts.
for (let i = 1; i <= 10; i++) {
  const name = `case ${String(i).padStart(2, '0')}`;
  test(name, async ({ page }) => {
    await page.setContent(`<h1 id="n">${name}</h1><p id="t">0</p>
      <script>let k = 0; setInterval(() => { document.getElementById('t').textContent = String(++k); }, 100);</script>`);
    await page.waitForTimeout(8_000);
    await expect(page.locator('#n')).toHaveText(i === 3 ? 'not this one' : name, { timeout: 1_000 });
  });
}
