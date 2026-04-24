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

  async openNewScheduleForm(): Promise<void> {
    await this.clickVisible(
      this.page.getByRole('button', { name: /new schedule/i }),
      this.page.getByText(/new schedule/i),
    );
  }

  async fillScheduleName(name: string): Promise<void> {
    await this.fillVisible(
      name,
      this.page.getByPlaceholder(/schedule name/i),
      this.page.locator('input[placeholder="Schedule name"]'),
    );
  }

  async selectRepeat(option: 'None' | 'Daily' | 'Weekly' | 'Weekdays' | 'Custom'): Promise<void> {
    await this.page.getByRole('radio', { name: option }).check();
  }

  async proceedToContent(): Promise<void> {
    await this.clickVisible(
      this.page.getByRole('button', { name: /next|schedule content/i }),
      this.page.getByText(/next/i),
    );
  }

  async proceedToVariables(): Promise<void> {
    await this.clickVisible(
      this.page.getByRole('button', { name: /next|variables/i }),
      this.page.getByText(/next/i),
    );
  }

  async proceedToReport(): Promise<void> {
    await this.clickVisible(
      this.page.getByRole('button', { name: /next|report/i }),
      this.page.getByText(/next/i),
    );
  }

  async saveSchedule(): Promise<void> {
    await this.clickVisible(
      this.page.getByRole('button', { name: /save/i }),
      this.page.getByText(/save/i),
    );
  }

  async assertScheduleVisible(scheduleName: string): Promise<void> {
    await expect(this.rowByText(scheduleName)).toBeVisible();
  }
}
