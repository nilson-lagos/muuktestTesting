import { test } from '../fixtures/auth.fixture';
import { DashboardPage } from '../pages/DashboardPage';

test('should load the MuukTest analytics dashboard and its main tabs', async ({ page, sidebar }) => {
  const dashboardPage = new DashboardPage(page);

  await sidebar.goToDashboard();
  await dashboardPage.assertLoaded();
  await dashboardPage.openScheduledTab();
  await dashboardPage.openIssuesTab();
});
