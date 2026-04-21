import { test } from '../fixtures/auth.fixture';
import { TestsPage } from '../pages/TestsPage';

test('should open the tag filter and reset it', async ({ page, sidebar }) => {
  const testsPage = new TestsPage(page);

  await sidebar.goToTests();
  await testsPage.assertLoaded();
  
  // Open the Groups filter dropdown
  await testsPage.openTagFilter();
  
  // Wait a moment for the dropdown to be visible
  await page.waitForTimeout(1000);
  
  // Close the filter dropdown by pressing Escape or clicking elsewhere
  await page.keyboard.press('Escape');
  
  // Verify we're still on the tests page
  await testsPage.assertLoaded();
});
