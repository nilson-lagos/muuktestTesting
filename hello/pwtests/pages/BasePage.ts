import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected byText(text: string, exact = true): Locator {
    return this.page.getByText(text, { exact });
  }

  protected rowByText(text: string): Locator {
    return this.page.locator('tr').filter({ hasText: text }).first();
  }

  protected async clickVisible(...locators: Locator[]): Promise<void> {
    for (const locator of locators) {
      if (await locator.count()) {
        const target = locator.first();
        if (await target.isVisible().catch(() => false)) {
          await target.click();
          return;
        }
      }
    }
    throw new Error('No visible locator found to click.');
  }

  protected async fillVisible(value: string, ...locators: Locator[]): Promise<void> {
    for (const locator of locators) {
      if (await locator.count()) {
        const target = locator.first();
        if (await target.isVisible().catch(() => false)) {
          await target.fill(value);
          return;
        }
      }
    }
    throw new Error('No visible locator found to fill.');
  }

  protected async expectAnyVisible(...locators: Locator[]): Promise<void> {
    for (const locator of locators) {
      if (await locator.count()) {
        const target = locator.first();
        if (await target.isVisible().catch(() => false)) {
          await expect(target).toBeVisible();
          return;
        }
      }
    }
    throw new Error('No expected locator became visible.');
  }
}
