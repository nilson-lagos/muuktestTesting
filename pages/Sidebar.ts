import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class Sidebar extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goToDashboard(): Promise<void> {
    await this.page.goto('/');
  }

  async goToTests(): Promise<void> {
    // Wait for any loading to complete first
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.ant-spin-spinning').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // Ignore if no spinner found
    });
    await this.page.getByText('Tests', { exact: true }).click();
    await expect(this.page.getByText('Test List')).toBeVisible();
  }

  async goToScheduling(): Promise<void> {
    await this.page.getByText('Scheduling', { exact: true }).click();
    await expect(this.page.getByRole('heading', { name: /scheduling list/i })).toBeVisible();
  }

  async goToMobile(): Promise<void> {
    await this.page.getByText('Mobile', { exact: true }).click();
    await expect(this.page.getByRole('tab', { name: /ios/i })).toBeVisible();
  }
}
