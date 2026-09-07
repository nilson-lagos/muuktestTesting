import { test } from '../fixtures/auth.fixture';
import { SchedulingPage } from '../pages/SchedulingPage';

test('should change the scheduling table pagination size', async ({ page, sidebar }) => {
  const schedulingPage = new SchedulingPage(page);

  await sidebar.goToScheduling();
  await schedulingPage.assertLoaded();
  await schedulingPage.changeItemsPerPage('20 / page');
  await schedulingPage.assertPaginationValue('20 / page');
});
