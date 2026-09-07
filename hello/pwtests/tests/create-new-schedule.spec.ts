import { test } from '../fixtures/auth.fixture';
import { SchedulingPage } from '../pages/SchedulingPage';
import { testsData } from '../utils/testData';

test('should create a new schedule with a name and daily repeat', async ({ page, sidebar }) => {
  const schedulingPage = new SchedulingPage(page);

  await sidebar.goToScheduling();
  await schedulingPage.assertLoaded();
  await schedulingPage.openNewScheduleForm();
  await schedulingPage.fillScheduleName(testsData.newScheduleName);
  await schedulingPage.selectRepeat('Daily');
  await schedulingPage.proceedToContent();
  await schedulingPage.proceedToVariables();
  await schedulingPage.proceedToReport();
  await schedulingPage.saveSchedule();
  await schedulingPage.assertScheduleVisible(testsData.newScheduleName);
});
