import { test } from '../../fixtures/auth.fixture';
import { TestsPage } from '../../pages/TestsPage';
import { testsData } from '../../utils/testData';

test('should refresh the tests list and clone a test as child test', async ({ page, sidebar }) => {
  const testsPage = new TestsPage(page);

  await sidebar.goToTests();
  await testsPage.assertLoaded();
  await testsPage.refresh();
  
  // Use an existing test name from the table
  const testToClone = "Test case to be cloned";
  const expectedCloneName = "Test case to be cloned clone";
  
  await testsPage.cloneAsChildTest(testToClone);
  await testsPage.assertRowVisible(expectedCloneName);
});
