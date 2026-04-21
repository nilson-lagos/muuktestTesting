import { test } from '../fixtures/auth.fixture';
import { TestsPage } from '../pages/TestsPage';
import { testsData } from '../utils/testData';

test('should filter the tests list by a single schedule', async ({ page, sidebar }) => {
  const testsPage = new TestsPage(page);

  await sidebar.goToTests();
  await testsPage.assertLoaded();
  await testsPage.filterBySchedules([testsData.schedulePrimary]);
  await testsPage.assertRowsContainAnyText(testsData.schedulePrimary);
});
