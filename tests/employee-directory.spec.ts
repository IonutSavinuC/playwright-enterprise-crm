import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import employeeData from '../test-data/employee.json';

test.describe('PeopleCore HR - Employee Directory & CRUD Operations', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        const adminUser = process.env.ADMIN_USER || 'Admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        await loginPage.goto();
        await loginPage.login(adminUser, adminPassword);
        
        // Reset demo data before each test so every test starts with the exact 4 initial employees
        await dashboardPage.resetDemoData();
        await expect(dashboardPage.employeeRows).toHaveCount(4);
    });

    test('should create a new employee with avatar upload and update KPIs', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        // NOTE: Change 'avatar.png' to 'avatar.jpg' if your file is a JPG
        const avatarPath = path.resolve(__dirname, '../test-data/avatar.jpg');

        await dashboardPage.addEmployee({
            ...employeeData,
            avatarPath
        });

        // Validate toast notification and updated employee count (4 -> 5)
        await expect(dashboardPage.toastNotification).toBeVisible();
        await expect(dashboardPage.employeeRows).toHaveCount(5);
        await expect(dashboardPage.kpiTotalEmployees).toContainText('5');

        // Verify the new employee row exists with the uploaded avatar image (data:image/...)
        const newRow = page.locator(`[data-testid="employee-row"][data-employee-id="${employeeData.employeeId}"]`);
        await expect(newRow).toBeVisible();
        await expect(newRow.getByTestId('row-name')).toContainText(`${employeeData.firstName} ${employeeData.lastName}`);
        const avatarSrc = await newRow.getByTestId('row-avatar').getAttribute('src');
        expect(avatarSrc).toContain('data:image');
    });

    test('should prevent creating an employee with a duplicate Employee ID', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);

        await dashboardPage.addEmployee({
            firstName: 'Duplicate',
            lastName: 'User',
            employeeId: 'EMP-101', // Already belongs to Sarah Jenkins
            role: 'Tester',
            department: 'Quality Assurance',
            salary: '80000',
            status: 'Active'
        });

        // Validate inline form error appears and modal stays open
        await expect(dashboardPage.formError).toBeVisible();
        await expect(dashboardPage.employeeModal).toBeVisible();
    });

    test('should filter employees dynamically via search and handle empty state', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);

        // Search for an existing employee
        await dashboardPage.searchEmployee('Marcus Vance');
        await expect(dashboardPage.employeeRows).toHaveCount(1);
        await expect(dashboardPage.employeeRows.first().getByTestId('row-name')).toContainText('Marcus Vance');

        // Search for a non-existent employee
        await dashboardPage.searchEmployee('NonExistentPerson999');
        await expect(dashboardPage.employeeRows).toHaveCount(0);
        await expect(dashboardPage.emptyTableMessage).toBeVisible();
    });

    test('should sort employees by salary from High to Low', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);

        await dashboardPage.sortBy('Salary (High to Low)');

        const salaryTexts = await page.getByTestId('row-salary').allInnerTexts();
        // Convert "$130,000" -> 130000
        const salaries = salaryTexts.map(text => parseInt(text.replace(/[$,]/g, ''), 10));

        for (let i = 0; i < salaries.length - 1; i++) {
            expect(salaries[i]).toBeGreaterThanOrEqual(salaries[i + 1]);
        }
    });

    test('should delete an employee after modal confirmation and logout securely', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);

        // Delete David Chen (EMP-104)
        await dashboardPage.deleteEmployeeById('EMP-104');

        await expect(dashboardPage.toastNotification).toBeVisible();
        await expect(dashboardPage.employeeRows).toHaveCount(3);

        // Logout and verify redirect to login form
        await dashboardPage.logout();
        await expect(page.getByTestId('login-form')).toBeVisible();
    });
});
