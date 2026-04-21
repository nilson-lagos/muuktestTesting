import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SchedulingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /scheduling list/i })).toBeVisible();
  }

  async changeItemsPerPage(target: '10 / page' | '20 / page' | '50 / page' = '20 / page'): Promise<void> {
    await this.page.getByText(/10 \/ page|20 \/ page|50 \/ page/i).first().click();
    await this.page.getByText(target, { exact: true }).click();
  }

  async assertPaginationValue(value: string): Promise<void> {
    await expect(this.page.getByText(value, { exact: true })).toBeVisible();
  }
}
