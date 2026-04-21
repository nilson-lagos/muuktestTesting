import { test } from '../../fixtures/auth.fixture';
import { TestsPage } from '../../pages/TestsPage';
import { testsData } from '../../utils/testData';

test('should edit the base URL in bulk for a selected test', async ({ page, sidebar }) => {
  const testsPage = new TestsPage(page);

  await sidebar.goToTests();
  await testsPage.assertLoaded();
  await testsPage.search(testsData.testToClone);
  await testsPage.bulkEditBaseUrl(testsData.testToClone, testsData.newBaseUrl);
  await testsPage.assertSuccessToast(/base url|updated successfully/i);
});
