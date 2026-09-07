import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { credentials } from '../utils/testData';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get emailInput() {
    return this.page.locator('input[name="email"], input[type="email"]');
  }

  private get passwordInput() {
    return this.page.locator('input[name="password"], input[type="password"]');
  }

  private get loginButton() {
    return this.page.getByRole('button', { name: /log in/i });
  }

  private get dashboardMarker() {
    return this.page.locator('li', { hasText: 'Analytics' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(email = credentials.email, password = credentials.password): Promise<void> {
    await this.goto();
    await expect(this.emailInput.first()).toBeVisible();
    await this.emailInput.first().fill(email);
    await this.passwordInput.first().fill(password);
    await this.loginButton.click();
    await expect(this.dashboardMarker.first()).toBeVisible();
  }
}
