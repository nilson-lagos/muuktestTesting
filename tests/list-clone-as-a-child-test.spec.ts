import { test } from '../fixtures/auth.fixture';
import { TestsPage } from '../pages/TestsPage';
import { testsData } from '../utils/testData';

test('should clone a test as child test from the actions menu', async ({ page, sidebar }) => {
  const testsPage = new TestsPage(page);

  await sidebar.goToTests();
  await testsPage.assertLoaded();
  await testsPage.search(testsData.testToClone);
  await testsPage.cloneAsChildTest(testsData.testToClone);
  await testsPage.assertRowVisible(testsData.clonedTestName);
});
