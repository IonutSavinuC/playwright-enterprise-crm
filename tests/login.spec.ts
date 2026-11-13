import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('PeopleCore HR - Authentication Module', () => {

    test('should login successfully with valid environment credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        const adminUser = process.env.ADMIN_USER || 'Admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        await loginPage.goto();
        await loginPage.login(adminUser, adminPassword);

        // Validate user badge appears in header and dashboard loads
        await expect(page.getByTestId('user-badge')).toBeVisible();
        await expect(page.getByTestId('user-badge')).toContainText('Welcome, Admin');
    });

    test('should show error message when credentials are invalid', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('WrongUser', 'WrongPass123');

        // Validate error banner is visible and shows proper message
        await expect(loginPage.errorBanner).toBeVisible();
        await expect(loginPage.errorBanner).toContainText('Invalid username or password');
    });
});
