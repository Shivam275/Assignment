class DashboardPage {

    constructor(page) {
        this.page = page;

        this.dashboardTitle = page.getByRole('heading', {
            name: 'Dashboard'
        });
    }

    async verifyDashboard() {
        await this.dashboardTitle.waitFor();
    }

    async navigateToAdmin() {
        await this.page.getByText('Admin', { exact: true }).click();
    }
}

module.exports = DashboardPage;
