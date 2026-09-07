import { test, expect } from '../fixtures';
import { LoginPage } from '../pages/LoginPage';

test('should display an error when logging in with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await page.locator('input[name="email"], input[type="email"]').first().fill('invalid@example.com');
  await page.locator('input[name="password"], input[type="password"]').first().fill('WrongPassword!');
  await page.getByRole('button', { name: /log in/i }).click();

  // Should NOT land on the dashboard
  await expect(page.locator('text=MuukTest Automation')).not.toBeVisible({ timeout: 5000 });

  // Should show an error message
  await expect(
    page.locator('text=/invalid|incorrect|wrong|error|unauthorized/i').first()
  ).toBeVisible();
});
