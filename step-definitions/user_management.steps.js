const {
    Given,
    When,
    Then,
    Before,
    After
} = require('@cucumber/cucumber');

const { chromium } = require('@playwright/test');

const config = require('../config/config');

const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const UserManagementPage = require('../pages/UserManagementPage');
const { createTestUser } = require('../test-data/testUser');

let browser;
let page;

let loginPage;
let dashboardPage;
let userManagementPage;

Before(async function () {
    config.validateCredentials();
    this.testUser = createTestUser();

    browser = await chromium.launch({
        headless: true
    });

    page = await browser.newPage();

    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    userManagementPage = new UserManagementPage(page);
});

After(async function (scenario) {
    try {
        if (scenario.result?.status === 'FAILED' && page && !page.isClosed()) {
            const screenshot = await page.screenshot({
                type: 'png',
                fullPage: true
            });
            await this.attach(screenshot, 'image/png');
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

Given(
    'I am logged into OrangeHRM as an administrator',
    async function () {
        await loginPage.navigate();

        await loginPage.login(
            config.username,
            config.password
        );

        await dashboardPage.verifyDashboard();
    }
);

Then(
    'I should see the Dashboard',
    async function () {
        await dashboardPage.verifyDashboard();
    }
);

Given(
    'I navigate to the User Management page',
    async function () {
        await dashboardPage.navigateToAdmin();

        await page.getByText('User Management').click();
        await page.getByText('Users').click();
    }
);

When(
    'I search for user {string}',
    async function (username) {
        await userManagementPage.searchUser(username);
    }
);

Then(
    'the user {string} should be displayed in the results',
    async function (username) {
        const userRow = page
            .getByRole('row')
            .filter({ hasText: username });

        await userRow.waitFor();
    }
);

When(
    'I create a new user with valid details',
    async function () {
        await userManagementPage.clickAddUser();
        await userManagementPage.createUser(this.testUser);
    }
);

Then(
    'the user should be created successfully',
    async function () {
        await userManagementPage.successToast.waitFor();
    }
);

Then(
    'the newly created user should be displayed in the user list',
    async function () {
        await userManagementPage.searchUser(this.testUser.username);

        const userRow = page
            .getByRole('row')
            .filter({ hasText: this.testUser.username });

        await userRow.waitFor();
    }
);

Given(
    'I have created a user with valid details',
    async function () {
        await userManagementPage.clickAddUser();
        await userManagementPage.createUser(this.testUser);
        await userManagementPage.successToast.waitFor();
    }
);

When(
    'I search for the newly created user',
    async function () {
        await userManagementPage.searchUser(this.testUser.username);
    }
);

When(
    'I update the user details',
    async function () {
        await userManagementPage.updateUser(this.testUser.username, 'Disabled');
    }
);

Then(
    'the user details should be updated successfully',
    async function () {
        await userManagementPage.successToast.waitFor();
        await userManagementPage.verifyUserStatus(this.testUser.username, 'Disabled');
    }
);

When(
    'I filter users with status {string}',
    async function (status) {
        await userManagementPage.filterUsersByStatus(status);
    }
);

Then(
    'only enabled users should be displayed',
    async function () {
        await userManagementPage.verifyAllUsersHaveStatus('Enabled');
    }
);

When(
    'I open the create user form',
    async function () {
        await userManagementPage.clickAddUser();
    }
);

When(
    'I click Save without entering mandatory details',
    async function () {
        await userManagementPage.clickSave();
    }
);

Then(
    'validation messages should be displayed',
    async function () {
        await userManagementPage.verifyRequiredValidationMessages();
    }
);

Then(
    'no matching users should be displayed',
    async function () {
        await userManagementPage.verifyNoMatchingUsers();
    }
);

When(
    'I logout from OrangeHRM',
    async function () {
        await page.locator('.oxd-userdropdown-tab').click();
        await page.getByText('Logout', { exact: true }).click();
    }
);

Then(
    'I should be redirected to the login page',
    async function () {
        await loginPage.username.waitFor();
    }
);
