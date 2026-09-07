import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Sidebar } from '../pages/Sidebar';
import { captureFailure, setupPageListeners } from '@muuktest/amikoo-playwright';

type AppFixtures = {
  loginPage: LoginPage;
  sidebar: Sidebar;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use, testInfo) => {
    const { consoleLogs, networkFailures } = setupPageListeners(page);
    await use(new LoginPage(page));
    await captureFailure(page, testInfo, consoleLogs, networkFailures);
  },
  sidebar: async ({ page }, use, testInfo) => {
    const { consoleLogs, networkFailures } = setupPageListeners(page);
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await use(new Sidebar(page));
    await captureFailure(page, testInfo, consoleLogs, networkFailures);
  },
});

export { expect } from '@playwright/test';
