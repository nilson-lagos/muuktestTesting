import { test } from '../fixtures/auth.fixture';
import { MobilePage } from '../pages/MobilePage';
import { mobileData } from '../utils/testData';

test('should navigate through the mobile module tabs and filters', async ({ page, sidebar }) => {
  const mobilePage = new MobilePage(page);

  await sidebar.goToMobile();
  await mobilePage.assertLoaded();
  await mobilePage.openIosTab();
  await mobilePage.assertCommonFiltersVisible();
  await mobilePage.search(mobileData.searchTerm);
  await mobilePage.openAndroidTab();
  await mobilePage.assertCommonFiltersVisible();
});
