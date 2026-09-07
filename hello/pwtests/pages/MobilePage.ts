import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MobilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page.getByRole('tab', { name: /ios/i })).toBeVisible();
    await expect(this.page.getByRole('tab', { name: /android/i })).toBeVisible();
  }

  async openIosTab(): Promise<void> {
    await this.page.getByRole('tab', { name: /ios/i }).click();
    await expect(this.page.getByText(/all status/i).first()).toBeVisible();
  }

  async openAndroidTab(): Promise<void> {
    await this.page.getByRole('tab', { name: /android/i }).click();
    await expect(this.page.getByText(/all status/i).last()).toBeVisible();
  }

  async assertCommonFiltersVisible(): Promise<void> {
    await expect(this.page.getByText(/show last execution/i).first()).toBeVisible();
    await expect(this.page.getByPlaceholder(/search by name or id/i).first()).toBeVisible();
  }

  async search(term: string): Promise<void> {
    if (!term) {
      return;
    }
    await this.page.getByPlaceholder(/search by name or id/i).first().fill(term);
    await this.page.keyboard.press('Enter');
  }
}
