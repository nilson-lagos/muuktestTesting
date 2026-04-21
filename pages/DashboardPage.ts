import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /analytics dashboard/i })).toBeVisible();
    await expect(this.page.getByText(/total tests created/i)).toBeVisible();
    await expect(this.page.getByText(/passed/i)).toBeVisible();
    await expect(this.page.getByText(/product failure/i)).toBeVisible();
    await expect(this.page.getByText(/review needed/i)).toBeVisible();
    await expect(this.page.getByText(/maintenance/i)).toBeVisible();
  }

  async openIssuesTab(): Promise<void> {
    await this.page.getByRole('tab', { name: /issues/i }).click();
    await expect(this.page.getByRole('columnheader', { name: /issue id/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /test id/i })).toBeVisible();
  }

  async openScheduledTab(): Promise<void> {
    await this.page.getByRole('tab', { name: /scheduled/i }).click();
    await expect(this.page.getByRole('columnheader', { name: /name/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /recurrence/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /time/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /total tests/i })).toBeVisible();
  }
}
