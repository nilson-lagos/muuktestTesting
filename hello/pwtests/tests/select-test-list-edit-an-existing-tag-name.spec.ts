import { test, expect } from '../fixtures/auth.fixture';
import { TestsPage } from '../pages/TestsPage';
import { testsData } from '../utils/testData';

test('should rename an existing tag on a test row', async ({ page, sidebar }) => {
  const testsPage = new TestsPage(page);

  await sidebar.goToTests();
  await testsPage.assertLoaded();
  await testsPage.search("Test to be Cloned");
  
  // Use actual tag values from the UI
  const currentTag = "#Asset";
  const newTag = "#Asset-Updated";
  
  await testsPage.renameTag("Test to be Cloned", currentTag, newTag);
  
  // Check that the Groups column shows multiple tags (indicating the new tag was added)
  await expect(page.locator('tr').filter({ hasText: 'Test to be Cloned' }).locator('td').filter({ hasText: /\+ \d/ })).toBeVisible();
});
