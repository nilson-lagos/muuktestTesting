import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get testsHeading() {
    return this.page.getByText('Test List');
  }

  private get okButton() {
    return this.page.getByRole('button', { name: /^ok$/i });
  }

  private get searchInput() {
    return this.page.getByPlaceholder(/search/i).first();
  }

  async assertLoaded(): Promise<void> {
    await expect(this.testsHeading).toBeVisible();
  }

  private scheduleHeaderButton(): Locator {
    return this.page.locator("th").filter({ hasText: /schedule/i }).locator('[role="button"]').first();
  }

  private tagHeaderButton(): Locator {
    return this.page.locator("th", { hasText: "Groups" });
  }

  private actionsButtonForRow(rowText: string): Locator {
    return this.rowByText(rowText).locator('button').last();
  }

  async filterBySchedules(scheduleNames: string[]): Promise<void> {
    await this.scheduleHeaderButton().click();
    for (const scheduleName of scheduleNames) {
      await this.page.getByText(scheduleName, { exact: true }).click();
    }
    await this.okButton.click();
  }

  async assertRowsContainAnyText(...expectedTexts: string[]): Promise<void> {
    const rows = this.page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index++) {
      const rowText = await rows.nth(index).innerText();
      expect(expectedTexts.some((item) => rowText.includes(item))).toBeTruthy();
    }
  }

  async openTagFilter(): Promise<void> {
    // Wait for any loading to complete
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.ant-spin-spinning').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // Ignore if no spinner found
    });
    await this.tagHeaderButton().click();
  }

  async resetCurrentFilter(): Promise<void> {
    await this.clickVisible(
      this.page.getByRole('button', { name: /reset/i }),
      this.page.getByText(/reset/i),
      this.page.locator('.ant-dropdown').getByText(/reset/i),
    );
  }

  async search(searchTerm: string): Promise<void> {
    if (!searchTerm) {
      return;
    }
    await this.searchInput.fill(searchTerm);
    await this.page.keyboard.press('Enter');
  }

  async openRowActions(rowText: string): Promise<void> {
    await this.actionsButtonForRow(rowText).click();
  }

  async cloneAsChildTest(rowText: string): Promise<void> {
    // Use the clone icon directly instead of the dropdown menu
    const row = this.rowByText(rowText);
    await row.getByRole('button').first().click(); // First button should be clone
  }

  async assertRowVisible(rowText: string): Promise<void> {
    await expect(this.rowByText(rowText)).toBeVisible();
  }

  async deleteRow(rowText: string): Promise<void> {
    const row = this.rowByText(rowText);
    await row.getByRole('button').nth(1).click();
    await expect(this.page.getByText(/are you sure you want to delete/i)).toBeVisible();
    await this.page.getByRole('button', { name: /yes, delete/i }).click();
  }

  async assertSuccessToast(messagePattern: RegExp): Promise<void> {
    await expect(this.page.getByText(/success/i)).toBeVisible();
    await expect(this.page.getByText(messagePattern)).toBeVisible();
  }

  async openBulkActions(): Promise<void> {
    await this.clickVisible(
      this.page.getByRole('button', { name: /bulk/i }),
      this.page.getByText(/bulk/i),
      this.page.locator('button').filter({ hasText: /edit/i }).first(),
    );
  }

  async selectRowCheckbox(rowText: string): Promise<void> {
    const checkbox = this.rowByText(rowText).locator('input[type="checkbox"], .ant-checkbox-input').first();
    if (await checkbox.count()) {
      await checkbox.check({ force: true }).catch(async () => {
        await checkbox.click({ force: true });
      });
      return;
    }
    await this.rowByText(rowText).locator('td').first().click();
  }

  async bulkEditBaseUrl(rowText: string, newBaseUrl: string): Promise<void> {
    await this.selectRowCheckbox(rowText);
    await this.openBulkActions();
    await this.clickVisible(
      this.page.getByText(/edit base url/i),
      this.page.getByRole('menuitem', { name: /edit base url/i }),
    );
    await this.fillVisible(
      newBaseUrl,
      this.page.getByLabel(/base url/i),
      this.page.getByPlaceholder(/base url/i),
      this.page.locator('input').filter({ has: this.page.locator('[placeholder*="Base URL"], [aria-label*="Base URL"]') }),
      this.page.locator('input[type="text"]').last(),
    );
    await this.clickVisible(
      this.page.getByRole('button', { name: /save|update/i }),
      this.okButton,
    );
  }

  async openTagEditor(rowText: string, tagText: string): Promise<void> {
    const row = this.rowByText(rowText);
    await row.getByText(tagText, { exact: false }).click();
  }

  async renameTag(rowText: string, currentTag: string, nextTag: string): Promise<void> {
    await this.openTagEditor(rowText, currentTag);
    
    // Click on "+ New hashtag" to create a new tag
    await this.page.getByText('+ New hashtag').click();
    
    // Fill in the new tag name in the input field
    await this.page.locator('input[type="text"]').last().fill(nextTag);
    
    // Click the Save button
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async refresh(): Promise<void> {
    await this.clickVisible(
      this.page.getByRole('button', { name: /refresh/i }),
      this.page.getByText(/refresh tests/i),
    );
  }
}
