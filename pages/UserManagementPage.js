class UserManagementPage {
    constructor(page) {
        this.page = page;
        this.searchForm = page.locator('.oxd-form').first();
        this.addUserForm = page.locator('.oxd-form').last();

        this.addButton = page.getByRole('button', { name: 'Add' });
        this.usernameInput = this.formField(this.searchForm, 'Username').locator('input');
        this.employeeNameInput = this.formField(this.addUserForm, 'Employee Name').locator('input');
        this.employeeNameSuggestions = page.locator('.oxd-autocomplete-option');
        this.newUsernameInput = this.formField(this.addUserForm, 'Username').locator('input');
        this.passwordInputs = this.addUserForm.locator('input[type="password"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.successToast = page.getByText('Successfully Saved', { exact: true });
        this.noRecordsFound = page.getByText('No Records Found', { exact: true });
        this.requiredValidationMessages = page.locator('.oxd-input-field-error-message');
    }

    formField(form, label) {
        return form
            .locator('.oxd-input-group')
            .filter({ has: this.page.getByText(label, { exact: true }) });
    }

    async searchUser(username) {
        await this.usernameInput.fill(username);
        await this.searchButton.click();
    }

    async clickAddUser() {
        await this.addButton.click();
    }

    async filterUsersByStatus(status) {
        await this.selectFormOption(this.searchForm, 'Status', status);
        await this.searchButton.click();
    }

    async createUser({ username, password, role, status, employeeName }) {
        if (!employeeName) {
            throw new Error('EMPLOYEE_NAME must be set to create a user');
        }

        await this.selectFormOption(this.addUserForm, 'User Role', role);
        await this.employeeNameInput.fill(employeeName);

        const employeeSuggestion = this.employeeNameSuggestions.filter({
            hasText: employeeName
        }).first();
        await employeeSuggestion.waitFor();
        await employeeSuggestion.click();

        await this.selectFormOption(this.addUserForm, 'Status', status);
        await this.newUsernameInput.fill(username);
        await this.passwordInputs.nth(0).fill(password);
        await this.passwordInputs.nth(1).fill(password);
        await this.saveButton.click();
    }

    async clickSave() {
        await this.saveButton.click();
    }

    async verifyRequiredValidationMessages() {
        await this.requiredValidationMessages.first().waitFor();

        if (await this.requiredValidationMessages.count() === 0) {
            throw new Error('Expected required-field validation messages');
        }
    }

    async verifyNoMatchingUsers() {
        await this.noRecordsFound.waitFor();
    }

    async updateUser(username, updatedStatus) {
        await this.searchUser(username);

        const userRow = this.userRow(username);
        await userRow.waitFor();
        await userRow.locator('.oxd-table-cell-actions button').first().click();
        await this.selectFormOption(this.addUserForm, 'Status', updatedStatus);
        await this.saveButton.click();
    }

    async verifyUserStatus(username, status) {
        await this.searchUser(username);

        const userRow = this.userRow(username);
        await userRow.waitFor();
        await userRow.getByRole('cell', { name: status, exact: true }).waitFor();
    }

    async verifyAllUsersHaveStatus(status) {
        const rows = this.page.locator('.oxd-table-body .oxd-table-row');
        const rowCount = await rows.count();

        if (rowCount === 0) {
            throw new Error(`No users were found with status "${status}"`);
        }

        for (const row of await rows.all()) {
            await row.getByRole('cell', { name: status, exact: true }).waitFor();
        }
    }

    userRow(username) {
        return this.page
            .getByRole('row')
            .filter({ hasText: username });
    }

    async resetSearch() {
        await this.resetButton.click();
    }

    async selectFormOption(form, label, value) {
        const field = this.formField(form, label);
        await field.locator('.oxd-select-text').click();
        await this.page
            .locator('.oxd-select-option')
            .getByText(value, { exact: true })
            .click();
    }
}

module.exports = UserManagementPage;
