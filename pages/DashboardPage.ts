import { Locator, Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    // Header & KPIs
    readonly userBadge: Locator;
    readonly resetDataButton: Locator;
    readonly logoutButton: Locator;
    readonly kpiTotalEmployees: Locator;
    readonly toastNotification: Locator;

    // Controls Bar
    readonly searchInput: Locator;
    readonly departmentFilter: Locator;
    readonly sortSelect: Locator;
    readonly addEmployeeButton: Locator;

    // Data Table
    readonly employeeTable: Locator;
    readonly employeeRows: Locator;
    readonly emptyTableMessage: Locator;

    // Add/Edit Employee Modal
    readonly employeeModal: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly roleInput: Locator;
    readonly departmentSelect: Locator;
    readonly salaryInput: Locator;
    readonly statusSelect: Locator;
    readonly avatarUploadInput: Locator;
    readonly avatarPreview: Locator;
    readonly saveEmployeeButton: Locator;
    readonly formError: Locator;

    // Delete Confirmation Modal
    readonly deleteModal: Locator;
    readonly confirmDeleteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Header & KPIs
        this.userBadge = page.getByTestId('user-badge');
        this.resetDataButton = page.getByTestId('reset-data-btn');
        this.logoutButton = page.getByTestId('logout-button');
        this.kpiTotalEmployees = page.getByTestId('kpi-total-employees');
        this.toastNotification = page.getByTestId('toast-notification');

        // Controls Bar
        this.searchInput = page.getByTestId('search-input');
        this.departmentFilter = page.getByTestId('department-filter');
        this.sortSelect = page.getByTestId('sort-select');
        this.addEmployeeButton = page.getByTestId('add-employee-btn');

        // Data Table
        this.employeeTable = page.getByTestId('employee-table');
        this.employeeRows = page.getByTestId('employee-row');
        this.emptyTableMessage = page.getByTestId('empty-table-message');

        // Add/Edit Employee Modal
        this.employeeModal = page.getByTestId('employee-modal');
        this.firstNameInput = page.getByTestId('first-name-input');
        this.lastNameInput = page.getByTestId('last-name-input');
        this.employeeIdInput = page.getByTestId('employee-id-input');
        this.roleInput = page.getByTestId('role-input');
        this.departmentSelect = page.getByTestId('department-select');
        this.salaryInput = page.getByTestId('salary-input');
        this.statusSelect = page.getByTestId('status-select');
        this.avatarUploadInput = page.getByTestId('avatar-upload');
        this.avatarPreview = page.getByTestId('avatar-preview');
        this.saveEmployeeButton = page.getByTestId('save-employee-btn');
        this.formError = page.getByTestId('form-error');

        // Delete Confirmation Modal
        this.deleteModal = page.getByTestId('delete-modal');
        this.confirmDeleteButton = page.getByTestId('confirm-delete-btn');
    }

    async resetDemoData() {
        await this.resetDataButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async searchEmployee(query: string) {
        await this.searchInput.fill(query);
    }

    async filterByDepartment(department: string) {
        await this.departmentFilter.selectOption({ label: department });
    }

    async sortBy(optionLabel: string) {
        await this.sortSelect.selectOption({ label: optionLabel });
    }

    async addEmployee(data: {
        firstName: string;
        lastName: string;
        employeeId: string;
        role: string;
        department: string;
        salary: string;
        status: string;
        avatarPath?: string;
    }) {
        await this.addEmployeeButton.click();
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.employeeIdInput.fill(data.employeeId);
        await this.roleInput.fill(data.role);
        await this.departmentSelect.selectOption({ label: data.department });
        await this.salaryInput.fill(data.salary);
        await this.statusSelect.selectOption({ label: data.status });

        if (data.avatarPath) {
            await this.avatarUploadInput.setInputFiles(data.avatarPath);
        }

        await this.saveEmployeeButton.click();
    }

    async deleteEmployeeById(employeeId: string) {
        // Finds the exact row matching the employee ID and clicks its specific delete button
        const targetRow = this.page.locator(`[data-testid="employee-row"][data-employee-id="${employeeId}"]`);
        await targetRow.getByTestId('delete-employee-btn').click();
        await this.confirmDeleteButton.click();
    }
}
