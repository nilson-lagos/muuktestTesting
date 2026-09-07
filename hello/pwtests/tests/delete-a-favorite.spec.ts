import { test } from '../fixtures/auth.fixture';
import { TestsPage } from '../pages/TestsPage';
import { testsData } from '../utils/testData';

test('should delete the cloned favorite test', async ({ page, sidebar }) => {
  const testsPage = new TestsPage(page);

  await sidebar.goToTests();
  await testsPage.assertLoaded();
  await testsPage.search(testsData.testToDelete);
  await testsPage.deleteRow(testsData.testToDelete);
  await testsPage.assertSuccessToast(/deleted successfully/i);
});
