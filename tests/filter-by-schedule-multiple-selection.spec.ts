import { test } from '../fixtures/auth.fixture';
import { TestsPage } from '../pages/TestsPage';
import { testsData } from '../utils/testData';

test('should filter the tests list by multiple schedules', async ({ page, sidebar }) => {
  const testsPage = new TestsPage(page);

  await sidebar.goToTests();
  await testsPage.assertLoaded();
  await testsPage.filterBySchedules([testsData.schedulePrimary, testsData.scheduleSecondary]);
  await testsPage.assertRowsContainAnyText(testsData.schedulePrimary, testsData.scheduleSecondary);
});
