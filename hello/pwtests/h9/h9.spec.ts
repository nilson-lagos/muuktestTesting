import * as fs from 'fs';
import { test, expect } from '@playwright/test';

// This worker's live ffmpeg children (Linux /proc). ffmpeg is a direct child of the Playwright
// worker (hang-free-executions.md H1 check (c)).
function ffmpegChildren(): number[] {
  const pids: number[] = [];
  for (const entry of fs.readdirSync('/proc')) {
    if (!/^\d+$/.test(entry)) continue;
    try {
      const stat = fs.readFileSync(`/proc/${entry}/stat`, 'utf8');
      const comm = stat.slice(stat.indexOf('(') + 1, stat.lastIndexOf(')'));
      const [state, ppid] = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
      if (comm.startsWith('ffmpeg') && Number(ppid) === process.pid && state !== 'Z') pids.push(Number(entry));
    } catch {}
  }
  return pids;
}

for (let i = 1; i <= 3; i++) {
  test(`case 0${i} normal`, async ({ page }) => {
    await page.setContent(`<h1>case ${i}</h1>`);
    await expect(page.locator('h1')).toHaveText(`case ${i}`);
  });
}

test('case 04 ffmpeg stopped', async ({ page }) => {
  await page.setContent('<h1>recording</h1>');
  await expect.poll(() => ffmpegChildren().length).toBeGreaterThan(0);
  const pids = ffmpegChildren();
  for (const pid of pids) process.kill(pid, 'SIGSTOP');
  console.log(`h9: stopped ffmpeg ${pids.join(',')} (worker ${process.pid})`);
  await page.setContent('<h1>still running</h1>');
  await expect(page.locator('h1')).toHaveText('still running');
});

for (let i = 5; i <= 8; i++) {
  test(`case 0${i} normal`, async ({ page }) => {
    await page.setContent(`<h1>case ${i}</h1>`);
    await expect(page.locator('h1')).toHaveText(`case ${i}`);
  });
}
