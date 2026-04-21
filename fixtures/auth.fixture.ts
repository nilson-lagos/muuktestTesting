import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Sidebar } from '../pages/Sidebar';

type AppFixtures = {
  loginPage: LoginPage;
  sidebar: Sidebar;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  sidebar: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await use(new Sidebar(page));
  },
});

export { expect } from '@playwright/test';
