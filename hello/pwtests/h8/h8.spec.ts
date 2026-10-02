import { test, expect } from '@playwright/test';

// Sixty tests of ~4 s, each recording a video and printing ~2.5 MB to stdout (≈ 150 MB for the run).
// case 07 fails on purpose, so the run has a failed count and still finishes.
const CHUNK = 'h8-test-output '.padEnd(1023, '.') + '\n';

for (let i = 1; i <= 60; i++) {
  const name = `case ${String(i).padStart(2, '0')}`;
  test(name, async ({ page }) => {
    await page.setContent(`<h1 id="n">${name}</h1><p id="t">0</p>
      <script>let k = 0; setInterval(() => { document.getElementById('t').textContent = String(++k); }, 100);</script>`);
    for (let k = 0; k < 5; k++) {
      await test.step(`print block ${k + 1}`, async () => {
        console.log(CHUNK.repeat(500).trimEnd());
        await page.waitForTimeout(800);
      });
    }
    await expect(page.locator('#n')).toHaveText(i === 7 ? 'not this one' : name, { timeout: 1_000 });
  });
}
